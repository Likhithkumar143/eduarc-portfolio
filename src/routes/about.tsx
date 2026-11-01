import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";
import aboutHeroImg from "@/assets/about-hero.jpg";
import { AboutContent } from "@/components/site/sections/AboutContent";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery({ ...siteContentQuery, staleTime: 0 });
  },
  head: () => ({
    meta: [
      { title: "About EDUARC — Educational Mentorship, Vision & Guidance Philosophy" },
      {
        name: "description",
        content:
          "Discover EDUARC's mission to bridge education with career achievement through structured roadmaps, experienced academic faculty, and holistic student guidance in India.",
      },
      {
        name: "keywords",
        content:
          "about EDUARC, education guidance philosophy, student career mentorship, career counselling Bangalore, school education consultants, academic advisory India, Ambitious to Achievement",
      },
      {
        property: "og:title",
        content: "About EDUARC — Empowering Students to Discover Their Future",
      },
      {
        property: "og:description",
        content:
          "Connect with expert academic mentors, unpack career possibilities, and build actionable milestone plans with EDUARC.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/about" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const c = useSiteContent();

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          Empowering Students to Discover Their Future
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#F5F1E8] border-b border-hairline/80 min-h-[340px] sm:min-h-[360px] lg:h-[360px] xl:h-[380px] flex items-end lg:items-center">
        {/* Desktop & Laptop Illustration: Aligned directly to bottom-right flush with bottom border */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 pointer-events-none select-none z-0 items-end justify-end">
          <img
            src={aboutHeroImg}
            alt="Empowering Students to Discover Their Future"
            className="h-full w-auto max-w-none object-contain object-right-bottom block select-none pointer-events-none"
          />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-8 sm:pt-12 sm:pb-10 lg:py-0 max-w-xl lg:max-w-lg xl:max-w-xl text-center sm:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-3 justify-center sm:justify-start">
                <span className="w-6 h-[2.5px] bg-[#B47A4B] inline-block rounded-full" />
                <span className="text-xs font-bold tracking-wider text-[#243B35]/70 uppercase">
                  About EduArc
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#243B35] tracking-tight leading-[1.15]">
                Empowering Students <br className="hidden sm:inline" />
                to Discover <span className="text-[#B47A4B]">Their Future.</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                {c.about?.lead ||
                  "EduArc is a career guidance platform designed to help students make informed decisions about their future. We provide the right guidance, resources and support to turn your dreams into achievable goals."}
              </p>
            </Reveal>
          </div>

          {/* Mobile & Tablet Illustration: rendered in-flow flush at the bottom edge */}
          <div className="lg:hidden relative w-full flex items-end justify-center pt-2 overflow-hidden">
            <img
              src={aboutHeroImg}
              alt="Empowering Students to Discover Their Future"
              className="h-[180px] sm:h-[220px] md:h-[260px] w-auto max-w-full object-contain object-bottom block select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* REUSABLE ABOUT CONTENT SECTIONS 2 THROUGH 6 */}
      <AboutContent />

      {/* =========================================================================
          SECTION 7: BOTTOM CTA BANNER
          Your Future Starts With The Right Guidance.
         ========================================================================= */}
      <section className="bg-[#EDF3F0] border-t border-hairline py-8 sm:py-10">
        <div className="container-apple">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
              {/* Paper Airplane & Headline */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-[#B47A4B]">
                  <Send className="w-6 h-6 rotate-[-20deg]" />
                </div>

                <div className="hidden sm:block h-9 w-[1px] bg-[#E2DBD0]" />

                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#243B35] tracking-tight leading-snug">
                    Your Future Starts With <br className="hidden sm:inline" />
                    The <span className="text-[#B47A4B]">Right Guidance.</span>
                  </h3>
                </div>
              </div>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
                Join EduArc today and take the first step towards a successful career.
              </p>

              {/* Action Button */}
              <Button
                asChild
                className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-xs font-semibold px-6 py-2.5 h-10 shadow-xs shrink-0 gap-2 cursor-pointer"
              >
                <Link to="/partner">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
