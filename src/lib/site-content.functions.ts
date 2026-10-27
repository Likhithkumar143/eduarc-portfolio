import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { mergeContent, defaultContent } from "@/content/eduarc";

// Public read of the editable site content (anon SELECT policy only).
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"] || "https://njukapkhqkubgcvnbnwo.supabase.co";
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || "sb_publishable_S5xJAe3BRAtlzMsicHl_ew_Y95fZlWa";
  if (!url || !key) return defaultContent;
  const client = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await client
    .from("site_content")
    .select("data")
    .eq("id", "main")
    .maybeSingle();
  if (error || !data) return defaultContent;
  return mergeContent(data.data);
});
