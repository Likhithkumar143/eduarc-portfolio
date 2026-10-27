import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import campusImg from "@/assets/campus.jpg";
import { PageIntro, SectionHeading, CtaBand } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FeatureIcon } from "@/components/site/icons";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs for Schools & Colleges — EduArc" },
      {
        name: "description",
        content:
          "Flexible EduArc partnership programs for high schools, PU colleges, degree colleges and technical institutions, with a simple 4‑step onboarding.",
      },
      { property: "og:title", content: "EduArc Programs for Schools & Colleges" },
      {
        property: "og:description",
        content: "Flexible partnership models and a simple 4‑step implementation process.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const c = useSiteContent();
  return (
    <>
      <PageIntro eyebrow="The offer" title={c.programsPage.title} lead={c.programsPage.lead} />

      <section className="bg-background pb-24 md:pb-32">
        <div className="container-apple grid gap-5 md:grid-cols-3">
          {c.offers.map((o, i) => (
            <Reveal key={o.title + i} delay={i * 80}>
              <article className="hover-lift h-full rounded-3xl bg-surface p-8">
                <FeatureIcon name={o.icon} />
                <h2 className="mt-7 text-[21px] font-semibold tracking-tight text-foreground">
                  {o.title}
                </h2>
                <p className="mt-2 text-[17px] text-muted-foreground">{o.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="container-wide mt-5">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-[2rem]">
              <img
                src={campusImg}
                alt="A modern school and college campus with a green lawn"
                width={1600}
                height={1008}
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="flex min-h-[520px] items-center p-6 md:p-12">
                <div className="glass max-w-md rounded-[2rem] p-8 md:p-10">
                  <p className="type-eyebrow">Ideal for</p>
                  <h2 className="type-title mt-3 text-foreground">
                    {c.programsPage.idealForTitle}
                  </h2>
                  <ul className="mt-8 space-y-4">
                    {c.idealFor.map((item, i) => (
                      <li
                        key={item + i}
                        className="flex items-center gap-3 text-[17px] text-foreground"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-teal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-24 md:py-32">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Easy onboarding"
            title={c.programsPage.processTitle}
            lead={c.programsPage.processLead}
          />
          <ol className="relative mx-auto mt-16 max-w-2xl">
            <span
              className="absolute bottom-6 left-6 top-6 w-px bg-gradient-brand opacity-40"
              aria-hidden="true"
            />
            {c.steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.title + i}
                delay={i * 100}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-[17px] font-semibold text-primary-foreground shadow-card">
                  {i + 1}
                </span>
                <div className="glass hover-lift flex-1 rounded-2xl px-6 py-5">
                  <h3 className="text-[21px] font-semibold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-[17px] text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
