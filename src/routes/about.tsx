import { createFileRoute } from "@tanstack/react-router";
import { Check, Target } from "lucide-react";
import { PageIntro, SectionHeading, CtaBand, GradientText } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FeatureIcon } from "@/components/site/icons";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EduArc — Our Mission & Why Partner With Us" },
      {
        name: "description",
        content:
          "EduArc helps students make informed academic and career decisions with personalized roadmaps, expert mentors and secure technology.",
      },
      { property: "og:title", content: "About EduArc — Our Mission" },
      {
        property: "og:description",
        content:
          "A next‑generation education guidance platform for students, schools and colleges.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const c = useSiteContent();
  return (
    <>
      <PageIntro eyebrow="Our mission" title={c.about.title} lead={c.about.lead} />

      <section className="bg-background pb-24 md:pb-32">
        <div className="container-apple grid gap-5 md:grid-cols-2">
          {c.pillars.map((p, i) => (
            <Reveal key={p.title + i} delay={i * 80}>
              <article className="hover-lift h-full rounded-3xl bg-surface p-9 md:p-10">
                <FeatureIcon name={p.icon} />
                <h2 className="type-title mt-8 text-foreground">{p.title}</h2>
                <p className="mt-3 text-[17px] text-muted-foreground">{p.body}</p>
              </article>
            </Reveal>
          ))}
          <Reveal className="md:col-span-2">
            <div className="relative isolate flex flex-col items-start gap-5 overflow-hidden rounded-3xl bg-accent p-9 md:flex-row md:items-center md:p-10">
              <span
                className="blob blob-teal -right-10 -top-10 -z-10 h-48 w-48 opacity-40"
                aria-hidden="true"
              />
              <span className="glass inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-brand">
                <Target className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <p className="type-title text-brand">{c.about.goal}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
        <span
          className="blob blob-navy -left-20 top-1/3 -z-10 h-80 w-80 opacity-20"
          aria-hidden="true"
        />
        <div className="container-apple">
          <SectionHeading
            eyebrow="The advantage"
            title={c.about.advantagesTitle}
            lead={c.about.advantagesLead}
          />
          <div className="glass mt-16 overflow-hidden rounded-3xl">
            {c.advantages.map((a, i) => (
              <Reveal key={a.title + i} delay={i * 60}>
                <div className="flex gap-5 border-b border-hairline p-8 last:border-b-0 md:p-10">
                  <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal text-primary-foreground">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="text-[21px] font-semibold tracking-tight text-foreground">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-[17px] text-muted-foreground">{a.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <p className="type-title">
              <GradientText>“{c.about.quote}”</GradientText>
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
