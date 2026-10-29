import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import campusImg from "@/assets/campus.jpg";
import { PageIntro, SectionHeading, CtaBand } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/programs")({
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
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/programs" }],
  }),
  component: ProgramsPage,
});

const institutionalTiers = [
  {
    icon: GraduationCap,
    tier: "Secondary Schools",
    audience: "Class 9 & 10 Students and Parents",
    focus: "Stream Selection & Foundation Planning",
    deliverables: [
      "Stream evaluation workshops (Science, Commerce, Arts)",
      "Aptitude and subject interest discovery",
      "Interactive parent orientation sessions",
      "Individual stream roadmap summaries",
    ],
  },
  {
    icon: Compass,
    tier: "Pre-University & Junior Colleges",
    audience: "Class 11 & 12 / PUC Students",
    focus: "Higher-Ed Pathways & Degree Alignment",
    deliverables: [
      "Degree and university options exploration",
      "Entrance exam timelines (CET, JEE, NEET, CUET, CLAT, etc.)",
      "One-on-one academic mentor consultations",
      "Targeted college selection roadmaps",
    ],
  },
  {
    icon: Building2,
    tier: "Colleges & Institutes",
    audience: "Undergraduate Students",
    focus: "Postgraduate & Career Specialization",
    deliverables: [
      "Higher education & research opportunities",
      "Emerging industry domains & skill prerequisites",
      "Faculty-aligned guidance seminars",
      "Academic assessment and roadmap planning",
    ],
  },
] as const;

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

function ProgramsPage() {
  const c = useSiteContent();

  return (
    <>
      {/* 1. Page Intro */}
      <PageIntro
        eyebrow="Institutional Features"
        title="Structured features for schools and colleges."
        lead={
          c.programsPage.lead ||
          "Equip your institution with systematic career guidance workshops, mentor sessions, and actionable student roadmaps led by verified academicians."
        }
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="pill-gold" size="pill">
            <Link to="/partner">Request Institutional Proposal</Link>
          </Button>
          <Button asChild variant="pill-outline" size="pill">
            <Link to="/contact">Speak with Partnerships Team</Link>
          </Button>
        </div>
      </PageIntro>

      {/* 2. Institutional Tiers */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Feature Levels"
            title="Designed for every critical academic transition."
            lead="Our features are calibrated to the exact developmental and academic stage of your student body."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {institutionalTiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <Reveal key={tier.tier} delay={idx * 80}>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline bg-surface/60 p-8 hover-lift transition-all hover:bg-white hover:border-brand-gold/40 hover:shadow-card">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="gold">{tier.tier}</Badge>
                      </div>

                      <h3 className="text-xl font-bold text-brand-navy tracking-tight">
                        {tier.focus}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-brand-gold">{tier.audience}</p>

                      <div className="mt-6 pt-6 border-t border-hairline space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          What is included:
                        </p>
                        <ul className="space-y-2.5">
                          {tier.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-xs text-foreground/80"
                            >
                              <CheckCircle2 className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-hairline">
                      <Button
                        asChild
                        variant="pill-outline"
                        size="sm"
                        className="w-full justify-between"
                      >
                        <Link to="/partner">
                          <span>Inquire for this level</span>
                          <ArrowRight className="h-3.5 w-3.5 text-brand-gold" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Campus Collaboration Visual Banner */}
      <section className="bg-surface py-16 border-y border-hairline">
        <div className="container-apple">
          <div className="rounded-3xl border border-hairline bg-white overflow-hidden shadow-card grid md:grid-cols-12 items-center">
            <div className="md:col-span-7 p-8 md:p-12 space-y-4">
              <Badge variant="navy">Delivery Format</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy tracking-tight">
                Flexible on-campus and hybrid formats.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you prefer in-person auditorium seminars, classroom workshops, or structured
                hybrid sessions with parent participation, EDUARC seamlessly adapts to your
                institutional timetable.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-hairline">
                  <p className="font-bold text-brand-navy">On-Campus Seminars</p>
                  <p className="text-muted-foreground mt-0.5">Direct mentor engagement</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-hairline">
                  <p className="font-bold text-brand-navy">Parent Orientations</p>
                  <p className="text-muted-foreground mt-0.5">Joint guidance clarity</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 h-full min-h-[260px]">
              <img
                src={campusImg}
                alt="Institutional campus grounds"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four-Step Onboarding Process */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Smooth Implementation"
            title="Four simple steps from consultation to roadmap delivery."
            lead="We handle session logistics and guidance materials so your school administration can focus on supporting your students."
          />

          <div className="mt-14 max-w-3xl mx-auto space-y-6">
            {onboardingPhases.map((phaseItem, idx) => (
              <Reveal key={phaseItem.step} delay={idx * 75}>
                <div className="flex gap-6 rounded-2xl border border-hairline bg-surface/50 p-6 md:p-8 hover:bg-white hover:border-brand-gold/40 hover:shadow-card transition-all">
                  <div className="flex flex-col items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-brand-gold font-bold font-mono text-base">
                      {phaseItem.step}
                    </span>
                    {idx < onboardingPhases.length - 1 && (
                      <span className="w-0.5 h-full bg-border my-2" aria-hidden="true" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-navy">{phaseItem.phase}</h3>
                      <span className="text-[11px] font-semibold text-brand-gold bg-brand-gold-soft px-2 py-0.5 rounded-full border border-brand-gold-border">
                        {phaseItem.timeline}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {phaseItem.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action Band */}
      <CtaBand
        title="Partner with EDUARC for your next academic term."
        lead="Our educational coordinators are available to meet with your leadership team and present a customized guidance proposal."
      />
    </>
  );
}
