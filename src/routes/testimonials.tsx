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
      <section className="relative overflow-hidden bg-[#F5F1E8] border-b border-hairline/80 py-10 sm:py-14 lg:py-16">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Academic Brand Copy */}
            <div className="lg:col-span-7 text-center sm:text-left">
              <span className="text-xs font-semibold tracking-wider text-[#B47A4B] uppercase mb-3 block">
                {pageContent.badge || "TESTIMONIALS"}
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-semibold text-[#243B35] tracking-tight leading-[1.18] sm:leading-[1.15]">
                {pageContent.title} <br />
                <span className="text-[#B47A4B]">{pageContent.titleHighlight}</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#343A36] max-w-xl mx-auto sm:mx-0 font-normal leading-relaxed">
                {pageContent.lead}
              </p>
            </div>

            {/* Right Column: Framed Editorial Showcase Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-hairline shadow-lift bg-white">
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={heroBannerImg}
                    alt="EDUARC Testimonials Student"
                    className="h-full w-full object-cover object-[92%_center]"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REUSABLE TESTIMONIALS CONTENT */}
      <TestimonialsContent />
    </div>
  );
}
