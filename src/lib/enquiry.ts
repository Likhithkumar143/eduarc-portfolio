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

export const enquiryRoles = ["student", "parent", "institution", "mentor"] as const;
export type EnquiryRole = (typeof enquiryRoles)[number];

export const roleLabels: Record<EnquiryRole, string> = {
  student: "Student",
  parent: "Parent / Guardian",
  institution: "School / College (Institution)",
  mentor: "Mentor",
};

export const educationLevels = ["Class 10", "Class 12 / PUC", "Degree / College", "Other"] as const;
export type EducationLevel = (typeof educationLevels)[number];

export const PRIVACY_POLICY_VERSION = "2026.1";

export const enquirySchema = z
  .object({
    role: z.enum(enquiryRoles).default("student"),
    fullName: z
      .string()
      .trim()
      .min(2, "Name is required")
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
    // Role-specific fields
    education: z.string().trim().max(100).optional(),
    childName: z.string().trim().max(100).optional(),
    college: z.string().trim().max(150).optional(),
    designation: z.string().trim().max(100).optional(),
    mentorExpertise: z.string().trim().max(150).optional(),
    // Optional Remarks (max 500 characters)
    remarks: z.string().trim().max(500, "Remarks must be 500 characters or fewer").optional(),
    // Privacy policy agreement (required, must be true)
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: "You must read and agree to EDUARC's Privacy Policy to submit your enquiry",
    }),
    // Marketing communications preference (optional, defaults to false)
    marketingConsent: z.boolean().default(false),
    // Honeypot field (hidden from users, trips automated spam bots)
    website: z.string().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "student") {
      if (!data.education || data.education.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["education"],
          message: "Please select your education level",
        });
      }
    } else if (data.role === "parent") {
      if (!data.education || data.education.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["education"],
          message: "Please select child's education level",
        });
      }
    } else if (data.role === "institution") {
      if (!data.college || data.college.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["college"],
          message: "Institution name is required",
        });
      }
      if (!data.designation || data.designation.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["designation"],
          message: "Designation at institution is required",
        });
      }
    } else if (data.role === "mentor") {
      if (!data.designation || data.designation.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["designation"],
          message: "Professional designation is required",
        });
      }
      if (!data.mentorExpertise || data.mentorExpertise.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["mentorExpertise"],
          message: "Area of expertise is required",
        });
      }
    }
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export const counsellingStatuses = [
  "contacted",
  "follow_up",
  "resolved",
  "done",
  "contact_again",
  "not_available",
] as const;
export type CounsellingStatus = (typeof counsellingStatuses)[number];

export const statusLabels: Record<CounsellingStatus, string> = {
  contacted: "Contacted",
  follow_up: "Follow-up Required",
  resolved: "Resolved",
  done: "Contacted",
  contact_again: "Follow-up Required",
  not_available: "Not Available",
};

export const statusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(counsellingStatuses).nullable(),
});

export const formatMobile = (digits: string) => `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
export const whatsappHref = (digits: string) => `https://wa.me/91${digits}`;
