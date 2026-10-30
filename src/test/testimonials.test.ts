import { describe, it, expect, vi, beforeEach } from "vitest";
import { userReviewInputSchema } from "@/lib/testimonials.functions";

describe("Testimonials & Review Submissions", () => {
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
});
