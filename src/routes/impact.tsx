import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Quote,
  CheckCircle2,
  ShieldCheck,
  Target,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { PageIntro, SectionHeading, CtaBand } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Methodology & Impact — EDUARC Guidance Principles" },
      {
        name: "description",
        content:
          "Discover how EDUARC measures guidance quality and career direction through structured student roadmaps, verified educator feedback, and family clarity.",
      },
      { property: "og:title", content: "EDUARC Methodology & Impact" },
      {
        property: "og:description",
        content: "Transparent, qualitative standards for measuring student career guidance.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/impact" }],
  }),
  component: ImpactPage,
});

const measurementPillars = [
  {
    icon: Compass,
    title: "1. Guidance Depth & Exploration",
    description:
      "We measure how thoroughly students evaluate multiple academic disciplines before narrowing down choices, ensuring decisions are grounded in understanding rather than haste.",
    metric: "Comprehensive Scope",
  },
  {
    icon: Users,
    title: "2. Family & Student Alignment",
    description:
      "Career choices succeed when parents and students share a mutual, well-informed vision. Our sessions bridge communication gaps and build consensus around realistic paths.",
    metric: "Collaborative Planning",
  },
  {
    icon: Target,
    title: "3. Actionable Milestone Roadmaps",
    description:
      "Every counselling engagement produces an individual roadmap specifying required entrance exams, admission deadlines, and skill development targets.",
    metric: "Clear Timelines",
  },
  {
    icon: ShieldCheck,
    title: "4. Credential-Backed Mentorship",
    description:
      "We maintain strict verification for all counsellors, requiring documented higher-education teaching and research experience before working with students.",
    metric: "Verified Standards",
  },
] as const;

function ImpactPage() {
  const c = useSiteContent();

  return (
    <>
      {/* 1. Page Intro */}
      <PageIntro
        eyebrow="Methodology & Outcomes"
        title="Measuring progress through authentic student clarity."
        lead="Rather than relying on fabricated statistics or inflated marketing claims, EDUARC evaluates impact through verified student roadmaps, family consensus, and academic direction."
      />

      {/* 2. How We Measure Guidance Progress */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Evaluation Standards"
            title="How EDUARC measures genuine guidance outcomes."
            lead="True career guidance is qualitative and developmental. Here are the core benchmarks we track for every student and partnering school."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {measurementPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={i * 75}>
                  <div className="h-full rounded-2xl border border-hairline bg-surface/60 p-8 hover-lift transition-all hover:bg-white hover:border-brand-gold/40 hover:shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="gold">{pillar.metric}</Badge>
                    </div>

                    <h3 className="text-xl font-bold text-brand-navy tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Verified Activity Notice */}
      <section className="bg-surface py-16 border-y border-hairline">
        <div className="container-apple">
          <Reveal>
            <div className="rounded-2xl border border-brand-gold-border bg-brand-gold-soft p-8 text-center max-w-3xl mx-auto space-y-3">
              <Badge variant="gold">Transparency Commitment</Badge>
              <h3 className="text-xl font-bold text-brand-navy">
                Verified Program Metrics as We Grow
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                EDUARC reports only audited, verified institutional data. As our student cohort and
                partner schools expand across Karnataka and neighboring regions, verified activity
                counts and milestone completions will be updated directly in our reports.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Student & Parent Perspectives */}
      <section className="bg-brand-navy py-20 md:py-28 text-white">
        <div className="container-apple">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="type-eyebrow text-brand-gold">Partner Perspectives</span>
            <h2 className="type-headline mt-3 text-white">Reflections on guided clarity.</h2>
            <p className="type-lead mt-3 text-ink-muted">
              Feedback from students and educators who experienced our career roadmap methodology.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {c.testimonials.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 80}>
                <figure className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-brand-gold/40">
                  <div>
                    <Quote className="h-7 w-7 text-brand-gold mb-4" strokeWidth={1.5} />
                    <blockquote className="text-base text-ink-foreground font-normal leading-relaxed italic">
                      “{t.quote}”
                    </blockquote>
                  </div>

                  <figcaption className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-navy">
                      {initials(t.name)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-brand-gold-soft">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Next Steps */}
      <CtaBand
        title="Experience purposeful guidance with EDUARC."
        lead="Schedule a consultation with our academic team to see how our roadmap methodology brings clarity to your students."
      />
    </>
  );
}
