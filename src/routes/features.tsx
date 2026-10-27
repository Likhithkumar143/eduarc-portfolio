import { createFileRoute } from "@tanstack/react-router";
import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import { PageIntro, SectionHeading, CtaBand, GradientText } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FeatureIcon } from "@/components/site/icons";
import { DeviceShowcase } from "@/components/site/DeviceShowcase";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Platform Features — EduArc" },
      {
        name: "description",
        content:
          "Career roadmaps, mentor sessions, progress tracking, certificates, notifications and an admin dashboard — on every device.",
      },
      { property: "og:title", content: "EduArc Platform Features" },
      {
        property: "og:description",
        content: "A complete ecosystem designed to guide, support and empower every student.",
      },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const c = useSiteContent();
  return (
    <>
      <PageIntro
        eyebrow="Key features"
        title={
          <>
            {c.featuresPage.title} <GradientText>{c.featuresPage.titleHighlight}</GradientText>
          </>
        }
        lead={c.featuresPage.lead}
      />

      <section className="bg-background pb-32">
        <div className="container-apple animate-zoom-in [animation-delay:250ms]">
          <DeviceShowcase />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
        <span
          className="blob blob-teal right-0 top-10 -z-10 h-96 w-96 opacity-20"
          aria-hidden="true"
        />
        <div className="container-apple">
          <SectionHeading eyebrow="Inside EduArc" title="Our platform features." />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.map((f, i) => (
              <Reveal key={f.title + i} delay={(i % 3) * 80}>
                <article className="glass hover-lift h-full rounded-3xl p-8">
                  <FeatureIcon name={f.icon} />
                  <h3 className="mt-7 text-[21px] font-semibold tracking-tight text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[17px] text-muted-foreground">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <Reveal className="container-apple text-center">
          <h2 className="type-headline text-foreground">{c.featuresPage.devicesTitle}</h2>
          <p className="type-lead mx-auto mt-5 max-w-xl text-muted-foreground">
            {c.featuresPage.devicesLead}
          </p>
          <div className="mt-12 flex items-end justify-center gap-10 text-brand md:gap-16">
            {[
              { Icon: Smartphone, label: "Mobile" },
              { Icon: Tablet, label: "Tablet" },
              { Icon: Laptop, label: "Laptop" },
              { Icon: Monitor, label: "Desktop" },
            ].map(({ Icon, label }, i) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <Icon
                  className={
                    "h-10 w-10 md:h-12 md:w-12 " +
                    (i % 2 ? "animate-float" : "animate-float-delayed")
                  }
                  strokeWidth={1.25}
                />
                <span className="text-[13px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
