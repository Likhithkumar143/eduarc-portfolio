import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Compass, ShieldCheck, Target, Users, BookOpen, ArrowRight } from "lucide-react";
import { PageIntro, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EDUARC — Our Mission & Educational Philosophy" },
      {
        name: "description",
        content:
          "EDUARC supports students and institutions with structured career roadmaps, academic clarity, and verified mentorship.",
      },
      { property: "og:title", content: "About EDUARC — Our Mission" },
      {
        property: "og:description",
        content:
          "Empowering students from Class 10 onwards with informed choices, parental support, and institutional guidance.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/about" }],
  }),
  component: AboutPage,
});

const coreFocusAreas = [
  {
    icon: Compass,
    title: "The Problem We Solve",
    lead: "Career Confusion & Information Overload",
    body: "After Class 10 and 12, students are confronted with an overwhelming array of courses, colleges, and competing opinions. Without structured guidance, decisions are often driven by peer pressure or incomplete information rather than individual aptitudes and career realities.",
  },
  {
    icon: Users,
    title: "Who We Serve",
    lead: "Students, Parents & Educational Institutions",
    body: "We work directly with students seeking clarity, parents desiring informed family discussions, and schools/colleges seeking a credible, professional guidance curriculum that complements regular academics.",
  },
  {
    icon: BookOpen,
    title: "Our Methodology",
    lead: "Academic Rigor Over Speculation",
    body: "Rather than quick automated quizzes or marketing promises, we combine structured exploration frameworks with real discussions led by verified educators with genuine higher-education and research experience.",
  },
  {
    icon: ShieldCheck,
    title: "Our Commitment",
    lead: "Integrity, Transparency & Privacy",
    body: "We operate with strict privacy standards and zero biased commercial affiliations. Our sole priority is helping each student choose the academic pathway best suited to their long-term growth.",
  },
] as const;

function AboutPage() {
  const c = useSiteContent();

  return (
    <>
      {/* 1. Page Intro */}
      <PageIntro
        eyebrow="Our Mission"
        title="Guiding students from confusion to clarity."
        lead={
          c.about.lead ||
          "EDUARC is a dedicated education guidance platform created to give students and parents structured, informed direction for higher education and career roadmaps."
        }
      />

      {/* 2. Philosophy & Four Focus Areas */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Educational Foundations"
            title="Why thoughtful career guidance matters today."
            lead="Choosing an academic stream or degree shouldn't feel like a leap into the dark. Here is how we approach student direction."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {coreFocusAreas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={idx * 75}>
                  <div className="h-full rounded-2xl border border-hairline bg-surface/60 p-8 hover-lift transition-all hover:bg-white hover:border-brand-gold/40 hover:shadow-card">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                          {item.title}
                        </span>
                        <h3 className="text-lg font-bold text-brand-navy">{item.lead}</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Core Goal Banner */}
          <Reveal className="mt-12">
            <div className="rounded-2xl border border-brand-gold-border bg-brand-gold-soft p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <Badge variant="gold" className="mb-1">
                    Core Principle
                  </Badge>
                  <p className="text-lg md:text-xl font-bold text-brand-navy">
                    {c.about.goal ||
                      "Every student deserves access to structured, unbiased guidance."}
                  </p>
                </div>
              </div>
              <Button asChild variant="pill-gold" size="pill-sm" className="shrink-0">
                <Link to="/partner">Speak With a Counsellor</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. The Advantage for Institutions & Families */}
      <section className="bg-surface py-20 md:py-28 border-y border-hairline">
        <div className="container-apple">
          <SectionHeading
            eyebrow="The EDUARC Advantage"
            title={c.about.advantagesTitle || "Why institutions and families trust our approach."}
            lead={
              c.about.advantagesLead ||
              "We provide structured tools that support students beyond routine textbook learning with realistic higher-education insights."
            }
          />

          <div className="mt-14 rounded-2xl border border-hairline bg-white divide-y divide-hairline shadow-xs overflow-hidden">
            {c.advantages.map((adv, i) => (
              <Reveal key={adv.title + i} delay={i * 60}>
                <div className="flex items-start gap-5 p-6 md:p-8 hover:bg-surface/30 transition-colors">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold-soft text-brand-navy border border-brand-gold-border">
                    <Check className="h-4 w-4 text-brand-gold" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy">{adv.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {adv.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Inspirational Tagline */}
          <Reveal className="mt-14 text-center">
            <p className="text-xl md:text-2xl font-semibold text-brand-navy">
              “{c.about.quote || "Guidance today, success tomorrow."}”
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-brand-gold font-semibold">
              The EDUARC Promise
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
