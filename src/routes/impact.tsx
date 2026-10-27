import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { PageIntro, CtaBand } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FeatureIcon } from "@/components/site/icons";
import { initials } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact & Testimonials — EduArc" },
      {
        name: "description",
        content:
          "See how EduArc helps institutions build focused, engaged and future‑ready student communities — in the words of our partners.",
      },
      { property: "og:title", content: "EduArc Impact & Partner Testimonials" },
      {
        property: "og:description",
        content: "Real results for schools and colleges partnering with EduArc.",
      },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  const c = useSiteContent();
  return (
    <>
      <PageIntro eyebrow="Real results" title={c.impactPage.title} lead={c.impactPage.lead} />

      <section className="bg-background pb-24 md:pb-32">
        <div className="container-apple grid gap-5 sm:grid-cols-2">
          {c.impacts.map((m, i) => (
            <Reveal key={m.title + i} delay={i * 80}>
              <article className="hover-lift flex h-full flex-col rounded-[2rem] bg-surface p-10 md:min-h-[300px]">
                <FeatureIcon name={m.icon} />
                <h2 className="type-title mt-auto pt-10 text-foreground">{m.title}</h2>
                <p className="mt-3 text-[17px] text-muted-foreground">{m.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-ink py-24 text-ink-foreground md:py-32">
        <span
          className="blob blob-teal left-[10%] top-[20%] -z-10 h-80 w-80 opacity-30"
          aria-hidden="true"
        />
        <span
          className="blob blob-navy bottom-0 right-[10%] -z-10 h-96 w-96 opacity-50 [animation-delay:-7s]"
          aria-hidden="true"
        />
        <div className="container-apple">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="type-eyebrow">Testimonials</p>
            <h2 className="type-headline mt-3">What our partners say.</h2>
          </Reveal>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {c.testimonials.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 100}>
                <figure className="glass-dark flex h-full flex-col rounded-[2rem] p-10 transition-transform duration-500 hover:-translate-y-1.5">
                  <Quote className="h-8 w-8 text-brand-teal" strokeWidth={1.5} />
                  <blockquote className="mt-6 text-[21px] leading-snug tracking-tight">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-4 pt-10">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-[15px] font-semibold">
                      {initials(t.name)}
                    </span>
                    <span>
                      <span className="block font-semibold">{t.name}</span>
                      <span className="block text-[15px] text-ink-muted">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Together, let's empower more students to achieve their dreams." />
    </>
  );
}
