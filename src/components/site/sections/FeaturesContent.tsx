import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Check,
  ArrowRight,
  Sparkles,
  Compass,
  Building2,
  Calendar,
  Users,
  Presentation,
  HeartHandshake,
  MessageSquare,
  FileCheck2,
  Layers,
  Award,
  CheckCircle2,
  FileText,
  BarChart3,
  PieChart,
  Sliders,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";

export const onboardingPhases = [
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

export function FeaturesContent() {
  const c = useSiteContent();

  return (
    <>
      {/* 2. Feature Levels Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container-apple">
          {/* Section Heading with paper plane doodle */}
          <div className="relative max-w-2xl mb-12">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-2 block">
                {c.featuresPage?.levelsEyebrow || "FEATURE LEVELS"}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243B35] tracking-tight">
                {c.featuresPage?.levelsTitle || "Designed for every critical academic transition."}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {c.featuresPage?.levelsLead ||
                  "Our features are calibrated to the exact developmental and academic stage of your student body."}
              </p>
            </Reveal>

            {/* Decorative Doodle in sky */}
            <div className="hidden lg:block absolute -right-48 top-0 pointer-events-none select-none opacity-80">
              <svg className="w-28 h-16 text-[#B47A4B]/60" viewBox="0 0 120 70" fill="none">
                <path d="M10,50 Q40,10 70,35 T110,20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M108,12 L118,20 L108,26 Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* 3 Transition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Secondary Schools */}
            <Reveal delay={60}>
              <div className="h-full rounded-2xl border border-hairline bg-white p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#F5F1E8] text-[#B47A4B] flex items-center justify-center shrink-0 border border-[#E2DBD0]">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#243B35]">Secondary Schools</h3>
                      <p className="text-xs text-slate-500">Stream Selection & Foundation Planning</p>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-[#B47A4B] bg-[#F5F1E8] px-2.5 py-0.5 rounded-full border border-[#E2DBD0] mb-5">
                    Class 9 & 10 Students and Parents
                  </span>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      What is included:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Stream evaluation workshops (Science, Commerce, Arts)</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Aptitude and subject interest discovery</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Interactive parent orientation sessions</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Individual stream roadmap summaries</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-4 py-2 h-8 shadow-xs gap-1 cursor-pointer"
                  >
                    <Link to="/partner">
                      <span>Inquire for this level</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5F1E8] border border-[#E2DBD0] text-[10px] font-bold text-[#B47A4B]">
                    <Sparkles className="h-3 w-3 text-[#B47A4B]" />
                    <span>Grade 9–10</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Pre-University & Junior Colleges */}
            <Reveal delay={120}>
              <div className="h-full rounded-2xl border border-hairline bg-white p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#EDF3F0] text-[#243B35] flex items-center justify-center shrink-0 border border-[#D3DFDA]">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#243B35]">Pre-University & Junior Colleges</h3>
                      <p className="text-xs text-slate-500">Higher-Ed Pathways & Degree Alignment</p>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-[#243B35] bg-[#EDF3F0] px-2.5 py-0.5 rounded-full border border-[#D3DFDA] mb-5">
                    Class 11 & 12 / PUC Students
                  </span>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      What is included:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Degree and university options exploration</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Entrance exam timelines (CET, JEE, NEET, CUET, CLAT, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>One-on-one academic mentor consultations</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Targeted college selection roadmaps</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-4 py-2 h-8 shadow-xs gap-1 cursor-pointer"
                  >
                    <Link to="/partner">
                      <span>Inquire for this level</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EDF3F0] border border-[#D3DFDA] text-[10px] font-bold text-[#243B35]">
                    <Compass className="h-3 w-3 text-[#243B35]" />
                    <span>Grade 11–12</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Colleges & Institutes */}
            <Reveal delay={180}>
              <div className="h-full rounded-2xl border border-hairline bg-white p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#EFF4EE] text-[#9AAB94] flex items-center justify-center shrink-0 border border-[#DCE6DA]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#243B35]">Colleges & Institutes</h3>
                      <p className="text-xs text-slate-500">Postgraduate & Career Specialization</p>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-[#243B35] bg-[#EFF4EE] px-2.5 py-0.5 rounded-full border border-[#DCE6DA] mb-5">
                    Undergraduate Students
                  </span>

                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      What is included:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Higher education & research opportunities</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Emerging industry domains & skill prerequisites</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Faculty-aligned guidance seminars</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#243B35] shrink-0 mt-0.5" />
                        <span>Academic assessment and roadmap planning</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-4 py-2 h-8 shadow-xs gap-1 cursor-pointer"
                  >
                    <Link to="/partner">
                      <span>Inquire for this level</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFF4EE] border border-[#DCE6DA] text-[10px] font-bold text-[#243B35]">
                    <Building2 className="h-3 w-3 text-[#9AAB94]" />
                    <span>Higher Ed</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Delivery Format Section */}
      <section className="py-16 md:py-20 bg-[#FAF9F5] border-y border-hairline/80">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <Reveal>
                <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-2 block">
                  DELIVERY FORMAT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B35] tracking-tight">
                  Flexible on-campus and hybrid formats.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                  Whether you prefer in-person auditorium seminars, classroom workshops, or structured hybrid sessions with parent participation, EDUARC seamlessly adapts to your institutional timetable.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-hairline shadow-xs">
                    <div className="h-10 w-10 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#243B35]">On-Campus Seminars</h4>
                      <p className="text-[11px] text-slate-500">Direct mentor engagement</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-hairline shadow-xs">
                    <div className="h-10 w-10 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#243B35]">Parent Orientations</h4>
                      <p className="text-[11px] text-slate-500">Joint guidance clarity</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: UI Artifact for Delivery Formats (Clean Schedule Widget) */}
            <div className="lg:col-span-6">
              <Reveal delay={150}>
                <div className="relative rounded-2xl bg-[#F5F1E8] p-6 sm:p-8 border border-hairline shadow-sm">
                  {/* Schedule Card Widget */}
                  <div className="rounded-xl bg-white p-5 border border-hairline shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-hairline">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#243B35] animate-pulse" />
                        <span className="text-xs font-bold text-[#243B35]">Active Session Roster</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#243B35] bg-[#EDF3F0] px-2 py-0.5 rounded-full">
                        Flexible Schedule
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] text-xs">
                        <div className="flex items-center gap-2.5">
                          <Presentation className="h-4 w-4 text-[#243B35]" />
                          <span className="font-semibold text-slate-800">Auditorium Keynote</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">100–300 Students</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] text-xs">
                        <div className="flex items-center gap-2.5">
                          <Users className="h-4 w-4 text-[#B47A4B]" />
                          <span className="font-semibold text-slate-800">Classroom Aptitude Lab</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">30–50 Students</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] text-xs">
                        <div className="flex items-center gap-2.5">
                          <HeartHandshake className="h-4 w-4 text-[#9AAB94]" />
                          <span className="font-semibold text-slate-800">Joint Parent Orientation</span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">Weekend / Evening</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Logistics & Materials Managed by EDUARC</span>
                      <span className="font-bold text-[#243B35]">✓ Zero Burden</span>
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
              <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-2 block">
                {c.featuresPage?.onboardingEyebrow || "SMOOTH IMPLEMENTATION"}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243B35] tracking-tight">
                {c.featuresPage?.onboardingTitle || "Four simple steps from consultation to roadmap delivery."}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {c.featuresPage?.onboardingLead ||
                  "We handle session logistics and guidance materials so your school administration can focus on supporting your students."}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingPhases.map((phase, idx) => {
              const icons = [MessageSquare, Calendar, Users, FileCheck2];
              const StepIcon = icons[idx % icons.length]!;
              return (
                <Reveal key={phase.step} delay={idx * 60}>
                  <div className="h-full rounded-2xl border border-hairline bg-white p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between">
                    <div>
                      {/* Step Indicator */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-8 w-8 rounded-full bg-[#243B35] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          {phase.step}
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-[#F5F1E8] text-[#B47A4B] flex items-center justify-center">
                          <StepIcon className="h-4 w-4" />
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-[#243B35]">{phase.phase}</h3>
                      <span className="text-[10px] font-semibold text-[#B47A4B] uppercase tracking-wider block mt-0.5 mb-3">
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
          <div className="rounded-2xl bg-[#F5F1E8] border border-hairline p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Side: Impact Stats & Heading */}
              <div className="lg:col-span-5 space-y-4">
                <Reveal>
                  <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-2 block">
                    {c.featuresPage?.suiteEyebrow || "WHY PARTNER WITH EDUARC"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B35] tracking-tight">
                    {c.featuresPage?.suiteTitle || "Real impact for your institution."}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.featuresPage?.suiteLead ||
                      "Partner with EDUARC to provide structured career guidance and create measurable outcomes for your students."}
                  </p>

                  {/* Impact Metric Artifact in place of stock illustration */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="p-3.5 rounded-xl bg-white border border-hairline shadow-xs">
                      <p className="text-xl font-black text-[#243B35]">100+</p>
                      <p className="text-[11px] text-slate-500 font-medium">Programs Conducted</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-hairline shadow-xs">
                      <p className="text-xl font-black text-[#243B35]">50+</p>
                      <p className="text-[11px] text-slate-500 font-medium">Partner Institutions</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-hairline shadow-xs">
                      <p className="text-xl font-black text-[#243B35]">10,000+</p>
                      <p className="text-[11px] text-slate-500 font-medium">Students Reached</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-hairline shadow-xs">
                      <p className="text-xl font-black text-[#243B35]">4.8 / 5</p>
                      <p className="text-[11px] text-slate-500 font-medium">Average Rating</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right Side: 4 Features 2x2 Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-hairline shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#243B35]">Structured Guidance Programs</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Well-designed and age-appropriate sessions.</p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-hairline shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#243B35]">Expert Mentors</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Industry and academic professionals.</p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-hairline shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#243B35]">Parent Involvement</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Stronger alignment and confidence.</p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-hairline shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#243B35]">Actionable Roadmaps</h4>
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
              <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-2 block">
                PROGRAM DELIVERABLES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243B35] tracking-tight">
                Complete support, clear outcomes.
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                We provide everything your institution needs for successful implementation and lasting impact.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={60}>
              <div className="rounded-xl border border-hairline bg-white p-6 shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#243B35]">Session Materials</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Presentation, worksheets, and resources.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-xl border border-hairline bg-white p-6 shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#243B35]">Participation Reports</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Attendance, engagement and key insights.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="rounded-xl border border-hairline bg-white p-6 shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-[#EDF3F0] text-[#243B35] flex items-center justify-center">
                  <PieChart className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#243B35]">Feedback Reports</h3>
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
          <div className="rounded-2xl bg-[#F5F1E8] border border-hairline p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center md:text-left max-w-lg">
              <span className="text-[10px] font-bold text-[#B47A4B] uppercase tracking-wider block">
                CUSTOMIZATION
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#243B35]">Built around your needs.</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We tailor our programs based on your student strength, academic level and available timetable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-hairline text-xs text-slate-700 w-full sm:w-auto justify-center">
                <Sliders className="h-3.5 w-3.5 text-[#B47A4B]" />
                <span>Request a customized program for your institution.</span>
              </div>
              <Button
                asChild
                className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-5 py-2.5 h-10 shadow-xs w-full sm:w-auto shrink-0 gap-1.5 cursor-pointer"
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
    </>
  );
}

