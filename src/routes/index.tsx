import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowRight,
  Compass,
  Map,
  Users,
  GraduationCap,
  Sparkles,
  CalendarCheck,
} from "lucide-react";
import heroImg from "@/assets/hero-students-clean.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { GradientText, SectionHeading } from "@/components/site/Section";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";

// Reused Content Sections from existing pages
import { AboutContent } from "@/components/site/sections/AboutContent";
import { FeaturesContent } from "@/components/site/sections/FeaturesContent";
import { TestimonialsContent } from "@/components/site/sections/TestimonialsContent";
import { ContactContent } from "@/components/site/sections/ContactContent";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery({ ...siteContentQuery, staleTime: 0 });
  },
  head: () => ({
    meta: [
      {
        title: "EDUARC — Career Guidance & Education Support Platform | Ambitious to Achievement",
      },
      {
        name: "description",
        content:
          "Career guidance and education support platform for schools, colleges, and students across India. Structured career roadmaps, verified academic mentorship, and future-ready planning.",
      },
      {
        name: "keywords",
        content:
          "EDUARC, career guidance, education support, career counselling Bangalore, student mentorship India, school guidance workshops, college admission guidance, stream selection after 10th, career planning after 12th, Karnataka education consultancy",
      },
      {
        property: "og:title",
        content: "EDUARC — Career Guidance & Education Support Platform",
      },
      {
        property: "og:description",
        content:
          "Structured career roadmaps, verified academic mentorship, and education support for schools, colleges, and students across India.",
      },
      { property: "og:url", content: "https://eduarc-connect.in" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { property: "og:image:width", content: "1600" },
      { property: "og:image:height", content: "1008" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in" }],
  }),
  component: Index,
});

function Index() {
  const c = useSiteContent();

  const studentJourneySteps = [
    {
      step: "01",
      title: c.home.step1Title || "Discover",
      subtitle: c.home.step1Subtitle || "Identify Strengths & Interests",
      description:
        c.home.step1Desc ||
        "Clarify academic interests, natural strengths, and subjects that inspire genuine curiosity before making critical stream choices.",
      icon: Compass,
    },
    {
      step: "02",
      title: c.home.step2Title || "Explore",
      subtitle: c.home.step2Subtitle || "Unpack Real Career Paths",
      description:
        c.home.step2Desc ||
        "Evaluate Science, Commerce, Arts, and emerging degree options with realistic information on course contents and higher-ed requirements.",
      icon: Map,
    },
    {
      step: "03",
      title: c.home.step3Title || "Connect",
      subtitle: c.home.step3Subtitle || "Verified Academic Mentorship",
      description:
        c.home.step3Desc ||
        "Discuss choices with experienced academicians and career counsellors who provide unbiased, supportive advice for students and parents.",
      icon: Users,
    },
    {
      step: "04",
      title: c.home.step4Title || "Progress",
      subtitle: c.home.step4Subtitle || "Actionable Educational Milestones",
      description:
        c.home.step4Desc ||
        "Build a step-by-step academic plan with timelines, skill benchmarks, and clear criteria for next-stage admissions and preparations.",
      icon: GraduationCap,
    },
  ];

  const audiencePathways = [
    {
      badge: "Students & Parents",
      title: c.home.pathway1Title || "Clarity over Confusion",
      description:
        c.home.pathway1Desc ||
        "Avoid stream regrets after Class 10 or 12. Receive structured guidance to choose courses confidently with full family alignment.",
      cta: "Request Guidance",
      targetSection: undefined,
      routeTo: "/partner" as const,
      highlight: "Class 10 & 12 Focus",
    },
    {
      badge: "Schools & Colleges",
      title: c.home.pathway2Title || "Institutional Guidance Hub",
      description:
        c.home.pathway2Desc ||
        "Equip your institution with systematic career guidance workshops, mentor sessions, and structured tracking for every student batch.",
      cta: "Explore Features",
      targetSection: "features",
      routeTo: undefined,
      highlight: "Partner Onboarding",
    },
    {
      badge: "Academic Mentors",
      title: c.home.pathway3Title || "Verified Mentorship Network",
      description:
        c.home.pathway3Desc ||
        "Connect certified educators and domain specialists with young minds seeking genuine academic direction and industry perspective.",
      cta: "View Directory",
      targetSection: undefined,
      routeTo: "/mentors" as const,
      highlight: "Credential-Backed",
    },
  ];

  // Scroll to hash on mount or hash change
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="relative">
      {/* =========================================================================
          1. HOME / HERO SECTION
         ========================================================================= */}
      <section id="hero" className="scroll-mt-16">
        {/* Above the fold Hero */}
        <div className="relative isolate overflow-hidden bg-gradient-soft pt-12 pb-16 md:pt-16 md:pb-20 border-b border-hairline/70">
          <div className="container-apple text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold-border bg-brand-gold-soft/80 px-3.5 py-1 text-xs font-semibold text-brand-navy shadow-xs mb-6">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
              <span>{c.home.eyebrow || "Ambitious to Achievement"}</span>
            </div>

            <h1 className="type-hero mx-auto max-w-4xl text-brand-navy font-bold tracking-tight">
              {c.home.title}{" "}
              <GradientText>{c.home.titleHighlight || "brighter future."}</GradientText>
            </h1>

            <p className="type-lead mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed">
              {c.home.lead}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                asChild
                variant="pill-gold"
                size="pill"
                className="w-full sm:w-auto justify-center cursor-pointer"
              >
                <Link to="/partner">Get Career Guidance</Link>
              </Button>
              <Button
                asChild
                variant="pill-outline"
                size="pill"
                className="w-full sm:w-auto justify-center cursor-pointer"
              >
                <Link to="/programs" className="gap-2 justify-center">
                  <span>Explore Programs</span>
                  <ArrowRight className="h-4 w-4 text-brand-gold" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="container-wide relative mt-8 md:mt-12 flex justify-center">
            <div className="relative w-fit max-w-full rounded-2xl overflow-hidden border border-border shadow-lift bg-[#E8E0D1]/20">
              <img
                src={heroImg}
                alt="High school and college students collaborating with notebooks and laptop on campus"
                width={1264}
                height={848}
                className="block h-auto w-auto max-w-full max-h-[min(540px,68vh)] rounded-2xl object-contain"
                loading="eager"
              />

              {/* Floating badge 1 */}
              <div className="bg-[#FAF9F5] absolute left-3 top-3 sm:left-5 sm:top-5 hidden sm:flex items-center gap-2.5 sm:gap-3 rounded-xl p-2.5 sm:p-3 border border-border shadow-xs">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-brand-forest text-brand-gold shrink-0">
                  <Map className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs font-semibold text-brand-forest">
                    {c.home.badge1Title || "Tailored Direction"}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                    {c.home.badge1Subtitle || "Class 10 to College Pathways"}
                  </p>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="bg-[#FAF9F5] absolute right-3 bottom-3 sm:right-5 sm:bottom-5 hidden sm:flex items-center gap-2.5 sm:gap-3 rounded-xl p-2.5 sm:p-3 border border-border shadow-xs">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-brand-gold-soft border border-brand-gold-border text-brand-forest shrink-0">
                  <CalendarCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-brand-gold" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs font-semibold text-brand-forest">
                    {c.home.badge2Title || "Verified Mentorship"}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                    {c.home.badge2Subtitle || "Dedicated Academic Guidance"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Four-Step Student Journey */}
        <div className="py-20 md:py-28 bg-background">
          <div className="container-apple">
            <SectionHeading
              eyebrow={c.home.journeyEyebrow || "The Student Journey"}
              title={c.home.journeyTitle || "Four intentional steps from confusion to clarity."}
              lead={c.home.journeyLead || "We guide students through a structured methodology that replaces guesswork with verified academic insights."}
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {studentJourneySteps.map((stepItem, idx) => {
                const Icon = stepItem.icon;
                return (
                  <Reveal key={stepItem.step} delay={idx * 60}>
                    <div className="group h-full rounded-2xl border border-hairline bg-surface/70 p-7 hover-lift transition-all hover:bg-white hover:border-brand-gold/40 hover:shadow-card">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-widest text-brand-gold font-mono">
                          {stepItem.step}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-brand-gold transition-transform group-hover:scale-105">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="mt-5 text-xl font-bold tracking-tight text-brand-navy">
                        {stepItem.title}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-brand-gold">
                        {stepItem.subtitle}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {stepItem.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Audience Pathways */}
        <div className="py-20 md:py-28 bg-surface border-y border-hairline/80">
          <div className="container-apple">
            <SectionHeading
              eyebrow={c.home.pathwaysEyebrow || "Tailored Solutions"}
              title={c.home.pathwaysTitle || "Guidance designed for your educational context."}
              lead={c.home.pathwaysLead || "Whether you are a student planning your next academic milestone or an institution structuring guidance for hundreds."}
            />

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {audiencePathways.map((path, i) => (
                <Reveal key={path.title} delay={i * 80}>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-8 shadow-card hover-lift">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="gold">{path.badge}</Badge>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {path.highlight}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy tracking-tight">
                        {path.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-hairline">
                      <Button
                        asChild
                        variant="pill-outline"
                        size="sm"
                        className="w-full justify-between"
                      >
                        {path.targetSection ? (
                          <a
                            href={`#${path.targetSection}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleScrollTo(path.targetSection!);
                            }}
                            className="flex items-center justify-between w-full"
                          >
                            <span>{path.cta}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-brand-gold" />
                          </a>
                        ) : path.routeTo ? (
                          <Link to={path.routeTo}>
                            <span>{path.cta}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-brand-gold" />
                          </Link>
                        ) : null}
                      </Button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ABOUT EDUARC SECTION
         ========================================================================= */}
      <section id="about" className="scroll-mt-16">
        <AboutContent />
      </section>

      {/* =========================================================================
          3. FEATURES & BENEFITS SECTION
         ========================================================================= */}
      <section id="features" className="scroll-mt-16">
        <FeaturesContent />
      </section>

      {/* =========================================================================
          4. CONTACT US SECTION
         ========================================================================= */}
      <section id="contact" className="scroll-mt-16">
        <ContactContent />
      </section>

      {/* =========================================================================
          5. TESTIMONIALS SECTION
         ========================================================================= */}
      <section id="testimonials" className="scroll-mt-16">
        <TestimonialsContent />
      </section>
    </div>
  );
}
