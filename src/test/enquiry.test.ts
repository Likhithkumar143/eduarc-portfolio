import { describe, expect, it } from "vitest";
import { enquirySchema, normalizeIndianMobile, statusUpdateSchema } from "@/lib/enquiry";

const valid = {
  fullName: "Ananya Rao",
  phone: "98765 43210",
  whatsapp: "+91 98765 43210",
  email: "Ananya@Example.com",
  college: "Sunrise PU College",
  education: "12th / PUC",
};

describe("Partner with us form", () => {
  it("accepts a fully filled form and normalises numbers", () => {
    const r = enquirySchema.parse(valid);
    expect(r.phone).toBe("9876543210");
    expect(r.whatsapp).toBe("9876543210");
    expect(r.email).toBe("ananya@example.com");
  });

  it("rejects the form when any field is empty", () => {
    for (const key of Object.keys(valid) as (keyof typeof valid)[]) {
      expect(enquirySchema.safeParse({ ...valid, [key]: "  " }).success).toBe(false);
    }
  });

  it("only accepts 10-digit Indian mobile numbers", () => {
    expect(normalizeIndianMobile("09876543210")).toBe("9876543210");
    expect(normalizeIndianMobile("12345")).toBeNull();
    expect(normalizeIndianMobile("5876543210")).toBeNull();
  });
});

describe("Counselling status", () => {
  const id = "3f1c2a9e-7b1d-4a5e-9c3f-2b8d6e4a1c70";
  it("allows only done, contact again, not available, or cleared", () => {
    for (const status of ["done", "contact_again", "not_available", null]) {
      expect(statusUpdateSchema.safeParse({ id, status }).success).toBe(true);
    }
    expect(statusUpdateSchema.safeParse({ id, status: "maybe" }).success).toBe(false);
  });
});
