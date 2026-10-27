import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { enquirySchema, statusUpdateSchema, type CounsellingStatus } from "./enquiry";
import {
  changeOwnPassword,
  requireReception,
  staffLogin,
  staffLogout,
  staffStatus,
} from "./staff.server";

export type EnquiryRow = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  college: string;
  education: string;
  status: CounsellingStatus | null;
  status_updated_at: string | null;
  created_at: string;
};

/** Public: anyone can submit the "Partner with us" form. Input is fully re-validated here. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((d) => enquirySchema.extend({ website: z.string().max(200).optional() }).parse(d))
  .handler(async ({ data }) => {
    // Honeypot: bots fill the hidden "website" field; pretend success and store nothing.
    if (data.website) return { ok: true as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("partner_enquiries").insert({
      full_name: data.fullName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      college: data.college,
      education: data.education,
    });
    if (error) {
      console.error("submitEnquiry failed", error.message);
      throw new Error("Could not save your details");
    }
    return { ok: true as const };
  });

export const getReceptionStatus = createServerFn({ method: "GET" }).handler(() =>
  staffStatus("reception"),
);

export const receptionLogin = createServerFn({ method: "POST" })
  .validator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(({ data }) => staffLogin("reception", data.password));

export const receptionLogout = createServerFn({ method: "POST" }).handler(async () => {
  await staffLogout("reception");
  return { ok: true as const };
});

export const changeReceptionPassword = createServerFn({ method: "POST" })
  .validator((d) =>
    z
      .object({ currentPassword: z.string().min(1).max(200), newPassword: z.string().max(200) })
      .parse(d),
  )
  .handler(({ data }) => changeOwnPassword("reception", data.currentPassword, data.newPassword));

export const listEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  await requireReception();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("partner_enquiries")
    .select(
      "id, full_name, phone, whatsapp, email, college, education, status, status_updated_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) throw new Error("Could not load students");
  return data as EnquiryRow[];
});

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .validator((d) => statusUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    await requireReception();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const statusUpdatedAt = data.status ? new Date().toISOString() : null;
    const { error } = await supabaseAdmin
      .from("partner_enquiries")
      .update({ status: data.status, status_updated_at: statusUpdatedAt })
      .eq("id", data.id);
    if (error) throw new Error("Could not update status");
    return { ok: true as const, statusUpdatedAt };
  });
