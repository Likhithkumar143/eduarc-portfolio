import { useMemo, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  CalendarClock,
  Eye,
  FileSpreadsheet,
  GraduationCap,
  KeyRound,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  X,
  FileText,
  Clock,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import {
  changeReceptionPassword,
  receptionLogout,
  updateEnquiryStatus,
  type EnquiryRow,
} from "@/lib/enquiry.functions";
import { enquiriesQuery, receptionStatusQuery } from "@/lib/reception-queries";
import {
  formatMobile,
  roleLabels,
  statusLabels,
  whatsappHref,
  type CounsellingStatus,
  type EnquiryRole,
} from "@/lib/enquiry";
import { exportStudentsToExcel } from "@/lib/export-excel";
import { BrandLogo } from "@/components/site/BrandLogo";
import { PasswordPanel } from "@/components/admin/PasswordPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type RoleFilter = "all" | EnquiryRole;
type StatusFilter = "all" | "new" | "contacted" | "follow_up" | "resolved";

const roleFilterTabs: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "All Enquiries" },
  { id: "student", label: "Students" },
  { id: "parent", label: "Parents" },
  { id: "institution", label: "Institutions" },
  { id: "mentor", label: "Mentors" },
];

const statusFilterTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Statuses" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "follow_up", label: "Follow-up" },
  { id: "resolved", label: "Resolved" },
];

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const when = (iso: string) => `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;

function normalizeStatus(
  st: string | null | undefined,
): "new" | "contacted" | "follow_up" | "resolved" {
  if (!st) return "new";
  if (st === "done" || st === "contacted") return "contacted";
  if (st === "contact_again" || st === "follow_up") return "follow_up";
  if (st === "resolved") return "resolved";
  return "new";
}

export function ReceptionDashboard() {
  const { data: rows, isFetching, refetch } = useSuspenseQuery(enquiriesQuery);
  const queryClient = useQueryClient();
  const logout = useServerFn(receptionLogout);

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<EnquiryRow | null>(null);

  // Accurate real-time summary counts by role
  const counts = useMemo(() => {
    const c = {
      total: rows.length,
      student: 0,
      parent: 0,
      institution: 0,
      mentor: 0,
    };
    for (const r of rows) {
      const role = (r.role || "student").toLowerCase();
      if (role === "student" || role === "unknown") c.student++;
      else if (role === "parent") c.parent++;
      else if (role === "institution") c.institution++;
      else if (role === "mentor") c.mentor++;
      else c.student++;
    }
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");

    return rows.filter((r) => {
      // Role filter check
      if (roleFilter !== "all") {
        const itemRole = (r.role || "student").toLowerCase();
        if (roleFilter === "student" && itemRole !== "student" && itemRole !== "unknown")
          return false;
        if (roleFilter !== "student" && itemRole !== roleFilter) return false;
      }

      // Status filter check
      if (statusFilter !== "all") {
        const norm = normalizeStatus(r.status);
        if (norm !== statusFilter) return false;
      }

      // Query check
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
  }, [rows, roleFilter, statusFilter, query]);

  async function onLogout() {
    await logout();
    queryClient.removeQueries({ queryKey: enquiriesQuery.queryKey });
    await queryClient.invalidateQueries({ queryKey: receptionStatusQuery.queryKey });
  }

  function handleExportExcel() {
    if (rows.length === 0) {
      toast.error("No student enquiries available to download.");
      return;
    }
    const toExport =
      visible.length > 0 &&
      (roleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0)
        ? visible
        : rows;
    const isFiltered = toExport.length !== rows.length;
    exportStudentsToExcel(
      toExport,
      isFiltered
        ? `EDUARC_Enquiries_${roleFilter}_${statusFilter}_${new Date().toISOString().split("T")[0]}.xls`
        : undefined,
    );
    toast.success(
      isFiltered
        ? `Exported ${toExport.length} filtered record(s) to Excel`
        : `Exported all ${rows.length} enquiry record(s) to Excel`,
    );
  }

  const hasActiveFilters =
    roleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0;

  const clearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setQuery("");
  };

  return (
    <div className="relative isolate min-h-screen bg-surface/40">
      {/* Top Header */}
      <header className="glass-nav sticky top-0 z-40 border-b border-hairline/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <Badge variant="navy" className="hidden sm:inline-flex py-0.5">
              Reception Portal
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="pill-gold"
              size="sm"
              className="text-xs font-bold"
              onClick={handleExportExcel}
              disabled={rows.length === 0}
              title="Download enquiries list in formatted Excel file"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Export Excel</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
              <span className="hidden sm:inline ml-1.5">Refresh</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80"
              onClick={() => setPasswordOpen(true)}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">Password</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80 text-muted-foreground hover:text-destructive hover:border-destructive/30"
              onClick={onLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-6 md:pt-10">
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-hairline">
          <div>
            <span className="type-eyebrow text-brand-gold">Reception Operations</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-navy mt-1">
              Role-Based Enquiries &amp; Leads
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Review live submissions across Students, Parents, Institutions, and Mentors, follow up
              with direct contact actions, and manage status progression.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0" />
            <span>Authorized Reception Desk</span>
          </div>
        </div>

        {/* 5 Summary Cards by Role */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            aria-pressed={roleFilter === "all"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              roleFilter === "all"
                ? "border-brand-navy bg-brand-navy text-white ring-2 ring-brand-navy"
                : "border-hairline bg-white hover:border-brand-gold/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  roleFilter === "all" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Total Enquiries
              </span>
              <FileText
                className={cn(
                  "h-4 w-4",
                  roleFilter === "all" ? "text-brand-gold" : "text-brand-navy",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                roleFilter === "all" ? "text-white" : "text-brand-navy",
              )}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("student")}
            aria-pressed={roleFilter === "student"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              roleFilter === "student"
                ? "border-brand-navy bg-brand-navy text-white ring-2 ring-brand-navy"
                : "border-hairline bg-white hover:border-brand-gold/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  roleFilter === "student" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Students
              </span>
              <GraduationCap
                className={cn(
                  "h-4 w-4",
                  roleFilter === "student" ? "text-brand-gold" : "text-brand-navy",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                roleFilter === "student" ? "text-white" : "text-brand-navy",
              )}
            >
              {counts.student}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("parent")}
            aria-pressed={roleFilter === "parent"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              roleFilter === "parent"
                ? "border-brand-navy bg-brand-navy text-white ring-2 ring-brand-navy"
                : "border-hairline bg-white hover:border-brand-gold/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  roleFilter === "parent" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Parents / Guardians
              </span>
              <Users
                className={cn(
                  "h-4 w-4",
                  roleFilter === "parent" ? "text-brand-gold" : "text-brand-navy",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                roleFilter === "parent" ? "text-white" : "text-brand-navy",
              )}
            >
              {counts.parent}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("institution")}
            aria-pressed={roleFilter === "institution"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              roleFilter === "institution"
                ? "border-brand-navy bg-brand-navy text-white ring-2 ring-brand-navy"
                : "border-hairline bg-white hover:border-brand-gold/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  roleFilter === "institution" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Institutions
              </span>
              <Building2
                className={cn(
                  "h-4 w-4",
                  roleFilter === "institution" ? "text-brand-gold" : "text-brand-navy",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                roleFilter === "institution" ? "text-white" : "text-brand-navy",
              )}
            >
              {counts.institution}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("mentor")}
            aria-pressed={roleFilter === "mentor"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              roleFilter === "mentor"
                ? "border-brand-navy bg-brand-navy text-white ring-2 ring-brand-navy"
                : "border-hairline bg-white hover:border-brand-gold/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  roleFilter === "mentor" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Mentors
              </span>
              <Sparkles
                className={cn(
                  "h-4 w-4",
                  roleFilter === "mentor" ? "text-brand-gold" : "text-brand-navy",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                roleFilter === "mentor" ? "text-white" : "text-brand-navy",
              )}
            >
              {counts.mentor}
            </span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, email, institution, education, designation, or remarks..."
              aria-label="Search enquiries"
              className="h-12 rounded-2xl border-hairline bg-white pl-11 text-sm text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-brand-gold"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Secondary Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Status:</span>
              {statusFilterTabs.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    statusFilter === st.id
                      ? "border-brand-navy bg-brand-navy text-white shadow-xs"
                      : "border-hairline bg-white text-foreground/80 hover:border-brand-gold/50",
                  )}
                >
                  {st.label}
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
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Enquiries Record Cards */}
        <div className="mt-6 space-y-4">
          {visible.length === 0 ? (
            <div className="rounded-3xl border border-hairline bg-white px-6 py-16 text-center shadow-xs">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-3 text-base font-bold text-brand-navy">
                {rows.length === 0
                  ? "No enquiries recorded yet"
                  : "No enquiries match your current filters"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                {rows.length === 0
                  ? "Incoming submissions from the role-based enquiry form will populate here automatically."
                  : "Try clearing your search query or switching to another role/status tab."}
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
            visible.map((r, i) => (
              <EnquiryCard key={r.id} row={r} index={i} onOpenDetails={() => setActiveDetail(r)} />
            ))
          )}
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={activeDetail !== null} onOpenChange={(open) => !open && setActiveDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-hairline bg-white shadow-lift">
          <DialogTitle className="sr-only">Enquiry Details</DialogTitle>
          {activeDetail && (
            <EnquiryDetailModal row={activeDetail} onClose={() => setActiveDetail(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Change Reception Password</DialogTitle>
          <PasswordPanel title="Change Reception Password" action={changeReceptionPassword} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoleBadge({ role }: { role: string | null | undefined }) {
  const norm = (role || "student").toLowerCase() as EnquiryRole;
  if (norm === "parent") {
    return (
      <Badge variant="outline" className="border-blue-300 bg-blue-50/80 text-blue-900 font-bold">
        Parent / Guardian
      </Badge>
    );
  }
  if (norm === "institution") {
    return (
      <Badge variant="navy" className="font-bold">
        School / College
      </Badge>
    );
  }
  if (norm === "mentor") {
    return (
      <Badge
        variant="outline"
        className="border-purple-300 bg-purple-50/80 text-purple-900 font-bold"
      >
        Mentor
      </Badge>
    );
  }
  return <Badge variant="gold">Student</Badge>;
}

function StatusBadge({ status }: { status: string | null | undefined }) {
  const norm = normalizeStatus(status);
  if (norm === "contacted") {
    return <Badge className="bg-success text-white hover:bg-success/90">Contacted</Badge>;
  }
  if (norm === "follow_up") {
    return <Badge className="bg-warning text-white hover:bg-warning/90">Follow-up Required</Badge>;
  }
  if (norm === "resolved") {
    return <Badge className="bg-brand-navy text-white hover:bg-brand-navy/90">Resolved</Badge>;
  }
  return (
    <Badge variant="outline" className="border-hairline text-muted-foreground">
      New
    </Badge>
  );
}

function EnquiryCard({
  row,
  onOpenDetails,
}: {
  row: EnquiryRow;
  index: number;
  onOpenDetails: () => void;
}) {
  const queryClient = useQueryClient();
  const update = useServerFn(updateEnquiryStatus);

  async function setStatus(newStatus: CounsellingStatus | null) {
    const previous = queryClient.getQueryData(enquiriesQuery.queryKey);
    const patch = (s: CounsellingStatus | null, at: string | null) =>
      queryClient.setQueryData(enquiriesQuery.queryKey, (old) =>
        old?.map((r) => (r.id === row.id ? { ...r, status: s, status_updated_at: at } : r)),
      );

    patch(newStatus, newStatus ? new Date().toISOString() : null);
    try {
      const res = await update({ data: { id: row.id, status: newStatus } });
      patch(res.status ?? newStatus, res.statusUpdatedAt);
      toast.success(
        newStatus
          ? `${row.full_name}: ${statusLabels[newStatus] ?? newStatus}`
          : `${row.full_name}: status reset to New`,
      );
    } catch (err: unknown) {
      if (previous) queryClient.setQueryData(enquiriesQuery.queryKey, previous);
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("unauthorized")) {
        toast.error("Your session has expired. Please sign in again.");
      } else {
        toast.error("Couldn't update status. Please try again.");
      }
      await queryClient.invalidateQueries({ queryKey: receptionStatusQuery.queryKey });
    }
  }

  const role = (row.role || "student").toLowerCase();
  const sameNumber = row.phone === row.whatsapp;

  return (
    <article className="rounded-2xl border border-hairline bg-white p-5 md:p-6 shadow-xs hover:border-brand-gold/40 hover:shadow-card transition-all">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          {/* Header row with Name, Role & Status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-brand-navy">{row.full_name}</h2>
            <RoleBadge role={row.role} />
            <StatusBadge status={row.status} />
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 text-brand-gold" />
            <span>Submitted {when(row.created_at)}</span>
          </p>

          {/* Dynamic Role-specific details grid */}
          <div className="grid gap-2 text-xs sm:grid-cols-2 pt-1">
            {/* Student */}
            {role === "student" && (
              <div className="flex items-center gap-2 text-foreground/80">
                <GraduationCap className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                <span className="font-semibold text-brand-navy">Education Level:</span>
                <span className="truncate">{row.education || "Class 10 / 12"}</span>
              </div>
            )}

            {/* Parent */}
            {role === "parent" && (
              <>
                <div className="flex items-center gap-2 text-foreground/80">
                  <GraduationCap className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  <span className="font-semibold text-brand-navy">Child's Level:</span>
                  <span className="truncate">{row.education || "Not specified"}</span>
                </div>
                {row.child_name && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Users className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                    <span className="font-semibold text-brand-navy">Child's Name:</span>
                    <span className="truncate">{row.child_name}</span>
                  </div>
                )}
              </>
            )}

            {/* Institution */}
            {role === "institution" && (
              <>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Building2 className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  <span className="font-semibold text-brand-navy">Institution:</span>
                  <span className="truncate">{row.college || "School / College"}</span>
                </div>
                {row.designation && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Briefcase className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                    <span className="font-semibold text-brand-navy">Designation:</span>
                    <span className="truncate">{row.designation}</span>
                  </div>
                )}
              </>
            )}

            {/* Mentor */}
            {role === "mentor" && (
              <>
                {row.designation && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Briefcase className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                    <span className="font-semibold text-brand-navy">Designation:</span>
                    <span className="truncate">{row.designation}</span>
                  </div>
                )}
                {row.mentor_expertise && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Sparkles className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                    <span className="font-semibold text-brand-navy">Expertise:</span>
                    <span className="truncate">{row.mentor_expertise}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Remarks preview if present */}
          {row.remarks && (
            <div className="rounded-xl border border-hairline/80 bg-surface/60 p-2.5 text-xs text-foreground/85">
              <span className="font-semibold text-brand-navy mr-1">Remarks:</span>
              <span className="line-clamp-2">{row.remarks}</span>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs">
            <a
              href={`tel:${row.phone}`}
              className="flex items-center gap-1.5 font-medium text-brand-navy hover:underline"
              title="Call student"
            >
              <Phone className="h-3.5 w-3.5 text-brand-gold" />
              <span>{formatMobile(row.phone)}</span>
            </a>

            <a
              href={whatsappHref(sameNumber ? row.phone : row.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-medium text-success hover:underline"
              title="Open WhatsApp chat"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WA: {formatMobile(sameNumber ? row.phone : row.whatsapp)}</span>
            </a>

            <a
              href={`mailto:${row.email}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-brand-navy hover:underline truncate"
              title="Send email"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{row.email}</span>
            </a>

            <button
              type="button"
              onClick={onOpenDetails}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold hover:text-brand-gold-hover hover:underline cursor-pointer ml-auto"
            >
              <Eye className="h-3 w-3" />
              <span>Full Details</span>
            </button>
          </div>
        </div>

        {/* Status Toggle Action */}
        <div className="flex flex-col items-start lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Follow-up Status
          </span>
          <ToggleGroup
            type="single"
            value={normalizeStatus(row.status)}
            onValueChange={(val) => {
              if (val === "new" || !val) setStatus(null);
              else setStatus(val as CounsellingStatus);
            }}
            className="flex flex-wrap gap-1 rounded-xl border border-hairline bg-surface p-1"
          >
            <ToggleGroupItem
              value="new"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-muted-foreground data-[state=on]:text-white"
            >
              New
            </ToggleGroupItem>
            <ToggleGroupItem
              value="contacted"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-success data-[state=on]:text-white"
            >
              Contacted
            </ToggleGroupItem>
            <ToggleGroupItem
              value="follow_up"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-warning data-[state=on]:text-white"
            >
              Follow-up
            </ToggleGroupItem>
            <ToggleGroupItem
              value="resolved"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-brand-navy data-[state=on]:text-white"
            >
              Resolved
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </article>
  );
}

