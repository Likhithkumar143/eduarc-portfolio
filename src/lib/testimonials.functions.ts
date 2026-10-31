import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/lib/staff.server";
import { getAvatarUrl, getGravatarUrl } from "@/lib/avatar";

export const userReviewInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  role: z.string().trim().min(2, "Role must be at least 2 characters").max(100),
  rating: z.number().int().min(1).max(5).default(5),
  category: z.string().trim().max(100).default("Career Guidance Session"),
  quote: z.string().trim().min(5, "Review must be at least 5 characters").max(2000),
  avatar: z.string().max(2_000_000).optional(), // User-uploaded photo (data URL) or custom avatar URL
  website: z.string().optional(), // Honeypot field for bot detection
});

export type UserReviewInput = z.infer<typeof userReviewInputSchema>;

export const reviewActionSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().optional(),
  })
  .refine(
    (val) => Boolean((val.id && val.id.trim().length > 0) || (val.email && val.email.trim().length > 0)),
    {
      message: "Must provide either review id or reviewer email",
    },
  );

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;

export type UserReviewRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  rating: number;
  category: string;
  quote: string;
  avatar: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
};

/**
 * Public review submission endpoint.
 * Reviews submitted here are held in 'pending' moderation status in 'user_reviews'
 * and are ONLY shown on the public testimonials page once approved by an admin.
 */
