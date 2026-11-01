import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./staff.server";
import { blockIpAddress, unblockIpAddress } from "./security.server";
import { blockedIpCache } from "./security-detector";
import type {
  BlockedIpRecord,
  IpInvestigationResult,
  SecurityEventRecord,
  SecurityOverview,
  SecuritySeverity,
} from "./security.types";

/**
 * Admin: Get comprehensive security monitoring overview
 */
export const getSecurityOverview = createServerFn({ method: "GET" }).handler(
  async (): Promise<SecurityOverview> => {
    await requireAdmin();

    let events: Record<string, unknown>[] = [];
    let dbBlockedIps: Record<string, unknown>[] = [];

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const [eventsRes, blockedRes] = await Promise.all([
        supabaseAdmin
          .from("security_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500),
        supabaseAdmin.from("blocked_ips").select("*").order("created_at", { ascending: false }),
      ]);

      if (eventsRes.data) events = eventsRes.data;
      if (blockedRes.data) dbBlockedIps = blockedRes.data;
    } catch (err) {
      console.warn("[security] Query error:", err);
    }

    // Combine DB blocked IPs and memory cache
    const activeBlockedMap = new Map<string, BlockedIpRecord>();
    for (const b of dbBlockedIps) {
      activeBlockedMap.set(b.ip, {
        id: b.id,
        ip: b.ip,
        reason: b.reason,
        severity: b.severity as SecuritySeverity,
        blockedBy: b.blocked_by,
        expiresAt: b.expires_at,
        createdAt: b.created_at,
      });
    }

    for (const mem of blockedIpCache.getAll()) {
      if (!activeBlockedMap.has(mem.ip)) {
        activeBlockedMap.set(mem.ip, {
          id: `mem_${mem.ip}`,
          ip: mem.ip,
          reason: mem.reason,
          severity: "high",
          blockedBy: "system_memory",
          expiresAt: mem.expiresAt ? new Date(mem.expiresAt).toISOString() : null,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const mappedEvents: SecurityEventRecord[] = events.map((e) => ({
      id: e.id,
      ip: e.ip,
      eventType: e.event_type,
      severity: e.severity as SecuritySeverity,
      description: e.description,
      path: e.path,
      method: e.method,
      statusCode: e.status_code,
      userAgent: e.user_agent,
      country: e.country || "IN",
      actionTaken: e.action_taken,
      details: e.details,
      createdAt: e.created_at,
    }));

    // Calculate metrics
    const totalEvents = mappedEvents.length;
    const blockedRequests = mappedEvents.filter((e) => e.actionTaken === "blocked").length;
    const failedLogins = mappedEvents.filter((e) => e.eventType === "failed_login").length;
    const criticalAlerts = mappedEvents.filter((e) => e.severity === "critical").length;

    const eventsBySeverity = {
      critical: criticalAlerts,
      high: mappedEvents.filter((e) => e.severity === "high").length,
      medium: mappedEvents.filter((e) => e.severity === "medium").length,
      low: mappedEvents.filter((e) => e.severity === "low").length,
    };

    // Calculate top suspicious IPs
    const ipCounts = new Map<
      string,
      { count: number; highest: SecuritySeverity; lastSeen: string; country: string }
    >();
    for (const e of mappedEvents) {
      const current = ipCounts.get(e.ip) || {
        count: 0,
        highest: "low",
        lastSeen: e.createdAt,
        country: e.country,
      };
      current.count++;
      if (e.severity === "critical") current.highest = "critical";
      else if (e.severity === "high" && current.highest !== "critical") current.highest = "high";
      else if (e.severity === "medium" && current.highest === "low") current.highest = "medium";
      ipCounts.set(e.ip, current);
    }

    const topSuspiciousIps = Array.from(ipCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([ip, data]) => ({
        ip,
        incidentCount: data.count,
        highestSeverity: data.highest,
        isBlocked: activeBlockedMap.has(ip),
        lastSeen: data.lastSeen,
        country: data.country,
      }));

    return {
      metrics: {
        totalEvents,
        blockedRequests,
        failedLogins,
        criticalAlerts,
        activeBlockedIps: activeBlockedMap.size,
      },
      recentEvents: mappedEvents.slice(0, 50),
      topSuspiciousIps,
      activeBlockedIps: Array.from(activeBlockedMap.values()),
      eventsBySeverity,
      defenseStatus: {
        rateLimiting: true,
        wafInspection: true,
        ipBlocking: true,
        bruteForceShield: true,
      },
      lastUpdated: new Date().toISOString(),
    };
  },
);

/**
 * Admin: Investigate specific IP address
 */
export const investigateIp = createServerFn({ method: "POST" })
  .validator((d) => z.object({ ip: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }): Promise<IpInvestigationResult> => {
    await requireAdmin();

    let events: Record<string, unknown>[] = [];
    let blockInfo: Record<string, unknown> | null = null;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const [eventsRes, blockRes] = await Promise.all([
        supabaseAdmin
          .from("security_events")
          .select("*")
          .eq("ip", data.ip)
          .order("created_at", { ascending: false })
          .limit(200),
        supabaseAdmin.from("blocked_ips").select("*").eq("ip", data.ip).maybeSingle(),
      ]);

      if (eventsRes.data) events = eventsRes.data;
      if (blockRes.data) blockInfo = blockRes.data;
    } catch (err) {
      console.warn("[security] Investigate query error:", err);
    }

    const mappedEvents: SecurityEventRecord[] = events.map((e) => ({
      id: e.id,
      ip: e.ip,
      eventType: e.event_type,
      severity: e.severity as SecuritySeverity,
      description: e.description,
      path: e.path,
      method: e.method,
      statusCode: e.status_code,
      userAgent: e.user_agent,
      country: e.country || "IN",
      actionTaken: e.action_taken,
      details: e.details,
      createdAt: e.created_at,
    }));

    const eventTypes: Record<string, number> = {};
    for (const e of mappedEvents) {
      eventTypes[e.eventType] = (eventTypes[e.eventType] || 0) + 1;
    }

    const severities = {
      critical: mappedEvents.filter((e) => e.severity === "critical").length,
      high: mappedEvents.filter((e) => e.severity === "high").length,
      medium: mappedEvents.filter((e) => e.severity === "medium").length,
      low: mappedEvents.filter((e) => e.severity === "low").length,
    };

    const firstSeen =
      mappedEvents.length > 0 ? mappedEvents[mappedEvents.length - 1]?.createdAt || null : null;
    const lastSeen = mappedEvents.length > 0 ? mappedEvents[0]?.createdAt || null : null;

    const memoryBlock = blockedIpCache.isBlocked(data.ip);
    const isBlocked = Boolean(blockInfo || memoryBlock.blocked);

    const blockDetails: BlockedIpRecord | null = blockInfo
      ? {
          id: blockInfo.id,
          ip: blockInfo.ip,
          reason: blockInfo.reason,
          severity: blockInfo.severity as SecuritySeverity,
          blockedBy: blockInfo.blocked_by,
          expiresAt: blockInfo.expires_at,
          createdAt: blockInfo.created_at,
        }
      : memoryBlock.blocked
        ? {
            id: `mem_${data.ip}`,
            ip: data.ip,
            reason: memoryBlock.reason || "Suspicious activity",
            severity: "high",
            blockedBy: "system",
            expiresAt: null,
            createdAt: new Date().toISOString(),
          }
        : null;

    return {
      ip: data.ip,
      isBlocked,
      blockDetails,
      totalIncidents: mappedEvents.length,
      firstSeen,
      lastSeen,
      severities,
      eventTypes,
      recentEvents: mappedEvents,
    };
  });

/**
 * Admin: Block an IP
 */
export const adminBlockIp = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ip: z.string().min(1).max(100),
      reason: z.string().min(1).max(300),
      durationSeconds: z.number().int().optional().nullable(),
    }).parse,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const ok = await blockIpAddress(data.ip, data.reason, data.durationSeconds, "admin");
    return { ok };
  });

