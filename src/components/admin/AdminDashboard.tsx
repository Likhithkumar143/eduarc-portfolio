import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Check,
  ExternalLink,
  GraduationCap,
  House,
  Info,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  Mail,
  Settings2,
  Sparkles,
  TrendingUp,
  Undo2,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { siteContentSchema, type SiteContent } from "@/content/eduarc";
import { adminLogout, saveSiteContent } from "@/lib/admin.functions";
import { adminStatusQuery } from "@/lib/admin-status";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";
import { AmbientBlobs } from "@/components/site/Section";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AboutEditor,
  ContactEditor,
  EditorStack,
  FeaturesEditor,
  GeneralEditor,
  HomeEditor,
  ImpactEditor,
  MentorsEditor,
  ProgramsEditor,
  type EditorProps,
} from "./editors";
import { PasswordPanel } from "./PasswordPanel";
import { ReceptionAccessPanel } from "./ReceptionAccessPanel";

type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  Editor?: ComponentType<EditorProps>;
  Custom?: ComponentType;
};

const sections: Section[] = [
  {
    id: "home",
    label: "Home",
    icon: House,
    description: "Headline, mission and key strengths.",
    Editor: HomeEditor,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
    description: "Your story and advantages.",
    Editor: AboutEditor,
  },
  {
    id: "mentors",
    label: "Mentors",
    icon: GraduationCap,
    description: "Add, edit and manage mentor profiles.",
    Editor: MentorsEditor,
  },
  {
    id: "features",
    label: "Features",
    icon: Sparkles,
    description: "Platform features list.",
    Editor: FeaturesEditor,
  },
  {
    id: "programs",
    label: "Programs",
    icon: Layers,
    description: "Offers, audiences and steps.",
    Editor: ProgramsEditor,
  },
  {
    id: "impact",
    label: "Impact",
    icon: TrendingUp,
    description: "Impact cards and testimonials.",
    Editor: ImpactEditor,
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    description: "Email, phone, website and contact page.",
    Editor: ContactEditor,
  },
  {
    id: "general",
    label: "Brand & footer",
    icon: Settings2,
    description: "Tagline, footer and call‑to‑action.",
    Editor: GeneralEditor,
  },
  {
    id: "reception",
    label: "Reception",
    icon: UserRoundCheck,
    description: "Set the reception desk password.",
    Custom: ReceptionAccessPanel,
  },
  {
    id: "security",
    label: "Password",
    icon: KeyRound,
    description: "Change your admin password.",
    Custom: PasswordPanel,
  },
];

/** Drops blank lines from simple lists before saving. */
function clean(c: SiteContent): SiteContent {
  const keep = (s: string) => s.trim().length > 0;
  return {
    ...c,
    idealFor: c.idealFor.filter(keep),
  };
}

export function AdminDashboard() {
  const saved = useSiteContent();
  const queryClient = useQueryClient();
  const save = useServerFn(saveSiteContent);
  const logout = useServerFn(adminLogout);

  const [draft, setDraft] = useState<SiteContent>(saved);
  const [active, setActive] = useState(sections[0]!.id);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  const section = sections.find((s) => s.id === active) ?? sections[0]!;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update: EditorProps["update"] = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  async function onSave() {
    const parsed = siteContentSchema.safeParse(clean(draft));
    if (!parsed.success) {
      toast.error("Some fields are too long or invalid. Please check and try again.");
      return;
    }
    setSaving(true);
    try {
      await save({ data: parsed.data });
      queryClient.setQueryData(siteContentQuery.queryKey, parsed.data);
      setDraft(parsed.data);
      toast.success("Changes published to the website");
    } catch {
      toast.error("Couldn't save. Your session may have expired — sign in again.");
      await queryClient.invalidateQueries({ queryKey: adminStatusQuery.queryKey });
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    await logout();
    await queryClient.invalidateQueries({ queryKey: adminStatusQuery.queryKey });
  }

  const Editor = section.Editor;
  const Custom = section.Custom;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-surface">
      <AmbientBlobs className="fixed opacity-50" />

      {/* Top bar */}
      <header className="glass-nav sticky top-0 z-40 border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="hidden rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink /> <span className="hidden sm:inline">View site</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={onLogout}>
              <LogOut /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-32 pt-6 md:px-6 lg:grid-cols-[240px_1fr] lg:pt-10">
        {/* Navigation */}
        <nav aria-label="Dashboard sections" className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass -mx-1 flex gap-1 overflow-x-auto rounded-2xl p-1.5 lg:mx-0 lg:flex-col lg:rounded-3xl lg:p-2">
            {sections.map((s) => {
              const Icon = s.icon;
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[14px] transition-all duration-300",
                    on
                      ? "bg-primary text-primary-foreground shadow-card"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div key={section.id} className="min-w-0">
          <div className="animate-rise mb-6">
            <p className="type-eyebrow">{section.Custom ? "Settings" : "Edit page"}</p>
            <h1 className="type-headline mt-1 text-foreground">{section.label}</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">{section.description}</p>
          </div>
          {Editor ? (
            <EditorStack>
              <Editor draft={draft} update={update} onSave={onSave} isSaving={saving} />
            </EditorStack>
          ) : Custom ? (
            <Custom />
          ) : null}
        </div>
      </div>

      {/* Save bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-all duration-500",
          dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
        )}
        aria-hidden={!dirty}
      >
        <div className="glass flex w-full max-w-xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 shadow-lift">
          <p className="flex items-center gap-2 text-[14px] text-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-teal" />
            Unsaved changes
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setDraft(saved)}
              disabled={saving}
              tabIndex={dirty ? 0 : -1}
            >
              <Undo2 /> Discard
            </Button>
            <Button
              variant="pill"
              size="pill-sm"
              className="h-9"
              onClick={onSave}
              disabled={saving}
              tabIndex={dirty ? 0 : -1}
            >
              {saving ? <Loader2 className="animate-spin" /> : <Check />}
              Save & publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
