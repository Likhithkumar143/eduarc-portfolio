import {
  BookOpen,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import studentJourneyBg from "@/assets/contact-guidance-bg.png";
import { PartnerForm } from "@/components/site/PartnerForm";
import { useSiteContent } from "@/lib/site-content";

export function PartnerContent() {
  const c = useSiteContent();

  const dynamicExpectations = [
    {
      icon: Users,
      title: c.partnerPage?.step1Title || "1. Dedicated Counsellor Contact",
      body:
        c.partnerPage?.step1Body ||
        "An academic coordinator will review your background and connect via phone or WhatsApp to understand your educational goals.",
    },
    {
      icon: BookOpen,
      title: c.partnerPage?.step2Title || "2. Focused Guidance Consultation",
      body:
        c.partnerPage?.step2Body ||
        "Explore stream opportunities, college options, and entrance timelines in a pressure-free, student-first consultation.",
    },
    {
      icon: ShieldCheck,
      title: c.partnerPage?.step3Title || "3. Absolute Privacy & Integrity",
      body:
        c.partnerPage?.step3Body ||
        "Your details remain confidential and are accessed exclusively by verified EDUARC counselling staff for educational planning.",
    },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-[#FAF9F5]">
      <main className="container-wide py-10 sm:py-14 lg:py-18">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.18fr] lg:items-start lg:gap-14 xl:gap-20">
          {/* Left Column: Context, Promises & Journey Artwork */}
          <div className="flex flex-col justify-between space-y-8 lg:space-y-10">
            {/* Header copy */}
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-[#F5F1E8] px-3.5 py-1.5 text-xs font-semibold text-[#B47A4B] border border-[#E2DBD0]">
                {c.partnerPage?.badge || "Student & Institutional Enquiries"}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-semibold tracking-tight text-brand-navy leading-[1.15]">
                {c.partnerPage?.title || "Start your guidance journey with EDUARC."}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-xl">
                {c.partnerPage?.lead ||
                  "Whether you are a student evaluating streams after Class 10 or 12, a parent seeking objective higher-education advice, or a school administrator planning a student guidance cohort."}
              </p>
            </div>

            {/* What to Expect After Submitting */}
            <div className="space-y-4 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/80">
                What to Expect After Submitting:
              </p>

              <div className="space-y-5">
                {dynamicExpectations.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#243B35] text-white shadow-xs">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium text-brand-navy">{item.title}</h3>
                        <p className="text-sm text-muted-foreground font-normal leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Journey Illustration with Floating Pathway Milestone Pills */}
            <div className="relative pt-1 select-none">
              <div className="relative rounded-2xl overflow-hidden bg-transparent">
                <img
                  src={studentJourneyBg}
                  alt="Student Guidance Journey towards Higher Education"
                  className="w-full h-auto object-cover max-h-[380px] sm:max-h-[440px]"
                />

                {/* Milestone 1: Higher Education */}
                <div className="absolute top-[30%] right-[14%] sm:right-[18%] flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-xs border border-hairline text-[11px] sm:text-xs font-bold text-brand-navy">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EDF3F0] text-[#243B35]">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                  <span>Higher Education</span>
                </div>

                {/* Milestone 2: Career Options */}
                <div className="absolute top-[50%] right-[6%] sm:right-[10%] flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-xs border border-hairline text-[11px] sm:text-xs font-bold text-brand-navy">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F5F1E8] text-[#B47A4B]">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <span>Career Options</span>
                </div>

                {/* Milestone 3: Your Future */}
                <div className="absolute top-[70%] right-[10%] sm:right-[14%] flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-xs border border-hairline text-[11px] sm:text-xs font-bold text-brand-navy">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EFF4EE] text-[#9AAB94]">
                    <Compass className="h-3.5 w-3.5" />
                  </div>
                  <span>Your Future</span>
                </div>
              </div>
            </div>

            {/* Bottom Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-hairline text-xs text-brand-navy font-semibold">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#243B35] shrink-0" />
                <span>Trusted by Students &amp; Families</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#243B35] shrink-0" />
                <span>Partnered with Schools &amp; Colleges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#243B35] shrink-0" />
                <span>Focused on Your Future</span>
              </div>
            </div>
          </div>

          {/* Right Column: Guidance Form Card */}
          <div className="lg:sticky lg:top-20">
            <PartnerForm />
          </div>
        </div>
      </main>
    </div>
  );
}

