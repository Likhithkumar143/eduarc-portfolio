import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  Compass,
  MapPin,
  Mail,
  Send,
  Quote,
  Check,
  Copy,
  Sparkles,
  Award,
  CheckCircle2,
  BookOpen,
  Route as RouteIcon,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  GitFork,
  Target,
  Bookmark,
  X,
  ExternalLink,
  ShieldCheck,
  Eye,
  type LucideIcon,
} from "lucide-react";
import mentorImg from "@/assets/mentor-gayathri.jpg";
import { AmbientBlobs } from "@/components/site/Section";
import { defaultContent, initials, type MentorProfile } from "@/content/eduarc";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/mentors")({
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery({ ...siteContentQuery, staleTime: 0 });
  },
  head: () => ({
    meta: [
      { title: "Academic Mentors & Student Guidance | EduArc" },
      {
        name: "description",
        content:
          "Connect with experienced academic mentors at EduArc. Get clear guidance on stream selection after 10th, course choices after 12th, and career roadmap planning.",
      },
      { property: "og:title", content: "Academic Mentors & Student Guidance | EduArc" },
      {
        property: "og:description",
        content:
          "Personalized student counselling, career stream selection, and academic roadmap guidance with experienced mentors.",
      },
    ],
  }),
  component: MentorProfilePage,
});

// Guide cards visual accent mappings
const guideIcons: LucideIcon[] = [
  Compass,
  GitFork,
  GraduationCap,
  RouteIcon,
  Lightbulb,
  HeartHandshake,
];

