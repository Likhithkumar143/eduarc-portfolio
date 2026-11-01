import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireAdmin } from "./staff.server";
import {
  trackEventInputSchema,
  type AnalyticsSummary,
  type DailyDataPoint,
  type TimeframeFilter,
  type TopItem,
} from "./analytics.types";

/**
 * Classify referrer into a high-level traffic channel
 */
function classifyTrafficSource(referrer: string | null | undefined): {
  source: string;
  domain: string;
} {
  if (!referrer || referrer.trim() === "" || referrer === "direct") {
    return { source: "direct", domain: "Direct / None" };
  }

  try {
    const url = new URL(referrer.startsWith("http") ? referrer : `https://${referrer}`);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    // Search engines
    if (
      host.includes("google") ||
      host.includes("bing") ||
      host.includes("yahoo") ||
      host.includes("duckduckgo") ||
      host.includes("ecosia")
    ) {
      return { source: "organic", domain: host };
    }

    // Social networks
    if (
      host.includes("instagram") ||
      host.includes("linkedin") ||
      host.includes("facebook") ||
      host.includes("twitter") ||
      host.includes("x.com") ||
      host.includes("t.co") ||
      host.includes("whatsapp") ||
      host.includes("telegram") ||
      host.includes("youtube")
    ) {
      return { source: "social", domain: host };
    }

    // Internal navigation
    if (host.includes("eduarc-connect.in") || host === "localhost") {
      return { source: "direct", domain: "Direct / Internal" };
    }

    return { source: "referral", domain: host };
  } catch {
    return { source: "referral", domain: referrer.slice(0, 50) };
  }
}

/**
 * Public: Record visitor analytics event (page view, CTA click, conversion)
 */
export const recordAnalyticsEvent = createServerFn({ method: "POST" })
  .validator((d) => trackEventInputSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      // Skip tracking admin/reception internal navigation
      if (data.path.startsWith("/admin") || data.path.startsWith("/reception")) {
        return { ok: true, skipped: true };
      }

      let country = "IN";
      try {
        const req = getRequest();
        if (req?.headers) {
          country =
            req.headers.get("cf-ipcountry") ||
            req.headers.get("x-country-code") ||
            req.headers.get("x-geo-country") ||
            "IN";
        }
      } catch {
        country = "IN";
      }

      const { source, domain } = classifyTrafficSource(data.referrer);

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const payload = {
        session_id: data.sessionId,
        visitor_id: data.visitorId,
        event_type: data.eventType,
        path: data.path,
        referrer: domain,
        source: source,
        device_type: data.deviceType,
        browser: data.browser,
        os: data.os,
        country: country,
        event_label: data.eventLabel || null,
        duration_seconds: data.durationSeconds || 0,
        is_new_visitor: data.isNewVisitor,
      };

      const { error } = await supabaseAdmin.from("analytics_events").insert(payload);
      if (error) {
        // Table might not exist yet if migration pending; log warning without breaking client
        console.warn("[analytics] Failed to insert event:", error.message);
      }

      return { ok: true };
    } catch (err) {
      console.warn("[analytics] Ingestion error:", err instanceof Error ? err.message : String(err));
      return { ok: false };
    }
  });

/**
 * Helper to compute TopItem[] with percentage
 */
