import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Compass,
  Building2,
  ArrowRight,
  Calendar,
  Users,
  MessageSquare,
  Award,
  FileText,
  BarChart3,
  PieChart,
  Sparkles,
  Sliders,
  Layers,
  HeartHandshake,
  Check,
  CheckCircle2,
  FileCheck2,
  Presentation,
} from "lucide-react";
import featuresHeroImg from "@/assets/features-hero.jpg";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features for Schools & Colleges — EDUARC Institutional Guidance" },
      {
        name: "description",
        content:
          "Institutional career guidance features for High Schools, PU Colleges, and Degree Institutions. Structured seminars, student roadmaps, and mentor sessions.",
      },
      { property: "og:title", content: "EDUARC Institutional Guidance Features" },
      {
        property: "og:description",
        content:
          "Structured partnership features for schools, PU colleges, and higher education institutions.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/features" }],
  }),
  component: FeaturesPage,
});

const onboardingPhases = [
  {
    step: "01",
    phase: "Institutional Consultation",
    timeline: "Initial Alignment",
    description:
      "We meet with school principals and academic coordinators to review current student batch size, stream distributions, and specific guidance priorities.",
  },
  {
    step: "02",
    phase: "Curriculum & Workshop Scheduling",
    timeline: "Preparation",
    description:
      "We design a structured schedule for in-person workshops, student awareness sessions, and parent orientation timings integrated smoothly into the school calendar.",
  },
  {
    step: "03",
    phase: "Interactive Guidance Delivery",
    timeline: "Session Execution",
    description:
      "Our verified academic mentors conduct high-engagement sessions, answering student questions, unpacking degree realities, and identifying individual aptitudes.",
  },
  {
    step: "04",
    phase: "Personalized Roadmap Delivery",
    timeline: "Student Takeaway",
    description:
      "Every participating student receives a clear, actionable education roadmap with milestone checklists to guide their next academic choices.",
  },
] as const;

