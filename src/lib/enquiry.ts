// Client-safe rules for the "Partner with us" form and the reception counselling statuses.
import { z } from "zod";

/** Accepts an Indian mobile number with optional +91 / 91 / 0 prefix; returns 10 digits or null. */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

const mobile = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .transform((v, ctx) => {
      const n = normalizeIndianMobile(v);
      if (!n) {
        ctx.addIssue({ code: "custom", message: `Enter a valid 10‑digit ${label.toLowerCase()}` });
        return z.NEVER;
      }
      return n;
    });

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Name must be under 100 characters"),
  phone: mobile("Contact number"),
  whatsapp: mobile("WhatsApp number"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(255, "Email must be under 255 characters")
    .email("Enter a valid email address")
    .transform((v) => v.toLowerCase()),
  college: z
    .string()
    .trim()
    .min(2, "College name is required")
    .max(150, "College name must be under 150 characters"),
  education: z
    .string()
    .trim()
    .min(2, "Education is required")
    .max(100, "Education must be under 100 characters"),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export const counsellingStatuses = ["done", "contact_again", "not_available"] as const;
export type CounsellingStatus = (typeof counsellingStatuses)[number];

export const statusLabels: Record<CounsellingStatus, string> = {
  done: "Done",
  contact_again: "Need to contact again",
  not_available: "Not available",
};

export const statusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(counsellingStatuses).nullable(),
});

export const formatMobile = (digits: string) => `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
export const whatsappHref = (digits: string) => `https://wa.me/91${digits}`;
