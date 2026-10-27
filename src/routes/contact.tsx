import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Mail, Phone } from "lucide-react";
import logoUrl from "@/assets/eduarc-logo.png";
import { PageIntro, GradientText, AmbientBlobs } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { phoneHref, websiteHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EduArc — Partner With Us" },
      {
        name: "description",
        content:
          "Partner with EduArc to bring career guidance and mentorship to your school or college.",
      },
      { property: "og:title", content: "Contact EduArc — Let's Build a Brighter Future" },
      {
        property: "og:description",
        content: "Get in touch to bring EduArc to your school or college.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const c = useSiteContent();
  const channels = [
    { Icon: Mail, label: "Email", value: c.contact.email, href: `mailto:${c.contact.email}` },
    { Icon: Phone, label: "Phone", value: c.contact.phone, href: phoneHref(c.contact.phone) },
    {
      Icon: Globe,
      label: "Website",
      value: c.contact.website,
      href: websiteHref(c.contact.website),
    },
  ];

  return (
    <>
      <PageIntro
        eyebrow="Next steps"
        title={
          <>
            {c.contactPage.title} <GradientText>{c.contactPage.titleHighlight}</GradientText>
          </>
        }
        lead={c.contactPage.lead}
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button asChild variant="pill" size="pill">
            <Link to="/partner">Partner with us</Link>
          </Button>
          <Button asChild variant="text-link" size="inline">
            <a href={`mailto:${c.contact.email}?subject=EduArc%20partnership%20enquiry`}>
              Email us <ArrowRight />
            </a>
          </Button>
        </div>
      </PageIntro>

      <section className="bg-background pb-24 md:pb-32">
        <div className="container-apple grid gap-5 md:grid-cols-3">
          {channels.map(({ Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 80}>
              <a
                href={href}
                className="glass hover-lift group flex h-full flex-col rounded-[2rem] p-9"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-brand transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="mt-8 text-[15px] text-muted-foreground">{label}</span>
                <span className="mt-1 break-words text-[21px] font-semibold tracking-tight text-foreground group-hover:text-link">
                  {value}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
        <AmbientBlobs className="opacity-60" />
        <Reveal className="container-apple text-center">
          <img
            src={logoUrl}
            alt="EduArc — Ambitious to Achievement"
            width={220}
            height={220}
            loading="lazy"
            className="animate-float mx-auto h-44 w-44 md:h-52 md:w-52"
          />
          <h2 className="type-hero mt-8 text-foreground">Thank you.</h2>
          <p className="type-lead mx-auto mt-4 max-w-xl text-muted-foreground">
            {c.contactPage.thankYou}
          </p>
        </Reveal>
      </section>
    </>
  );
}