const guideColors = [
  { badge: "bg-blue-50 text-blue-700 border-blue-200/80", iconBg: "bg-blue-600 text-white" },
  { badge: "bg-purple-50 text-purple-700 border-purple-200/80", iconBg: "bg-purple-600 text-white" },
  { badge: "bg-teal-50 text-teal-700 border-teal-200/80", iconBg: "bg-teal-600 text-white" },
  { badge: "bg-amber-50 text-amber-700 border-amber-200/80", iconBg: "bg-amber-600 text-white" },
  { badge: "bg-rose-50 text-rose-700 border-rose-200/80", iconBg: "bg-rose-600 text-white" },
  { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80", iconBg: "bg-emerald-600 text-white" },
];

const whyConnectIcons: LucideIcon[] = [
  Award,
  GraduationCap,
  BookOpen,
  Target,
  Sparkles,
];

const benefitIcons: LucideIcon[] = [
  Compass,
  GraduationCap,
  HeartHandshake,
  Sparkles,
];

function MentorProfilePage() {
  const content = useSiteContent();
  const mentors =
    content.mentors && content.mentors.length > 0 ? content.mentors : defaultContent.mentors;

  // Selected mentor for full detail modal
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = !prev[id];
      if (next) {
        toast.success("Mentor bookmarked to your list!");
      } else {
        toast.info("Bookmark removed");
      }
      return { ...prev, [id]: next };
    });
  };

  const copyEmail = (email?: string) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative isolate overflow-hidden bg-slate-50/70 pb-24 pt-8 md:pb-32">
      <AmbientBlobs />

      <div className="container-wide">
        {/* Breadcrumb / Top Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground">Mentors & Advisors</span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified EduArc Mentors
            </span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1 text-xs font-semibold text-brand">
            <GraduationCap className="h-3.5 w-3.5" />
            Academic Mentorship Network
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Meet Our Expert Mentors
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">
            Personalized guidance from experienced academicians and research supervisors. Click on any
            mentor card to view their complete academic background, guidance roadmap, and connect directly.
          </p>
        </div>

        {/* ============================================================ */}
        {/* MENTOR PROFILE CARDS GRID (Matches user screenshot)          */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
          {mentors.map((mentor) => {
            const isGayathri =
              mentor.id === "dr-gayathri-g-n" || mentor.name.toLowerCase().includes("gayathri");
            const rawUrl = (mentor.imageUrl || "").trim().replace(/^["']|["']$/g, "");
            const photoUrl = rawUrl ? rawUrl : isGayathri ? mentorImg : null;
            const isBookmarked = Boolean(bookmarkedIds[mentor.id]);

            // Stats defaults
            const stats =
              mentor.cardStats && mentor.cardStats.length >= 3
                ? mentor.cardStats.slice(0, 3)
                : [
                    { label: "Experience", value: "7+ Yrs" },
                    { label: "Research", value: "6 Pubs" },
                    { label: "Education", value: "Ph.D." },
                  ];

            const shortDescription =
              mentor.shortBio?.trim() ||
              (mentor.about
                ? mentor.about.split("\n")[0]?.slice(0, 115) + "..."
                : "Helping students move from confusion to clarity with personalized roadmaps and career guidance.");

            return (
              <div
                key={mentor.id}
                onClick={() => setSelectedMentor(mentor)}
                className="group relative w-full max-w-[360px] aspect-[1/1.5] rounded-[36px] overflow-hidden border-[5px] border-white bg-slate-900 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] cursor-pointer select-none"
              >
                {/* Background Image / Placeholder */}
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={mentor.name}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      if (isGayathri && e.currentTarget.src !== mentorImg) {
                        e.currentTarget.src = mentorImg;
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-brand flex items-center justify-center">
                    <span className="text-6xl font-black text-white/20 tracking-wider">
                      {initials(mentor.name)}
                    </span>
                  </div>
                )}

                {/* Dark Vignette / Gradient Scrim (Exactly like screenshot) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 via-45% to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/90">
                    <Sparkles className="h-3 w-3 text-sky-400" />
                    {mentor.location || "EduArc Mentor"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Eye className="h-3 w-3" /> Details
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                  {/* Name + Blue Verified Checkmark Badge */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                      {mentor.name}
                    </h3>
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-sm ring-2 ring-white/20"
                      title="Verified EduArc Mentor"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  </div>

                  {/* Short Bio Description */}
                  <p className="mt-2 text-xs sm:text-[13px] text-white/85 leading-relaxed line-clamp-2">
                    {shortDescription}
                  </p>

                  {/* 3 Stats Row with Dividers */}
                  <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-3 items-center text-center">
                    {stats.map((s, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "px-1",
                          idx > 0 && "border-l border-white/20",
                        )}
                      >
                        <div className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center justify-center gap-1">
                          {s.value}
                          {idx === 0 && <span className="text-amber-400 text-xs">★</span>}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase tracking-wider mt-0.5">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buttons Action Row (Exactly like screenshot) */}
                  <div className="mt-5 flex items-center gap-2.5">
                    {/* Primary Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMentor(mentor);
                      }}
                      className="flex-1 rounded-full bg-white py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-slate-900" />
                      Get In Touch
                    </button>

                    {/* Bookmark / Save Icon Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(mentor.id, e)}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Mentor"}
                      className={cn(
                        "h-11 w-11 shrink-0 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer",
                        isBookmarked
                          ? "bg-brand text-white border-brand shadow-md"
                          : "bg-white/15 hover:bg-white/25 border-white/20 text-white",
                      )}
                    >
                      <Bookmark
                        className={cn(
                          "h-4 w-4",
                          isBookmarked && "fill-current text-white",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Helper Banner */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Click on any mentor profile card above to explore their full roadmap, guidance sessions, and student testimonials.
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULL DETAILS MODAL DIALOG (Opens when profile card is clicked) */}
      {/* ============================================================ */}
      <Dialog
        open={selectedMentor !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMentor(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 lg:p-10 border-slate-200/80 shadow-2xl">
          {selectedMentor && (
            <div className="space-y-8">
              {/* Modal Header: Hero Profile */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    {(() => {
                      const isGayathriModal =
                        selectedMentor.id === "dr-gayathri-g-n" ||
                        selectedMentor.name.toLowerCase().includes("gayathri");
                      const rawModalUrl = (selectedMentor.imageUrl || "")
                        .trim()
                        .replace(/^["']|["']$/g, "");
                      const modalPhotoUrl = rawModalUrl
                        ? rawModalUrl
                        : isGayathriModal
                          ? mentorImg
                          : null;

                      return modalPhotoUrl ? (
                        <img
                          src={modalPhotoUrl}
                          alt={selectedMentor.name}
                          className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover shadow-md ring-4 ring-slate-100"
                          onError={(e) => {
                            if (isGayathriModal && e.currentTarget.src !== mentorImg) {
                              e.currentTarget.src = mentorImg;
                            }
                          }}
                        />
                      ) : (
                        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-teal/20 text-brand flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-slate-100">
                          {initials(selectedMentor.name)}
                        </div>
                      );
                    })()}
                    <span
                      className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow ring-2 ring-white"
                      title="Verified Mentor"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-800">
                      <Sparkles className="h-3 w-3 text-sky-600" />
                      {selectedMentor.role || "Career Guidance & Student Counselling Mentor"}
                    </span>
                    <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {selectedMentor.name}
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-600">
                      {selectedMentor.designation}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      {selectedMentor.location && (
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" />
                          {selectedMentor.location}
                        </span>
                      )}
                      {selectedMentor.email && (
                        <button
                          type="button"
                          onClick={() => copyEmail(selectedMentor.email)}
                          className="flex items-center gap-1 font-medium text-sky-700 hover:text-sky-900 cursor-pointer"
                        >
                          <Mail className="h-3.5 w-3.5 text-sky-600" />
                          {selectedMentor.email}
                          {copied ? (
                            <Check className="h-3 w-3 text-emerald-600 ml-0.5" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-400 ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <Link
                    to="/partner"
                    onClick={() => setSelectedMentor(null)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand/90 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Request Guidance
                  </Link>
                </div>
              </div>

              {/* 1. About the Mentor */}
              {selectedMentor.about && (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
                  <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-base sm:text-lg">
                    <BookOpen className="h-5 w-5 text-brand" />
                    About the Mentor
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700">
                    {selectedMentor.about
                      .split("\n\n")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                  </div>
                </div>
              )}

              {/* 2. How I Can Guide You (6 Steps) */}
              {selectedMentor.howICanGuide && selectedMentor.howICanGuide.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-base sm:text-lg">
                    <Compass className="h-5 w-5 text-brand" />
                    How I Can Guide You
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedMentor.howICanGuide.map((step, idx) => {
                      const IconComp = guideIcons[idx % guideIcons.length] || Compass;
                      const theme = guideColors[idx % guideColors.length]!;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="mb-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-lg shadow-xs",
                                  theme.iconBg,
                                )}
                              >
                                <IconComp className="h-4 w-4" />
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Why Connect & Who Can Benefit Grid */}
              <div className="grid gap-6 lg:grid-cols-12">
                {/* Left: Why Connect With This Mentor */}
                {selectedMentor.whyConnect && selectedMentor.whyConnect.length > 0 && (
                  <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-sm sm:text-base">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Why Connect With This Mentor?
                    </div>
                    <div className="space-y-3">
                      {selectedMentor.whyConnect.map((reason, idx) => {
                        const IconComp = whyConnectIcons[idx % whyConnectIcons.length] || Award;
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200/80 text-brand">
                              <IconComp className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                                {reason.title}
                              </h5>
                              <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                                {reason.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Right: Who Can Benefit? */}
                {selectedMentor.whoCanBenefit && selectedMentor.whoCanBenefit.length > 0 && (
                  <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                    <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-sm sm:text-base">
                      <Target className="h-4 w-4 text-purple-600" />
                      Who Can Benefit?
                    </div>
                    <div className="space-y-3">
                      {selectedMentor.whoCanBenefit.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-purple-100/80 bg-gradient-to-br from-purple-50/40 via-white to-slate-50/40 p-3.5"
                        >
                          <h5 className="text-xs font-bold text-slate-900">{item.target}</h5>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                            {item.benefit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. EDUARC Mentorship Impact */}
              {selectedMentor.impactMetrics && selectedMentor.impactMetrics.length > 0 && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                      <TrendingUp className="h-4 w-4 text-teal-600" />
                      EDUARC Mentorship Impact
                    </div>
                    {selectedMentor.impactNotice && (
                      <span className="text-[11px] text-slate-500 italic">
                        {selectedMentor.impactNotice}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {selectedMentor.impactMetrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex flex-col justify-between"
                      >
                        <span className="text-[11px] text-slate-500 font-medium">{m.label}</span>
                        <span className="mt-2 text-xs sm:text-sm font-bold text-slate-900">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. A Message to Students & Parents */}
              {selectedMentor.message && (
                <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-blue-50/30 to-white p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-800 mb-3">
                    <Quote className="h-4 w-4 text-sky-600" />
                    A Message to Students & Parents
                  </div>
                  <div className="border-l-2 border-sky-400 pl-4 space-y-2 text-xs sm:text-sm italic text-slate-700 leading-relaxed">
                    {selectedMentor.message
                      .split("\n\n")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>“{para}”</p>
                      ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-bold text-slate-900">— {selectedMentor.name}</span>
                    <span>{selectedMentor.designation}</span>
                  </div>
                </div>
              )}

              {/* 6. Connect CTA Footer */}
              <div className="rounded-2xl bg-gradient-to-br from-brand via-slate-900 to-brand text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Connect With the Mentor</h4>
                  <p className="mt-1 text-xs text-white/80 max-w-lg">
                    {selectedMentor.tagline ||
                      "Learn with direction. Grow with confidence. Build your future with EDUARC."}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/80">
                    {selectedMentor.email && <span>Email: {selectedMentor.email}</span>}
                    {selectedMentor.location && <span>Location: {selectedMentor.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <Link
                    to="/partner"
                    onClick={() => setSelectedMentor(null)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-brand shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    Request Guidance →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
