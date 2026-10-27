import { createFileRoute } from "@tanstack/react-router";
import { PartnerForm } from "@/components/site/PartnerForm";
import { AmbientBlobs, GradientText } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { CalendarCheck, MessageCircle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner with EduArc — Share Your Details" },
      {
        name: "description",
        content:
          "Share your details with EduArc and our counsellors will contact you for career guidance.",
      },
      { property: "og:title", content: "Partner with EduArc" },
      {
        property: "og:description",
        content: "Share your details and an EduArc counsellor will reach out to guide you.",
      },
    ],
  }),
  component: PartnerPage,
});

const promises = [
  {
    Icon: MessageCircle,
    title: "We call or WhatsApp you",
    body: "A counsellor reaches out on the number you share.",
  },
  {
    Icon: CalendarCheck,
    title: "Guidance session",
    body: "Talk through your goals, options and next steps.",
  },
  {
    Icon: ShieldCheck,
    title: "Your details stay private",
    body: "Only the EduArc team can see what you submit.",
  },
];

function PartnerPage() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-soft">
      <AmbientBlobs />
      <div className="container-apple grid gap-12 pb-24 pt-20 md:pb-32 md:pt-28 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        <div className="animate-rise lg:sticky lg:top-28">
          <p className="type-eyebrow">Partner with us</p>
          <h1 className="type-hero mt-4 text-foreground">
            Start your journey <GradientText>with EduArc.</GradientText>
          </h1>
          <p className="type-lead mt-6 max-w-xl text-muted-foreground">
            Fill in your details and our counselling team will get in touch to help you plan your
            next step.
          </p>
          <ul className="mt-10 space-y-5">
            {promises.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 80}>
                <li className="flex gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-brand">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-[17px] font-semibold tracking-tight text-foreground">
                      {title}
                    </span>
                    <span className="block text-[15px] text-muted-foreground">{body}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="animate-zoom-in [animation-delay:150ms]">
          <PartnerForm />
        </div>
      </div>
    </section>
  );
}
