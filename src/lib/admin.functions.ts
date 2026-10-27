import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { siteContentSchema } from "@/content/eduarc";
import {
  changeOwnPassword,
  receptionAccessInfo,
  requireAdmin,
  setReceptionPassword,
  staffLogin,
  staffLogout,
  staffStatus,
} from "./staff.server";

const passwordInput = z.object({ password: z.string().min(1).max(200) });
const changeInput = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().max(200),
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(() => staffStatus("admin"));

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d) => passwordInput.parse(d))
  .handler(({ data }) => staffLogin("admin", data.password));

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await staffLogout("admin");
  return { ok: true as const };
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .validator((d) => siteContentSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: "main", data, updated_at: new Date().toISOString() });
    if (error) throw new Error("Could not save changes");
    return { ok: true as const };
  });

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator((d) => changeInput.parse(d))
  .handler(({ data }) => changeOwnPassword("admin", data.currentPassword, data.newPassword));

export const getReceptionAccess = createServerFn({ method: "GET" }).handler(() =>
  receptionAccessInfo(),
);

export const adminSetReceptionPassword = createServerFn({ method: "POST" })
  .validator((d) => z.object({ newPassword: z.string().max(200) }).parse(d))
  .handler(({ data }) => setReceptionPassword(data.newPassword));
