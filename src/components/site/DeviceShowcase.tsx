import { Bell, Map, Award, User } from "lucide-react";

/** Crisp HTML mockup of the EduArc student app on laptop + phone. */
export function DeviceShowcase() {
  const rows = [
    { icon: Map, label: "Career Roadmap", pct: 72 },
    { icon: User, label: "Profile completion", pct: 88 },
    { icon: Award, label: "Certificates earned", pct: 45 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-4xl" aria-hidden="true">
      {/* Laptop */}
      <div className="rounded-[22px] border border-hairline bg-ink p-2.5 shadow-lift">
        <div className="overflow-hidden rounded-[14px] bg-surface">
          <div className="flex items-center gap-1.5 border-b border-hairline bg-background px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
            <span className="ml-3 text-[11px] text-muted-foreground">EduArc · Admin Dashboard</span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            {[
              { k: "Active students", v: "1,248" },
              { k: "Mentor sessions", v: "326" },
              { k: "Roadmaps started", v: "982" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-background p-4 shadow-card">
                <p className="text-[11px] text-muted-foreground">{s.k}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-brand">{s.v}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-background p-4 shadow-card sm:col-span-2">
              <p className="text-[11px] text-muted-foreground">Engagement this term</p>
              <div className="mt-4 flex h-24 items-end gap-2">
                {[38, 52, 46, 64, 58, 72, 80, 76, 88, 94].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-brand"
                    style={{ height: `${h}%`, opacity: 0.55 + i * 0.045 }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 shadow-card">
              <p className="text-[11px] text-muted-foreground">Upcoming</p>
              <p className="mt-2 text-[13px] font-medium text-foreground">Career fair prep</p>
              <p className="text-[11px] text-muted-foreground">Grade 12 · Thu</p>
              <p className="mt-3 text-[13px] font-medium text-foreground">Mentor: Engineering</p>
              <p className="text-[11px] text-muted-foreground">Group session · Fri</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-2xl bg-hairline" />

      {/* Phone */}
      <div className="absolute -bottom-10 right-2 w-40 rounded-[28px] border border-hairline bg-ink p-1.5 shadow-lift sm:right-6 sm:w-48">
        <div className="overflow-hidden rounded-[22px] bg-background">
          <div className="bg-gradient-brand px-4 pb-4 pt-6">
            <p className="text-[10px] text-ink-muted">Good morning</p>
            <p className="text-[14px] font-semibold text-ink-foreground">Ananya</p>
          </div>
          <div className="space-y-3 p-3">
            {rows.map((r) => (
              <div key={r.label} className="rounded-xl bg-surface p-2.5">
                <div className="flex items-center gap-2">
                  <r.icon className="h-3.5 w-3.5 text-brand-teal" />
                  <span className="text-[10px] font-medium text-foreground">{r.label}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-hairline">
                  <div
                    className="h-1.5 rounded-full bg-brand-teal"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl bg-accent p-2.5">
              <Bell className="h-3.5 w-3.5 text-brand" />
              <span className="text-[10px] text-brand">New scholarship alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
