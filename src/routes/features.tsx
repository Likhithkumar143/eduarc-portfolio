import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";
import featuresHeroImg from "@/assets/features-hero.jpg";
import { FeaturesContent } from "@/components/site/sections/FeaturesContent";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      {
        title: "EDUARC Features — 4-Pillar Career Guidance & Institutional Framework",
      },
      {
        name: "description",
        content:
          "Explore EDUARC's 4-pillar methodology: Aptitude Assessment, Tailored Roadmaps, Verified Faculty Mentorship, and Institutional Success Cohorts for schools and PU colleges.",
      },
      {
        name: "keywords",
        content:
          "career guidance framework, student psychometric assessment, career roadmaps, institutional mentorship programs, school workshop framework, PU college guidance, higher education consulting",
      },
      {
        property: "og:title",
        content: "EDUARC Features — Comprehensive Career Guidance Framework",
      },
      {
        property: "og:description",
        content:
          "Structured partnership features and student guidance methodology for schools, PU colleges, and universities across India.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/features" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/features" }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const c = useSiteContent();

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* 1. Hero Section - Sleek, Borderless Hero Banner with Features Hero Image */}
      <section className="relative overflow-hidden bg-[#F5F1E8] border-b border-hairline/80 min-h-[340px] sm:min-h-[360px] lg:h-[360px] xl:h-[380px] flex items-end lg:items-center">
        {/* Desktop & Laptop Illustration: Aligned directly to bottom-right flush with bottom border */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 pointer-events-none select-none z-0 items-end justify-end">
          <img
            src={featuresHeroImg}
            alt="EDUARC Institutional Students Learning Together"
            className="h-full w-auto max-w-none object-contain object-right-bottom block select-none pointer-events-none"
          />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-8 sm:pt-12 sm:pb-10 lg:py-0 max-w-xl lg:max-w-lg xl:max-w-xl text-center sm:text-left">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-3 block">
                INSTITUTIONAL FEATURES
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#243B35] tracking-tight leading-[1.15]">
                Structured features for{" "}
                <span className="text-[#243B35]">
                  schools and colleges.
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                {c.featuresPage?.lead ||
                  "Designed to guide, support and empower students — and give institutions full visibility."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                <Button
                  asChild
                  className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-5 py-2.5 h-10 shadow-xs gap-1.5 cursor-pointer"
                >
                  <Link to="/partner">
                    <span>Request Institutional Proposal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#243B35] bg-transparent hover:bg-[#243B35]/10 text-[#243B35] text-xs font-medium px-4 py-2.5 h-10 cursor-pointer"
                >
                  <Link to="/contact">Speak with Partnerships Team</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Mobile & Tablet Illustration: rendered in-flow flush at the bottom edge */}
          <div className="lg:hidden relative w-full flex items-end justify-center pt-2 overflow-hidden">
            <img
              src={featuresHeroImg}
              alt="EDUARC Institutional Students Learning Together"
              className="h-[180px] sm:h-[220px] md:h-[260px] w-auto max-w-full object-contain object-bottom block select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* REUSABLE FEATURES CONTENT */}
      <FeaturesContent />

      {/* 7. Institutional Bottom CTA Banner */}
      <section className="py-16 md:py-24 bg-[#FAF9F5]">
        <div className="container-apple">
          <div className="rounded-2xl bg-[#F5F1E8] border border-hairline p-8 sm:p-12 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3 text-center sm:text-left">
                <span className="text-[11px] font-bold tracking-wider text-[#B47A4B] uppercase block">
                  LET'S WORK TOGETHER
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243B35] tracking-tight">
                  Partner with EDUARC
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                  Let's build brighter futures for your students, together.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                  <Button
                    asChild
                    className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-5 py-2.5 h-10 shadow-xs gap-1.5 cursor-pointer"
                  >
                    <Link to="/partner">
                      <span>Request Institutional Proposal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-[#243B35] bg-transparent hover:bg-[#243B35]/10 text-[#243B35] text-xs font-medium px-4 py-2.5 h-10 cursor-pointer"
                  >
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right Side Callout Script Artifact */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div className="text-center sm:text-left rotate-[-2deg] p-4 rounded-xl bg-white border border-hairline shadow-xs">
                  <p className="font-serif italic font-bold text-[#243B35] text-sm sm:text-base leading-tight tracking-wide">
                    Better Guidance
                    <br />
                    <span className="text-[#B47A4B]">Brighter Futures</span>
                  </p>
                  <svg
                    className="w-20 sm:w-24 h-3 text-[#B47A4B] stroke-current mt-1 mx-auto sm:mx-0"
                    viewBox="0 0 100 12"
                    fill="none"
                  >
                    <path d="M2,8 Q50,2 98,6" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