function EnquiryDetailModal({ row, onClose }: { row: EnquiryRow; onClose: () => void }) {
  const queryClient = useQueryClient();
  const update = useServerFn(updateEnquiryStatus);

  async function setStatus(newStatus: CounsellingStatus | null) {
    const previous = queryClient.getQueryData(enquiriesQuery.queryKey);
    const patch = (s: CounsellingStatus | null, at: string | null) =>
      queryClient.setQueryData(enquiriesQuery.queryKey, (old) =>
        old?.map((r) => (r.id === row.id ? { ...r, status: s, status_updated_at: at } : r)),
      );

    patch(newStatus, newStatus ? new Date().toISOString() : null);
    try {
      const res = await update({ data: { id: row.id, status: newStatus } });
      patch(res.status ?? newStatus, res.statusUpdatedAt);
      toast.success(
        newStatus
          ? `${row.full_name}: ${statusLabels[newStatus] ?? newStatus}`
          : `${row.full_name}: status reset to New`,
      );
    } catch (err: unknown) {
      if (previous) queryClient.setQueryData(enquiriesQuery.queryKey, previous);
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("unauthorized")) {
        toast.error("Your session has expired. Please sign in again.");
      } else {
        toast.error("Couldn't update status. Please try again.");
      }
    }
  }

  const role = (row.role || "student").toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-navy">{row.full_name}</h2>
            <RoleBadge role={row.role} />
            <StatusBadge status={row.status} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-gold" />
            <span>Submitted on {when(row.created_at)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Direct Contact Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <a
          href={`tel:${row.phone}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface p-3 text-xs font-bold text-brand-navy hover:border-brand-gold"
        >
          <Phone className="h-4 w-4 text-brand-gold" />
          <span>Call {formatMobile(row.phone)}</span>
        </a>

        <a
          href={whatsappHref(row.whatsapp || row.phone)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/5 p-3 text-xs font-bold text-success hover:bg-success/10"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Chat</span>
        </a>

        <a
          href={`mailto:${row.email}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface p-3 text-xs font-bold text-brand-navy hover:border-brand-gold"
        >
          <Mail className="h-4 w-4 text-brand-gold" />
          <span>Email Lead</span>
        </a>
      </div>

      {/* Profile Details List */}
      <div className="rounded-2xl border border-hairline bg-surface/30 p-4 space-y-3 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-muted-foreground text-[11px]">
          Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="font-semibold text-brand-navy block">Role Category:</span>
            <span className="text-foreground/80">{roleLabels[role as EnquiryRole] ?? role}</span>
          </div>

          <div>
            <span className="font-semibold text-brand-navy block">Email Address:</span>
            <span className="text-foreground/80">{row.email}</span>
          </div>

          <div>
            <span className="font-semibold text-brand-navy block">Contact Phone:</span>
            <span className="text-foreground/80">{formatMobile(row.phone)}</span>
          </div>

          <div>
            <span className="font-semibold text-brand-navy block">WhatsApp Phone:</span>
            <span className="text-foreground/80">{formatMobile(row.whatsapp || row.phone)}</span>
          </div>

          {row.education && (
            <div>
              <span className="font-semibold text-brand-navy block">Education Stage / Level:</span>
              <span className="text-foreground/80">{row.education}</span>
            </div>
          )}

          {row.child_name && (
            <div>
              <span className="font-semibold text-brand-navy block">Child's Name:</span>
              <span className="text-foreground/80">{row.child_name}</span>
            </div>
          )}

          {row.college && (
            <div>
              <span className="font-semibold text-brand-navy block">School / Institution:</span>
              <span className="text-foreground/80">{row.college}</span>
            </div>
          )}

          {row.designation && (
            <div>
              <span className="font-semibold text-brand-navy block">Designation:</span>
              <span className="text-foreground/80">{row.designation}</span>
            </div>
          )}

          {row.mentor_expertise && (
            <div>
              <span className="font-semibold text-brand-navy block">Mentor Expertise:</span>
              <span className="text-foreground/80">{row.mentor_expertise}</span>
            </div>
          )}

          {row.status_updated_at && (
            <div>
              <span className="font-semibold text-brand-navy block">Status Last Updated:</span>
              <span className="text-foreground/80">{when(row.status_updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Consent Records */}
      <div className="rounded-2xl border border-hairline bg-surface/30 p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0" />
          <h3 className="font-bold uppercase tracking-wider text-muted-foreground text-[11px]">
            Privacy &amp; Compliance Record
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <span className="font-semibold text-brand-navy block">Privacy Policy Consent:</span>
            <span className="text-foreground/80 flex flex-wrap items-center gap-1.5 mt-0.5">
              {row.consent_given ? (
                <>
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Agreed (v{row.consent_version || "2026.1"})
                  </span>
                  {row.consent_timestamp && (
                    <span className="text-[11px] text-muted-foreground">
                      at {when(row.consent_timestamp)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground italic">Not recorded (legacy entry)</span>
              )}
            </span>
          </div>

          <div>
            <span className="font-semibold text-brand-navy block">Marketing Communications:</span>
            <span className="text-foreground/80 flex items-center gap-1.5 mt-0.5">
              {row.marketing_consent ? (
                <span className="inline-flex items-center rounded-md bg-brand-gold-soft px-2 py-0.5 text-xs font-semibold text-brand-navy ring-1 ring-inset ring-brand-gold/30">
                  Opted In (Subscribed)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                  Not Opted In
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-[11px]">
          Submitted Remarks / Questions
        </h3>
        <div className="rounded-2xl border border-hairline bg-white p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
          {row.remarks ? (
            row.remarks
          ) : (
            <span className="italic text-muted-foreground">
              No remarks provided with this enquiry.
            </span>
          )}
        </div>
      </div>

      {/* Status Update Control in Modal */}
      <div className="border-t border-hairline pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-semibold text-brand-navy">Update Follow-up Status:</span>
        <ToggleGroup
          type="single"
          value={normalizeStatus(row.status)}
          onValueChange={(val) => {
            if (val === "new" || !val) setStatus(null);
            else setStatus(val as CounsellingStatus);
          }}
          className="flex flex-wrap gap-1 rounded-xl border border-hairline bg-surface p-1"
        >
          <ToggleGroupItem
            value="new"
            size="sm"
            className="rounded-lg text-xs font-semibold px-2.5 py-1"
          >
            New
          </ToggleGroupItem>
          <ToggleGroupItem
            value="contacted"
            size="sm"
            className="rounded-lg text-xs font-semibold px-2.5 py-1 data-[state=on]:bg-success data-[state=on]:text-white"
          >
            Contacted
          </ToggleGroupItem>
          <ToggleGroupItem
            value="follow_up"
            size="sm"
            className="rounded-lg text-xs font-semibold px-2.5 py-1 data-[state=on]:bg-warning data-[state=on]:text-white"
          >
            Follow-up
          </ToggleGroupItem>
          <ToggleGroupItem
            value="resolved"
            size="sm"
            className="rounded-lg text-xs font-semibold px-2.5 py-1 data-[state=on]:bg-brand-navy data-[state=on]:text-white"
          >
            Resolved
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
