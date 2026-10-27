import { useMemo, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  CalendarClock,
  GraduationCap,
  KeyRound,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Users,
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
  counsellingStatuses,
  formatMobile,
  statusLabels,
  whatsappHref,
  type CounsellingStatus,
} from "@/lib/enquiry";
import { AmbientBlobs } from "@/components/site/Section";
import { BrandLogo } from "@/components/site/BrandLogo";
import { PasswordPanel } from "@/components/admin/PasswordPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type Filter = "all" | "new" | CounsellingStatus;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All students" },
  { id: "new", label: "New" },
  { id: "done", label: "Done" },
  { id: "contact_again", label: "Contact again" },
  { id: "not_available", label: "Not available" },
];

const statusTone: Record<CounsellingStatus, string> = {
  done: "data-[state=on]:bg-success-soft data-[state=on]:text-success",
  contact_again: "data-[state=on]:bg-warning-soft data-[state=on]:text-warning",
  not_available: "data-[state=on]:bg-muted data-[state=on]:text-foreground",
};

const dot: Record<Filter, string> = {
  all: "bg-brand",
  new: "bg-brand-teal",
  done: "bg-success",
  contact_again: "bg-warning",
  not_available: "bg-muted-foreground",
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const when = (iso: string) => `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;

export function ReceptionDashboard() {
  const { data: rows, isFetching, refetch } = useSuspenseQuery(enquiriesQuery);
  const queryClient = useQueryClient();
  const logout = useServerFn(receptionLogout);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: rows.length,
      new: 0,
      done: 0,
      contact_again: 0,
      not_available: 0,
    };
    for (const r of rows) c[r.status ?? "new"]++;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");
    return rows.filter((r) => {
      if (filter !== "all" && (r.status ?? "new") !== filter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.includes(q) ||
        r.college.toLowerCase().includes(q) ||
        r.education.toLowerCase().includes(q) ||
        (qDigits.length >= 3 && (r.phone.includes(qDigits) || r.whatsapp.includes(qDigits)))
      );
    });
  }, [rows, filter, query]);

  async function onLogout() {
    await logout();
    queryClient.removeQueries({ queryKey: enquiriesQuery.queryKey });
    await queryClient.invalidateQueries({ queryKey: receptionStatusQuery.queryKey });
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-surface">
      <AmbientBlobs className="fixed opacity-50" />

      <header className="glass-nav sticky top-0 z-40 border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="hidden rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand sm:inline">
              Reception
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn(isFetching && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setPasswordOpen(true)}
            >
              <KeyRound /> <span className="hidden sm:inline">Password</span>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={onLogout}>
              <LogOut /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <div className="animate-rise">
          <p className="type-eyebrow">Reception desk</p>
          <h1 className="type-headline mt-1 text-foreground">Student enquiries</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Everyone who filled in “Partner with us”. Set the counselling status after each call.
          </p>
        </div>

        {/* Filters with counts */}
        <div className="animate-rise mt-8 grid grid-cols-2 gap-3 [animation-delay:80ms] sm:grid-cols-3 lg:grid-cols-5">
          {filters.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={on}
                className={cn(
                  "glass hover-lift rounded-2xl px-4 py-4 text-left transition-all duration-300",
                  on && "ring-2 ring-brand-teal",
                )}
              >
                <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className={cn("h-2 w-2 rounded-full", dot[f.id])} />
                  {f.label}
                </span>
                <span className="mt-1 block text-[28px] font-semibold tracking-tight text-foreground">
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="animate-rise relative mt-6 [animation-delay:140ms]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, email, college or education"
            aria-label="Search students"
            className="glass h-12 rounded-2xl border-0 pl-11 text-[15px]"
          />
        </div>

        <div className="mt-6 space-y-3">
          {visible.length === 0 ? (
            <div className="glass animate-rise rounded-3xl px-6 py-16 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-3 text-[17px] font-semibold text-foreground">
                {rows.length === 0 ? "No students yet" : "No students match"}
              </p>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {rows.length === 0
                  ? "New submissions from the “Partner with us” page will appear here."
                  : "Try a different filter or search."}
              </p>
            </div>
          ) : (
            visible.map((r, i) => <StudentCard key={r.id} row={r} index={i} />)
          )}
        </div>
      </main>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Change reception password</DialogTitle>
          <PasswordPanel title="Change reception password" action={changeReceptionPassword} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentCard({ row, index }: { row: EnquiryRow; index: number }) {
  const queryClient = useQueryClient();
  const update = useServerFn(updateEnquiryStatus);

  async function setStatus(status: CounsellingStatus | null) {
    const previous = queryClient.getQueryData(enquiriesQuery.queryKey);
    const patch = (s: CounsellingStatus | null, at: string | null) =>
      queryClient.setQueryData(enquiriesQuery.queryKey, (old) =>
        old?.map((r) => (r.id === row.id ? { ...r, status: s, status_updated_at: at } : r)),
      );
    patch(status, status ? new Date().toISOString() : null);
    try {
      const res = await update({ data: { id: row.id, status } });
      patch(status, res.statusUpdatedAt);
      toast.success(
        status ? `${row.full_name}: ${statusLabels[status]}` : `${row.full_name}: status cleared`,
      );
    } catch {
      if (previous) queryClient.setQueryData(enquiriesQuery.queryKey, previous);
      toast.error("Couldn't update the status. Your session may have expired — sign in again.");
      await queryClient.invalidateQueries({ queryKey: receptionStatusQuery.queryKey });
    }
  }

  const sameNumber = row.phone === row.whatsapp;

  return (
    <article
      className="glass hover-lift animate-rise rounded-3xl p-5 md:p-6"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-[19px] font-semibold tracking-tight text-foreground">
              {row.full_name}
            </h2>
            {!row.status && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
                New
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" /> Submitted {when(row.created_at)}
          </p>

          <dl className="mt-4 grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-2">
            <Detail icon={Building2} label="College" value={row.college} />
            <Detail icon={GraduationCap} label="Education" value={row.education} />
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <Contact
              href={`tel:+91${row.phone}`}
              icon={Phone}
              label={formatMobile(row.phone)}
              title="Call"
            />
            <Contact
              href={whatsappHref(row.whatsapp)}
              icon={MessageCircle}
              label={sameNumber ? "WhatsApp" : `WhatsApp ${formatMobile(row.whatsapp)}`}
              title="Open WhatsApp"
              external
            />
            <Contact href={`mailto:${row.email}`} icon={Mail} label={row.email} title="Email" />
          </div>
        </div>

        <div className="shrink-0 lg:w-[340px]">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Counselling status
          </p>
          <ToggleGroup
            type="single"
            value={row.status ?? ""}
            onValueChange={(v) => setStatus(v ? (v as CounsellingStatus) : null)}
            className="grid grid-cols-3 gap-1 rounded-2xl bg-background/70 p-1"
            aria-label={`Counselling status for ${row.full_name}`}
          >
            {counsellingStatuses.map((s) => (
              <ToggleGroupItem
                key={s}
                value={s}
                className={cn(
                  "h-auto min-h-10 rounded-xl px-2 py-2 text-[12px] leading-tight text-muted-foreground transition-all duration-300 hover:bg-surface data-[state=on]:font-semibold data-[state=on]:shadow-card",
                  statusTone[s],
                )}
              >
                {statusLabels[s]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="mt-2 text-[12px] text-muted-foreground">
            {row.status && row.status_updated_at
              ? `Updated ${when(row.status_updated_at)} · tap again to clear`
              : "Not counselled yet"}
          </p>
        </div>
      </div>
    </article>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" strokeWidth={1.75} />
      <div className="min-w-0">
        <dt className="text-[12px] text-muted-foreground">{label}</dt>
        <dd className="break-words text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function Contact({
  href,
  icon: Icon,
  label,
  title,
  external,
}: {
  href: string;
  icon: typeof Phone;
  label: string;
  title: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      title={title}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-hairline bg-background/70 px-3.5 py-2 text-[13px] text-foreground transition-colors hover:border-brand-teal hover:text-link"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
}
