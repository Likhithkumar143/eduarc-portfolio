import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Quote,
  Star,
  Users,
  Mail,
  Lock,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSiteContent } from "@/lib/site-content";
import { submitUserReview } from "@/lib/testimonials.functions";
import { initials, type TestimonialItem } from "@/content/eduarc";

// Local cropped assets from reference design
import ananyaImg from "@/assets/testimonials/ananya.jpg";
import priyaImg from "@/assets/testimonials/priya.jpg";
import rohitImg from "@/assets/testimonials/rohit.jpg";
import meeraImg from "@/assets/testimonials/meera.jpg";
import rameshImg from "@/assets/testimonials/ramesh.jpg";
import snehaImg from "@/assets/testimonials/sneha.jpg";
import heroBannerImg from "@/assets/testimonials/hero-banner.jpg";
import successBooksImg from "@/assets/testimonials/success-books.jpg";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Real Stories. Brighter Futures. | EDUARC" },
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

const defaultAvatars: Record<string, string> = {
  ananya: ananyaImg,
  priya: priyaImg,
  rohit: rohitImg,
  meera: meeraImg,
  ramesh: rameshImg,
  sneha: snehaImg,
};

// Fallback avatar lookup by index or key
function getAvatarSrc(t: TestimonialItem, index: number): string | null {
  if (t.avatar && defaultAvatars[t.avatar.toLowerCase()]) {
    return defaultAvatars[t.avatar.toLowerCase()]!;
  }
  const keys = ["ananya", "priya", "rohit", "meera", "ramesh", "sneha"];
  const fallbackKey = keys[index % keys.length];
  if (fallbackKey && defaultAvatars[fallbackKey]) {
    return defaultAvatars[fallbackKey]!;
  }
  return null;
}

