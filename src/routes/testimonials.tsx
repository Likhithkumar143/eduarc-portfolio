import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { useSiteContent } from "@/lib/site-content";
import heroBannerImg from "@/assets/testimoials hero banner.jpg";
import { TestimonialsContent } from "@/components/site/sections/TestimonialsContent";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "EDUARC Testimonials — Real Stories. Brighter Futures." },
      {
        name: "description",
        content:
          "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs and workshops.",
      },
      { property: "og:title", content: "EDUARC Testimonials — Real Stories. Brighter Futures." },
      {
        property: "og:description",
        content:
          "Real feedback and reviews from students, parents, and school partners who achieved career clarity with EDUARC.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const c = useSiteContent();

  const pageContent = c.testimonialsPage || {
    badge: "TESTIMONIALS",
    title: "Real Stories.",
    titleHighlight: "Brighter Futures.",
    lead: "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs.",
    calloutLine1: "Better Guidance",
    calloutLine2: "Brighter Futures",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Section - Sleek, Borderless Hero Banner matching Features Hero layout */}
      <section className="relative overflow-hidden bg-[#F2F7FD] border-b border-slate-200/60 min-h-[340px] sm:min-h-[360px] lg:h-[360px] xl:h-[380px] flex items-end lg:items-center">
        {/* Desktop Illustration: Aligned directly to bottom-right flush with bottom border */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 pointer-events-none select-none z-0 items-end justify-end">
          <img
            src={heroBannerImg}
            alt="EDUARC Testimonials Student"
            className="h-full w-auto max-w-none object-contain object-right-bottom block select-none pointer-events-none"
          />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-8 sm:pt-12 sm:pb-10 lg:py-0 max-w-xl lg:max-w-lg xl:max-w-xl text-center sm:text-left">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-3 block">
                {pageContent.badge || "TESTIMONIALS"}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
                {pageContent.title} <br className="hidden sm:inline" />
                <span className="text-[#0F172A]">{pageContent.titleHighlight}</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                {pageContent.lead}
              </p>
            </Reveal>
          </div>

          {/* Mobile & Tablet Illustration: rendered in-flow flush at the bottom edge */}
          <div className="lg:hidden relative w-full flex items-end justify-center pt-2 overflow-hidden">
            <img
              src={heroBannerImg}
              alt="EDUARC Testimonials Student"
              className="h-[180px] sm:h-[220px] md:h-[260px] w-auto max-w-full object-contain object-bottom block select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* REUSABLE TESTIMONIALS CONTENT */}
      <TestimonialsContent />
    </div>
  );
}
