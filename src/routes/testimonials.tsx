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
import heroBannerImg from "@/assets/testimoials hero banner.jpg";
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
      {/* 1. Hero Section - Sleek, Borderless Hero Banner matching Features Hero layout */}
      <section className="relative overflow-hidden bg-[#F2F7FD] border-b border-slate-200/60 min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] flex items-end">
        {/* Desktop Illustration: Aligned directly to bottom-right flush with bottom border */}
        <div className="hidden lg:flex absolute inset-y-0 right-0 pointer-events-none select-none z-0 items-end justify-end">
          <img
            src={heroBannerImg}
            alt="EDUARC Testimonials Student"
            className="h-full max-h-[380px] w-auto max-w-none object-contain object-right-bottom block"
          />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="pt-10 pb-8 sm:pt-12 sm:pb-10 lg:py-14 max-w-xl lg:max-w-lg xl:max-w-xl text-center sm:text-left">
            <Reveal>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-3 block">
                {pageContent.badge || "TESTIMONIALS"}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
                {pageContent.title}{" "}
                <span className="text-[#0F172A]">
                  {pageContent.titleHighlight}
                </span>
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
              className="w-full max-w-lg h-auto object-contain block select-none pointer-events-none"
            />
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

