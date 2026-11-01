import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertOctagon,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Globe2,
  Info,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  UserX,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminBlockIp,
  adminUnblockIp,
  exportSecurityCsv,
  getSecurityOverview,
  investigateIp,
} from "@/lib/security.functions";
import type { IpInvestigationResult, SecuritySeverity } from "@/lib/security.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SecurityAdminPanel() {
  const [searchIp, setSearchIp] = useState("");
  const [investigating, setInvestigating] = useState(false);
  const [investigationData, setInvestigationData] = useState<IpInvestigationResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Manual block modal / prompt state
  const [blockReason, setBlockReason] = useState("");
  const [blockingIp, setBlockingIp] = useState<string | null>(null);

  const fetchOverview = useServerFn(getSecurityOverview);
  const doInvestigate = useServerFn(investigateIp);
  const doBlock = useServerFn(adminBlockIp);
  const doUnblock = useServerFn(adminUnblockIp);
  const doExport = useServerFn(exportSecurityCsv);

  const {
    data: overview,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-security-overview"],
    queryFn: () => fetchOverview(),
    staleTime: 30_000,
  });

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchIp.trim()) return;

    setInvestigating(true);
    try {
      const res = await doInvestigate({ data: { ip: searchIp.trim() } });
      setInvestigationData(res);
      toast.success(`Investigation report generated for ${searchIp.trim()}`);
    } catch {
      toast.error("Failed to investigate IP address.");
    } finally {
      setInvestigating(false);
    }
  }

  async function handleToggleBlock(ip: string, currentlyBlocked: boolean) {
    try {
      if (currentlyBlocked) {
        await doUnblock({ data: { ip } });
        toast.success(`IP ${ip} has been unblocked`);
      } else {
        const reason = blockReason || "Administrative security action";
        await doBlock({ data: { ip, reason, durationSeconds: 86400 * 7 } }); // 7 days
        toast.success(`IP ${ip} has been blocked for 7 days`);
        setBlockingIp(null);
        setBlockReason("");
      }
      refetch();
      if (investigationData && investigationData.ip === ip) {
        const updated = await doInvestigate({ data: { ip } });
        setInvestigationData(updated);
      }
    } catch {
      toast.error("Security action failed. Please check your privileges.");
    }
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const res = await doExport();
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", res.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Security incident report exported");
    } catch {
      toast.error("Failed to export security CSV.");
    } finally {
      setIsExporting(false);
    }
  }

  const getSeverityBadge = (severity: SecuritySeverity) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive" className="bg-red-700 text-white font-bold">CRITICAL</Badge>;
      case "high":
        return <Badge variant="destructive" className="font-semibold">HIGH</Badge>;
      case "medium":
        return <Badge variant="gold" className="font-medium">MEDIUM</Badge>;
      case "low":
      default:
        return <Badge variant="secondary" className="font-medium">LOW</Badge>;
    }
  };

  const metrics = overview?.metrics;

  return (
    <div className="space-y-6">
      {/* Defensive Controls Status Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-hairline bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-brand-navy">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Active Defenses:</span>
          </div>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50 text-emerald-800">
            WAF Threat Filter: Active
          </Badge>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50 text-emerald-800">
            Rate Limiting: Active
          </Badge>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50 text-emerald-800">
            Brute Force Throttling: Active
          </Badge>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50 text-emerald-800">
            Edge IP Blocking: Active
          </Badge>
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
        {/* Total Security Events */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Security Incidents
            </span>
            <span className="rounded-lg bg-brand-gold/10 p-2 text-brand-gold">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              {isLoading ? "..." : (metrics?.totalEvents ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">Logged events</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">All threat checks & access audits</p>
        </div>

        {/* Blocked Requests */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Blocked Requests
            </span>
            <span className="rounded-lg bg-red-500/10 p-2 text-red-600">
              <Ban className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-red-600">
              {isLoading ? "..." : (metrics?.blockedRequests ?? 0).toLocaleString()}
            </span>
            <Badge variant="destructive" className="text-[10px]">
              {metrics?.activeBlockedIps ?? 0} active bans
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Probes & blacklisted IP blocks</p>
        </div>

        {/* Failed Login Attempts */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Failed Logins
            </span>
            <span className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <UserX className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-navy">
              {isLoading ? "..." : (metrics?.failedLogins ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">Staff portals</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Admin & reception password failures</p>
        </div>

        {/* Critical Alerts */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Critical Alerts
            </span>
            <span className="rounded-lg bg-red-600/10 p-2 text-red-700">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-red-700">
              {isLoading ? "..." : (metrics?.criticalAlerts ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">SQLi / Severe</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Exploit payloads & targeted attacks</p>
        </div>
      </div>

      {/* IP Investigation Search Bar */}
      <div className="rounded-2xl border border-hairline bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-brand-gold" />
          <h2 className="text-sm font-bold text-brand-navy">IP Address Forensics & Investigation</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Investigate any suspicious source IP to inspect its request frequency, threat severity, and
          blocking history, or apply an immediate block.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter IP address (e.g. 192.168.1.1, 103.21.244.2)"
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              className="text-xs h-10"
            />
          </div>
          <Button
            type="submit"
            variant="pill-gold"
            size="pill-sm"
            disabled={investigating || !searchIp.trim()}
            className="text-xs h-10"
          >
            {investigating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Investigating...
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Investigate IP
              </>
            )}
          </Button>
        </form>

        {/* Investigation Results */}
        {investigationData && (
          <div className="mt-6 rounded-xl border border-hairline bg-surface/50 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-hairline/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-brand-navy">
                    {investigationData.ip}
                  </span>
                  {investigationData.isBlocked ? (
                    <Badge variant="destructive" className="font-bold">
                      BLOCKED
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-emerald-700 bg-emerald-50">
                      CLEAN / ACTIVE
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total Incidents Logged: <strong>{investigationData.totalIncidents}</strong> ·
                  First Seen: {investigationData.firstSeen ? new Date(investigationData.firstSeen).toLocaleString() : "Never"} ·
                  Last Seen: {investigationData.lastSeen ? new Date(investigationData.lastSeen).toLocaleString() : "Never"}
                </p>
              </div>

              <div>
                <Button
                  size="sm"
                  variant={investigationData.isBlocked ? "outline" : "destructive"}
                  onClick={() => handleToggleBlock(investigationData.ip, investigationData.isBlocked)}
                  className="text-xs"
                >
                  {investigationData.isBlocked ? (
                    <>
                      <Unlock className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                      Unblock IP
                    </>
                  ) : (
                    <>
                      <Ban className="h-3.5 w-3.5 mr-1.5" />
                      Block IP (7 Days)
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Severity counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-hairline text-center">
                <span className="text-red-700 font-bold block text-base">
                  {investigationData.severities.critical}
                </span>
                <span className="text-muted-foreground text-[11px]">Critical</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-hairline text-center">
                <span className="text-red-600 font-bold block text-base">
                  {investigationData.severities.high}
                </span>
                <span className="text-muted-foreground text-[11px]">High</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-hairline text-center">
                <span className="text-amber-600 font-bold block text-base">
                  {investigationData.severities.medium}
                </span>
                <span className="text-muted-foreground text-[11px]">Medium</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-hairline text-center">
                <span className="text-slate-600 font-bold block text-base">
                  {investigationData.severities.low}
                </span>
                <span className="text-muted-foreground text-[11px]">Low</span>
              </div>
            </div>

            {/* Recent incidents from this IP */}
            {investigationData.recentEvents.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-brand-navy block">Incident History</span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {investigationData.recentEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 rounded-lg bg-white border border-hairline text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        {getSeverityBadge(evt.severity)}
                        <span className="font-mono text-muted-foreground">{evt.method}</span>
                        <span className="truncate text-brand-navy font-medium">{evt.description}</span>
                      </div>
                      <span className="text-muted-foreground text-[11px] shrink-0">
                        {new Date(evt.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid: Suspicious IPs and Active Blocks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Suspicious IPs */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Top Suspicious Source IPs
            </h3>
            <span className="text-xs text-muted-foreground">Action</span>
          </div>

          <div className="mt-3 divide-y divide-hairline/60">
            {(!overview?.topSuspiciousIps || overview.topSuspiciousIps.length === 0) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No repeat suspicious IP addresses detected.
              </p>
            ) : (
              overview.topSuspiciousIps.map((s) => (
                <div key={s.ip} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-navy">{s.ip}</span>
                      {getSeverityBadge(s.highestSeverity)}
                      {s.isBlocked && (
                        <Badge variant="destructive" className="text-[10px]">
                          Blocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {s.incidentCount} incidents · Country: {s.country}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchIp(s.ip);
                        doInvestigate({ data: { ip: s.ip } }).then(setInvestigationData);
                      }}
                      className="text-xs h-7 px-2"
                    >
                      Inspect
                    </Button>
                    <Button
                      variant={s.isBlocked ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => handleToggleBlock(s.ip, s.isBlocked)}
                      className="text-xs h-7 px-2.5"
                    >
                      {s.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Blocked IPs */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-600" />
              Active IP Blocklist ({overview?.activeBlockedIps?.length ?? 0})
            </h3>
            <span className="text-xs text-muted-foreground">Status</span>
          </div>

          <div className="mt-3 divide-y divide-hairline/60">
            {(!overview?.activeBlockedIps || overview.activeBlockedIps.length === 0) ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No active IP blocks currently enforced.
              </p>
            ) : (
              overview.activeBlockedIps.map((b) => (
                <div key={b.ip} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-navy">{b.ip}</span>
                      <Badge variant="destructive" className="text-[10px]">
                        Enforced
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {b.reason}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleBlock(b.ip, true)}
                    className="text-xs h-7 px-2.5 shrink-0"
                  >
                    Unblock
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Security Events Table */}
      <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <div>
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-gold" />
              Real-Time Security Event Audit Log
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recent intrusion attempts, login anomalies, probing, and defensive actions
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {overview?.recentEvents?.length ?? 0} events
          </Badge>
        </div>

        <div className="mt-3 overflow-x-auto">
          {(!overview?.recentEvents || overview.recentEvents.length === 0) ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No security incidents recorded. System is operating normally.
            </p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-hairline text-muted-foreground text-[11px] uppercase">
                  <th className="py-2.5 font-semibold">Severity</th>
                  <th className="py-2.5 font-semibold">Event Type</th>
                  <th className="py-2.5 font-semibold">Source IP</th>
                  <th className="py-2.5 font-semibold">Target Path</th>
                  <th className="py-2.5 font-semibold">Description</th>
                  <th className="py-2.5 font-semibold">Action</th>
                  <th className="py-2.5 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/60">
                {overview.recentEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-2.5 whitespace-nowrap">{getSeverityBadge(e.severity)}</td>
                    <td className="py-2.5 font-mono text-[11px] whitespace-nowrap text-brand-navy">
                      {e.eventType}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchIp(e.ip);
                          doInvestigate({ data: { ip: e.ip } }).then(setInvestigationData);
                        }}
                        className="underline text-brand-navy hover:text-brand-gold cursor-pointer"
                      >
                        {e.ip}
                      </button>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] truncate max-w-[140px] text-muted-foreground">
                      {e.path}
                    </td>
                    <td className="py-2.5 truncate max-w-[220px] text-brand-navy font-medium">
                      {e.description}
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <Badge
                        variant={e.actionTaken === "blocked" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {e.actionTaken}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap text-muted-foreground text-[11px]">
                      {new Date(e.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