function TestimonialsPage() {
  const c = useSiteContent();
  const submitReviewFn = useServerFn(submitUserReview);
  const [localTestimonials, setLocalTestimonials] = useState<TestimonialItem[]>(c.testimonials);

  const stats = c.testimonialStats || {
    programsConducted: "100+",
    programsLabel: "Programs Conducted",
    institutionsPartnered: "50+",
    institutionsLabel: "Institutions Partnered",
    studentsReached: "10,000+",
    studentsLabel: "Students Reached",
    averageRating: "4.8/5",
    ratingLabel: "Average Rating",
    ctaTitle: "Be a part of their success story",
    ctaDescription: "Join EDUARC and help more students discover their true potential.",
    ctaButtonText: "Explore Our Programs",
  };

  const pageContent = c.testimonialsPage || {
    badge: "TESTIMONIALS",
    title: "Real Stories.",
    titleHighlight: "Brighter Futures.",
    lead: "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs.",
    calloutLine1: "Better Guidance",
    calloutLine2: "Brighter Futures",
  };

  useEffect(() => {
    setLocalTestimonials(c.testimonials);
  }, [c.testimonials]);

  const [emailInput, setEmailInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: "",
    email: "",
    role: "Class 12 Student",
    rating: 5,
    category: "Career Guidance Session",
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setModalForm((prev) => ({ ...prev, email: emailInput.trim() }));
    setIsModalOpen(true);
  }

  async function handleSaveReview(e: React.FormEvent) {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!modalForm.email.trim() || !modalForm.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!modalForm.review.trim()) {
      toast.error("Please write your review feedback");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Submitting review...", { id: "user-review" });

      const res = await submitReviewFn({
        data: {
          name: modalForm.name.trim(),
          email: modalForm.email.trim(),
          role: modalForm.role.trim() || "Student",
          rating: modalForm.rating,
          category: modalForm.category.trim() || "Career Guidance Session",
          quote: modalForm.review.trim(),
        },
      });

      toast.dismiss("user-review");

      if (res.skipped) {
        toast.info(res.message, {
          id: "user-review",
          duration: 5000,
        });
      } else {
        toast.success(res.message, {
          id: "user-review",
          duration: 5000,
        });
        if (res.review) {
          setLocalTestimonials((prev) => [res.review as TestimonialItem, ...prev]);
        }
      }

      setIsModalOpen(false);
      setEmailInput("");
      setModalForm({
        name: "",
        email: "",
        role: "Class 12 Student",
        rating: 5,
        category: "Career Guidance Session",
        review: "",
      });
    } catch (err) {
      toast.dismiss("user-review");
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Section - Sleek, Compact, Seamless Fully Aligned Hero Banner matching reference */}
      <section className="relative overflow-hidden bg-[#F2F7FD] border-b border-slate-200/60">
        <div className="container-apple relative">
          {/* Desktop & Laptop Grid: 5 cols Text | 4 cols Student Girl | 3 cols Script Callout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-end min-h-[220px] lg:min-h-[240px] xl:min-h-[260px]">
            {/* Left Column: Badge, Title & Lead (Cols 1 to 5) */}
            <div className="lg:col-span-5 py-6 xl:py-8 z-10">
              <Reveal>
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                  {pageContent.badge || "TESTIMONIALS"}
                </span>

                <h1 className="text-2xl lg:text-[34px] xl:text-[38px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
                  {pageContent.title}{" "}
                  <span className="text-[#0F172A]">
                    {pageContent.titleHighlight}
                  </span>
                </h1>

                <p className="mt-2.5 text-xs lg:text-[13px] text-slate-600 max-w-sm xl:max-w-md leading-relaxed">
                  {pageContent.lead}
                </p>
              </Reveal>
            </div>

            {/* Middle Column: Student Girl Illustration (Cols 6 to 9) - Flush with bottom border */}
            <div className="lg:col-span-4 flex items-end justify-center h-full">
              <Reveal delay={100}>
                <div className="relative h-48 lg:h-56 xl:h-60 flex items-end justify-center overflow-hidden w-full max-w-[280px]">
                  <img
                    src={heroBannerImg}
                    alt="EDUARC Student - Better Guidance, Brighter Futures"
                    className="h-full w-auto max-w-none object-cover object-right-bottom block select-none pointer-events-none"
                  />
                </div>
              </Reveal>
            </div>

            {/* Right Column: Cursive Script Callout (Cols 10 to 12) - In its own column, NEVER on her face */}
            <div className="lg:col-span-3 pb-8 xl:pb-10 flex items-center justify-start">
              <Reveal delay={200}>
                <div className="text-left select-none pointer-events-none rotate-[-2deg] pl-2 xl:pl-4">
                  <p className="font-serif italic font-bold text-[#1E40AF] text-base lg:text-lg xl:text-xl leading-tight tracking-wide drop-shadow-2xs">
                    {pageContent.calloutLine1 || "Better Guidance"}
                    <br />
                    <span className="text-indigo-800">{pageContent.calloutLine2 || "Brighter Futures"}</span>
                  </p>
                  <svg
                    className="w-22 lg:w-26 xl:w-28 h-3 text-blue-600 stroke-current mt-1"
                    viewBox="0 0 100 12"
                    fill="none"
                  >
                    <path d="M2,8 Q50,2 98,6" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Mobile & Tablet Layout (< 1024px): Compact text on top, Girl and Callout side-by-side below */}
          <div className="lg:hidden pt-8 pb-0">
            {/* Top: Headline & Lead */}
            <div className="text-center sm:text-left max-w-xl mx-auto sm:mx-0">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                {pageContent.badge || "TESTIMONIALS"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
                {pageContent.title}{" "}
                <span className="text-[#0F172A]">
                  {pageContent.titleHighlight}
                </span>
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto sm:mx-0 leading-relaxed">
                {pageContent.lead}
              </p>
            </div>

            {/* Bottom: Student Girl & Cursive Callout placed side-by-side flush to bottom border */}
            <div className="flex items-end justify-center sm:justify-start gap-4 sm:gap-8 pt-4 overflow-hidden">
              <div className="relative h-40 sm:h-48 overflow-hidden flex items-end">
                <img
                  src={heroBannerImg}
                  alt="EDUARC Student - Better Guidance, Brighter Futures"
                  className="h-full w-auto max-w-none object-cover object-right-bottom block select-none pointer-events-none"
                />
              </div>

              <div className="pb-6 sm:pb-8 text-left select-none pointer-events-none rotate-[-2deg] shrink-0">
                <p className="font-serif italic font-bold text-[#1E40AF] text-xs sm:text-sm leading-tight drop-shadow-2xs">
                  {pageContent.calloutLine1 || "Better Guidance"}
                  <br />
                  <span className="text-indigo-800">{pageContent.calloutLine2 || "Brighter Futures"}</span>
                </p>
                <svg
                  className="w-16 sm:w-20 h-2.5 text-blue-600 stroke-current mt-0.5"
                  viewBox="0 0 100 12"
                  fill="none"
                >
                  <path d="M2,8 Q50,2 98,6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonial Cards (3-Column Grid) */}
      <section className="py-12 md:py-16">
        <div className="container-apple">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localTestimonials.map((t, idx) => {
              const avatarSrc = getAvatarSrc(t, idx);
              const rating = t.rating ?? 5;
              const category =
                t.category ||
                (idx === 0
                  ? "Career Guidance Session"
                  : idx === 1
                    ? "Parent Feedback"
                    : idx === 2
                      ? "Mentorship Session"
                      : idx === 3
                        ? "Workshop Feedback"
                        : idx === 4
                          ? "Institution Partner"
                          : "Career Guidance Session");

              return (
                <Reveal key={t.name + idx} delay={idx * 60}>
                  <div className="group h-full rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(37,99,235,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {/* Top Header: Avatar + Info + Quote Icon */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs">
                            {avatarSrc ? (
                              <img
                                src={avatarSrc}
                                alt={t.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-blue-100 text-xs font-bold text-blue-800">
                                {initials(t.name)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                              {t.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-normal mt-0.5">{t.role}</p>
                          </div>
                        </div>

                        {/* Subtle circular quote badge */}
                        <div className="h-8 w-8 rounded-full bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-blue-400 shrink-0">
                          <Quote className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Middle: Testimonial Quote */}
                      <blockquote className="mt-4 mb-5 text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                        “{t.quote}”
                      </blockquote>
                    </div>

                    {/* Bottom: 5 Gold Stars & Category Badge */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400" aria-label="5 stars">
                        {Array.from({ length: rating }).map((_, starIdx) => (
                          <Star key={starIdx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 tracking-tight">
                        {category}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* 3. Impact Metrics & Success Story Banner */}
          <Reveal delay={200}>
            <div className="mt-12 rounded-3xl border border-blue-100/90 bg-[#F0F7FF] p-5 sm:p-6 lg:p-7 shadow-xs">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-6 xl:gap-8">
                {/* Left Stats Section */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-blue-100/90 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <Users className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 items-center">
                    {/* Stat 1: Programs Conducted */}
                    <div className="min-w-0 pr-3 sm:pr-4 lg:pr-5">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-black text-[#0F172A] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.programsConducted}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.programsLabel}
                      </p>
                    </div>

                    {/* Stat 2: Institutions Partnered */}
                    <div className="min-w-0 pl-3 sm:px-4 lg:px-5 border-l border-blue-200/70">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-black text-[#0F172A] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.institutionsPartnered}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.institutionsLabel}
                      </p>
                    </div>

                    {/* Stat 3: Students Reached */}
                    <div className="min-w-0 pt-3 sm:pt-0 pr-3 sm:px-4 lg:px-5 sm:border-l sm:border-blue-200/70">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-black text-[#0F172A] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.studentsReached}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.studentsLabel}
                      </p>
                    </div>

                    {/* Stat 4: Average Rating */}
                    <div className="min-w-0 pt-3 sm:pt-0 pl-3 sm:pl-4 lg:pl-5 border-l border-blue-200/70">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-black text-[#0F172A] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.averageRating}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.ratingLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider for Desktop */}
                <div className="hidden lg:block h-12 w-px bg-blue-200/70 shrink-0" />

                {/* Right Call To Action with 3D Books Illustration */}
                <div className="flex items-center justify-between gap-4 lg:shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-blue-200/60 max-w-sm lg:max-w-[280px] xl:max-w-xs">
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug">
                      {stats.ctaTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {stats.ctaDescription}
                    </p>
                    <div className="mt-2.5 sm:mt-3">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2 gap-1.5 shadow-sm"
                      >
                        <Link to="/programs">
                          <span>{stats.ctaButtonText}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="h-16 w-20 sm:h-20 sm:w-24 xl:h-24 xl:w-28 shrink-0 flex items-center justify-center">
                    <img
                      src={successBooksImg}
                      alt="Education and Success"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 4. Share Your Experience Form */}
          <Reveal delay={250}>
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Left Header */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                      Share Your Experience
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5">
                      Your feedback helps us improve and reach more students.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Send us your review via email and be a part of our growing community.
                    </p>
                  </div>
                </div>

                {/* Center Form */}
                <div className="w-full lg:max-w-md">
                  <form
                    onSubmit={handleQuickSubmit}
                    className="flex flex-col sm:flex-row items-center gap-2"
                  >
                    <div className="relative w-full">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="yourname@example.com"
                        className="pl-9 h-10 rounded-full border-slate-200 text-xs bg-slate-50/50 focus-visible:bg-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto shrink-0 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 h-10 gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      <span>Send Review</span>
                    </Button>
                  </form>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-2 justify-center sm:justify-start">
                    <Lock className="h-3 w-3" />
                    <span>Your information is safe with us. We value your privacy.</span>
                  </p>
                </div>

                {/* Right Decorative Message */}
                <div className="hidden xl:flex items-center gap-2 text-blue-600 select-none">
                  <svg
                    className="w-16 h-8 text-blue-400/80 stroke-current"
                    viewBox="0 0 60 30"
                    fill="none"
                  >
                    <path
                      d="M2,28 C20,28 35,5 55,8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                  <span className="font-serif italic text-xs font-semibold text-blue-700">
                    Your words make a difference!
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Share Review Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span>Share Your Review</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Share how EDUARC guided your academic or career journey.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveReview} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-700">Your Full Name *</Label>
                <Input
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="mt-1 h-9 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Email Address *</Label>
                <Input
                  type="email"
                  value={modalForm.email}
                  onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                  placeholder="yourname@example.com"
                  className="mt-1 h-9 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-700">Your Role</Label>
                <select
                  value={modalForm.role}
                  onChange={(e) => setModalForm({ ...modalForm, role: e.target.value })}
                  className="mt-1 w-full h-9 rounded-xl border border-input bg-transparent px-3 text-xs"
                >
                  <option value="Student">Student</option>
                  <option value="Class 10 Student">Class 10 Student</option>
                  <option value="Class 12 Student">Class 12 Student</option>
                  <option value="College Student">College Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Institution Representative">Institution Partner</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setModalForm({ ...modalForm, rating: star })}
                      className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          star <= modalForm.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Program / Session</Label>
              <Input
                value={modalForm.category}
                onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                placeholder="e.g. Career Guidance Session"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Your Feedback / Review</Label>
              <Textarea
                value={modalForm.review}
                onChange={(e) => setModalForm({ ...modalForm, review: e.target.value })}
                placeholder="Describe how the guidance or mentoring helped you..."
                rows={4}
                className="mt-1 rounded-xl text-xs resize-none"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

