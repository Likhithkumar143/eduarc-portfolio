import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { useSiteContent } from "@/lib/site-content";
import heroBannerImg from "@/assets/testimoials hero banner.jpg";
import { TestimonialsContent } from "@/components/site/sections/TestimonialsContent";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Student & Parent Reviews — EDUARC Testimonials | Real Stories" },
      {
        name: "description",
        content:
          "Read verified reviews and feedback from students, parents, and educators on how EDUARC's career guidance sessions helped them choose the right academic direction with confidence.",
      },
      {
        name: "keywords",
        content:
          "EDUARC reviews, student testimonials, parent feedback, career guidance ratings, school partner reviews, education mentorship feedback, career counselling reviews Bangalore",
      },
      {
        property: "og:title",
        content: "EDUARC Testimonials — Real Stories. Brighter Futures.",
      },
      {
        property: "og:description",
        content:
          "Real feedback and reviews from students, parents, and school partners who achieved career clarity with EDUARC.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/testimonials" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
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
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* 1. Hero Section - Structured 2-Column Academic Layout */}
      {/* 1. Hero Section - Full-Bleed Edge-to-Edge Academic Hero Banner */}
      <section className="relative overflow-hidden bg-[#F2F7FD] border-b border-hairline/80 min-h-[380px] sm:min-h-[420px] lg:h-[440px] xl:h-[480px] flex items-center">
        {/* Desktop & Tablet Background Banner: Edge-to-edge horizontally, locked right-bottom with left fade */}
        <div className="hidden sm:block absolute inset-y-0 right-0 h-full w-full pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={heroBannerImg}
            alt="EDUARC Testimonials Student"
            className="h-full w-full object-cover object-right-bottom block"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, transparent 12%, black 38%, black 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 12%, black 38%, black 100%)",
            }}
          />
          {/* Subtle gradient behind text to guarantee contrast across all viewports */}
          <div className="absolute inset-y-0 left-0 w-[55%] md:w-[50%] lg:w-[45%] bg-gradient-to-r from-[#F2F7FD] via-[#F2F7FD]/90 to-transparent pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-4 sm:py-14 md:py-16 lg:py-20 max-w-xl text-center sm:text-left">
            <span className="text-xs font-semibold tracking-wider text-[#B47A4B] uppercase mb-3 block">
              {pageContent.badge || "TESTIMONIALS"}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-semibold text-[#243B35] tracking-tight leading-[1.18] sm:leading-[1.15]">
              {pageContent.title} <br />
              <span className="text-[#B47A4B]">{pageContent.titleHighlight}</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#343A36] max-w-lg mx-auto sm:mx-0 font-normal leading-relaxed">
              {pageContent.lead}
            </p>
          </div>

          {/* Mobile View: edge-to-edge horizontally, locked right-bottom, left empty space faded */}
          <div className="sm:hidden relative w-[calc(100%+2rem)] -mx-4 h-[250px] overflow-hidden mt-4">
            <img
              src={heroBannerImg}
              alt="EDUARC Testimonials Student"
              className="h-full w-full object-cover object-right-bottom block"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 100%)",
              }}
            />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F2F7FD] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* REUSABLE TESTIMONIALS CONTENT */}
      <TestimonialsContent />
    </div>
  );
}
