import { Map, User, Calendar, ShieldCheck } from "lucide-react";

/** Clean Apple-style preview of the EDUARC portal & guidance experience. Clearly marked as illustrative UI preview. */
export function DeviceShowcase() {
  const guidanceModules = [
    { icon: Map, label: "Stream & Course Roadmap", status: "Active" },
    { icon: User, label: "Student Profile & Goals", status: "In Review" },
    { icon: Calendar, label: "Mentor Consultation", status: "Scheduled" },
  ];

  return (
    <div
      className="relative mx-auto w-full max-w-4xl"
      aria-label="EDUARC Platform Interface Preview"
    >
      {/* Laptop frame */}
      <div className="rounded-[22px] border border-hairline bg-brand-navy p-2.5 shadow-lift">
        <div className="overflow-hidden rounded-[14px] bg-surface">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-hairline bg-white px-3 py-2 sm:px-4 sm:py-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-border" />
              <span className="ml-2 sm:ml-3 text-[10px] sm:text-[11px] font-semibold text-brand-navy truncate">
                EDUARC Connect · Academic Guidance Portal
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-brand-gold-soft border border-brand-gold-border px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-brand-navy">
              System Interface Preview
            </span>
          </div>

          {/* Screen Content */}
          <div className="grid gap-4 p-5 sm:grid-cols-3 bg-surface/50">
            {[
              { k: "Guidance Modules", v: "Class 10 & 12", sub: "Stream Alignment" },
              { k: "Mentorship Focus", v: "1-on-1 Guidance", sub: "Verified Academicians" },
              { k: "Family Support", v: "Student & Parent", sub: "Joint Counselling" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-hairline bg-white p-4 shadow-card">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.k}
                </p>
                <p className="mt-1 text-xl font-bold tracking-tight text-brand-navy">{s.v}</p>
                <p className="mt-1 text-[11px] text-brand-gold font-medium">{s.sub}</p>
              </div>
            ))}

            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Guidance Pathway Progression
                  </p>
                  <p className="text-xs text-brand-navy font-semibold mt-0.5">
                    Stage-by-Stage Decision Framework
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">Term 2026</span>
              </div>

              {/* Clean progression steps */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {[
                  { label: "1. Aptitude", sub: "Identified" },
                  { label: "2. Courses", sub: "Explored" },
                  { label: "3. Mentorship", sub: "In Progress" },
                  { label: "4. Roadmap", sub: "Finalizing" },
                ].map((step, i) => (
                  <div
                    key={step.label}
                    className="rounded-lg bg-surface p-2 border border-hairline"
                  >
                    <div className="h-1.5 w-full rounded-full bg-brand-gold/20 mb-2 overflow-hidden">
                      <div
                        className="h-full bg-brand-gold rounded-full"
                        style={{ width: `${(i + 1) * 25}%` }}
                      />
                    </div>
                    <p className="text-[11px] font-bold text-brand-navy">{step.label}</p>
                    <p className="text-[10px] text-muted-foreground">{step.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-hairline bg-white p-4 shadow-card flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Featured Mentor
                </p>
                <p className="mt-2 text-sm font-bold text-brand-navy">Dr. Gayathri G N</p>
                <p className="text-[11px] text-muted-foreground">Ph.D. · Associate Professor</p>
              </div>
              <div className="mt-3 pt-3 border-t border-hairline flex items-center gap-1.5 text-[11px] text-brand-gold font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Academic Credentials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-full rounded-b-2xl bg-brand-navy/60" />

      {/* Mobile phone frame */}
      <div className="absolute -bottom-8 right-2 w-44 rounded-[26px] border border-hairline bg-brand-navy p-1.5 shadow-lift sm:right-6 sm:w-52 hidden sm:block">
        <div className="overflow-hidden rounded-[20px] bg-white">
          <div className="bg-brand-navy px-4 pb-3.5 pt-5 text-white">
            <p className="text-[10px] text-ink-muted">Welcome to EDUARC</p>
            <p className="text-sm font-bold text-white">Student Roadmap</p>
          </div>
          <div className="space-y-2.5 p-3 bg-surface/40">
            {guidanceModules.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-hairline bg-white p-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <m.icon className="h-3.5 w-3.5 text-brand-gold" />
                    <span className="text-[11px] font-semibold text-brand-navy">{m.label}</span>
                  </div>
                  <span className="text-[9px] font-medium text-brand-gold bg-brand-gold-soft px-1.5 py-0.5 rounded">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
