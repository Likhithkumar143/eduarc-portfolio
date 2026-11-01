import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, UserCheck } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import counselorHeroBg from "@/assets/contact-hero-counselor-hd.jpg";
import { useSiteContent } from "@/lib/site-content";
import { ContactContent } from "@/components/site/sections/ContactContent";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EDUARC — Academic Consultation, Phone, WhatsApp & Office" },
      {
        name: "description",
        content:
          "Have questions about career guidance or institutional partnerships? Reach out to EDUARC via direct call (+91 98765 43210), email, WhatsApp, or visit our Bengaluru campus.",
      },
      {
        name: "keywords",
        content:
          "contact EDUARC, career counsellor Bangalore phone, student counselling WhatsApp, career guidance office Bengaluru, partnerships@eduarc.in, Karnataka education support",
      },
      { property: "og:title", content: "Contact EDUARC — Multiple Ways to Reach Us" },
      {
        property: "og:description",
        content:
          "We're here to help students, parents, and educational institutions across India. Connect with EDUARC today.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/contact" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { contactPage } = useSiteContent();

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* 1. Hero Section - Sleek, Borderless Hero Banner matching Features Hero layout */}
      <section className="relative overflow-hidden bg-[#F5F1E8] border-b border-hairline/80 min-h-[340px] sm:min-h-[360px] lg:h-[360px] xl:h-[380px] flex items-end lg:items-center">
        {/* Desktop Illustration: Aligned directly to bottom-right flush with bottom border */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 pointer-events-none select-none z-0 items-end justify-end">
          <img
            src={counselorHeroBg}
            alt="EDUARC Educational Guidance and Counselling"
            className="h-full w-auto max-w-none object-contain object-right-bottom block select-none pointer-events-none"
          />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-8 sm:pt-12 sm:pb-10 lg:py-0 max-w-xl lg:max-w-lg xl:max-w-xl text-center sm:text-left">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-[#B47A4B] uppercase mb-3 block">
                {contactPage.badge || "Get in Touch"}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#243B35] tracking-tight leading-[1.15]">
                {contactPage.title} <br className="hidden sm:inline" />
                {contactPage.titleHighlight}
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-700 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                {contactPage.lead}
              </p>

              {/* 3 Value Pills */}
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hairline shadow-xs text-xs font-semibold text-slate-700">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF3F0] text-[#243B35]">
                    <MessageCircle className="w-3 h-3" />
                  </span>
                  {contactPage.pill1 || "Quick Response"}
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hairline shadow-xs text-xs font-semibold text-slate-700">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF3F0] text-[#243B35]">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                  {contactPage.pill2 || "Dedicated Support"}
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-hairline shadow-xs text-xs font-semibold text-slate-700">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF3F0] text-[#243B35]">
                    <UserCheck className="w-3 h-3" />
                  </span>
                  {contactPage.pill3 || "Real People"}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Mobile & Tablet Illustration: rendered in-flow flush at the bottom edge */}
          <div className="lg:hidden relative w-full flex items-end justify-center pt-2 overflow-hidden">
            <img
              src={counselorHeroBg}
              alt="EDUARC Educational Guidance and Counselling"
              className="h-[180px] sm:h-[220px] md:h-[260px] w-auto max-w-full object-contain object-bottom block select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* REUSABLE CONTACT CONTENT */}
      <ContactContent />
    </div>
  );
}
