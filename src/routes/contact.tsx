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
      {/* 1. Hero Section - Structured 2-Column Academic Layout */}
      <section className="relative overflow-hidden bg-[#F5F1E8] border-b border-hairline/80 py-10 sm:py-14 lg:py-16">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Academic Brand Copy */}
            <div className="lg:col-span-7 text-center sm:text-left">
              <span className="text-xs font-semibold tracking-wider text-[#B47A4B] uppercase mb-3 block">
                {contactPage.badge || "Get in Touch"}
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-semibold text-[#243B35] tracking-tight leading-[1.2] sm:leading-[1.15]">
                Let's build a brighter <br />
                future together.
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#343A36] max-w-xl mx-auto sm:mx-0 font-normal leading-relaxed">
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
            </div>

            {/* Right Column: Framed Editorial Showcase Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-hairline shadow-lift bg-white">
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={counselorHeroBg}
                    alt="EDUARC Educational Guidance and Counselling"
                    className="h-full w-full object-cover object-[88%_center]"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REUSABLE CONTACT CONTENT */}
      <ContactContent />
    </div>
  );
}
