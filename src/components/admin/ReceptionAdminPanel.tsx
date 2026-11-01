import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { enquiriesQuery } from "@/lib/reception-queries";
import { adminSetReceptionPassword, getReceptionAccess } from "@/lib/admin.functions";
import { exportStudentsToExcel } from "@/lib/export-excel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  normalizeStatus,
  EnquiryCard,
  EnquiryDetailModal,
} from "@/components/reception/enquiry-components";
import { Panel, TextField } from "./fields";
import type { EnquiryRow } from "@/lib/enquiry.functions";
import type { EnquiryRole } from "@/lib/enquiry";

type RoleFilter = "all" | EnquiryRole;
type StatusFilter = "all" | "new" | "contacted" | "follow_up" | "resolved";

const statusFilterTabs: { id: StatusFilter; label: string; colorDot: string }[] = [
  { id: "all", label: "All Statuses", colorDot: "bg-slate-400" },
  { id: "new", label: "New / Pending", colorDot: "bg-slate-400" },
  { id: "contacted", label: "Contacted", colorDot: "bg-emerald-500" },
  { id: "follow_up", label: "Follow-up", colorDot: "bg-amber-500" },
  { id: "resolved", label: "Resolved", colorDot: "bg-brand-navy" },
];

const MIN_PASS_LEN = 8;

