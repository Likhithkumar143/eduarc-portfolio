import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Users,
  Map,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { PageIntro, SectionHeading, CtaBand } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceShowcase } from "@/components/site/DeviceShowcase";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Platform Capabilities — EDUARC Connect" },
      {
        name: "description",
        content:
          "Explore EDUARC's actual guidance capabilities: Stream & Degree Exploration, 1-on-1 Academic Mentorship, Institutional Reception & Tracking, and Student Roadmaps.",
      },
      { property: "og:title", content: "EDUARC Platform Capabilities" },
      {
        property: "og:description",
        content:
          "Authentic career guidance tools built for students, parents, and academic institutions.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/features" }],
  }),
  component: FeaturesPage,
});

const verifiedPlatformFeatures = [
  {
    icon: Compass,
    title: "Stream & Course Exploration",
    status: "Available Now",
    statusVariant: "gold" as const,
    lead: "Comprehensive 10th & 12th Options",
    description:
      "Detailed breakdowns of Science, Commerce, and Humanities streams, plus undergraduate degree paths, eligibility prerequisites, and realistic future careers.",
  },
  {
    icon: Users,
    title: "1-on-1 Academic Mentorship",
    status: "Available Now",
    statusVariant: "gold" as const,
    lead: "Verified University Educators",
    description:
      "Direct guidance sessions led by experienced academicians (such as Dr. Gayathri G N) to help students and parents evaluate academic choices together.",
  },
  {
    icon: Map,
    title: "Actionable Career Roadmaps",
    status: "Available Now",
    statusVariant: "gold" as const,
    lead: "Step-by-Step Educational Milestones",
    description:
      "Structured milestone mapping outlining required entrance examinations, admissions timelines, and skill preparations tailored to individual student interests.",
  },
  {
    icon: ShieldCheck,
    title: "Institutional Reception & Tracking",
    status: "Available Now",
    statusVariant: "gold" as const,
    lead: "School & College Staff Portal",
    description:
      "Secure administrative and reception tools for schools to organize student enquiries, update counselling statuses, and track batch guidance progress.",
  },
  {
    icon: Lock,
    title: "Data Privacy & Session Security",
    status: "Available Now",
    statusVariant: "gold" as const,
    lead: "Confidential Student Records",
    description:
      "Enterprise-grade Supabase security with role-based access control, cryptographic password hashing, and zero student data sharing with third parties.",
  },
  {
    icon: CheckCircle2,
    title: "Parent Consultation Framework",
    status: "Available Now",
    statusVariant: "gold" as const,
    lead: "Collaborative Family Planning",
    description:
      "Guidance formats structured to involve parents actively, demystifying new career options and fostering supportive decisions at home.",
  },
] as const;

function FeaturesPage() {
  const c = useSiteContent();

  return (
    <>
      {/* 1. Page Intro */}
      <PageIntro
        eyebrow="Platform Capabilities"
        title="Tools built for authentic guidance, not guesswork."
        lead={
          c.featuresPage.lead ||
          "A transparent ecosystem engineered to give students clarity, parents confidence, and institutions a structured guidance framework."
        }
      />

      {/* 2. Device Showcase Preview */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="container-apple">
          <DeviceShowcase />
        </div>
      </section>

      {/* 3. Core Verified Capabilities */}
      <section className="bg-surface py-20 md:py-28 border-y border-hairline">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Inside EDUARC"
            title="Core guidance tools available today."
            lead="Every capability described here is actively supported in the EDUARC platform and ready for student and institutional use."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {verifiedPlatformFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Reveal key={feat.title} delay={(i % 3) * 75}>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline bg-white p-7 shadow-xs hover-lift transition-all hover:border-brand-gold/40 hover:shadow-card">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant={feat.statusVariant}>{feat.status}</Badge>
                      </div>

                      <h3 className="text-lg font-bold text-brand-navy tracking-tight">
                        {feat.title}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-brand-gold">{feat.lead}</p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {feat.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-hairline flex items-center gap-1.5 text-xs text-brand-navy font-semibold">
                      <span>Included in All Programs</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Multi-device compatibility */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-apple text-center">
          <Reveal>
            <span className="type-eyebrow text-brand-gold">Responsive Experience</span>
            <h2 className="type-headline mt-3 text-brand-navy">Accessible on every device.</h2>
            <p className="type-lead mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
              Designed with Apple-inspired ergonomics for seamless use across mobile phones,
              tablets, laptops, and desktop computers.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {[
                { Icon: Smartphone, label: "Mobile" },
                { Icon: Tablet, label: "Tablet" },
                { Icon: Laptop, label: "Laptop" },
                { Icon: Monitor, label: "Desktop" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-surface text-brand-navy shadow-xs">
                    <Icon className="h-7 w-7 text-brand-navy" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Next Steps */}
      <CtaBand
        title="Experience the EDUARC guidance workflow."
        lead="Contact our team to preview student guidance materials or schedule an institutional demo for your faculty."
      />
    </>
  );
}
