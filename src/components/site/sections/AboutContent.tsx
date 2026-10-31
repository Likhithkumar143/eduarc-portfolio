import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  Users,
  Rocket,
  Lightbulb,
  HelpCircle,
  Building2,
  GraduationCap,
  Award,
  Target,
  Eye,
  ArrowRight,
  User,
  Settings,
  Sparkles,
  MapPin,
  Check,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { useSiteContent } from "@/lib/site-content";
import { defaultContent, initials, type MentorProfile } from "@/content/eduarc";
import { cn } from "@/lib/utils";

import aboutDeskImg from "@/assets/about-desk.jpg";
import aboutVisionImg from "@/assets/about-vision.jpg";
import mentorGayathriImg from "@/assets/mentor-gayathri.jpg";

function isUsableImage(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return false;
  if (trimmed.startsWith("data:") && (trimmed.includes("AAAAAAAA") || trimmed.length < 50)) {
    return false;
  }
  return true;
}

function MentorAvatar({
  imageUrl,
  name,
  isGayathri,
}: {
  imageUrl?: string;
  name: string;
  isGayathri: boolean;
}) {
  const usableCustomUrl = isUsableImage(imageUrl)
    ? imageUrl!.trim().replace(/^["']|["']$/g, "")
    : null;
  const initialSrc = usableCustomUrl || (isGayathri ? mentorGayathriImg : null);
  const [src, setSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const updatedUsable = isUsableImage(imageUrl)
      ? imageUrl!.trim().replace(/^["']|["']$/g, "")
      : null;
    setSrc(updatedUsable || (isGayathri ? mentorGayathriImg : null));
    setHasError(false);
  }, [imageUrl, isGayathri]);

  if (!src || hasError) {
    if (isGayathri && src !== mentorGayathriImg) {
      return (
        <img
          src={mentorGayathriImg}
          alt={name}
          className="w-12 h-12 rounded-full object-cover object-top border border-slate-200 shrink-0 shadow-sm"
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-[#0D2436] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 shadow-sm">
        {initials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-12 h-12 rounded-full object-cover object-top border border-slate-200 shrink-0 shadow-sm"
      onError={() => {
        if (isGayathri && src !== mentorGayathriImg) {
          setSrc(mentorGayathriImg);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

function BigMentorImage({
  imageUrl,
  name,
  isGayathri,
  className,
}: {
  imageUrl?: string;
  name: string;
  isGayathri: boolean;
  className?: string;
}) {
  const usableCustomUrl = isUsableImage(imageUrl)
    ? imageUrl!.trim().replace(/^["']|["']$/g, "")
    : null;
  const initialSrc = usableCustomUrl || (isGayathri ? mentorGayathriImg : null);
  const [src, setSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const updatedUsable = isUsableImage(imageUrl)
      ? imageUrl!.trim().replace(/^["']|["']$/g, "")
      : null;
    setSrc(updatedUsable || (isGayathri ? mentorGayathriImg : null));
    setHasError(false);
  }, [imageUrl, isGayathri]);

  if (!src || hasError) {
    if (isGayathri && src !== mentorGayathriImg) {
      return (
        <img
          src={mentorGayathriImg}
          alt={name}
          className={cn("w-full h-full object-cover object-top", className)}
        />
      );
    }
    return (
      <div className={cn("w-full h-full bg-brand-navy flex items-center justify-center", className)}>
        <span className="text-5xl font-bold text-white/25 tracking-wider">{initials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={cn("w-full h-full object-cover object-top", className)}
      onError={() => {
        if (isGayathri && src !== mentorGayathriImg) {
          setSrc(mentorGayathriImg);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

function getMentorExpertise(m: MentorProfile): string {
  if (m.id === "dr-gayathri-g-n" || m.name.toLowerCase().includes("gayathri")) {
    return "Engineering, Research, Higher Education & Career Roadmaps";
  }
  if (m.howICanGuide && m.howICanGuide.length > 0) {
    return m.howICanGuide
      .slice(0, 3)
      .map((g) => g.title)
      .join(", ");
  }
  return m.shortBio || m.designation || m.role;
}

export function AboutContent() {
  const c = useSiteContent();
  const mentors = c.mentors && c.mentors.length > 0 ? c.mentors : defaultContent.mentors;

  const dynamicChallenges = [
    {
      icon: HelpCircle,
      title: c.about.challenge1Title || "Confusion in Choosing Career Paths",
      description: c.about.challenge1Desc || "Too many options, not enough clarity.",
    },
    {
      icon: User,
      title: c.about.challenge2Title || "Lack of Proper Career Guidance",
      description: c.about.challenge2Desc || "Limited access to expert advice and real-world insights.",
    },
    {
      icon: Building2,
      title: c.about.challenge3Title || "Limited Awareness of Industry Opportunities",
      description: c.about.challenge3Desc || "Not knowing about emerging fields and future trends.",
    },
    {
      icon: Settings,
      title: c.about.challenge4Title || "Difficulty Finding the Right Skills & Certifications",
      description: c.about.challenge4Desc || "Unclear about what to learn, where to learn and how to get certified.",
    },
  ];

  const dynamicSolutions = [
    {
      icon: Compass,
      title: c.about.solution1Title || "Career Guidance",
      description:
        c.about.solution1Desc ||
        "Personalized career path suggestions based on your interests, skills and market trends.",
      color: "bg-orange-50 text-[#E07A2B] border-orange-100",
    },
    {
      icon: Users,
      title: c.about.solution2Title || "Expert Mentorship",
      description:
        c.about.solution2Desc ||
        "Learn from industry professionals with real-world experience and practical advice.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: GraduationCap,
      title: c.about.solution3Title || "Skill Development Programs",
      description:
        c.about.solution3Desc ||
        "Build in-demand skills through structured learning and hands-on projects.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: Award,
      title: c.about.solution4Title || "Certification & Learning Programs",
      description:
        c.about.solution4Desc ||
        "Gain recognized certifications to boost your profile and career opportunities.",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <>
      {/* =========================================================================
          SECTION 2: WHO WE ARE
          What is EduArc?
         ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 text-center sm:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <span className="w-6 h-[2.5px] bg-[#E07A2B] inline-block rounded-full" />
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    {c.about.whoWeAreEyebrow || "WHO WE ARE"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight">
                  {c.about.whoWeAreTitle || "What is EduArc?"}
                </h2>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto sm:mx-0">
                  {c.about.whoWeAreLead ||
                    "EduArc is a modern career guidance platform that connects students with expert mentors, learning programs and industry insights. We help you explore career options, build essential skills and take confident steps towards your dream career."}
                </p>

                {/* 3 Value Pillars */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-around sm:justify-start sm:gap-10">
                  {/* Item 1 */}
                  <div className="text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-[#E07A2B] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {c.about.pillar1Title || "Student Focused"}
                    </p>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-200" />

                  {/* Item 2 */}
                  <div className="text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-[#E07A2B] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {c.about.pillar2Title || "Guidance Driven"}
                    </p>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-200" />

                  {/* Item 3 */}
                  <div className="text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-[#E07A2B] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {c.about.pillar3Title || "Future Ready"}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Desk Image */}
            <div className="lg:col-span-6">
              <Reveal delay={150}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 group">
                  <img
                    src={aboutDeskImg}
                    alt="Study desk with books and laptop"
                    className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover block"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE PROBLEM WE SOLVE
          Common Challenges Students Face
         ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-y border-slate-200/60">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 text-center sm:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <span className="w-6 h-[2.5px] bg-[#E07A2B] inline-block rounded-full" />
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    {c.about.problemsEyebrow || "THE PROBLEM WE SOLVE"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight leading-tight">
                  {c.about.problemsTitle || "Common Challenges Students Face"}
                </h2>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto sm:mx-0">
                  {c.about.problemsLead ||
                    "We understand the struggles. Here are some of the key problems students face today:"}
                </p>
              </Reveal>
            </div>

            {/* Right 2x2 Challenge Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {dynamicChallenges.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={item.title} delay={idx * 60}>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 hover:bg-white border border-transparent hover:border-slate-200/80 transition-all shadow-2xs">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#0D2436] leading-snug">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OUR SOLUTIONS
          How We Help You
         ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-apple">
          <Reveal>
            <div className="text-center sm:text-left mb-12">
              <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                <span className="w-6 h-[2.5px] bg-[#E07A2B] inline-block rounded-full" />
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  {c.about.solutionsEyebrow || "OUR SOLUTIONS"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight">
                {c.about.solutionsTitle || "How We Help You"}
              </h2>
            </div>
          </Reveal>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dynamicSolutions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={idx * 75}>
                  <div className="h-full p-6 sm:p-7 rounded-2xl border border-slate-200/80 bg-white hover:border-[#E07A2B]/40 hover:shadow-card transition-all flex flex-col justify-between">
                    <div>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 border ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0D2436] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: OUR MISSION & VISION
          Building a Brighter Future
         ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-y border-slate-200/60">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Mission & Vision Blocks */}
            <div className="lg:col-span-7 text-center sm:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <span className="w-6 h-[2.5px] bg-[#E07A2B] inline-block rounded-full" />
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    OUR MISSION &amp; VISION
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight">
                  {c.about.missionTitle || "Building a Brighter Future"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 pt-6 border-t border-slate-200/80">
                  {/* Mission */}
                  <div>
                    <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#E07A2B] flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-[#0D2436]">Mission</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {c.about.missionText ||
                        "To help every student make informed career decisions with the right guidance, resources and support."}
                    </p>
                  </div>

                  {/* Vision */}
                  <div>
                    <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#E07A2B] flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-[#0D2436]">Vision</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {c.about.visionText ||
                        "To build a future where every student has access to the right guidance, mentorship and opportunities to achieve their dreams."}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Landscape Mountain Summit Image */}
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80">
                  <img
                    src={aboutVisionImg}
                    alt="Person with backpack standing atop mountain summit at sunrise"
                    className="w-full h-[220px] sm:h-[260px] md:h-[280px] object-cover block"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: MEET OUR MENTORS
          Learn From The Best
         ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-apple">
          {/* Header with View All Link */}
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-10 md:mb-12 text-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <span className="w-6 h-[2.5px] bg-brand-gold inline-block rounded-full" />
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase font-mono">
                    {c.about.mentorsEyebrow || "MEET OUR MENTORS"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                  {c.about.mentorsTitle || "Learn From The Best"}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
                  {c.about.mentorsLead ||
                    "Our mentors are experienced university educators and research scholars dedicated to giving students clarity, direction, and structured academic roadmaps."}
                </p>
              </div>

              <Link
                to="/mentors"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors shrink-0 group border border-hairline px-4 py-2 rounded-full hover:border-brand-gold/40 hover:bg-surface"
              >
                <span>Explore All Mentors</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-brand-gold" />
              </Link>
            </div>
          </Reveal>

          {/* Big Mentor Profile Card(s) with Quick Info */}
          {mentors.length === 1 ? (
            /* Single Featured Mentor: Big Screen-Fit Showcase Card */
            <div className="max-w-5xl mx-auto">
              {mentors.map((m) => {
                const isGayathri =
                  m.id === "dr-gayathri-g-n" || m.name.toLowerCase().includes("gayathri");
                const stats =
                  m.cardStats && m.cardStats.length >= 3
                    ? m.cardStats.slice(0, 4)
                    : [
                        { label: "Experience", value: "7+ Yrs" },
                        { label: "Education", value: "Ph.D." },
                        { label: "Research", value: "6 Pubs" },
                        { label: "Guidance", value: "1-on-1" },
                      ];
                const guidanceChips =
                  m.howICanGuide && m.howICanGuide.length > 0
                    ? m.howICanGuide.slice(0, 4).map((g) => g.title)
                    : [
                        "Stream Selection (Class 10 & 12)",
                        "Engineering & Emerging Careers",
                        "Higher Education Roadmaps",
                        "Student & Parent Counselling",
                      ];
                const shortDescription =
                  m.shortBio?.trim() ||
                  (m.about
                    ? m.about.split("\n")[0]
                    : "Helping students move from confusion to clarity with personalized roadmaps and verified academic guidance.");

                return (
                  <Reveal key={m.id || m.name}>
                    <div className="rounded-2xl sm:rounded-3xl border border-hairline bg-surface/50 p-2 sm:p-2.5 shadow-card hover:border-brand-gold/40 transition-all">
                      <div className="grid lg:grid-cols-12 gap-5 lg:gap-7 items-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-border">
                        {/* Left Column: Sleek Mentor Portrait */}
                        <div className="lg:col-span-4 relative w-full h-[220px] sm:h-[250px] lg:h-[285px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lift bg-[#ebedf0]/40 group">
                          <BigMentorImage
                            imageUrl={m.imageUrl}
                            name={m.name}
                            isGayathri={isGayathri}
                            className="transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Top Left Floating Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-brand-navy shadow-card">
                              <Sparkles className="h-3 w-3 text-brand-gold" />
                              Verified Mentor
                            </span>
                          </div>

                          {/* Bottom Location Badge */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <span className="glass inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-brand-navy shadow-card">
                              <MapPin className="h-3 w-3 text-brand-gold shrink-0" />
                              <span className="truncate">{m.location || "Tumkur, Karnataka, India"}</span>
                            </span>
                          </div>
                        </div>

                        {/* Right Column: Compact & Quick Info Content */}
                        <div className="lg:col-span-8 flex flex-col justify-between h-full py-1">
                          <div>
                            {/* Top Row: Name, Badge & Category */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                                  {m.name}
                                </h3>
                                <span
                                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow-xs font-bold shrink-0"
                                  title="Verified EDUARC Academic Mentor"
                                >
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </span>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold font-mono bg-brand-gold-soft px-2.5 py-0.5 rounded-full border border-brand-gold-border/60">
                                Academic Counsellor
                              </span>
                            </div>

                            <p className="mt-1 text-xs sm:text-sm font-semibold text-brand-gold">
                              {m.designation || m.role}
                            </p>

                            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {shortDescription}
                            </p>
                          </div>

                          {/* Quick Info Credentials Grid */}
                          <div className="mt-3 pt-2.5 border-t border-hairline">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {stats.map((s, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="rounded-lg border border-hairline bg-surface/70 px-2 py-1.5 text-center transition-all hover:bg-white hover:border-brand-gold/40"
                                >
                                  <div className="text-base sm:text-lg font-bold text-brand-navy tracking-tight font-display">
                                    {s.value}
                                  </div>
                                  <div className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                    {s.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Guidance Chips */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500 mr-1 hidden sm:inline">
                              Focus:
                            </span>
                            {guidanceChips.slice(0, 3).map((chip, cIdx) => (
                              <span
                                key={cIdx}
                                className="inline-flex items-center gap-1 rounded-md border border-brand-gold-border/60 bg-brand-gold-soft/40 px-2 py-0.5 text-[11px] font-medium text-brand-navy"
                              >
                                <CheckCircle2 className="h-3 w-3 text-brand-gold shrink-0" />
                                <span>{chip}</span>
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-3.5 pt-3 border-t border-hairline flex flex-wrap items-center gap-2.5">
                            <Button
                              asChild
                              variant="pill-gold"
                              size="sm"
                              className="cursor-pointer shadow-xs"
                            >
                              <Link to="/mentors" className="gap-1.5">
                                <span>View Full Profile &amp; Roadmap</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="pill-outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Link to="/partner">Request Guidance Session</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            /* Multi-Mentor Grid with Big Profile Cards & Quick Info */
            <div
              className={cn(
                "grid gap-8 max-w-6xl mx-auto",
                mentors.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {mentors.map((m, idx) => {
                const isGayathri =
                  m.id === "dr-gayathri-g-n" || m.name.toLowerCase().includes("gayathri");
                const stats =
                  m.cardStats && m.cardStats.length >= 3
                    ? m.cardStats.slice(0, 3)
                    : [
                        { label: "Experience", value: "7+ Yrs" },
                        { label: "Education", value: "Ph.D." },
                        { label: "Research", value: "6 Pubs" },
                      ];
                const guidanceChips =
                  m.howICanGuide && m.howICanGuide.length > 0
                    ? m.howICanGuide.slice(0, 3).map((g) => g.title)
                    : [
                        "Stream Selection",
                        "Higher Education",
                        "Career Roadmaps",
                      ];
                const shortDescription =
                  m.shortBio?.trim() ||
                  (m.about
                    ? m.about.split("\n")[0]
                    : "Helping students move from confusion to clarity with personalized roadmaps.");

                return (
                  <Reveal key={m.id || m.name} delay={idx * 60}>
                    <div className="flex flex-col h-full rounded-3xl border border-hairline bg-white shadow-card overflow-hidden hover:border-brand-gold/40 hover:shadow-lift transition-all">
                      {/* Big Mentor Image Banner */}
                      <div className="relative w-full aspect-[16/10] bg-[#ebedf0]/40 overflow-hidden group">
                        <BigMentorImage
                          imageUrl={m.imageUrl}
                          name={m.name}
                          isGayathri={isGayathri}
                          className="transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-brand-navy shadow-card">
                            <Sparkles className="h-3 w-3 text-brand-gold" />
                            Verified
                          </span>
                        </div>
                        {m.location && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <span className="glass inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium text-brand-navy shadow-card">
                              <MapPin className="h-3 w-3 text-brand-gold shrink-0" />
                              <span className="truncate">{m.location}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-brand-navy tracking-tight">
                              {m.name}
                            </h3>
                            <span
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow-xs font-bold shrink-0"
                              title="Verified Mentor"
                            >
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-semibold text-brand-gold">
                            {m.designation || m.role}
                          </p>

                          <p className="mt-3 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {shortDescription}
                          </p>

                          {/* Quick Info Stats */}
                          <div className="mt-4 pt-3.5 border-t border-hairline grid grid-cols-3 gap-2">
                            {stats.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="rounded-lg border border-hairline bg-surface/70 p-2 text-center"
                              >
                                <div className="text-sm font-bold text-brand-navy font-display">
                                  {s.value}
                                </div>
                                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                                  {s.label}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Guidance Chips */}
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {guidanceChips.map((chip, cIdx) => (
                              <span
                                key={cIdx}
                                className="inline-flex items-center gap-1 rounded-md border border-brand-gold-border/60 bg-brand-gold-soft/40 px-2 py-0.5 text-[11px] font-medium text-brand-navy"
                              >
                                <CheckCircle2 className="h-3 w-3 text-brand-gold shrink-0" />
                                <span>{chip}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-6 pt-4 border-t border-hairline">
                          <Button
                            asChild
                            variant="pill-gold"
                            size="sm"
                            className="w-full justify-center"
                          >
                            <Link to="/mentors" className="gap-1.5">
                              <span>View Profile &amp; Roadmap</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

