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
} from "lucide-react";
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

const challenges = [
  {
    icon: HelpCircle,
    title: "Confusion in Choosing Career Paths",
    description: "Too many options, not enough clarity.",
  },
  {
    icon: User,
    title: "Lack of Proper Career Guidance",
    description: "Limited access to expert advice and real-world insights.",
  },
  {
    icon: Building2,
    title: "Limited Awareness of Industry Opportunities",
    description: "Not knowing about emerging fields and future trends.",
  },
  {
    icon: Settings,
    title: "Difficulty Finding the Right Skills & Certifications",
    description: "Unclear about what to learn, where to learn and how to get certified.",
  },
] as const;

const solutions = [
  {
    icon: Compass,
    title: "Career Guidance",
    description:
      "Personalized career path suggestions based on your interests, skills and market trends.",
    color: "bg-orange-50 text-[#E07A2B] border-orange-100",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description:
      "Learn from industry professionals with real-world experience and practical advice.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: GraduationCap,
    title: "Skill Development Programs",
    description:
      "Build in-demand skills through structured learning and hands-on projects.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: Award,
    title: "Certification & Learning Programs",
    description:
      "Gain recognized certifications to boost your profile and career opportunities.",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
] as const;

export function AboutContent() {
  const c = useSiteContent();
  const mentors = c.mentors && c.mentors.length > 0 ? c.mentors : defaultContent.mentors;

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
                    WHO WE ARE
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight">
                  What is <span className="text-[#E07A2B]">EduArc?</span>
                </h2>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto sm:mx-0">
                  EduArc is a modern career guidance platform that connects students with expert
                  mentors, learning programs and industry insights. We help you explore career
                  options, build essential skills and take confident steps towards your dream
                  career.
                </p>

                {/* 3 Value Pillars */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-around sm:justify-start sm:gap-10">
                  {/* Item 1 */}
                  <div className="text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-[#E07A2B] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      Student
                      <br />
                      Focused
                    </p>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-200" />

                  {/* Item 2 */}
                  <div className="text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-[#E07A2B] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      Guidance
                      <br />
                      Driven
                    </p>
                  </div>

                  <div className="h-8 w-[1px] bg-slate-200" />

                  {/* Item 3 */}
                  <div className="text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-[#E07A2B] flex items-center justify-center mb-2 mx-auto sm:mx-0">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      Future
                      <br />
                      Ready
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
                    THE PROBLEM WE SOLVE
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight leading-tight">
                  Common Challenges <br className="hidden sm:inline" />
                  Students Face
                </h2>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto sm:mx-0">
                  We understand the struggles. Here are some of the key problems students face
                  today:
                </p>
              </Reveal>
            </div>

            {/* Right 2x2 Challenge Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {challenges.map((item, idx) => {
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
                  OUR SOLUTIONS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight">
                How We Help You
              </h2>
            </div>
          </Reveal>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((item, idx) => {
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
                  Building a Brighter Future
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
                      To help every student make informed career decisions with the right guidance,
                      resources and support.
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
                      To build a future where every student has access to the right guidance,
                      mentorship and opportunities to achieve their dreams.
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
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-10 text-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                  <span className="w-6 h-[2.5px] bg-[#E07A2B] inline-block rounded-full" />
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    MEET OUR MENTORS
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D2436] tracking-tight">
                  Learn From The Best
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg">
                  Our mentors are industry professionals, educators and experts who are passionate
                  about helping you grow.
                </p>
              </div>

              <Link
                to="/mentors"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E07A2B] hover:text-[#C5651F] transition-colors shrink-0 group"
              >
                <span>View All Mentors</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          {/* Mentors Grid */}
          <div
            className={cn(
              "grid gap-6",
              mentors.length === 1
                ? "grid-cols-1 max-w-lg mx-auto"
                : mentors.length === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                : mentors.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {mentors.map((m, idx) => {
              const isGayathri =
                m.id === "dr-gayathri-g-n" || m.name.toLowerCase().includes("gayathri");
              const expertise = getMentorExpertise(m);

              return (
                <Reveal key={m.id || m.name} delay={idx * 60}>
                  <Link
                    to="/mentors"
                    className="block p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-[#E07A2B]/40 hover:shadow-card transition-all group"
                  >
                    <div className="flex items-center gap-3.5 mb-3">
                      <MentorAvatar imageUrl={m.imageUrl} name={m.name} isGayathri={isGayathri} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-sm font-bold text-[#0D2436] truncate group-hover:text-[#E07A2B] transition-colors">
                            {m.name}
                          </h3>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E07A2B] transition-transform group-hover:translate-x-0.5 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {m.designation || m.role}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100">
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        <span className="font-semibold text-slate-700">Expertise:</span>{" "}
                        {expertise}
                      </p>
                    </div>

                    {m.cardStats && m.cardStats.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {m.cardStats.slice(0, 3).map((st) => (
                          <span
                            key={st.label}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/70"
                          >
                            <span className="font-bold text-[#0D2436]">{st.value}</span> {st.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