export function ReceptionAdminPanel() {
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading, isFetching, refetch } = useQuery(enquiriesQuery);

  const fetchAccessInfo = useServerFn(getReceptionAccess);
  const setReceptionPassword = useServerFn(adminSetReceptionPassword);
  const accessInfo = useQuery({ queryKey: ["reception-access"], queryFn: () => fetchAccessInfo() });

  const [activeTab, setActiveTab] = useState<"data" | "credentials">("data");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [activeDetail, setActiveDetail] = useState<EnquiryRow | null>(null);

  // Password reset form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Comprehensive Progress Report Calculations
  const stats = useMemo(() => {
    const total = rows.length;
    let newCount = 0;
    let contactedCount = 0;
    let followUpCount = 0;
    let resolvedCount = 0;

    let students = 0;
    let parents = 0;
    let institutions = 0;
    let mentors = 0;

    for (const r of rows) {
      const norm = normalizeStatus(r.status);
      if (norm === "new") newCount++;
      else if (norm === "contacted") contactedCount++;
      else if (norm === "follow_up") followUpCount++;
      else if (norm === "resolved") resolvedCount++;

      const role = (r.role || "student").toLowerCase();
      if (role === "student" || role === "unknown") students++;
      else if (role === "parent") parents++;
      else if (role === "institution") institutions++;
      else if (role === "mentor") mentors++;
      else students++;
    }

    const contactedOrResolved = contactedCount + followUpCount + resolvedCount;
    const contactRate = total > 0 ? ((contactedOrResolved / total) * 100).toFixed(1) : "0.0";
    const resolutionRate = total > 0 ? ((resolvedCount / total) * 100).toFixed(1) : "0.0";

    // Progress bar segment percentages
    const pctResolved = total > 0 ? (resolvedCount / total) * 100 : 0;
    const pctContacted = total > 0 ? (contactedCount / total) * 100 : 0;
    const pctFollowUp = total > 0 ? (followUpCount / total) * 100 : 0;
    const pctNew = total > 0 ? (newCount / total) * 100 : 0;

    // Audience breakdown percentages
    const audienceTotal = total;
    const pctStudents = audienceTotal > 0 ? (students / audienceTotal) * 100 : 0;
    const pctParents = audienceTotal > 0 ? (parents / audienceTotal) * 100 : 0;
    const pctInstitutions = audienceTotal > 0 ? (institutions / audienceTotal) * 100 : 0;
    const pctMentors = audienceTotal > 0 ? (mentors / audienceTotal) * 100 : 0;

    return {
      total,
      newCount,
      contactedCount,
      followUpCount,
      resolvedCount,
      contactedOrResolved,
      contactRate,
      resolutionRate,
      students,
      parents,
      institutions,
      mentors,
      pctResolved,
      pctContacted,
      pctFollowUp,
      pctNew,
      pctStudents,
      pctParents,
      pctInstitutions,
      pctMentors,
    };
  }, [rows]);

  const effectiveRoleFilter = roleFilter === "mentor" && stats.mentors === 0 ? "all" : roleFilter;

  // Filtered rows for data table
  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");

    return rows.filter((r) => {
      // Role filter check
      if (effectiveRoleFilter !== "all") {
        const itemRole = (r.role || "student").toLowerCase();
        if (effectiveRoleFilter === "student" && itemRole !== "student" && itemRole !== "unknown")
          return false;
        if (effectiveRoleFilter !== "student" && itemRole !== effectiveRoleFilter) return false;
      }

      // Status filter check
      if (statusFilter !== "all") {
        const norm = normalizeStatus(r.status);
        if (norm !== statusFilter) return false;
      }

      // Text Query check
      if (!q) return true;

      const searchable = [
        r.full_name,
        r.email,
        r.college ?? "",
        r.education ?? "",
        r.child_name ?? "",
        r.designation ?? "",
        r.mentor_expertise ?? "",
        r.remarks ?? "",
        r.role ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(q) ||
        (qDigits.length >= 3 && (r.phone.includes(qDigits) || r.whatsapp.includes(qDigits)))
      );
    });
  }, [rows, effectiveRoleFilter, statusFilter, query]);

  function handleExportExcel() {
    if (rows.length === 0) {
      toast.error("No student enquiries available to download.");
      return;
    }
    const toExport =
      visibleRows.length > 0 &&
      (effectiveRoleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0)
        ? visibleRows
        : rows;
    const isFiltered = toExport.length !== rows.length;
    exportStudentsToExcel(
      toExport,
      isFiltered
        ? `EDUARC_Admin_Enquiries_${effectiveRoleFilter}_${statusFilter}_${new Date().toISOString().split("T")[0]}.xls`
        : undefined,
    );
    toast.success(
      isFiltered
        ? `Exported ${toExport.length} filtered record(s) to Excel`
        : `Exported all ${rows.length} enquiry record(s) to Excel`,
    );
  }

  async function onSaveReceptionPassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword.length < MIN_PASS_LEN) {
      return setPasswordError(`Use at least ${MIN_PASS_LEN} characters.`);
    }
    if (newPassword !== confirmPassword) {
      return setPasswordError("The passwords don't match.");
    }
    setIsSavingPassword(true);
    try {
      const res = await setReceptionPassword({ data: { newPassword } });
      if (!res.ok) return setPasswordError(res.message);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Reception staff password saved successfully");
      await accessInfo.refetch();
    } catch {
      setPasswordError("Couldn't save password. Please try again.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  const clearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setQuery("");
  };

  const hasActiveFilters =
    effectiveRoleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Top View Selector & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-surface/60 rounded-2xl border border-hairline">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-hairline shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("data")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
              activeTab === "data"
                ? "bg-[#243B35] text-white shadow-xs"
                : "text-muted-foreground hover:text-[#243B35] hover:bg-surface",
            )}
          >
            <TrendingUp className="h-3.5 w-3.5 text-[#B47A4B]" />
            <span>Enquiries &amp; Progress Report</span>
            <Badge
              variant={activeTab === "data" ? "gold" : "outline"}
              className="ml-1 text-[10px] py-0 px-1.5"
            >
              {stats.total}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
              activeTab === "credentials"
                ? "bg-[#243B35] text-white shadow-xs"
                : "text-muted-foreground hover:text-[#243B35] hover:bg-surface",
            )}
          >
            <KeyRound className="h-3.5 w-3.5 text-[#B47A4B]" />
            <span>Reception Desk Access</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto px-1">
          <Button
            variant="pill-gold"
            size="sm"
            className="text-xs font-bold"
            onClick={handleExportExcel}
            disabled={rows.length === 0}
            title="Download full enquiries spreadsheet"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
            <span>Export Excel</span>
          </Button>

          <Button
            variant="pill-outline"
            size="sm"
            className="bg-white/80"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh latest data"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            <span className="hidden sm:inline ml-1.5">Refresh</span>
          </Button>

          <Button asChild variant="pill-outline" size="sm" className="bg-white/80">
            <a href="/reception" target="_blank" rel="noreferrer" className="gap-1.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open Desk Portal</span>
            </a>
          </Button>
        </div>
      </div>

      {activeTab === "data" ? (
        <>
          {/* =========================================================================
              1. EXECUTIVE PROGRESS REPORT
             ========================================================================= */}
          <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-hairline">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#B47A4B]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Counselling &amp; Enquiries Progress Report
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#243B35] mt-1 font-heading">
                  Lead Conversion &amp; Outreach Performance
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Contact Outreach:</span>
                <span className="font-bold text-[#243B35] text-sm bg-[#F5F1E8] px-2.5 py-0.5 rounded-lg border border-[#E2DBD0]">
                  {stats.contactRate}%
                </span>
                <span className="text-muted-foreground ml-2">Resolution Rate:</span>
                <span className="font-bold text-[#243B35] text-sm bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {stats.resolutionRate}%
                </span>
              </div>
            </div>

            {/* 4 Pipeline Status Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* New / Action Required */}
              <button
                type="button"
                onClick={() => setStatusFilter("new")}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
                  statusFilter === "new"
                    ? "border-slate-800 bg-slate-900 text-white ring-2 ring-slate-900"
                    : "border-hairline bg-surface/50 hover:bg-white hover:border-[#243B35]/40 hover:shadow-card",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      statusFilter === "new" ? "text-slate-300" : "text-muted-foreground",
                    )}
                  >
                    New &amp; Pending
                  </span>
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                </div>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl font-extrabold tracking-tight",
                    statusFilter === "new" ? "text-white" : "text-[#243B35]",
                  )}
                >
                  {stats.newCount}
                </span>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    statusFilter === "new" ? "text-slate-400" : "text-muted-foreground",
                  )}
                >
                  {stats.total > 0
                    ? `${((stats.newCount / stats.total) * 100).toFixed(0)}% awaiting contact`
                    : "No pending"}
                </p>
              </button>

              {/* Contacted */}
              <button
                type="button"
                onClick={() => setStatusFilter("contacted")}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
                  statusFilter === "contacted"
                    ? "border-emerald-700 bg-emerald-900 text-white ring-2 ring-emerald-800"
                    : "border-hairline bg-surface/50 hover:bg-white hover:border-emerald-300 hover:shadow-card",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      statusFilter === "contacted" ? "text-emerald-200" : "text-emerald-700",
                    )}
                  >
                    Contacted
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl font-extrabold tracking-tight",
                    statusFilter === "contacted" ? "text-white" : "text-emerald-950",
                  )}
                >
                  {stats.contactedCount}
                </span>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    statusFilter === "contacted" ? "text-emerald-200" : "text-muted-foreground",
                  )}
                >
                  Initial outreach complete
                </p>
              </button>

              {/* Follow-up */}
              <button
                type="button"
                onClick={() => setStatusFilter("follow_up")}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
                  statusFilter === "follow_up"
                    ? "border-amber-700 bg-amber-900 text-white ring-2 ring-amber-800"
                    : "border-hairline bg-surface/50 hover:bg-white hover:border-amber-300 hover:shadow-card",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      statusFilter === "follow_up" ? "text-amber-200" : "text-amber-700",
                    )}
                  >
                    Follow-up Required
                  </span>
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                </div>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl font-extrabold tracking-tight",
                    statusFilter === "follow_up" ? "text-white" : "text-amber-950",
                  )}
                >
                  {stats.followUpCount}
                </span>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    statusFilter === "follow_up" ? "text-amber-200" : "text-muted-foreground",
                  )}
                >
                  Active scheduling ongoing
                </p>
              </button>

              {/* Resolved */}
              <button
                type="button"
                onClick={() => setStatusFilter("resolved")}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
                  statusFilter === "resolved"
                    ? "border-[#243B35] bg-[#243B35] text-white ring-2 ring-[#243B35]"
                    : "border-hairline bg-surface/50 hover:bg-white hover:border-[#243B35]/30 hover:shadow-card",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      statusFilter === "resolved" ? "text-white/80" : "text-[#243B35]",
                    )}
                  >
                    Resolved / Guided
                  </span>
                  <div className="h-2 w-2 rounded-full bg-[#B47A4B]" />
                </div>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl font-extrabold tracking-tight",
                    statusFilter === "resolved" ? "text-white" : "text-[#243B35]",
                  )}
                >
                  {stats.resolvedCount}
                </span>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    statusFilter === "resolved" ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  Roadmaps delivered
                </p>
              </button>
            </div>

            {/* Segmented Pipeline Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-[#243B35]">Pipeline Distribution</span>
                <span>
                  {stats.total > 0
                    ? `${stats.resolvedCount} of ${stats.total} total leads successfully closed`
                    : "0 enquiries"}
                </span>
              </div>

              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-hairline">
                {stats.pctResolved > 0 && (
                  <div
                    style={{ width: `${stats.pctResolved}%` }}
                    className="bg-[#243B35] rounded-l-full transition-all duration-500"
                    title={`Resolved: ${stats.resolvedCount} (${stats.pctResolved.toFixed(1)}%)`}
                  />
                )}
                {stats.pctContacted > 0 && (
                  <div
                    style={{ width: `${stats.pctContacted}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Contacted: ${stats.contactedCount} (${stats.pctContacted.toFixed(1)}%)`}
                  />
                )}
                {stats.pctFollowUp > 0 && (
                  <div
                    style={{ width: `${stats.pctFollowUp}%` }}
                    className="bg-amber-400 transition-all duration-500"
                    title={`Follow-up: ${stats.followUpCount} (${stats.pctFollowUp.toFixed(1)}%)`}
                  />
                )}
                {stats.pctNew > 0 && (
                  <div
                    style={{ width: `${stats.pctNew}%` }}
                    className="bg-slate-300 rounded-r-full transition-all duration-500"
                    title={`New: ${stats.newCount} (${stats.pctNew.toFixed(1)}%)`}
                  />
                )}
              </div>

              {/* Progress Legend */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#243B35]" />
                  <span>Resolved ({stats.pctResolved.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Contacted ({stats.pctContacted.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span>Follow-up ({stats.pctFollowUp.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span>New ({stats.pctNew.toFixed(0)}%)</span>
                </div>
              </div>
            </div>

            {/* Segmented Audience Distribution Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-hairline/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-[#243B35]">Audience Segment Distribution</span>
                <span>
                  {stats.total > 0
                    ? `${stats.students} Students • ${stats.parents} Parents • ${stats.institutions} Institutions${stats.mentors > 0 ? ` • ${stats.mentors} Mentors` : ""}`
                    : "0 enquiries"}
                </span>
              </div>

              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-hairline">
                {stats.pctStudents > 0 && (
                  <div
                    style={{ width: `${stats.pctStudents}%` }}
                    className="bg-[#243B35] rounded-l-full transition-all duration-500"
                    title={`Students: ${stats.students} (${stats.pctStudents.toFixed(1)}%)`}
                  />
                )}
                {stats.pctParents > 0 && (
                  <div
                    style={{ width: `${stats.pctParents}%` }}
                    className={cn(
                      "bg-[#B47A4B] transition-all duration-500",
                      stats.pctStudents === 0 && "rounded-l-full",
                      stats.pctInstitutions === 0 && stats.pctMentors === 0 && "rounded-r-full",
                    )}
                    title={`Parents: ${stats.parents} (${stats.pctParents.toFixed(1)}%)`}
                  />
                )}
                {stats.pctInstitutions > 0 && (
                  <div
                    style={{ width: `${stats.pctInstitutions}%` }}
                    className={cn(
                      "bg-[#9AAB94] transition-all duration-500",
                      stats.pctStudents === 0 && stats.pctParents === 0 && "rounded-l-full",
                      stats.pctMentors === 0 && "rounded-r-full",
                    )}
                    title={`Institutions: ${stats.institutions} (${stats.pctInstitutions.toFixed(1)}%)`}
                  />
                )}
                {stats.pctMentors > 0 && (
                  <div
                    style={{ width: `${stats.pctMentors}%` }}
                    className="bg-slate-400 rounded-r-full transition-all duration-500"
                    title={`Mentors (Historical): ${stats.mentors} (${stats.pctMentors.toFixed(1)}%)`}
                  />
                )}
              </div>

              {/* Audience Distribution Legend */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#243B35]" />
                  <span>Students ({stats.pctStudents.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#B47A4B]" />
                  <span>Parents ({stats.pctParents.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#9AAB94]" />
                  <span>Institutions ({stats.pctInstitutions.toFixed(0)}%)</span>
                </div>
                {stats.mentors > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    <span>Mentors Historical ({stats.pctMentors.toFixed(0)}%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audience Segment Tabs */}
            <div className="pt-4 border-t border-hairline">
              <span className="text-xs font-semibold text-muted-foreground block mb-2.5">
                Filter by Audience Category:
              </span>
              <div
                className={cn(
                  "grid gap-2",
                  stats.mentors > 0 ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4",
                )}
              >
                <button
                  type="button"
                  onClick={() => setRoleFilter("all")}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                    effectiveRoleFilter === "all"
                      ? "border-[#243B35] bg-[#243B35] text-white shadow-xs"
                      : "border-hairline bg-surface hover:border-[#243B35]/40 hover:bg-white",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span>All Leads</span>
                  </span>
                  <Badge
                    variant={effectiveRoleFilter === "all" ? "gold" : "outline"}
                    className="text-[10px] py-0 px-1.5"
                  >
                    {stats.total}
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleFilter("student")}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                    effectiveRoleFilter === "student"
                      ? "border-[#243B35] bg-[#243B35] text-white shadow-xs"
                      : "border-hairline bg-surface hover:border-[#243B35]/40 hover:bg-white",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Students</span>
                  </span>
                  <Badge
                    variant={effectiveRoleFilter === "student" ? "gold" : "outline"}
                    className="text-[10px] py-0 px-1.5"
                  >
                    {stats.students}
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleFilter("parent")}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                    effectiveRoleFilter === "parent"
                      ? "border-[#243B35] bg-[#243B35] text-white shadow-xs"
                      : "border-hairline bg-surface hover:border-[#243B35]/40 hover:bg-white",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>Parents</span>
                  </span>
                  <Badge
                    variant={effectiveRoleFilter === "parent" ? "gold" : "outline"}
                    className="text-[10px] py-0 px-1.5"
                  >
                    {stats.parents}
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleFilter("institution")}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                    effectiveRoleFilter === "institution"
                      ? "border-[#243B35] bg-[#243B35] text-white shadow-xs"
                      : "border-hairline bg-surface hover:border-[#243B35]/40 hover:bg-white",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Institutions</span>
                  </span>
                  <Badge
                    variant={effectiveRoleFilter === "institution" ? "gold" : "outline"}
                    className="text-[10px] py-0 px-1.5"
                  >
                    {stats.institutions}
                  </Badge>
                </button>

                {stats.mentors > 0 && (
                  <button
                    type="button"
                    onClick={() => setRoleFilter("mentor")}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer col-span-2 sm:col-span-1",
                      effectiveRoleFilter === "mentor"
                        ? "border-[#243B35] bg-[#243B35] text-white shadow-xs"
                        : "border-hairline bg-surface hover:border-[#243B35]/40 hover:bg-white",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Mentors (Historical)</span>
                    </span>
                    <Badge
                      variant={effectiveRoleFilter === "mentor" ? "gold" : "outline"}
                      className="text-[10px] py-0 px-1.5"
                    >
                      {stats.mentors}
                    </Badge>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. SEARCH & STATUS FILTERS
             ========================================================================= */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads by name, phone, email, institution, education stage, designation, or remarks..."
                className="h-12 rounded-2xl border-hairline bg-white pl-11 text-sm text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-brand-gold"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                  aria-label="Clear query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground mr-1">Status:</span>
                {statusFilterTabs.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      statusFilter === st.id
                        ? "border-brand-navy bg-brand-navy text-white shadow-xs"
                        : "border-hairline bg-white text-foreground/80 hover:border-brand-gold/50",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", st.colorDot)} />
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-brand-navy"
                >
                  Reset all filters
                </Button>
              )}
            </div>
          </div>

          {/* =========================================================================
              3. LIVE ENQUIRIES DATA LIST
             ========================================================================= */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-3xl border border-hairline bg-white p-12 text-center shadow-xs">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-gold" />
                <p className="mt-3 text-sm font-semibold text-brand-navy">
                  Loading live reception enquiries...
                </p>
              </div>
            ) : visibleRows.length === 0 ? (
              <div className="rounded-3xl border border-hairline bg-white px-6 py-16 text-center shadow-xs">
                <Users className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <p className="mt-3 text-base font-bold text-brand-navy">
                  {rows.length === 0
                    ? "No enquiries recorded yet"
                    : "No enquiries match your current filters"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  {rows.length === 0
                    ? "Submissions from the student, parent, institution and mentor guidance forms will populate here live."
                    : "Try clearing your search query or switching to another status or role category."}
                </p>
                {hasActiveFilters && (
                  <div className="mt-4">
                    <Button variant="pill-outline" size="sm" onClick={clearFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              visibleRows.map((r, i) => (
                <EnquiryCard
                  key={r.id}
                  row={r}
                  index={i}
                  onOpenDetails={() => setActiveDetail(r)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        /* =========================================================================
            4. RECEPTION ACCESS & CREDENTIALS MANAGEMENT
           ========================================================================= */
        <div className="grid gap-6 max-w-2xl">
          <Panel
            title="Reception Staff Portal Credentials"
            description="Manage authentication for the dedicated reception desk. Reception staff sign in at /reception to manage follow-up calls and update counselling statuses."
          >
            <div className="flex items-center gap-2 rounded-xl bg-background/60 px-4 py-3 text-[14px]">
              {accessInfo.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : accessInfo.data?.configured ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-foreground font-medium">
                    Reception portal access is currently active and configured.
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  No reception password configured yet. Set a password below to allow reception
                  staff to log in.
                </span>
              )}
            </div>

            <form onSubmit={onSaveReceptionPassword} className="space-y-5 pt-2">
              <TextField
                label="New Reception Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                hint={`Minimum ${MIN_PASS_LEN} characters. Changing this password will sign out any reception staff currently logged in.`}
              />

              <TextField
                label="Confirm Reception Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              {passwordError && (
                <p role="alert" className="text-xs font-semibold text-destructive">
                  {passwordError}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  type="submit"
                  variant="pill"
                  size="pill"
                  disabled={isSavingPassword || !newPassword || !confirmPassword}
                >
                  {isSavingPassword && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  <span>Save Reception Password</span>
                </Button>

                <Button asChild variant="pill-outline" size="sm" className="bg-white/80">
                  <a href="/reception" target="_blank" rel="noreferrer" className="gap-1.5 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open /reception desk</span>
                  </a>
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={activeDetail !== null} onOpenChange={(open) => !open && setActiveDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-hairline bg-white shadow-lift">
          <DialogTitle className="sr-only">Enquiry Details</DialogTitle>
          {activeDetail && (
            <EnquiryDetailModal row={activeDetail} onClose={() => setActiveDetail(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
