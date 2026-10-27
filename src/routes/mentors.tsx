import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  FileText,
  Users,
  Laptop,
  Brain,
  ShieldCheck,
  BookOpen,
  Compass,
  MapPin,
  Mail,
  Send,
  Quote,
  Check,
  Copy,
  Layers,
  Sparkles,
  FlaskConical,
  Briefcase,
  Star,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import mentorImg from "@/assets/mentor-gayathri.jpg";
import { AmbientBlobs } from "@/components/site/Section";
import { defaultContent, initials, type MentorProfile } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Academic Mentors & Advisors | EduArc" },
      {
        name: "description",
        content:
          "Meet EduArc's academic and industry mentors guiding students in Computer Science, Cloud Security, AI, Machine Learning, and career roadmaps.",
      },
      { property: "og:title", content: "Academic Mentors & Advisors | EduArc" },
      {
        property: "og:description",
        content:
          "Connect with experienced mentors and research supervisors for technical guidance and career roadmaps.",
      },
    ],
  }),
  component: MentorProfilePage,
});

const domainIconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  brain: Brain,
  shield: ShieldCheck,
  book: BookOpen,
  compass: Compass,
  graduation: GraduationCap,
  layers: Layers,
  sparkles: Sparkles,
  file: FileText,
};

const domainStyles = [
  { iconColor: "bg-blue-600 text-white", borderColor: "hover:border-blue-300" },
  { iconColor: "bg-purple-600 text-white", borderColor: "hover:border-purple-300" },
  { iconColor: "bg-teal-600 text-white", borderColor: "hover:border-teal-300" },
  { iconColor: "bg-amber-600 text-white", borderColor: "hover:border-amber-300" },
  { iconColor: "bg-indigo-600 text-white", borderColor: "hover:border-indigo-300" },
  { iconColor: "bg-rose-600 text-white", borderColor: "hover:border-rose-300" },
];

const highlightStyles = [
  { icon: GraduationCap, bgColor: "bg-blue-50 text-blue-600" },
  { icon: FileText, bgColor: "bg-emerald-50 text-emerald-600" },
  { icon: Layers, bgColor: "bg-purple-50 text-purple-600" },
  { icon: Star, bgColor: "bg-amber-50 text-amber-600" },
];

const educationDotColors = [
  "bg-emerald-500 ring-emerald-100",
  "bg-blue-500 ring-blue-100",
  "bg-purple-500 ring-purple-100",
  "bg-amber-500 ring-amber-100",
  "bg-teal-500 ring-teal-100",
];