/**
 * Admin: Unblock an IP
 */
export const adminUnblockIp = createServerFn({ method: "POST" })
  .validator(z.object({ ip: z.string().min(1).max(100) }).parse)
  .handler(async ({ data }) => {
    await requireAdmin();
    const ok = await unblockIpAddress(data.ip);
    return { ok };
  });

/**
 * Admin: Export security incidents CSV
 */
export const exportSecurityCsv = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ filename: string; csv: string }> => {
    await requireAdmin();

    let rows: Record<string, unknown>[] = [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("security_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000);

      if (!error && data) rows = data;
    } catch (err) {
      console.warn("[security] CSV export error:", err);
    }

    const headers = [
      "Timestamp",
      "IP Address",
      "Severity",
      "Event Type",
      "Description",
      "Path",
      "Method",
      "Status Code",
      "Action Taken",
      "Country",
      "User Agent",
    ];

    const escapeCsv = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvLines = [headers.join(",")];
    for (const r of rows) {
      csvLines.push(
        [
          escapeCsv(r.created_at),
          escapeCsv(r.ip),
          escapeCsv(r.severity),
          escapeCsv(r.event_type),
          escapeCsv(r.description),
          escapeCsv(r.path),
          escapeCsv(r.method),
          escapeCsv(r.status_code),
          escapeCsv(r.action_taken),
          escapeCsv(r.country),
          escapeCsv(r.user_agent),
        ].join(","),
      );
    }

    const filename = `eduarc-security-incidents-${new Date().toISOString().split("T")[0]}.csv`;
    return { filename, csv: csvLines.join("\n") };
  },
);