function buildTopItems(counts: Map<string, number>, total: number, max = 8): TopItem[] {
  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max);

  return sorted.map(([label, count]) => ({
    label,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

/**
 * Admin: Get aggregated analytics summary
 */
export const getAnalyticsSummary = createServerFn({ method: "GET" })
  .validator((d) => z.object({ timeframe: z.enum(["7d", "30d", "90d"]).default("30d") }).parse(d))
  .handler(async ({ data }): Promise<AnalyticsSummary> => {
    await requireAdmin();

    const days = data.timeframe === "7d" ? 7 : data.timeframe === "90d" ? 90 : 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const sinceIso = sinceDate.toISOString();

    let events: any[] = [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: rows, error } = await supabaseAdmin
        .from("analytics_events")
        .select("*")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: true })
        .limit(20000);

      if (!error && rows) {
        events = rows;
      }
    } catch (err) {
      console.warn("[analytics] Query error:", err instanceof Error ? err.message : String(err));
    }

    // Process aggregated metrics
    const totalPageviews = events.filter((e) => e.event_type === "page_view").length;
    const uniqueVisitorsSet = new Set(events.map((e) => e.visitor_id));
    const uniqueVisitors = uniqueVisitorsSet.size;
    const newVisitors = new Set(events.filter((e) => e.is_new_visitor).map((e) => e.visitor_id)).size;
    const returningVisitors = Math.max(0, uniqueVisitors - newVisitors);
    const totalEnquiries = events.filter((e) => e.event_type === "enquiry_submit").length;
    const totalCtaClicks = events.filter((e) => e.event_type === "cta_click" || e.event_type === "contact_click").length;
    const conversionRate = uniqueVisitors > 0 ? Number(((totalEnquiries / uniqueVisitors) * 100).toFixed(1)) : 0;

    // Average session duration
    const durations = events.map((e) => e.duration_seconds || 0).filter((d) => d > 0);
    const avgDurationSeconds =
      durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 48;

    // Daily breakdown map
    const dailyMap = new Map<string, { pageviews: number; visitors: Set<string>; enquiries: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0]!;
      dailyMap.set(key, { pageviews: 0, visitors: new Set(), enquiries: 0 });
    }

    // Count distributions
    const pageCounts = new Map<string, number>();
    const sourceCounts = new Map<string, number>();
    const referrerCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    const browserCounts = new Map<string, number>();
    const actionCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();

    for (const e of events) {
      const dateKey = (e.created_at || "").split("T")[0];
      if (dateKey && dailyMap.has(dateKey)) {
        const item = dailyMap.get(dateKey)!;
        if (e.event_type === "page_view") item.pageviews++;
        if (e.event_type === "enquiry_submit") item.enquiries++;
        if (e.visitor_id) item.visitors.add(e.visitor_id);
      }

      if (e.event_type === "page_view" && e.path) {
        pageCounts.set(e.path, (pageCounts.get(e.path) || 0) + 1);
      }

      const src = e.source || "direct";
      sourceCounts.set(src, (sourceCounts.get(src) || 0) + 1);

      if (e.referrer) {
        referrerCounts.set(e.referrer, (referrerCounts.get(e.referrer) || 0) + 1);
      }

      const dev = e.device_type || "desktop";
      deviceCounts.set(dev, (deviceCounts.get(dev) || 0) + 1);

      const br = e.browser || "other";
      browserCounts.set(br, (browserCounts.get(br) || 0) + 1);

      if (e.event_label) {
        actionCounts.set(e.event_label, (actionCounts.get(e.event_label) || 0) + 1);
      }

      const ctry = e.country || "IN";
      countryCounts.set(ctry, (countryCounts.get(ctry) || 0) + 1);
    }

    const dailyTrend: DailyDataPoint[] = Array.from(dailyMap.entries()).map(([date, val]) => ({
      date,
      pageviews: val.pageviews,
      visitors: val.visitors.size,
      enquiries: val.enquiries,
    }));

    const totalEvents = events.length || 1;
    const totalViews = totalPageviews || 1;

    return {
      timeframe: data.timeframe,
      overview: {
        totalPageviews,
        uniqueVisitors,
        newVisitors,
        returningVisitors,
        totalEnquiries,
        totalCtaClicks,
        conversionRate,
        avgDurationSeconds,
      },
      dailyTrend,
      topPages: buildTopItems(pageCounts, totalViews, 8),
      trafficSources: buildTopItems(sourceCounts, totalEvents, 6),
      referrers: buildTopItems(referrerCounts, totalEvents, 6),
      deviceBreakdown: buildTopItems(deviceCounts, totalEvents, 4),
      browserBreakdown: buildTopItems(browserCounts, totalEvents, 6),
      topEngagementActions: buildTopItems(actionCounts, totalCtaClicks || 1, 8),
      geographicDistribution: buildTopItems(countryCounts, totalEvents, 6),
      lastUpdated: new Date().toISOString(),
    };
  });

/**
 * Admin: Export analytics CSV data
 */
export const exportAnalyticsCsv = createServerFn({ method: "GET" })
  .validator((d) => z.object({ timeframe: z.enum(["7d", "30d", "90d"]).default("30d") }).parse(d))
  .handler(async ({ data }): Promise<{ filename: string; csv: string }> => {
    await requireAdmin();

    const days = data.timeframe === "7d" ? 7 : data.timeframe === "90d" ? 90 : 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    let rows: any[] = [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: queryRows, error } = await supabaseAdmin
        .from("analytics_events")
        .select("*")
        .gte("created_at", sinceDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(10000);

      if (!error && queryRows) rows = queryRows;
    } catch (err) {
      console.warn("[analytics] CSV query error:", err);
    }

    const headers = [
      "Timestamp",
      "Event Type",
      "Path",
      "Event Label",
      "Source",
      "Referrer",
      "Device",
      "Browser",
      "OS",
      "Country",
      "Duration (s)",
      "Is New Visitor",
      "Session ID",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvLines = [headers.join(",")];
    for (const r of rows) {
      csvLines.push(
        [
          escapeCsv(r.created_at),
          escapeCsv(r.event_type),
          escapeCsv(r.path),
          escapeCsv(r.event_label),
          escapeCsv(r.source),
          escapeCsv(r.referrer),
          escapeCsv(r.device_type),
          escapeCsv(r.browser),
          escapeCsv(r.os),
          escapeCsv(r.country),
          escapeCsv(r.duration_seconds),
          escapeCsv(r.is_new_visitor),
          escapeCsv(r.session_id),
        ].join(","),
      );
    }

    const filename = `eduarc-analytics-${data.timeframe}-${new Date().toISOString().split("T")[0]}.csv`;
    return { filename, csv: csvLines.join("\n") };
  });