function FeaturesPage() {
  const c = useSiteContent();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Section - Sleek, Borderless Hero Banner with Features Hero Image */}
      <section className="relative overflow-hidden bg-[#EFF6FE] border-b border-slate-200/60 min-h-[340px] sm:min-h-[360px] lg:min-h-[380px] lg:h-[380px] xl:min-h-[400px] xl:h-[400px] flex items-end lg:items-center">
        {/* Desktop & Laptop Illustration: Aligned directly to bottom-right flush with bottom border */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 pointer-events-none select-none z-0 items-end justify-end">
          <img
            src={featuresHeroImg}
            alt="EDUARC Institutional Students Learning Together"
            className="h-[340px] xl:h-[360px] w-auto max-w-none object-contain object-right-bottom block select-none pointer-events-none"
          />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-8 sm:pt-12 sm:pb-10 lg:py-10 xl:py-12 max-w-xl lg:max-w-lg xl:max-w-xl text-center sm:text-left">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-3 block">
                INSTITUTIONAL FEATURES
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
                Structured features for{" "}
                <span className="text-[#0F172A]">
                  schools and colleges.
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                {c.featuresPage?.lead ||
                  "Designed to guide, support and empower students — and give institutions full visibility."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                <Button
                  asChild
                  className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 h-10 shadow-sm gap-1.5"
                >
                  <Link to="/partner">
                    <span>Request Institutional Proposal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-4 py-2.5 h-10 shadow-2xs"
                >
                  <Link to="/contact">Speak with Partnerships Team</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Mobile & Tablet Illustration: rendered in-flow flush at the bottom edge */}
          <div className="lg:hidden relative w-full flex items-end justify-center pt-2 overflow-hidden">
            <img
              src={featuresHeroImg}
              alt="EDUARC Institutional Students Learning Together"
              className="h-[180px] sm:h-[220px] md:h-[260px] w-auto max-w-full object-contain object-bottom block select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Feature Levels Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container-apple">
          {/* Section Heading with paper plane doodle */}
          <div className="relative max-w-2xl mb-12">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                FEATURE LEVELS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Designed for every critical academic transition.
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Our features are calibrated to the exact developmental and academic stage of your student body.
              </p>
            </Reveal>

            {/* Decorative Doodle in sky */}
            <div className="hidden lg:block absolute -right-48 top-0 pointer-events-none select-none opacity-80">
              <svg className="w-28 h-16 text-blue-400/70" viewBox="0 0 120 70" fill="none">
                <path d="M10,50 Q40,10 70,35 T110,20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M108,12 L118,20 L108,26 Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* 3 Transition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Secondary Schools */}
            <Reveal delay={60}>
              <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">Secondary Schools</h3>
                      <p className="text-xs text-slate-500">Stream Selection & Foundation Planning</p>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-purple-700 bg-purple-50/80 px-2.5 py-0.5 rounded-full border border-purple-200/60 mb-5">
                    Class 9 & 10 Students and Parents
                  </span>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      What is included:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Stream evaluation workshops (Science, Commerce, Arts)</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Aptitude and subject interest discovery</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Interactive parent orientation sessions</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Individual stream roadmap summaries</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2 h-8 shadow-2xs gap-1"
                  >
                    <Link to="/partner">
                      <span>Inquire for this level</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/60 border border-purple-100/80 text-[10px] font-bold text-purple-700">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <span>Grade 9–10</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Pre-University & Junior Colleges */}
            <Reveal delay={120}>
              <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">Pre-University & Junior Colleges</h3>
                      <p className="text-xs text-slate-500">Higher-Ed Pathways & Degree Alignment</p>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-200/60 mb-5">
                    Class 11 & 12 / PUC Students
                  </span>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      What is included:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Degree and university options exploration</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Entrance exam timelines (CET, JEE, NEET, CUET, CLAT, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>One-on-one academic mentor consultations</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Targeted college selection roadmaps</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2 h-8 shadow-2xs gap-1"
                  >
                    <Link to="/partner">
                      <span>Inquire for this level</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/60 border border-blue-100/80 text-[10px] font-bold text-blue-700">
                    <Compass className="h-3 w-3 text-blue-600" />
                    <span>Grade 11–12</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Colleges & Institutes */}
            <Reveal delay={180}>
              <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">Colleges & Institutes</h3>
                      <p className="text-xs text-slate-500">Postgraduate & Career Specialization</p>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60 mb-5">
                    Undergraduate Students
                  </span>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      What is included:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Higher education & research opportunities</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Emerging industry domains & skill prerequisites</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Faculty-aligned guidance seminars</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Academic assessment and roadmap planning</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 h-8 shadow-2xs gap-1"
                  >
                    <Link to="/partner">
                      <span>Inquire for this level</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/60 border border-emerald-100/80 text-[10px] font-bold text-emerald-700">
                    <Building2 className="h-3 w-3 text-emerald-600" />
                    <span>Higher Ed</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Delivery Format Section */}
      <section className="py-16 md:py-20 bg-[#F8FAFC] border-y border-slate-200/60">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <Reveal>
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                  DELIVERY FORMAT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Flexible on-campus and hybrid formats.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                  Whether you prefer in-person auditorium seminars, classroom workshops, or structured hybrid sessions with parent participation, EDUARC seamlessly adapts to your institutional timetable.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">On-Campus Seminars</h4>
                      <p className="text-[11px] text-slate-500">Direct mentor engagement</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">Parent Orientations</h4>
                      <p className="text-[11px] text-slate-500">Joint guidance clarity</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: UI Artifact for Delivery Formats (Clean Schedule Widget) */}
            <div className="lg:col-span-6">
              <Reveal delay={150}>
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white p-6 sm:p-8 border border-blue-100 shadow-sm">
                  {/* Schedule Card Widget */}
                  <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-[#0F172A]">Active Session Roster</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Flexible Schedule
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                        <div className="flex items-center gap-2.5">
                          <Presentation className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-slate-800">Auditorium Keynote</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">100–300 Students</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                        <div className="flex items-center gap-2.5">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-slate-800">Classroom Aptitude Lab</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">30–50 Students</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                        <div className="flex items-center gap-2.5">
                          <HeartHandshake className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800">Joint Parent Orientation</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">Weekend / Evening</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Logistics & Materials Managed by EDUARC</span>
                      <span className="font-bold text-emerald-600">✓ Zero Burden</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Smooth Implementation Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-apple">
          <div className="max-w-2xl mb-12">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                SMOOTH IMPLEMENTATION
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Four simple steps from consultation to roadmap delivery.
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                We handle session logistics and guidance materials so your school administration can focus on supporting your students.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingPhases.map((phase, idx) => {
              const icons = [MessageSquare, Calendar, Users, FileCheck2];
              const StepIcon = icons[idx % icons.length]!;
              return (
                <Reveal key={phase.step} delay={idx * 60}>
                  <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      {/* Step Indicator */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-8 w-8 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {phase.step}
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <StepIcon className="h-4 w-4" />
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-[#0F172A]">{phase.phase}</h3>
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block mt-0.5 mb-3">
                        {phase.timeline}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Why Partner with EDUARC */}
      <section className="py-12 md:py-16">
        <div className="container-apple">
          <div className="rounded-3xl bg-[#F0F6FE] border border-blue-100/90 p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Side: Impact Stats & Heading */}
              <div className="lg:col-span-5 space-y-4">
                <Reveal>
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                    WHY PARTNER WITH EDUARC
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    Real impact for your institution.
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Partner with EDUARC to provide structured career guidance and create measurable outcomes for your students.
                  </p>

                  {/* Impact Metric Artifact in place of stock illustration */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-2xs">
                      <p className="text-xl font-black text-[#0F172A]">100+</p>
                      <p className="text-[11px] text-slate-500 font-medium">Programs Conducted</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-2xs">
                      <p className="text-xl font-black text-[#0F172A]">50+</p>
                      <p className="text-[11px] text-slate-500 font-medium">Partner Institutions</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-2xs">
                      <p className="text-xl font-black text-[#0F172A]">10,000+</p>
                      <p className="text-[11px] text-slate-500 font-medium">Students Reached</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-2xs">
                      <p className="text-xl font-black text-[#0F172A]">4.8 / 5</p>
                      <p className="text-[11px] text-slate-500 font-medium">Average Rating</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right Side: 4 Features 2x2 Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-2xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Structured Guidance Programs</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Well-designed and age-appropriate sessions.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-2xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Expert Mentors</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Industry and academic professionals.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-2xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Parent Involvement</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Stronger alignment and confidence.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-2xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Actionable Roadmaps</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Every student walks away with a clear plan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Program Deliverables */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-apple">
          <div className="max-w-2xl mb-12">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                PROGRAM DELIVERABLES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Complete support, clear outcomes.
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                We provide everything your institution needs for successful implementation and lasting impact.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={60}>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Session Materials</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Presentation, worksheets, and resources.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Participation Reports</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Attendance, engagement and key insights.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PieChart className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Feedback Reports</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Student and parent feedback summaries.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. Customization Bar */}
      <section className="py-6">
        <div className="container-apple">
          <div className="rounded-2xl bg-[#F4F8FD] border border-blue-100/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1 text-center md:text-left max-w-lg">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                CUSTOMIZATION
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">Built around your needs.</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We tailor our programs based on your student strength, academic level and available timetable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 w-full sm:w-auto justify-center">
                <Sliders className="h-3.5 w-3.5 text-blue-600" />
                <span>Request a customized program for your institution.</span>
              </div>
              <Button
                asChild
                className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 h-10 shadow-sm w-full sm:w-auto shrink-0 gap-1.5"
              >
                <Link to="/contact">
                  <span>Contact Our Team</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner: Partner with EDUARC */}
      <section className="py-12 md:py-16">
        <div className="container-apple">
          <div className="rounded-3xl bg-gradient-to-r from-[#EFF6FF] via-[#F0F7FF] to-[#E0EFFF] border border-blue-200/70 p-8 sm:p-12 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3 text-center sm:text-left">
                <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block">
                  LET'S WORK TOGETHER
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Partner with EDUARC
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                  Let's build brighter futures for your students, together.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                  <Button
                    asChild
                    className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 h-10 shadow-sm gap-1.5"
                  >
                    <Link to="/partner">
                      <span>Request Institutional Proposal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-slate-300 bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-4 py-2.5 h-10 shadow-2xs"
                  >
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right Side Callout Script Artifact */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div className="text-center sm:text-left rotate-[-2deg] p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-white/80 shadow-xs">
                  <p className="font-serif italic font-bold text-[#1E40AF] text-sm sm:text-base leading-tight tracking-wide drop-shadow-2xs">
                    Better Guidance
                    <br />
                    <span className="text-indigo-800">Brighter Futures</span>
                  </p>
                  <svg
                    className="w-20 sm:w-24 h-3 text-blue-600 stroke-current mt-1 mx-auto sm:mx-0"
                    viewBox="0 0 100 12"
                    fill="none"
                  >
                    <path d="M2,8 Q50,2 98,6" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
