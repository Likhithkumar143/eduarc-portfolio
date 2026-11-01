import { z } from "zod";

export const eventTypeSchema = z.enum([
  "page_view",
  "cta_click",
  "contact_click",
  "enquiry_submit",
]);

export type AnalyticsEventType = z.infer<typeof eventTypeSchema>;

export const trackEventInputSchema = z.object({
  eventType: eventTypeSchema,
  path: z.string().max(300),
  referrer: z.string().max(500).optional().nullable(),
  eventLabel: z.string().max(200).optional().nullable(),
  sessionId: z.string().max(100),
  visitorId: z.string().max(100),
  deviceType: z.enum(["mobile", "tablet", "desktop"]).default("desktop"),
  browser: z.string().max(50).default("other"),
  os: z.string().max(50).default("other"),
  isNewVisitor: z.boolean().default(false),
  durationSeconds: z.number().int().min(0).max(86400).optional().default(0),
});

export type TrackEventInput = z.infer<typeof trackEventInputSchema>;

export type TimeframeFilter = "7d" | "30d" | "90d";

export type DailyDataPoint = {
  date: string; // YYYY-MM-DD
  pageviews: number;
  visitors: number;
  enquiries: number;
};

export type TopItem = {
  label: string;
  count: number;
  percentage: number;
};

export type AnalyticsSummary = {
  timeframe: TimeframeFilter;
  overview: {
    totalPageviews: number;
    uniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
    totalEnquiries: number;
    totalCtaClicks: number;
    conversionRate: number; // percentage
    avgDurationSeconds: number;
  };
  dailyTrend: DailyDataPoint[];
  topPages: TopItem[];
  trafficSources: TopItem[];
  referrers: TopItem[];
  deviceBreakdown: TopItem[];
  browserBreakdown: TopItem[];
  topEngagementActions: TopItem[];
  geographicDistribution: TopItem[];
  lastUpdated: string;
};

