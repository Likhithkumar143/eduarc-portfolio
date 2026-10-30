import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const userReviewInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  role: z.string().trim().min(2, "Role must be at least 2 characters").max(100),
  rating: z.number().int().min(1).max(5).default(5),
  category: z.string().trim().max(100).default("Career Guidance Session"),
  quote: z.string().trim().min(5, "Review must be at least 5 characters").max(2000),
  website: z.string().optional(), // Honeypot field for bot detection
});

export type UserReviewInput = z.infer<typeof userReviewInputSchema>;

export const submitUserReview = createServerFn({ method: "POST" })
  .validator((d) => userReviewInputSchema.parse(d))
  .handler(async ({ data }) => {
    // 1. Bot Honeypot: Ignore automated submissions silently
    if (data.website) {
      return {
        ok: true as const,
        skipped: false as const,
        message: "Thank you! Your review has been recorded.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const normalizedEmail = data.email.toLowerCase().trim();

    // 2. Query main site_content row to inspect live testimonials array
    const { data: mainRow, error: mainFetchErr } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .maybeSingle();

    if (mainFetchErr) {
      console.error("[submitUserReview] Error reading site_content row 'main':", mainFetchErr);
    }

    const mainData = (mainRow?.data || {}) as Record<string, unknown>;
    const testimonials = Array.isArray(mainData["testimonials"])
      ? (mainData["testimonials"] as Array<{ email?: string; [key: string]: unknown }>)
      : [];

    // 3. Query user_reviews audit record in site_content to inspect all past submissions
    const { data: userReviewsRow, error: userReviewsFetchErr } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "user_reviews")
      .maybeSingle();

    if (userReviewsFetchErr) {
      console.warn("[submitUserReview] Note on user_reviews lookup:", userReviewsFetchErr);
    }

    const userReviewsData = (userReviewsRow?.data || {}) as Record<string, unknown>;
    const storedReviews = Array.isArray(userReviewsData["reviews"])
      ? (userReviewsData["reviews"] as Array<{ email?: string; [key: string]: unknown }>)
      : [];

    // 4. Duplicate Check: Prevent duplicate submissions for the same email address
    const existsInTestimonials = testimonials.some(
      (t) => t.email && t.email.toLowerCase().trim() === normalizedEmail,
    );
    const existsInStoredReviews = storedReviews.some(
      (r) => r.email && r.email.toLowerCase().trim() === normalizedEmail,
    );

    if (existsInTestimonials || existsInStoredReviews) {
      // If already exists with this email, skip saving!
      return {
        ok: true as const,
        skipped: true as const,
        message:
          "A review from this email address has already been submitted. Thank you for your feedback!",
      };
    }

    // 5. Construct new review item
    const newReview = {
      name: data.name.trim(),
      email: normalizedEmail,
      role: data.role.trim(),
      rating: data.rating,
      category: data.category.trim() || "Career Guidance Session",
      quote: data.quote.trim(),
      avatar: "",
      createdAt: new Date().toISOString(),
    };

    // 6. Save to site_content main row (testimonials list)
    const updatedTestimonials = [...testimonials, newReview];
    const { error: updateMainErr } = await supabaseAdmin
      .from("site_content")
      .upsert({
        id: "main",
        data: {
          ...mainData,
          testimonials: updatedTestimonials,
        } as unknown as import("@/integrations/supabase/types").Json,
        updated_at: new Date().toISOString(),
      });

    if (updateMainErr) {
      console.error("[submitUserReview] Failed to update main site_content:", updateMainErr);
      throw new Error("Could not save your review to the database. Please try again later.");
    }

    // 7. Also store in user_reviews audit row in site_content
    const updatedStoredReviews = [...storedReviews, newReview];
    await supabaseAdmin
      .from("site_content")
      .upsert({
        id: "user_reviews",
        data: { reviews: updatedStoredReviews } as unknown as import("@/integrations/supabase/types").Json,
        updated_at: new Date().toISOString(),
      });

    return {
      ok: true as const,
      skipped: false as const,
      message: "Thank you! Your review has been saved and submitted successfully.",
      review: newReview,
    };
  });
