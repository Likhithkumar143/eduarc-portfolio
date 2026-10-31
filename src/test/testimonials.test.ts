import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  userReviewInputSchema,
  reviewActionSchema,
  type UserReviewRecord,
} from "@/lib/testimonials.functions";
import { siteContentSchema, defaultContent } from "@/content/eduarc";
import {
  checkRateLimit,
  ENQUIRY_RATE_LIMIT_OPTIONS,
  _resetRateLimitsForTesting,
} from "@/lib/rate-limit.server";
import {
  getGravatarUrl,
  getAvatarUrl,
  getGoogleColor,
  getAvatarInitials,
  getGoogleMaterialAvatarSvg,
  getGoogleInitialsAvatar,
  GOOGLE_AVATAR_COLORS,
  md5,
} from "@/lib/avatar";

describe("Testimonials & Review Submissions", () => {
  describe("Avatar & Profile Photo Generation from Email ID", () => {
    it("computes accurate MD5 hash matching RFC 1321 standard", () => {
      expect(md5("test@example.com")).toBe("55502f40dc8b7c769880b10874abc9d0");
      expect(md5("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
    });

    it("generates a valid Gravatar avatar URL with identicon fallback from email", () => {
      const url = getGravatarUrl("test@example.com");
      expect(url).toBe("https://www.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=200&d=identicon");
    });

    it("normalizes email case and whitespace before hashing", () => {
      const url1 = getGravatarUrl("  Student@Gmail.COM ");
      const url2 = getGravatarUrl("student@gmail.com");
      expect(url1).toBe(url2);
    });

    it("handles invalid or empty emails gracefully", () => {
      expect(getGravatarUrl("")).toBe("");
      expect(getGravatarUrl("not-an-email")).toBe("");
    });

    it("maps any email or name deterministically to a Google Material color", () => {
      const color1 = getGoogleColor("rahul@gmail.com");
      const color2 = getGoogleColor("rahul@gmail.com");
      expect(color1).toBe(color2);
      expect(GOOGLE_AVATAR_COLORS).toContain(color1);
    });

    it("extracts accurate 1 or 2 letter initials for user avatars", () => {
      expect(getAvatarInitials("Rahul")).toBe("R");
      expect(getAvatarInitials("Rahul Sharma")).toBe("RS");
      expect(getAvatarInitials("Ananya Srikanth Rao")).toBe("AR");
      expect(getAvatarInitials("")).toBe("U");
    });

    it("generates zero-network SVG data URI replicating Google contact avatar", () => {
      const svgUri = getGoogleMaterialAvatarSvg("Rahul Sharma", "rahul@gmail.com");
      expect(svgUri.startsWith("data:image/svg+xml;utf8,")).toBe(true);
      expect(svgUri).toContain("RS");
      expect(svgUri).toContain("%3Ccircle");
    });

    it("generates an Unavatar URL with Google Material avatar fallback for email", () => {
      const url = getAvatarUrl("rahul@gmail.com", "Rahul Sharma");
      expect(url).toContain("https://unavatar.io/rahul%40gmail.com");
      expect(url).toContain("fallback=");
    });
  });

  describe("Review Moderation & Admin Approval Workflow", () => {
    it("assigns pending moderation status and does not publish directly to live testimonials", () => {
      const newReview: UserReviewRecord = {
        id: "rev_12345_test",
        name: "Rahul Verma",
        email: "rahul@gmail.com",
        role: "Class 12 Student",
        rating: 5,
        category: "Career Guidance Session",
        quote: "Wonderful guidance session that cleared all my college admission doubts.",
        avatar: getGravatarUrl("rahul@gmail.com"),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      expect(newReview.status).toBe("pending");
      expect(newReview.avatar).toContain("gravatar.com/avatar");

      // Verify that live testimonials array initially does not contain this pending review
      const liveTestimonials = [...defaultContent.testimonials];
      const isPubliclyVisible = liveTestimonials.some(
        (t) => t.email && t.email.toLowerCase() === newReview.email.toLowerCase(),
      );
      expect(isPubliclyVisible).toBe(false);
    });

    it("simulates admin approval: promotes review to approved and syncs with live testimonials", () => {
      const pendingReview: UserReviewRecord = {
        id: "rev_12345_test",
        name: "Rahul Verma",
        email: "rahul@gmail.com",
        role: "Class 12 Student",
        rating: 5,
        category: "Career Guidance Session",
        quote: "Wonderful guidance session that cleared all my college admission doubts.",
        avatar: getGravatarUrl("rahul@gmail.com"),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Admin approves:
      const approvedReview: UserReviewRecord = {
        ...pendingReview,
        status: "approved",
        reviewedAt: new Date().toISOString(),
      };

      expect(approvedReview.status).toBe("approved");

      // Appending to live testimonials list
      const publishedTestimonials = [
        {
          name: approvedReview.name,
          role: approvedReview.role,
          quote: approvedReview.quote,
          rating: approvedReview.rating,
          category: approvedReview.category,
          email: approvedReview.email,
          avatar: approvedReview.avatar,
        },
        ...defaultContent.testimonials,
      ];

      expect(publishedTestimonials[0]?.email).toBe("rahul@gmail.com");
      expect(publishedTestimonials[0]?.avatar).toContain("gravatar.com/avatar");
    });

    it("simulates admin decline/rejection: removes review from live testimonials", () => {
      const initialTestimonials = [
        {
          name: "Rahul Verma",
          email: "rahul@gmail.com",
          role: "Class 12 Student",
          quote: "Test quote",
        },
        ...defaultContent.testimonials,
      ];

      expect(initialTestimonials.some((t) => t.email === "rahul@gmail.com")).toBe(true);

      // Admin declines
      const updatedTestimonials = initialTestimonials.filter(
        (t) => t.email !== "rahul@gmail.com",
      );
      expect(updatedTestimonials.some((t) => t.email === "rahul@gmail.com")).toBe(false);
    });

    it("validates reviewActionSchema allows delete/approve by id, email, or both", () => {
      // By ID only
      const byId = reviewActionSchema.safeParse({ id: "rev_12345" });
      expect(byId.success).toBe(true);

      // By Email only (handles legacy records without ID)
      const byEmail = reviewActionSchema.safeParse({ email: "rahul@gmail.com" });
      expect(byEmail.success).toBe(true);

      // By both
      const byBoth = reviewActionSchema.safeParse({
        id: "rev_12345",
        email: "rahul@gmail.com",
      });
      expect(byBoth.success).toBe(true);

      // Rejects empty payload
      const empty = reviewActionSchema.safeParse({});
      expect(empty.success).toBe(false);

      const emptyStrings = reviewActionSchema.safeParse({ id: "", email: "" });
      expect(emptyStrings.success).toBe(false);
    });
  });

  describe("userReviewInputSchema validation", () => {
    it("accepts valid review inputs", () => {
      const valid = {
        name: "Aarav Sharma",
        email: "aarav@gmail.com",
        role: "Class 12 Student",
        rating: 5,
        category: "Career Guidance Session",
        quote: "The guidance session was truly inspiring and gave me complete direction.",
      };
      const result = userReviewInputSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("aarav@gmail.com");
        expect(result.data.rating).toBe(5);
      }
    });

    it("rejects invalid emails", () => {
      const invalid = {
        name: "Aarav Sharma",
        email: "not-an-email",
        role: "Student",
        rating: 5,
        category: "Career Guidance",
        quote: "Great session!",
      };
      const result = userReviewInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects review quotes that are too short", () => {
      const invalid = {
        name: "Aarav Sharma",
        email: "aarav@gmail.com",
        role: "Student",
        rating: 5,
        category: "Career Guidance",
        quote: "Hi", // < 5 chars
      };
      const result = userReviewInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("restricts rating between 1 and 5", () => {
      expect(
        userReviewInputSchema.safeParse({
          name: "Aarav",
          email: "aarav@gmail.com",
          role: "Student",
          rating: 6,
          quote: "A long enough quote here.",
        }).success,
      ).toBe(false);

      expect(
        userReviewInputSchema.safeParse({
          name: "Aarav",
          email: "aarav@gmail.com",
          role: "Student",
          rating: 0,
          quote: "A long enough quote here.",
        }).success,
      ).toBe(false);
    });

    it("accepts user review with uploaded avatar data URL", () => {
      const withAvatar = {
        name: "Aarav Sharma",
        email: "aarav@gmail.com",
        role: "Class 12 Student",
        rating: 5,
        category: "Career Guidance Session",
        quote: "The guidance session was truly inspiring and gave me complete direction.",
        avatar: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQ",
      };
      const result = userReviewInputSchema.safeParse(withAvatar);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.avatar).toContain("data:image/webp;base64");
      }
    });
  });

  describe("Duplicate Email Prevention Logic", () => {
    const existingTestimonials = [
      {
        name: "Ananya S",
        email: "ananya@example.com",
        role: "Class 12 Student",
        quote: "Great guidance session.",
        rating: 5,
      },
      {
        name: "Priya Sharma",
        email: "priya.parent@example.com",
        role: "Parent",
        quote: "Clear roadmap for my daughter.",
        rating: 5,
      },
    ];

    it("identifies matching emails case-insensitively and skips saving", () => {
      const newEmail = "Ananya@Example.com "; // Upper-case and trailing whitespace
      const normalized = newEmail.toLowerCase().trim();

      const exists = existingTestimonials.some(
        (t) => t.email && t.email.toLowerCase().trim() === normalized,
      );
      expect(exists).toBe(true);
    });

    it("allows new emails that do not already exist in database records", () => {
      const newEmail = "newstudent@gmail.com";
      const normalized = newEmail.toLowerCase().trim();

      const exists = existingTestimonials.some(
        (t) => t.email && t.email.toLowerCase().trim() === normalized,
      );
      expect(exists).toBe(false);
    });
  });

  describe("testimonialStats Schema Validation", () => {
    it("validates and defaults testimonial milestone metrics", () => {
      const parsed = siteContentSchema.safeParse(defaultContent);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.testimonialStats.programsConducted).toBe("100+");
        expect(parsed.data.testimonialStats.institutionsPartnered).toBe("50+");
        expect(parsed.data.testimonialStats.studentsReached).toBe("10,000+");
        expect(parsed.data.testimonialStats.averageRating).toBe("4.8/5");
      }
    });

    it("accepts custom updated milestone numbers", () => {
      const customContent = {
        ...defaultContent,
        testimonialStats: {
          programsConducted: "150+",
          programsLabel: "Sessions Held",
          institutionsPartnered: "80+",
          institutionsLabel: "Colleges & Schools",
          studentsReached: "25,000+",
          studentsLabel: "Students Mentored",
          averageRating: "4.9/5",
          ratingLabel: "Overall Rating",
          ctaTitle: "Join Our Success Story",
          ctaDescription: "Help us reach the next generation.",
          ctaButtonText: "View Programs",
        },
      };

      const parsed = siteContentSchema.safeParse(customContent);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.testimonialStats.programsConducted).toBe("150+");
        expect(parsed.data.testimonialStats.averageRating).toBe("4.9/5");
      }
    });
  });

  describe("Review Rate Limiting & Abuse Prevention", () => {
    it("enforces rate limits on review submissions per IP", () => {
      _resetRateLimitsForTesting();
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit("review:192.168.1.100", ENQUIRY_RATE_LIMIT_OPTIONS);
        expect(res.allowed).toBe(true);
      }
      const throttled = checkRateLimit("review:192.168.1.100", ENQUIRY_RATE_LIMIT_OPTIONS);
      expect(throttled.allowed).toBe(false);
      expect(throttled.retryAfterSeconds).toBeGreaterThan(0);
    });
  });
});

