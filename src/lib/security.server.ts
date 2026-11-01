import { blockedIpCache } from "./security-detector";
import type { SecurityEventType, SecuritySeverity } from "./security.types";

export type LogSecurityEventParams = {
  ip: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  path: string;
  method?: string;
  statusCode?: number;
  userAgent?: string | null;
  country?: string;
  actionTaken?: "logged" | "blocked" | "rate_limited" | "locked_out";
  details?: Record<string, unknown> | null;
};

/**
 * Log a security incident to Supabase security_events table asynchronously.
 */
export async function logSecurityEvent(params: LogSecurityEventParams): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload = {
      ip: params.ip || "unknown",
      event_type: params.eventType,
      severity: params.severity,
      description: params.description,
      path: params.path || "/",
      method: params.method || "GET",
      status_code: params.statusCode ?? 200,
      user_agent: params.userAgent || null,
      country: params.country || "IN",
      action_taken: params.actionTaken || "logged",
      details: params.details || null,
    };

    const { error } = await supabaseAdmin.from("security_events").insert(payload);
    if (error) {
      console.warn("[security] Failed to record security incident:", error.message);
    }
  } catch (err) {
    // Non-blocking catch
    console.warn("[security] Log exception:", err instanceof Error ? err.message : String(err));
  }
}

/**
 * Block an IP address in database and in-memory cache.
 */
export async function blockIpAddress(
  ip: string,
  reason: string,
  durationSeconds?: number | null,
  blockedBy = "admin",
): Promise<boolean> {
  try {
    blockedIpCache.setBlock(ip, reason, durationSeconds);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const expiresAt = durationSeconds
      ? new Date(Date.now() + durationSeconds * 1000).toISOString()
      : null;

    const { error } = await supabaseAdmin.from("blocked_ips").upsert(
      {
        ip,
        reason,
        severity: "high",
        blocked_by: blockedBy,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      },
      { onConflict: "ip" },
    );

    if (error) {
      console.warn("[security] Failed to persist IP block to DB:", error.message);
    }

    await logSecurityEvent({
      ip,
      eventType: "suspicious_request",
      severity: "high",
      description: `IP address blocked by ${blockedBy}: ${reason}`,
      path: "/admin/security",
      actionTaken: "blocked",
    });

    return true;
  } catch (err) {
    console.warn("[security] Block error:", err);
    return false;
  }
}

/**
 * Remove an IP from block list.
 */
export async function unblockIpAddress(ip: string): Promise<boolean> {
  try {
    blockedIpCache.removeBlock(ip);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blocked_ips").delete().eq("ip", ip);
    if (error) {
      console.warn("[security] Failed to delete IP block from DB:", error.message);
    }

    await logSecurityEvent({
      ip,
      eventType: "suspicious_request",
      severity: "low",
      description: `IP address unblocked by administrator`,
      path: "/admin/security",
      actionTaken: "logged",
    });

    return true;
  } catch (err) {
    console.warn("[security] Unblock error:", err);
    return false;
  }
}
