import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Globe2,
  Laptop,
  Mail,
  MessageSquare,
  MousePointerClick,
  Phone,
  RefreshCw,
  Shield,
  Smartphone,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { exportAnalyticsCsv, getAnalyticsSummary } from "@/lib/analytics.functions";
import type { TimeframeFilter, TopItem } from "@/lib/analytics.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AnalyticsAdminPanel() {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>("30d");
  const [isExporting, setIsExporting] = useState(false);

  const fetchSummary = useServerFn(getAnalyticsSummary);
  const fetchCsv = useServerFn(exportAnalyticsCsv);

  const {
    data: summary,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-analytics-summary", timeframe],
    queryFn: () => fetchSummary({ data: { timeframe } }),
    staleTime: 60_000,
  });

  async function handleExport() {
    setIsExporting(true);
    try {
      const res = await fetchCsv({ data: { timeframe } });
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", res.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Analytics CSV exported successfully");
    } catch {
      toast.error("Failed to export analytics data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return "< 1m";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const overview = summary?.overview;
  const dailyTrend = summary?.dailyTrend || [];
  const maxDayViews = Math.max(...dailyTrend.map((d) => d.pageviews), 10);

  return (
    <div className="space-y-6">
      {/* Control Bar: Timeframe & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-hairline bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-gold" />
          <span className="text-xs font-semibold text-brand-navy">Time Range:</span>
          <div className="inline-flex rounded-xl bg-surface p-1 text-xs">
            {(["7d", "30d", "90d"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={cn(
                  "rounded-lg px-3 py-1 font-medium transition-all cursor-pointer",
                  timeframe === t
                    ? "bg-white text-brand-navy shadow-xs font-bold"
                    : "text-muted-foreground hover:text-brand-navy",
                )}
              >
                {t === "7d" ? "7 Days" : t === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching || isLoading}
            className="text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", (isRefetching || isLoading) && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="pill-gold"
            size="pill-sm"
            onClick={handleExport}
            disabled={isExporting || isLoading}
            className="text-xs h-8"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Unique Visitors */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Unique Visitors
            </span>
            <span className="rounded-lg bg-brand-gold/10 p-2 text-brand-gold">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              {isLoading ? "..." : (overview?.uniqueVisitors ?? 0).toLocaleString()}
            </span>
            <Badge variant="secondary" className="text-[10px] font-medium">
              {overview?.newVisitors ?? 0} new
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {overview?.returningVisitors ?? 0} returning visitors
          </p>
        </div>

        {/* Total Page Views */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Page Views
            </span>
            <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <Eye className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              {isLoading ? "..." : (overview?.totalPageviews ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              {overview && overview.uniqueVisitors > 0
                ? `${(overview.totalPageviews / overview.uniqueVisitors).toFixed(1)}/visitor`
                : "0/visitor"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Across all brochure & program pages</p>
        </div>

        {/* Total Enquiries & Conversion */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enquiry Leads
            </span>
            <span className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              {isLoading ? "..." : (overview?.totalEnquiries ?? 0).toLocaleString()}
            </span>
            <Badge variant="gold" className="text-[10px] font-bold">
              {overview?.conversionRate ?? 0}% conv.
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Submitted partner & student forms</p>
        </div>

        {/* CTA & Contact Clicks */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Engagement Actions
            </span>
            <span className="rounded-lg bg-purple-500/10 p-2 text-purple-600">
              <MousePointerClick className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              {isLoading ? "..." : (overview?.totalCtaClicks ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              Avg: {formatDuration(overview?.avgDurationSeconds ?? 0)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Phone, email, and booking CTA clicks</p>
        </div>
      </div>

      {/* Daily Traffic Timeline Chart */}
      <div className="rounded-2xl border border-hairline bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-gold" />
              Daily Traffic & Page Views Trend
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily page views (dark green) and unique visitors (gold)
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-[#243B35]" />
              <span className="text-muted-foreground font-medium">Page Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-[#B47A4B]" />
              <span className="text-muted-foreground font-medium">Visitors</span>
            </div>
          </div>
        </div>

        {dailyTrend.length === 0 || isLoading ? (
          <div className="flex h-44 items-center justify-center text-xs text-muted-foreground">
            {isLoading ? "Loading traffic data..." : "No traffic activity logged in this period yet."}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex h-48 items-end gap-1 pt-6 sm:gap-2">
              {dailyTrend.map((d) => {
                const heightPct = Math.max(8, Math.round((d.pageviews / maxDayViews) * 100));
                const visitorHeightPct = Math.max(6, Math.round((d.visitors / maxDayViews) * 100));
                return (
                  <div
                    key={d.date}
                    className="group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
                  >
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute -top-12 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-navy px-2.5 py-1 text-[11px] font-medium text-white shadow-md group-hover:block left-1/2">
                      <div className="font-bold">{d.date}</div>
                      <div>
                        {d.pageviews} views · {d.visitors} visitors · {d.enquiries} leads
                      </div>
                    </div>

                    {/* Stacked bar */}
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-0.5">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full rounded-t-xs bg-[#243B35] transition-all group-hover:bg-[#1a2b27]"
                      />
                      <div
                        style={{ height: `${visitorHeightPct}%` }}
                        className="w-full rounded-t-xs bg-[#B47A4B] transition-all group-hover:bg-[#9a6438]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Date labels */}
            <div className="flex justify-between text-[10px] text-muted-foreground border-t border-hairline/60 pt-2 px-1">
              <span>{dailyTrend[0]?.date}</span>
              <span>{dailyTrend[Math.floor(dailyTrend.length / 2)]?.date}</span>
              <span>{dailyTrend[dailyTrend.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Breakdown Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most Visited Pages */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand-gold" />
              Most Visited Pages
            </h3>
            <span className="text-xs text-muted-foreground">Views</span>
          </div>

          <div className="mt-3 divide-y divide-hairline/60">
            {(!summary?.topPages || summary.topPages.length === 0) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No page views recorded for this timeframe yet.
              </p>
            ) : (
              summary.topPages.map((item) => (
                <div key={item.label} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 font-medium text-brand-navy truncate">
                      <span className="truncate">{item.label}</span>
                      <a
                        href={item.label}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-brand-navy inline-flex"
                      >
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1 h-1.5 w-36 rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full bg-[#243B35] rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-brand-navy">{item.count.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1 text-[11px]">({item.percentage}%)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Traffic Sources & Referrers */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-brand-gold" />
              Traffic Sources & Referrers
            </h3>
            <span className="text-xs text-muted-foreground">Share</span>
          </div>

          <div className="mt-3 space-y-3">
            {(!summary?.trafficSources || summary.trafficSources.length === 0) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No referral sources recorded yet.
              </p>
            ) : (
              summary.trafficSources.map((item) => {
                const labelTitle =
                  item.label === "direct"
                    ? "Direct / Bookmarks"
                    : item.label === "organic"
                      ? "Search Engines (Organic)"
                      : item.label === "social"
                        ? "Social Media & Messaging"
                        : "Referral Websites";
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-brand-navy">{labelTitle}</span>
                      <span className="text-muted-foreground font-semibold">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full bg-[#B47A4B] rounded-full"
                        style={{ width: `${Math.max(item.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}

            {summary?.referrers && summary.referrers.length > 0 && (
              <div className="pt-3 border-t border-hairline/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Top Referrer Domains
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {summary.referrers.map((ref) => (
                    <Badge key={ref.label} variant="outline" className="text-xs font-normal">
                      {ref.label} ({ref.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Device, Browser & Geography */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <Laptop className="h-4 w-4 text-brand-gold" />
              Audience & Technology
            </h3>
            <span className="text-xs text-muted-foreground">Distribution</span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Device breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-brand-navy">Device Category</span>
              {(!summary?.deviceBreakdown || summary.deviceBreakdown.length === 0) ? (
                <p className="text-xs text-muted-foreground">No device data</p>
              ) : (
                summary.deviceBreakdown.map((dev) => (
                  <div key={dev.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 capitalize text-muted-foreground">
                      {dev.label === "mobile" ? (
                        <Smartphone className="h-3.5 w-3.5" />
                      ) : (
                        <Laptop className="h-3.5 w-3.5" />
                      )}
                      {dev.label}
                    </span>
                    <span className="font-semibold text-brand-navy">
                      {dev.count} ({dev.percentage}%)
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Browser breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-brand-navy">Top Browsers</span>
              {(!summary?.browserBreakdown || summary.browserBreakdown.length === 0) ? (
                <p className="text-xs text-muted-foreground">No browser data</p>
              ) : (
                summary.browserBreakdown.map((br) => (
                  <div key={br.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{br.label}</span>
                    <span className="font-semibold text-brand-navy">
                      {br.count} ({br.percentage}%)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="mt-4 pt-4 border-t border-hairline/60">
            <span className="text-xs font-semibold text-brand-navy block mb-2">
              Geographic Distribution
            </span>
            <div className="flex flex-wrap gap-2">
              {(!summary?.geographicDistribution || summary.geographicDistribution.length === 0) ? (
                <Badge variant="outline" className="text-xs">
                  India (Primary)
                </Badge>
              ) : (
                summary.geographicDistribution.map((geo) => (
                  <Badge key={geo.label} variant="outline" className="text-xs">
                    {geo.label}: {geo.count} ({geo.percentage}%)
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Engagement Actions & Funnel */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-brand-gold" />
              High-Intent Conversions
            </h3>
            <span className="text-xs text-muted-foreground">Events</span>
          </div>

          <div className="mt-3 space-y-3">
            {(!summary?.topEngagementActions || summary.topEngagementActions.length === 0) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No high-intent clicks or enquiry submissions recorded yet.
              </p>
            ) : (
              summary.topEngagementActions.map((action) => {
                const isPhone = action.label.startsWith("phone");
                const isEmail = action.label.startsWith("email");
                const isForm = action.label.startsWith("role:");
                return (
                  <div
                    key={action.label}
                    className="flex items-center justify-between p-2 rounded-xl bg-surface/60 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {isPhone ? (
                        <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : isEmail ? (
                        <Mail className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      )}
                      <span className="font-medium text-brand-navy truncate">
                        {isForm
                          ? `Enquiry: ${action.label.replace("role:", "")}`
                          : action.label}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-bold text-xs shrink-0">
                      {action.count}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="rounded-2xl border border-hairline bg-surface/50 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-brand-navy">Privacy-First Analytics: </strong>
          Visitor tracking uses pseudonymous identifiers stored locally. EduArc never captures
          passwords, payment details, keystrokes, personal addresses, or invasive browser
          fingerprints. Complies with DPDP Act & international education privacy standards.
        </div>
      </div>
    </div>
  );
}