export const submitUserReview = createServerFn({ method: "POST" })
  .validator((d) => userReviewInputSchema.parse(d))
  .handler(async ({ data }) => {
    // 1. Bot Honeypot: Ignore automated bot submissions silently
    if (data.website) {
      return {
        ok: true as const,
        skipped: false as const,
        message: "Thank you! Your feedback has been received.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const normalizedEmail = data.email.toLowerCase().trim();

    // 2. Query user_reviews record in site_content to inspect all past submissions
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
      ? (userReviewsData["reviews"] as UserReviewRecord[])
      : [];

    // 3. Duplicate Check: Prevent duplicate submissions for the same email address if already pending or approved
    const existingSubmission = storedReviews.find(
      (r) => r.email && r.email.toLowerCase().trim() === normalizedEmail,
    );

    if (existingSubmission && existingSubmission.status !== "rejected") {
      return {
        ok: true as const,
        skipped: true as const,
        message:
          existingSubmission.status === "approved"
            ? "Your review has already been approved and published. Thank you for your feedback!"
            : "Your review is currently awaiting administrator approval. Thank you for your patience!",
      };
    }

    // 4. Resolve profile photo: use user's uploaded avatar if provided, otherwise resolve via email
    const avatarUrl =
      data.avatar && data.avatar.trim().length > 0
        ? data.avatar.trim()
        : getAvatarUrl(normalizedEmail, data.name);

    // 5. Construct new review item with unique 'id' and 'pending' status
    const newReview: UserReviewRecord = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: data.name.trim(),
      email: normalizedEmail,
      role: data.role.trim() || "Student",
      rating: data.rating,
      category: data.category.trim() || "Career Guidance Session",
      quote: data.quote.trim(),
      avatar: avatarUrl,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // 6. Save exclusively to user_reviews (DO NOT push to main site_content testimonials array until approved)
    const updatedStoredReviews = [
      newReview,
      ...storedReviews.filter((r) => r.email.toLowerCase().trim() !== normalizedEmail),
    ];

    const { error: saveErr } = await supabaseAdmin.from("site_content").upsert({
      id: "user_reviews",
      data: { reviews: updatedStoredReviews } as unknown as import("@/integrations/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });

    if (saveErr) {
      console.error("[submitUserReview] Failed to save user review:", saveErr);
      throw new Error("Could not save your review. Please try again later.");
    }

    return {
      ok: true as const,
      skipped: false as const,
      message:
        "Thank you for sharing your experience! Your review has been submitted for moderation and will appear on the testimonials page once approved by our team.",
      review: newReview,
    };
  });

/**
 * Admin: List all submitted user reviews (pending, approved, rejected).
 * Polyfills missing IDs on legacy records and self-heals database storage.
 */
export const listUserReviews = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("data")
    .eq("id", "user_reviews")
    .maybeSingle();

  if (error) {
    console.error("[listUserReviews] error fetching user reviews:", error);
    return { reviews: [] as UserReviewRecord[] };
  }

  const rawReviews = Array.isArray(data?.data && (data.data as Record<string, unknown>)["reviews"])
    ? ((data.data as Record<string, unknown>)["reviews"] as Array<Record<string, unknown>>)
    : [];

  let needsSelfHeal = false;
  const reviews: UserReviewRecord[] = rawReviews.map((r, idx) => {
    const rawId = typeof r["id"] === "string" ? r["id"].trim() : "";
    const email = typeof r["email"] === "string" ? r["email"].trim() : "";

    let id = rawId;
    if (!id) {
      needsSelfHeal = true;
      const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, "");
      id = `rev_legacy_${idx}_${cleanEmail || idx}`;
    }

    const avatar =
      typeof r["avatar"] === "string" && r["avatar"].trim().length > 0
        ? (r["avatar"] as string)
        : email
          ? getAvatarUrl(email, typeof r["name"] === "string" ? r["name"] : "User")
          : "";

    const status: "pending" | "approved" | "rejected" =
      r["status"] === "approved" || r["status"] === "rejected" || r["status"] === "pending"
        ? (r["status"] as "pending" | "approved" | "rejected")
        : "pending";

    return {
      id,
      name: typeof r["name"] === "string" && r["name"].trim() ? r["name"] : "Reviewer",
      email,
      role: typeof r["role"] === "string" && r["role"].trim() ? r["role"] : "Student",
      rating: typeof r["rating"] === "number" ? r["rating"] : 5,
      category: typeof r["category"] === "string" ? r["category"] : "Career Guidance Session",
      quote: typeof r["quote"] === "string" ? r["quote"] : "",
      avatar,
      status,
      createdAt: typeof r["createdAt"] === "string" ? r["createdAt"] : new Date().toISOString(),
      reviewedAt: typeof r["reviewedAt"] === "string" ? r["reviewedAt"] : undefined,
    };
  });

  // Self-heal: update records in DB if legacy rows without IDs were found
  if (needsSelfHeal && reviews.length > 0) {
    await supabaseAdmin.from("site_content").upsert({
      id: "user_reviews",
      data: { reviews } as unknown as import("@/integrations/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });
  }

  return { reviews };
});

/**
 * Admin: Approve a user review and publish it live to the public site_content.testimonials array.
 */
export const approveUserReview = createServerFn({ method: "POST" })
  .validator((d) => reviewActionSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const targetId = data.id?.trim() || "";
    const targetEmail = data.email?.toLowerCase().trim() || "";

    // 1. Fetch user reviews
    const { data: userReviewsRow } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "user_reviews")
      .maybeSingle();

    const rawReviews = Array.isArray(
      userReviewsRow?.data && (userReviewsRow.data as Record<string, unknown>)["reviews"],
    )
      ? ((userReviewsRow.data as Record<string, unknown>)["reviews"] as Array<Record<string, unknown>>)
      : [];

    const isMatch = (r: Record<string, unknown>) => {
      if (targetId && typeof r["id"] === "string" && r["id"] === targetId) return true;
      if (targetEmail && typeof r["email"] === "string" && r["email"].toLowerCase().trim() === targetEmail)
        return true;
      return false;
    };

    const targetReview = rawReviews.find(isMatch);
    if (!targetReview) {
      throw new Error("Review submission not found");
    }

    const reviewEmail = (typeof targetReview["email"] === "string" ? targetReview["email"] : targetEmail).toLowerCase().trim();
    const reviewName = typeof targetReview["name"] === "string" ? targetReview["name"] : "Reviewer";
    const reviewRole = typeof targetReview["role"] === "string" ? targetReview["role"] : "Student";
    const reviewRating = typeof targetReview["rating"] === "number" ? targetReview["rating"] : 5;
    const reviewCategory = typeof targetReview["category"] === "string" ? targetReview["category"] : "Career Guidance Session";
    const reviewQuote = typeof targetReview["quote"] === "string" ? targetReview["quote"] : "";
    const reviewAvatar =
      typeof targetReview["avatar"] === "string" && targetReview["avatar"].trim().length > 0
        ? (targetReview["avatar"] as string)
        : reviewEmail
          ? getAvatarUrl(reviewEmail, reviewName)
          : "";
    const reviewCreatedAt = typeof targetReview["createdAt"] === "string" ? targetReview["createdAt"] : new Date().toISOString();

    // 2. Mark as approved in user_reviews
    const updatedReviews = rawReviews.map((r) =>
      isMatch(r)
        ? {
            ...r,
            status: "approved",
            avatar: reviewAvatar,
            reviewedAt: new Date().toISOString(),
          }
        : r,
    );

    await supabaseAdmin.from("site_content").upsert({
      id: "user_reviews",
      data: { reviews: updatedReviews } as unknown as import("@/integrations/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });

    // 3. Fetch main site_content to sync into testimonials array
    const { data: mainRow } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .maybeSingle();

    const mainData = (mainRow?.data || {}) as Record<string, unknown>;
    const currentTestimonials = Array.isArray(mainData["testimonials"])
      ? (mainData["testimonials"] as Array<Record<string, unknown>>)
      : [];

    const approvedItem = {
      name: reviewName,
      email: reviewEmail,
      role: reviewRole,
      rating: reviewRating,
      category: reviewCategory,
      quote: reviewQuote,
      avatar: reviewAvatar,
      createdAt: reviewCreatedAt,
    };

    const alreadyExists = currentTestimonials.some(
      (t) =>
        t["email"] &&
        typeof t["email"] === "string" &&
        t["email"].toLowerCase().trim() === reviewEmail,
    );

    let nextTestimonials: Array<Record<string, unknown>>;
    if (alreadyExists) {
      nextTestimonials = currentTestimonials.map((t) =>
        t["email"] &&
        typeof t["email"] === "string" &&
        t["email"].toLowerCase().trim() === reviewEmail
          ? approvedItem
          : t,
      );
    } else {
      nextTestimonials = [approvedItem, ...currentTestimonials];
    }

    const { error: mainUpdateErr } = await supabaseAdmin.from("site_content").upsert({
      id: "main",
      data: {
        ...mainData,
        testimonials: nextTestimonials,
      } as unknown as import("@/integrations/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });

    if (mainUpdateErr) {
      console.error("[approveUserReview] Error updating main site_content:", mainUpdateErr);
      throw new Error("Failed to publish approved review to the live site.");
    }

    return { ok: true as const, approvedItem };
  });

/**
 * Admin: Reject a user review and remove it from public site_content if previously published.
 */
export const rejectUserReview = createServerFn({ method: "POST" })
  .validator((d) => reviewActionSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const targetId = data.id?.trim() || "";
    const targetEmail = data.email?.toLowerCase().trim() || "";

    // 1. Fetch user reviews
    const { data: userReviewsRow } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "user_reviews")
      .maybeSingle();

    const rawReviews = Array.isArray(
      userReviewsRow?.data && (userReviewsRow.data as Record<string, unknown>)["reviews"],
    )
      ? ((userReviewsRow.data as Record<string, unknown>)["reviews"] as Array<Record<string, unknown>>)
      : [];

    const isMatch = (r: Record<string, unknown>) => {
      if (targetId && typeof r["id"] === "string" && r["id"] === targetId) return true;
      if (targetEmail && typeof r["email"] === "string" && r["email"].toLowerCase().trim() === targetEmail)
        return true;
      return false;
    };

    const targetReview = rawReviews.find(isMatch);
    if (!targetReview) {
      throw new Error("Review submission not found");
    }

    // 2. Mark as rejected in user_reviews
    const updatedReviews = rawReviews.map((r) =>
      isMatch(r) ? { ...r, status: "rejected", reviewedAt: new Date().toISOString() } : r,
    );

    await supabaseAdmin.from("site_content").upsert({
      id: "user_reviews",
      data: { reviews: updatedReviews } as unknown as import("@/integrations/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });

    // 3. Remove from main site_content testimonials array if present
    const emailToRemove =
      targetEmail ||
      (targetReview && typeof targetReview["email"] === "string"
        ? targetReview["email"].toLowerCase().trim()
        : "");

    if (emailToRemove) {
      const { data: mainRow } = await supabaseAdmin
        .from("site_content")
        .select("data")
        .eq("id", "main")
        .maybeSingle();

      const mainData = (mainRow?.data || {}) as Record<string, unknown>;
      const currentTestimonials = Array.isArray(mainData["testimonials"])
        ? (mainData["testimonials"] as Array<Record<string, unknown>>)
        : [];

      const filteredTestimonials = currentTestimonials.filter(
        (t) =>
          !(
            t["email"] &&
            typeof t["email"] === "string" &&
            t["email"].toLowerCase().trim() === emailToRemove
          ),
      );

      if (filteredTestimonials.length !== currentTestimonials.length) {
        await supabaseAdmin.from("site_content").upsert({
          id: "main",
          data: {
            ...mainData,
            testimonials: filteredTestimonials,
          } as unknown as import("@/integrations/supabase/types").Json,
          updated_at: new Date().toISOString(),
        });
      }
    }

    return { ok: true as const };
  });

/**
 * Admin: Delete a user review record permanently.
 */
export const deleteUserReview = createServerFn({ method: "POST" })
  .validator((d) => reviewActionSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const targetId = data.id?.trim() || "";
    const targetEmail = data.email?.toLowerCase().trim() || "";

    // 1. Fetch user reviews
    const { data: userReviewsRow } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "user_reviews")
      .maybeSingle();

    const rawReviews = Array.isArray(
      userReviewsRow?.data && (userReviewsRow.data as Record<string, unknown>)["reviews"],
    )
      ? ((userReviewsRow.data as Record<string, unknown>)["reviews"] as Array<Record<string, unknown>>)
      : [];

    const isMatch = (r: Record<string, unknown>) => {
      if (targetId && typeof r["id"] === "string" && r["id"] === targetId) return true;
      if (targetEmail && typeof r["email"] === "string" && r["email"].toLowerCase().trim() === targetEmail)
        return true;
      return false;
    };

    const targetReview = rawReviews.find(isMatch);
    const updatedReviews = rawReviews.filter((r) => !isMatch(r));

    await supabaseAdmin.from("site_content").upsert({
      id: "user_reviews",
      data: { reviews: updatedReviews } as unknown as import("@/integrations/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });

    // 2. Remove from main site_content testimonials array if present
    const emailToRemove =
      targetEmail ||
      (targetReview && typeof targetReview["email"] === "string"
        ? targetReview["email"].toLowerCase().trim()
        : "");

    if (emailToRemove) {
      const { data: mainRow } = await supabaseAdmin
        .from("site_content")
        .select("data")
        .eq("id", "main")
        .maybeSingle();

      const mainData = (mainRow?.data || {}) as Record<string, unknown>;
      const currentTestimonials = Array.isArray(mainData["testimonials"])
        ? (mainData["testimonials"] as Array<Record<string, unknown>>)
        : [];

      const filteredTestimonials = currentTestimonials.filter(
        (t) =>
          !(
            t["email"] &&
            typeof t["email"] === "string" &&
            t["email"].toLowerCase().trim() === emailToRemove
          ),
      );

      if (filteredTestimonials.length !== currentTestimonials.length) {
        await supabaseAdmin.from("site_content").upsert({
          id: "main",
          data: {
            ...mainData,
            testimonials: filteredTestimonials,
          } as unknown as import("@/integrations/supabase/types").Json,
          updated_at: new Date().toISOString(),
        });
      }
    }

    return { ok: true as const };
  });