function MentorProfilePage() {
  const content = useSiteContent();
  const mentors = content.mentors && content.mentors.length > 0 ? content.mentors : defaultContent.mentors;

  const [selectedId, setSelectedId] = useState<string>(mentors[0]?.id || "dr-gayathri-g-n");
  const [copied, setCopied] = useState(false);

  const activeMentor: MentorProfile =
    mentors.find((m) => m.id === selectedId) || mentors[0] || defaultContent.mentors[0]!;

  const isGayathri =
    activeMentor.id === "dr-gayathri-g-n" ||
    activeMentor.name.toLowerCase().includes("gayathri");

  const avatarSrc = activeMentor.imageUrl?.trim()
    ? activeMentor.imageUrl
    : isGayathri
      ? mentorImg
      : null;

  const copyEmail = () => {
    if (!activeMentor.email) return;
    navigator.clipboard.writeText(activeMentor.email);
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative isolate overflow-hidden bg-slate-50/60 pb-24 pt-6 md:pb-32">
      <AmbientBlobs />

      <div className="container-wide">
        {/* Breadcrumb / Top Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">Mentors</span>
            <span>/</span>
            <span className="text-foreground/70">{activeMentor.name}</span>
          </nav>

          {/* Multiple Mentors Switcher */}
          {mentors.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-sm">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Mentors:
              </span>
              {mentors.map((m) => {
                const isActive = m.id === activeMentor.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                      isActive
                        ? "bg-brand text-brand-contrast shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                    )}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* HERO PROFILE BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-md sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Avatar & Bio */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={activeMentor.name}
                    className="h-32 w-32 rounded-2xl object-cover shadow-md ring-4 ring-white sm:h-40 sm:w-40 md:h-44 md:w-44"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 rounded-2xl bg-gradient-to-br from-brand/20 via-sky-100 to-brand-teal/20 text-brand flex items-center justify-center font-bold text-3xl shadow-md ring-4 ring-white">
                    {initials(activeMentor.name || "Mentor")}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>

              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {activeMentor.role || "Academic Mentor"}
                </span>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                  {activeMentor.name}
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                  {activeMentor.designation || "Mentor"}
                  {activeMentor.qualification ? (
                    <>
                      <span className="mx-2 text-slate-300 font-light">|</span>
                      <span>{activeMentor.qualification}</span>
                    </>
                  ) : null}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 sm:text-sm">
                  {activeMentor.location && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {activeMentor.location}
                    </span>
                  )}
                  {activeMentor.email && (
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 font-medium text-sky-700 hover:text-sky-800 transition-colors cursor-pointer"
                      title="Click to copy email"
                    >
                      <Mail className="h-4 w-4 text-sky-600" />
                      {activeMentor.email}
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>

                {activeMentor.bio && (
                  <p className="mt-4 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {activeMentor.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quote Box */}
            {activeMentor.quote && (
              <div className="relative flex flex-col justify-between rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-white p-6 shadow-xs lg:w-[360px] lg:shrink-0">
                <Quote className="h-7 w-7 text-sky-500/80 mb-2" />
                <blockquote className="text-xs italic leading-relaxed text-slate-700 sm:text-sm">
                  “{activeMentor.quote}”
                </blockquote>
                <div className="mt-4 text-right">
                  <span className="text-xs font-bold text-slate-900">— {activeMentor.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STATS HIGHLIGHTS STRIP */}
        {activeMentor.highlights && activeMentor.highlights.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {activeMentor.highlights.map((item, index) => {
              const style = highlightStyles[index % highlightStyles.length]!;
              const Icon = domainIconMap[item.icon] || style.icon;
              return (
                <div
                  key={index}
                  className="hover-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.bgColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{item.value}</h2>
                    <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MAIN 2-COLUMN SECTION */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Mentorship Areas & Research Interests */}
          <div className="space-y-8 lg:col-span-8">
            {/* Mentorship Areas */}
            {activeMentor.mentorshipAreas && activeMentor.mentorshipAreas.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Mentorship Areas
                    </h2>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      Expert guidance across key domains and specialized engineering curricula
                    </p>
                  </div>
                </div>

                {/* Grid of Areas */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeMentor.mentorshipAreas.map((area, idx) => {
                    const style = domainStyles[idx % domainStyles.length]!;
                    const Icon = domainIconMap[area.icon] || Laptop;
                    return (
                      <div
                        key={idx}
                        className={`hover-lift flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all ${style.borderColor}`}
                      >
                        <div>
                          <div
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${style.iconColor} shadow-xs mb-3`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-sm font-bold leading-tight text-slate-900">
                            {area.title}
                          </h3>
                          <ul className="mt-3.5 space-y-2">
                            {area.topics.map((topic, tIdx) => (
                              <li
                                key={tIdx}
                                className="flex items-start gap-2 text-xs leading-snug text-slate-600"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Research Interests */}
            {activeMentor.researchInterests && activeMentor.researchInterests.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Research Interests
                    </h2>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      Specialized research domains and emerging technology applications
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {activeMentor.researchInterests.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50/70 px-4 py-2 text-xs font-medium text-sky-900 transition-colors hover:bg-sky-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                  Academic guidance and student research mentorship bridge foundational theory with practical
                  applications, empowering students to explore technical innovations and prepare for competitive careers.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Quick Info & Education) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Quick Info Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <Sparkles className="h-5 w-5 text-brand" />
                <h2 className="text-base font-bold text-slate-900">Quick Info</h2>
              </div>

              <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
                {activeMentor.experience && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      Experience
                    </span>
                    <span className="font-semibold text-slate-900 text-right">
                      {activeMentor.experience}
                    </span>
                  </div>
                )}

                {activeMentor.qualification && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                      Qualification
                    </span>
                    <span className="font-semibold text-slate-900 text-right">
                      {activeMentor.qualification}
                    </span>
                  </div>
                )}

                {activeMentor.location && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Location
                    </span>
                    <span className="font-semibold text-slate-900 text-right">
                      {activeMentor.location}
                    </span>
                  </div>
                )}

                {activeMentor.email && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-slate-500">
                      <Mail className="h-4 w-4 text-slate-400" />
                      Email
                    </span>
                    <a
                      href={`mailto:${activeMentor.email}`}
                      className="font-medium text-sky-700 hover:underline text-right break-all"
                    >
                      {activeMentor.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Embedded CTA Box */}
              <div className="mt-6 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/50 to-white p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
                  <Send className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  Let's build your future together
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Get personalized guidance from experienced mentors.
                </p>

                <Link
                  to="/partner"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-brand/90 hover:shadow"
                >
                  Request Mentorship
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Education Timeline */}
            {activeMentor.education && activeMentor.education.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <GraduationCap className="h-5 w-5 text-brand" />
                  <h2 className="text-base font-bold text-slate-900">Education</h2>
                </div>

                <div className="relative mt-5 ml-2.5 border-l-2 border-slate-200/90 pl-5 space-y-6">
                  {activeMentor.education.map((edu, idx) => {
                    const dotColor = educationDotColors[idx % educationDotColors.length];
                    return (
                      <div key={idx} className="relative">
                        <span
                          className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full ring-4 ${dotColor}`}
                        />
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {edu.degree}
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-400">{edu.year}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{edu.institution}</p>
                        {edu.note && (
                          <p className="mt-1.5 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
                            {edu.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
