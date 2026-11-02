import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  CalendarClock,
  Eye,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
  ShieldCheck,
  X,
  Clock,
  Briefcase,
  Trash2,
  Settings2,
  Edit3,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { updateEnquiryStatus, type EnquiryRow } from "@/lib/enquiry.functions";
import { enquiriesQuery, receptionStatusQuery } from "@/lib/reception-queries";
import {
  formatMobile,
  roleLabels,
  statusLabels,
  whatsappHref,
  type CounsellingStatus,
  type EnquiryRole,
} from "@/lib/enquiry";
import { useWhatsAppTemplate } from "@/lib/whatsapp";
import { WhatsAppTemplateModal } from "./WhatsAppTemplateModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
export const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
export const when = (iso: string) =>
  `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;

export function normalizeStatus(
  st: string | null | undefined,
): "new" | "contacted" | "follow_up" | "resolved" {
  if (!st) return "new";
  if (st === "done" || st === "contacted") return "contacted";
  if (st === "contact_again" || st === "follow_up") return "follow_up";
  if (st === "resolved") return "resolved";
  return "new";
}

export function RoleBadge({ role }: { role: string | null | undefined }) {
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

export function StatusBadge({ status }: { status: string | null | undefined }) {
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

export function EnquiryCard({
  row,
  onOpenDetails,
  onDelete,
}: {
  row: EnquiryRow;
  index?: number;
  onOpenDetails: () => void;
  onDelete?: () => void;
}) {
  const queryClient = useQueryClient();
  const update = useServerFn(updateEnquiryStatus);
  const { formatGreeting } = useWhatsAppTemplate();

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
              href={whatsappHref(
                sameNumber ? row.phone : row.whatsapp,
                formatGreeting(row.full_name),
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-medium text-success hover:underline"
              title={`Open WhatsApp chat with ${row.full_name}`}
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

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onOpenDetails}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold hover:text-brand-gold-hover hover:underline cursor-pointer"
              >
                <Eye className="h-3 w-3" />
                <span>Full Details</span>
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  title="Delete this enquiry (Admin only)"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              )}
            </div>
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
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-muted-foreground data-[state=on]:text-white cursor-pointer"
            >
              New
            </ToggleGroupItem>
            <ToggleGroupItem
              value="contacted"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-success data-[state=on]:text-white cursor-pointer"
            >
              Contacted
            </ToggleGroupItem>
            <ToggleGroupItem
              value="follow_up"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-warning data-[state=on]:text-white cursor-pointer"
            >
              Follow-up
            </ToggleGroupItem>
            <ToggleGroupItem
              value="resolved"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2 py-1 data-[state=on]:bg-brand-navy data-[state=on]:text-white cursor-pointer"
            >
              Resolved
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </article>
  );
}

export function EnquiryDetailModal({
  row,
  onClose,
  onDelete,
}: {
  row: EnquiryRow;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const queryClient = useQueryClient();
  const update = useServerFn(updateEnquiryStatus);
  const { formatGreeting } = useWhatsAppTemplate();
  const [customWaMsg, setCustomWaMsg] = useState<string | null>(null);
  const [showWaSettings, setShowWaSettings] = useState(false);
  const [isEditingMsg, setIsEditingMsg] = useState(false);

  const activeGreeting = customWaMsg !== null ? customWaMsg : formatGreeting(row.full_name);

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
          className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface p-3 text-xs font-bold text-brand-navy hover:border-brand-gold transition-colors"
        >
          <Phone className="h-4 w-4 text-brand-gold" />
          <span>Call {formatMobile(row.phone)}</span>
        </a>

        <a
          href={whatsappHref(row.whatsapp || row.phone, activeGreeting)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/5 p-3 text-xs font-bold text-success hover:bg-success/10 transition-colors"
          title={`Open WhatsApp chat with ${row.full_name}`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Chat</span>
        </a>

        <a
          href={`mailto:${row.email}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface p-3 text-xs font-bold text-brand-navy hover:border-brand-gold transition-colors"
        >
          <Mail className="h-4 w-4 text-brand-gold" />
          <span>Email Lead</span>
        </a>
      </div>

      {/* WhatsApp Greeting Message Preview & Customizer */}
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-50/20 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>WhatsApp Greeting Message</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            {!isEditingMsg ? (
              <button
                type="button"
                onClick={() => {
                  if (customWaMsg === null) setCustomWaMsg(activeGreeting);
                  setIsEditingMsg(true);
                }}
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                title="Edit message specifically for this student"
              >
                <Edit3 className="h-3 w-3" />
                <span>Customize for {row.full_name.split(" ")[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCustomWaMsg(null);
                  setIsEditingMsg(false);
                }}
                className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-brand-navy cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Default Template</span>
              </button>
            )}
            <span className="text-muted-foreground/30">•</span>
            <button
              type="button"
              onClick={() => setShowWaSettings(true)}
              className="inline-flex items-center gap-1 font-semibold text-[#B47A4B] hover:text-[#9A6438] hover:underline cursor-pointer"
              title="Change default greeting for all enquiries"
            >
              <Settings2 className="h-3 w-3" />
              <span>Template Settings</span>
            </button>
          </div>
        </div>

        {isEditingMsg ? (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={customWaMsg ?? ""}
              onChange={(e) => setCustomWaMsg(e.target.value)}
              className="w-full rounded-xl border border-emerald-300 bg-white p-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder={`Type personalized greeting for ${row.full_name}...`}
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground text-[10px]">Applies to this enquiry only</span>
              <button
                type="button"
                onClick={() => setIsEditingMsg(false)}
                className="rounded-lg bg-emerald-600 px-2.5 py-1 font-bold text-white hover:bg-emerald-700 text-[11px] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-200/70 bg-[#E7FFDB] p-2.5 text-xs leading-relaxed text-slate-800 shadow-xs">
            <p className="whitespace-pre-wrap">{activeGreeting}</p>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-emerald-200/40 text-[10px] text-emerald-800/70">
              <span className="italic">
                {customWaMsg !== null ? "Custom message for this lead" : "Default greeting template"}
              </span>
              <span className="font-semibold">Ready to send ✓✓</span>
            </div>
          </div>
        )}
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
        <div className="flex flex-wrap items-center gap-2">
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
              className="rounded-lg text-xs font-semibold px-2.5 py-1 cursor-pointer"
            >
              New
            </ToggleGroupItem>
            <ToggleGroupItem
              value="contacted"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2.5 py-1 data-[state=on]:bg-success data-[state=on]:text-white cursor-pointer"
            >
              Contacted
            </ToggleGroupItem>
            <ToggleGroupItem
              value="follow_up"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2.5 py-1 data-[state=on]:bg-warning data-[state=on]:text-white cursor-pointer"
            >
              Follow-up
            </ToggleGroupItem>
            <ToggleGroupItem
              value="resolved"
              size="sm"
              className="rounded-lg text-xs font-semibold px-2.5 py-1 data-[state=on]:bg-brand-navy data-[state=on]:text-white cursor-pointer"
            >
              Resolved
            </ToggleGroupItem>
          </ToggleGroup>

          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold rounded-xl"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>Delete Lead</span>
            </Button>
          )}
        </div>
      </div>

      <WhatsAppTemplateModal
        open={showWaSettings}
        onOpenChange={setShowWaSettings}
        sampleStudentName={row.full_name}
      />
    </div>
  );
}
