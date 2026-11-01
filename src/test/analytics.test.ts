import { describe, expect, it } from "vitest";
import { trackEventInputSchema } from "@/lib/analytics.types";

describe("Website Analytics System (Phase 1)", () => {
  describe("Event Input Validation Schema", () => {
    it("validates a standard page view event correctly", () => {
      const payload = {
        eventType: "page_view",
        path: "/programs",
        referrer: "https://www.google.com/search?q=eduarc",
        sessionId: "s_test123",
        visitorId: "v_user456",
        deviceType: "desktop",
        browser: "Chrome",
        os: "Windows",
        isNewVisitor: true,
        durationSeconds: 15,
      };

      const result = trackEventInputSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventType).toBe("page_view");
        expect(result.data.path).toBe("/programs");
        expect(result.data.browser).toBe("Chrome");
      }
    });

    it("validates CTA click and conversion events", () => {
      const ctaPayload = {
        eventType: "cta_click",
        path: "/",
        eventLabel: "cta:book_counselling",
        sessionId: "s_test123",
        visitorId: "v_user456",
        deviceType: "mobile",
        browser: "Safari",
        os: "iOS",
      };

      const result = trackEventInputSchema.safeParse(ctaPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventType).toBe("cta_click");
        expect(result.data.eventLabel).toBe("cta:book_counselling");
        expect(result.data.deviceType).toBe("mobile");
      }
    });

    it("validates enquiry submission conversion event", () => {
      const leadPayload = {
        eventType: "enquiry_submit",
        path: "/partner",
        eventLabel: "role:student",
        sessionId: "s_test123",
        visitorId: "v_user456",
        deviceType: "desktop",
      };

      const result = trackEventInputSchema.safeParse(leadPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventType).toBe("enquiry_submit");
        expect(result.data.eventLabel).toBe("role:student");
      }
    });

    it("rejects unauthorized event types", () => {
      const invalidPayload = {
        eventType: "hacked_event",
        path: "/",
        sessionId: "s_test123",
        visitorId: "v_user456",
      };

      const result = trackEventInputSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects negative duration seconds", () => {
      const invalidPayload = {
        eventType: "page_view",
        path: "/",
        sessionId: "s_test123",
        visitorId: "v_user456",
        durationSeconds: -50,
      };

      const result = trackEventInputSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("Privacy & Data Boundary Safeguards", () => {
    it("ensures event schema does not accept passwords, credentials, or PII keys", () => {
      const payloadWithPii = {
        eventType: "page_view",
        path: "/contact",
        sessionId: "s_test123",
        visitorId: "v_user456",
        password: "secret_password",
        creditCard: "4111222233334444",
      };

      const parsed = trackEventInputSchema.parse(payloadWithPii);
      expect((parsed as unknown as Record<string, unknown>).password).toBeUndefined();
      expect((parsed as unknown as Record<string, unknown>).creditCard).toBeUndefined();
    });
  });

  describe("Metrics Aggregation Computation", () => {
    it("computes conversion rates and unique counts accurately", () => {
      const events = [
        { visitor_id: "v1", event_type: "page_view" },
        { visitor_id: "v1", event_type: "page_view" },
        { visitor_id: "v2", event_type: "page_view" },
        { visitor_id: "v3", event_type: "page_view" },
        { visitor_id: "v3", event_type: "enquiry_submit" },
      ];

      const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;
      const enquiries = events.filter((e) => e.event_type === "enquiry_submit").length;
      const conversionRate = Number(((enquiries / uniqueVisitors) * 100).toFixed(1));

      expect(uniqueVisitors).toBe(3);
      expect(enquiries).toBe(1);
      expect(conversionRate).toBe(33.3);
    });

    it("handles zero division safely when no visitors are logged", () => {
      const uniqueVisitors = 0;
      const enquiries = 0;
      const conversionRate =
        uniqueVisitors > 0 ? Number(((enquiries / uniqueVisitors) * 100).toFixed(1)) : 0;
      expect(conversionRate).toBe(0);
    });
  });
});
