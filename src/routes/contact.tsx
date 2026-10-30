import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Compass,
  Facebook,
  Globe,
  GraduationCap,
  Headphones,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
  Youtube,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import counselorHeroBg from "@/assets/contact-hero-counselor-hd.jpg";
import { phoneHref, websiteHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EDUARC — Let’s Build Brighter Futures Together" },
      {
        name: "description",
        content:
          "Have questions, feedback, or want to collaborate with EDUARC? Reach out via phone, email, WhatsApp, or connect on our social channels.",
      },
      { property: "og:title", content: "Contact EDUARC — Multiple Ways to Reach Us" },
      {
        property: "og:description",
        content:
          "We're here to help students, parents, and educational institutions. Reach out today.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/contact" }],
  }),
  component: ContactPage,
});

/* Official X (Twitter) Logo Component */
function XLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ContactPage() {
  const { contactPage } = useSiteContent();

  return (
    <div className="bg-[#FAFDFB] min-h-screen">
      {/* 1. Hero Section - Sleek, Borderless Hero Banner matching Features Hero layout */}
      <section className="relative overflow-hidden bg-[#E6FFFF] border-b border-slate-200/60 min-h-[340px] sm:min-h-[360px] lg:h-[360px] xl:h-[380px] flex items-end lg:items-center">
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
              <span className="text-xs font-bold tracking-wider text-[#1C5153] uppercase mb-3 block">
                {contactPage.badge || "Get in Touch"}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#0D2436] tracking-tight leading-[1.15]">
                {contactPage.title} <br className="hidden sm:inline" />
                {contactPage.titleHighlight}
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-700 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                {contactPage.lead}
              </p>

              {/* 3 Value Pills */}
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EBF5F3] text-[#1C5153]">
                    <MessageCircle className="w-3 h-3" />
                  </span>
                  {contactPage.pill1 || "Quick Response"}
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EBF5F3] text-[#1C5153]">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                  {contactPage.pill2 || "Dedicated Support"}
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EBF5F3] text-[#1C5153]">
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

export function ContactContent() {
  const { contact, contactPage, socials } = useSiteContent();
  const [selectedTopic, setSelectedTopic] = useState<string>("general");

  const topics = [
    {
      id: "general",
      title: "General Enquiry",
      icon: MessageSquare,
      targetHref: `mailto:${contact.email}?subject=General%20Enquiry`,
    },
    {
      id: "mentorship",
      title: "Mentorship & Guidance",
      icon: GraduationCap,
      targetHref: "/partner?role=student",
      isInternal: true,
    },
    {
      id: "institution",
      title: "Institution Partnership",
      icon: Building2,
      targetHref: "/partner?role=institution",
      isInternal: true,
    },
    {
      id: "other",
      title: "Other",
      icon: HelpCircle,
      targetHref: `mailto:${contact.email}?subject=General%20Question`,
    },
  ];

  const currentTopic = topics.find((t) => t.id === selectedTopic) ?? topics[0]!;

  return (
    <>

      {/* 2. Contact Information Cards */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              CONTACT INFORMATION
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2436] tracking-tight">
              {contactPage.channelsTitle || "Multiple Ways to Reach Us"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {contactPage.channelsLead ||
                "Choose the channel that works best for you. We're just a call, email or message away!"}
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Phone Card */}
            <a
              href={phoneHref(contact.phone)}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5450]/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1E5450] text-white shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E5450] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Phone</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1E5450] transition-colors">
                  {contact.phone}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.phoneHours || "Mon - Fri, 9:00 AM - 6:00 PM (IST)"}
                </p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${contact.email}`}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1C5153]/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C5153] text-white shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1C5153] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Email</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1C5153] transition-colors break-all">
                  {contact.email}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.emailNote || "We reply within 24 hours"}
                </p>
              </div>
            </a>

            {/* Location Card */}
            <a
              href="https://maps.google.com/?q=Bengaluru,Karnataka,India"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5450]/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1E5450] text-white shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E5450] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Our Location</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1E5450] transition-colors">
                  {contact.location || "Bengaluru, Karnataka, India"}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.locationNote || "(By appointment only)"}
                </p>
              </div>
            </a>

            {/* Website Card */}
            <a
              href={websiteHref(contact.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1C5153]/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C5153] text-white shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1C5153] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Website</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1C5153] transition-colors">
                  {contact.website}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.websiteNote || "Explore more about us"}
                </p>
              </div>
            </a>
          </div>

          {/* 3. Social Media Channels (5 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-2">
            {/* Instagram */}
            <a
              href={socials.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#D62976]/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FA7E1E] via-[#D62976] to-[#962FBF] text-white shadow-2xs">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Instagram</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {socials.instagramHandle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#D62976] group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
            </a>

            {/* Facebook */}
            <a
              href={socials.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1877F2]/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1877F2] text-white shadow-2xs">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Facebook</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{socials.facebookHandle}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
            </a>

            {/* X (Twitter) */}
            <a
              href={socials.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-black/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white shadow-2xs">
                  <XLogo className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">X (Twitter)</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{socials.twitterHandle}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-black group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
            </a>

            {/* LinkedIn */}
            <a
              href={socials.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0A66C2]/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0A66C2] text-white shadow-2xs">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">LinkedIn</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{socials.linkedinHandle}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0A66C2] group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
            </a>

            {/* YouTube */}
            <a
              href={socials.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#FF0000]/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF0000] text-white shadow-2xs">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">YouTube</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{socials.youtubeHandle}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF0000] group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
            </a>
          </div>

          {/* 4. Dual Engagement Section ("Ready to Connect?" & "Send Us a Message") */}
          <div className="rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-12 mt-6">
            {/* Left Box: We're Here for What's Next */}
            <div className="lg:col-span-5 bg-[#EBF5F3] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <span className="text-[11px] font-bold text-[#1C5153] uppercase tracking-wider block">
                  {contactPage.connectEyebrow || "— Ready to Connect?"}
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D2436] tracking-tight leading-snug">
                  {contactPage.connectTitle || "We’re Here for What’s Next"}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
                  {contactPage.connectLead}
                </p>

                {/* Flying Paper Airplane Path */}
                <div className="relative py-2 select-none pointer-events-none">
                  <svg
                    viewBox="0 0 180 50"
                    className="w-full h-12 overflow-visible"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 10,40 Q 75,5 155,20"
                      stroke="#1C5153"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.35"
                    />
                  </svg>
                  <div className="absolute top-1 right-6 text-[#1C5153] transform rotate-12">
                    <Send className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
              </div>

              {/* Quick Links List */}
              <div className="space-y-2.5 relative z-10 pt-4">
                <Link
                  to="/partner"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-[#D1EAE5] text-[#0D2436] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#EBF5F3] text-[#1C5153] group-hover:scale-110 transition-transform">
                    <Compass className="w-4 h-4" />
                  </span>
                  <span>Career Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#1C5153] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/mentors"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-[#D1EAE5] text-[#0D2436] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#EBF5F3] text-[#1C5153] group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </span>
                  <span>Mentor Support</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#1C5153] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/partner"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-[#D1EAE5] text-[#0D2436] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#EBF5F3] text-[#1C5153] group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span>Institution Partnership</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#1C5153] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <a
                  href={`mailto:${contact.email}?subject=General%20Enquiry`}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-[#D1EAE5] text-[#0D2436] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#EBF5F3] text-[#1C5153] group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <span>General Enquiries</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#1C5153] group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>

              {/* Decorative background botanical corner motif */}
              <div
                className="absolute -bottom-8 -left-8 w-44 h-44 pointer-events-none opacity-20 text-[#1C5153]"
                aria-hidden="true"
              >
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10 90 C 20 50, 60 20, 95 10 C 85 40, 60 80, 10 90 Z" />
                  <path d="M15 85 C 35 60, 55 45, 80 35 C 65 55, 45 75, 15 85 Z" opacity="0.6" />
                </svg>
              </div>
            </div>

            {/* Right Box: Send Us a Message */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] inline-block mb-2">
                    {contactPage.messageBadge || "Quick Contact"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D2436] tracking-tight">
                    {contactPage.messageTitle || "Send Us a Message"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {contactPage.messageLead ||
                      "Have a specific question or inquiry? Choose a topic and we'll get back to you with the right person from our team."}
                  </p>
                </div>

                {/* 4 Topic Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {topics.map((topic) => {
                    const isSelected = selectedTopic === topic.id;
                    const Icon = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#EBF5F3] border-[#1E5450] text-[#1E5450] ring-1 ring-[#1E5450]/30 shadow-2xs font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 font-semibold"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-xl ${
                            isSelected ? "bg-[#1E5450] text-white" : "bg-[#EBF5F3] text-[#1C5153]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs leading-snug">{topic.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Action button reflecting chosen topic */}
                <div className="pt-1">
                  {currentTopic.isInternal ? (
                    <Link
                      to={currentTopic.targetHref}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#1E5450] hover:bg-[#153D3A] text-white shadow-xs transition-colors"
                    >
                      <span>Proceed with {currentTopic.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={currentTopic.targetHref}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#1E5450] hover:bg-[#153D3A] text-white shadow-xs transition-colors"
                    >
                      <span>Send Message for {currentTopic.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Direct Conversation Callout Box */}
                <div className="rounded-2xl bg-[#F0F7FA] border border-[#D5E7EF] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#E0EDF3] text-[#0A66C2] shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900">
                        {contactPage.directCallTitle || "Prefer a direct conversation?"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {contactPage.directCallLead || (
                          <>
                            Call us at{" "}
                            <span className="font-semibold text-slate-900">{contact.phone}</span>{" "}
                            during our working hours (
                            {contact.phoneHours || "Mon - Fri, 9:00 AM - 6:00 PM IST"}).
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={phoneHref(contact.phone)}
                    aria-label={`Call ${contact.phone}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1E5450] hover:bg-[#153D3A] text-white shrink-0 shadow-xs transition-colors self-end sm:self-auto"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Signature Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 text-slate-700 select-none">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-[#1C5153]/85 tracking-wide">
                  {contactPage.signature || "“We’d love to hear from you!”"}
                </span>
                <div className="flex items-center gap-1 text-[#1C5153]/70">
                  <svg
                    width="44"
                    height="20"
                    viewBox="0 0 44 20"
                    fill="none"
                    className="overflow-visible"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2,16 Q 22,2 38,10"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                  <Send className="w-4 h-4 -rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
