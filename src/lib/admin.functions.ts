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

const uploadImageInput = z.object({
  fileName: z.string().max(200),
  contentType: z.string().max(100).default("image/jpeg"),
  base64Data: z.string().max(15_000_000),
  sessionId: z.string().max(150).default("custom"),
  type: z.enum(["card", "hero", "gallery"]).default("card"),
  galleryIndex: z.number().optional(),
});

export const uploadProgramImage = createServerFn({ method: "POST" })
  .validator((d) => uploadImageInput.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Clean base64 prefix
    const rawBase64 = data.base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(rawBase64, "base64");

    const cleanSessionId =
      data.sessionId
        .toLowerCase()
        .replace(/[^\w-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "custom";

    let targetFileName = "";
    if (data.type === "card") {
      targetFileName = `card-${Date.now()}.jpg`;
    } else if (data.type === "hero") {
      targetFileName = `hero-${Date.now()}.jpg`;
    } else if (data.type === "gallery") {
      const idx = (data.galleryIndex ?? 0) + 1;
      targetFileName = `gallery-${idx}-${Date.now()}.jpg`;
    } else {
      targetFileName = `${Date.now()}-${data.fileName.toLowerCase().replace(/[^\w.-]/g, "-")}`;
    }

    // Keep every session's images in its own separate directory: sessions/{sessionId}/...
    const uniquePath = `sessions/${cleanSessionId}/${targetFileName}`;

    // Upload to Supabase Storage bucket 'programs'
    const { error: uploadError } = await supabaseAdmin.storage
      .from("programs")
      .upload(uniquePath, buffer, {
        contentType: data.contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[uploadProgramImage] Storage upload error:", uploadError);
      throw new Error(`Failed to upload image to Supabase Storage: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("programs")
      .getPublicUrl(uniquePath);

    return {
      ok: true as const,
      publicUrl: publicUrlData.publicUrl,
      path: uniquePath,
    };
  });
