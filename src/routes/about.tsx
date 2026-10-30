import { createFileRoute, Link } from "@tanstack/react-router";
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
  Send,
  User,
  Settings,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";

import futureStudentImg from "@/assets/future-student.jpg";
import aboutDeskImg from "@/assets/about-desk.jpg";
import aboutVisionImg from "@/assets/about-vision.jpg";
import mentorGayathriImg from "@/assets/mentor-gayathri.jpg";
import rohitImg from "@/assets/testimonials/rohit.jpg";
import snehaImg from "@/assets/testimonials/sneha.jpg";
import arjunImg from "@/assets/about-arjun.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EduArc — Empowering Students to Discover Their Future" },
      {
        name: "description",
        content:
          "EduArc is a modern career guidance platform designed to help students make informed decisions about their future with expert mentorship and structured roadmaps.",
      },
      { property: "og:title", content: "About EduArc — Empowering Students to Discover Their Future" },
      {
        property: "og:description",
        content:
          "Connecting students with expert mentors, learning programs, and authentic higher-education insights.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/about" }],
  }),
  component: AboutPage,
});

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

const mentors = [
  {
    name: "Dr. Gayathri G N",
    role: "Associate Professor, SIET",
    expertise: "Engineering, Research, Higher Studies",
    avatar: mentorGayathriImg,
    href: "/mentor" as const,
  },
  {
    name: "Rohit Sharma",
    role: "Product Designer, Google",
    expertise: "UI/UX, Design Thinking, Product Design",
    avatar: rohitImg,
    href: "/mentors" as const,
  },
  {
    name: "Arjun Mehta",
    role: "Tech Lead, TCS",
    expertise: "Software Development, System Design, Tech Careers",
    avatar: arjunImg,
    href: "/mentors" as const,
  },
  {
    name: "Sneha Patil",
    role: "HR Manager, Infosys",
    expertise: "Career Planning, Interview Preparation",
    avatar: snehaImg,
    href: "/mentors" as const,
  },
] as const;

function AboutPage() {
  const c = useSiteContent();

  return (
    <div className="min-h-screen bg-white">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          Empowering Students to Discover Their Future
         ========================================================================= */}
      <section className="relative overflow-hidden bg-white pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 xl:col-span-6 text-center sm:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 mb-4 justify-center sm:justify-start">
                  <span className="w-6 h-[2.5px] bg-[#E07A2B] inline-block rounded-full" />
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    About EduArc
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-extrabold text-[#0D2436] tracking-tight leading-[1.12]">
                  Empowering Students <br className="hidden sm:inline" />
                  to Discover <span className="text-[#E07A2B]">Their Future.</span>
                </h1>

                <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto sm:mx-0 leading-relaxed">
                  {c.about?.lead ||
                    "EduArc is a career guidance platform designed to help students make informed decisions about their future. We provide the right guidance, resources and support to turn your dreams into achievable goals."}
                </p>
              </Reveal>
            </div>

            {/* Right Arched Illustration with Handwriting Callout */}
            <div className="lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end">
              <Reveal delay={150}>
                <div className="relative">
                  {/* Decorative curved arc border around the dome */}
                  <svg
                    className="absolute -left-10 -bottom-6 w-72 h-72 sm:w-80 sm:h-80 pointer-events-none -z-10 text-[#E07A2B]/40"
                    viewBox="0 0 200 200"
                    fill="none"
                  >
                    <path
                      d="M 20 180 A 130 130 0 0 1 170 30"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>

                  {/* Arched Photo Frame (Dome top, flat bottom) */}
                  <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[340px] sm:h-[390px] md:h-[430px] rounded-t-[160px] sm:rounded-t-[180px] md:rounded-t-[200px] overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                    <img
                      src={futureStudentImg}
                      alt="Student looking forward to a brighter career future"
                      className="w-full h-full object-cover object-center block select-none pointer-events-none"
                    />
                  </div>

                  {/* Handwritten Callout Tag */}
                  <div className="absolute -top-4 -right-3 sm:-right-8 select-none pointer-events-none">
                    <div className="font-serif italic text-right leading-none space-y-1 drop-shadow-xs">
                      <span className="block text-xl sm:text-2xl text-slate-500 font-light tracking-wide">
                        Better
                      </span>
                      <span className="block text-xl sm:text-2xl text-slate-500 font-light tracking-wide">
                        Choices
                      </span>
                      <span className="block text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight pt-0.5">
                        Brighter
                      </span>
                      <span className="relative inline-block text-2xl sm:text-3xl font-bold text-[#E07A2B] tracking-tight">
                        Future
                        {/* Decorative brush underline */}
                        <svg
                          className="absolute -bottom-1.5 left-0 w-full overflow-visible"
                          height="6"
                          viewBox="0 0 80 6"
                          fill="none"
                        >
                          <path
                            d="M 2 3 Q 40 6 78 2"
                            stroke="#E07A2B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

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

            {/* Right Desk Image with Quote Overlay */}
            <div className="lg:col-span-6">
              <Reveal delay={150}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 group">
                  <img
                    src={aboutDeskImg}
                    alt="Study desk with books, laptop, and plant"
                    className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover block"
                  />
                  {/* Subtle Top-Right Quote Badge */}
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-right bg-white/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl shadow-xs border border-white/60">
                    <p className="font-serif italic text-xs sm:text-sm text-slate-700 leading-tight">
                      Right Guidance
                      <br />
                      Leads to
                      <br />
                      <span className="font-semibold text-slate-900">Greater Opportunities</span>
                    </p>
                    <div className="w-6 h-[2px] bg-[#E07A2B] ml-auto mt-1.5 rounded-full" />
                  </div>
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

          {/* 4 Mentors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((m, idx) => (
              <Reveal key={m.name} delay={idx * 60}>
                <Link
                  to={m.href}
                  className="block p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-[#E07A2B]/40 hover:shadow-card transition-all group"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-[#0D2436] truncate group-hover:text-[#E07A2B] transition-colors">
                          {m.name}
                        </h3>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E07A2B] transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{m.role}</p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100">
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-slate-700">Expertise:</span>{" "}
                      {m.expertise}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: BOTTOM CTA BANNER
          Your Future Starts With The Right Guidance.
         ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 border-t border-slate-200/70 py-6 sm:py-8">
        <div className="container-apple">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
              {/* Paper Airplane & Headline */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-[#E07A2B]">
                  <Send className="w-6 h-6 rotate-[-20deg]" />
                </div>

                <div className="hidden sm:block h-9 w-[1px] bg-slate-300" />

                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0D2436] tracking-tight leading-snug">
                    Your Future Starts With <br className="hidden sm:inline" />
                    The <span className="text-[#E07A2B]">Right Guidance.</span>
                  </h3>
                </div>
              </div>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
                Join EduArc today and take the first step towards a successful career.
              </p>

              {/* Action Button */}
              <Button
                asChild
                className="rounded-full bg-[#0B1B2B] hover:bg-[#152D47] text-white text-xs font-semibold px-6 py-2.5 h-10 shadow-sm shrink-0 gap-2"
              >
                <Link to="/partner">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
