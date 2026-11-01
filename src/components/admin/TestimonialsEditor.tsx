import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Quote,
  Star,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  AlertCircle,
  MoveUp,
  MoveDown,
  Mail,
  User,
  Sparkles,
  MessageSquare,
  Tag,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Camera,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { type SiteContent, type TestimonialItem, initials, defaultContent } from "@/content/eduarc";
import { siteContentQuery } from "@/lib/site-content";
import heroBannerImg from "@/assets/testimonials/hero-banner.jpg";
import ananyaImg from "@/assets/testimonials/ananya.jpg";
import priyaImg from "@/assets/testimonials/priya.jpg";
import rohitImg from "@/assets/testimonials/rohit.jpg";
import meeraImg from "@/assets/testimonials/meera.jpg";
import rameshImg from "@/assets/testimonials/ramesh.jpg";
import snehaImg from "@/assets/testimonials/sneha.jpg";
import type { EditorProps } from "./editors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  listUserReviews,
  approveUserReview,
  rejectUserReview,
  deleteUserReview,
  type UserReviewRecord,
} from "@/lib/testimonials.functions";
import {
  getAvatarUrl,
  getGoogleInitialsAvatar,
  getGoogleMaterialAvatarSvg,
  getGravatarUrl,
} from "@/lib/avatar";
import { compressImage } from "@/lib/image-compression";

const defaultAvatars: Record<string, string> = {
  ananya: ananyaImg,
  priya: priyaImg,
  rohit: rohitImg,
  meera: meeraImg,
  ramesh: rameshImg,
  sneha: snehaImg,
};

function resolveTestimonialAvatar(t: { avatar?: string; email?: string; name: string }): string {
  if (t.avatar) {
    if (
      t.avatar.startsWith("http://") ||
      t.avatar.startsWith("https://") ||
      t.avatar.startsWith("data:") ||
      t.avatar.startsWith("//")
    ) {
      return t.avatar;
    }
    if (defaultAvatars[t.avatar.toLowerCase()]) {
      return defaultAvatars[t.avatar.toLowerCase()]!;
    }
  }
  if (t.email && t.email.includes("@")) {
    return getAvatarUrl(t.email, t.name);
  }
  return getGoogleInitialsAvatar(t.name, t.email);
}

const roleSuggestions = [
  "Class 10 Student",
  "Class 12 Student",
  "College Student",
  "Parent",
  "Teacher",
  "Institution Representative",
  "Principal",
  "Academic Counselor",
];

const categorySuggestions = [
  "Career Guidance Session",
  "Parent Feedback",
  "Mentorship Session",
  "Workshop Feedback",
  "Institution Partner",
  "Alumni Story",
];

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const when = (iso: string) => {
  try {
    return `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;
  } catch {
    return iso;
  }
};

export function TestimonialsEditor({ draft, update, onSave, isSaving }: EditorProps) {
  const testimonials = draft.testimonials || [];
  const queryClient = useQueryClient();
  const fetchReviews = useServerFn(listUserReviews);
  const approveReviewFn = useServerFn(approveUserReview);
  const rejectReviewFn = useServerFn(rejectUserReview);
  const deleteReviewFn = useServerFn(deleteUserReview);

  const {
    data: userReviewsData,
    isFetching: isFetchingReviews,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["admin-user-reviews"],
    queryFn: () => fetchReviews(),
    staleTime: 10_000,
  });

  const submittedReviews = userReviewsData?.reviews || [];

  const [moderationTab, setModerationTab] = useState<"pending" | "approved" | "rejected" | "all">(
    "pending",
  );

  const pendingReviews = useMemo(
    () => submittedReviews.filter((r) => r.status === "pending"),
    [submittedReviews],
  );
  const approvedReviews = useMemo(
    () => submittedReviews.filter((r) => r.status === "approved"),
    [submittedReviews],
  );
  const rejectedReviews = useMemo(
    () => submittedReviews.filter((r) => r.status === "rejected"),
    [submittedReviews],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

  const displayModerationReviews = useMemo(() => {
    let list = submittedReviews;
    if (moderationTab === "pending") list = pendingReviews;
    else if (moderationTab === "approved") list = approvedReviews;
    else if (moderationTab === "rejected") list = rejectedReviews;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.quote.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    );
  }, [
    submittedReviews,
    moderationTab,
    pendingReviews,
    approvedReviews,
    rejectedReviews,
    searchQuery,
  ]);

  async function handleApproveSubmission(review: UserReviewRecord) {
    try {
      toast.loading(`Approving review from ${review.name}...`, { id: "mod-action" });
      const res = await approveReviewFn({
        data: {
          id: review.id || undefined,
          email: review.email || undefined,
        },
      });
      toast.dismiss("mod-action");
      toast.success(`Approved & published review from "${review.name}" to the live site!`);

      await queryClient.invalidateQueries({ queryKey: ["admin-user-reviews"] });
      await queryClient.invalidateQueries({ queryKey: siteContentQuery.queryKey });

      if (res.approvedItem) {
        const cleanEmail = review.email.toLowerCase().trim();
        const exists = testimonials.some(
          (t) => t.email && t.email.toLowerCase().trim() === cleanEmail,
        );
        let nextList: TestimonialItem[];
        if (exists) {
          nextList = testimonials.map((t) =>
            t.email && t.email.toLowerCase().trim() === cleanEmail
              ? (res.approvedItem as TestimonialItem)
              : t,
          );
        } else {
          nextList = [res.approvedItem as TestimonialItem, ...testimonials];
        }
        update("testimonials", nextList);
        if (onSave) {
          await onSave({ ...draft, testimonials: nextList });
        }
      }
    } catch (err) {
      toast.dismiss("mod-action");
      toast.error(err instanceof Error ? err.message : "Failed to approve review");
    }
  }

  async function handleRejectSubmission(review: UserReviewRecord) {
    try {
      toast.loading(`Declining review from ${review.name}...`, { id: "mod-action" });
      await rejectReviewFn({
        data: {
          id: review.id || undefined,
          email: review.email || undefined,
        },
      });
      toast.dismiss("mod-action");
      toast.info(`Review from "${review.name}" declined.`);

      await queryClient.invalidateQueries({ queryKey: ["admin-user-reviews"] });
      await queryClient.invalidateQueries({ queryKey: siteContentQuery.queryKey });

      const cleanEmail = review.email.toLowerCase().trim();
      const nextList = testimonials.filter(
        (t) => !(t.email && t.email.toLowerCase().trim() === cleanEmail),
      );
      if (nextList.length !== testimonials.length) {
        update("testimonials", nextList);
        if (onSave) {
          await onSave({ ...draft, testimonials: nextList });
        }
      }
    } catch (err) {
      toast.dismiss("mod-action");
      toast.error(err instanceof Error ? err.message : "Failed to decline review");
    }
  }

  async function handleDeleteSubmission(review: UserReviewRecord) {
    if (!window.confirm(`Permanently delete review submission from "${review.name}"?`)) return;
    try {
      toast.loading("Deleting submission...", { id: "mod-action" });
      await deleteReviewFn({
        data: {
          id: review.id || undefined,
          email: review.email || undefined,
        },
      });
      toast.dismiss("mod-action");
      toast.success("Review submission deleted.");

      await queryClient.invalidateQueries({ queryKey: ["admin-user-reviews"] });
      await queryClient.invalidateQueries({ queryKey: siteContentQuery.queryKey });

      const cleanEmail = review.email.toLowerCase().trim();
      const nextList = testimonials.filter(
        (t) => !(t.email && t.email.toLowerCase().trim() === cleanEmail),
      );
      if (nextList.length !== testimonials.length) {
        update("testimonials", nextList);
        if (onSave) {
          await onSave({ ...draft, testimonials: nextList });
        }
      }
    } catch (err) {
      toast.dismiss("mod-action");
      toast.error(err instanceof Error ? err.message : "Failed to delete submission");
    }
  }

  async function handleRestoreDefaults() {
    update("testimonials", defaultContent.testimonials);
    toast.success("Restored reference testimonials");
    if (onSave) {
      await onSave({ ...draft, testimonials: defaultContent.testimonials });
    }
  }

  // Modal Form State
  const [form, setForm] = useState<TestimonialItem>({
    name: "",
    role: "Class 12 Student",
    quote: "",
    rating: 5,
    category: "Career Guidance Session",
    email: "",
    avatar: "",
  });

  const stats = draft.testimonialStats || {
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

  function updateStat(key: keyof typeof stats, value: string) {
    const nextStats = { ...stats, [key]: value };
    update("testimonialStats", nextStats);
  }

  async function handleSaveStats() {
    if (onSave) {
      await onSave({ ...draft, testimonialStats: stats });
      toast.success("Impact numbers and milestone stats updated live!");
    }
  }

  const page = draft.testimonialsPage || {
    badge: "TESTIMONIALS",
    title: "Real Stories.",
    titleHighlight: "Brighter Futures.",
    lead: "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs.",
    calloutLine1: "Better Guidance",
    calloutLine2: "Brighter Futures",
  };

  function updatePage(key: keyof typeof page, value: string) {
    const nextPage = { ...page, [key]: value };
    update("testimonialsPage", nextPage);
  }

  async function handleSavePage() {
    if (onSave) {
      await onSave({ ...draft, testimonialsPage: page });
      toast.success("Hero Banner & Header settings saved live!");
    }
  }

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    if (!searchQuery.trim()) return testimonials;
    const q = searchQuery.toLowerCase();
    return testimonials.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.quote.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)),
    );
  }, [testimonials, searchQuery]);

  // Open modal for new item
  function handleAddNew() {
    setEditingIndex(null);
    setForm({
      name: "",
      role: "Class 12 Student",
      quote: "",
      rating: 5,
      category: "Career Guidance Session",
      email: "",
      avatar: "",
    });
    setIsDialogOpen(true);
  }

  // Open modal for editing
  function handleEdit(index: number) {
    setEditingIndex(index);
    const item = testimonials[index];
    if (item) {
      setForm({
        name: item.name || "",
        role: item.role || "",
        quote: item.quote || "",
        rating: item.rating ?? 5,
        category: item.category || "Career Guidance Session",
        email: item.email || "",
        avatar: item.avatar || "",
      });
    }
    setIsDialogOpen(true);
  }

  // Save Modal
  async function handleSaveItem() {
    if (!form.name.trim()) {
      toast.error("Please enter the reviewer's full name");
      return;
    }
    if (!form.role.trim()) {
      toast.error("Please enter the role or grade");
      return;
    }
    if (!form.quote.trim()) {
      toast.error("Please enter the testimonial quote");
      return;
    }

    const cleanItem: TestimonialItem = {
      name: form.name.trim(),
      role: form.role.trim(),
      quote: form.quote.trim(),
      rating: form.rating ?? 5,
      category: form.category?.trim() || "Career Guidance Session",
      email: form.email?.trim() || undefined,
      avatar:
        form.avatar?.trim() || (form.email?.trim() ? getGravatarUrl(form.email.trim()) : undefined),
    };

    let nextList: TestimonialItem[];
    if (editingIndex !== null) {
      nextList = testimonials.map((t, idx) => (idx === editingIndex ? cleanItem : t));
      toast.success(`Updated testimonial for "${cleanItem.name}"`);
    } else {
      nextList = [cleanItem, ...testimonials];
      toast.success(`Added new testimonial for "${cleanItem.name}"`);
    }

    update("testimonials", nextList);
    setIsDialogOpen(false);

    if (onSave) {
      await onSave({ ...draft, testimonials: nextList });
    }
  }

  // Delete
  async function handleConfirmDelete() {
    if (deleteTargetIndex === null) return;
    const target = testimonials[deleteTargetIndex];
    const nextList = testimonials.filter((_, idx) => idx !== deleteTargetIndex);
    update("testimonials", nextList);
    setDeleteTargetIndex(null);
    toast.success(`Deleted testimonial for "${target?.name || "reviewer"}"`);

    if (onSave) {
      await onSave({ ...draft, testimonials: nextList });
    }
  }

  // Reordering
  async function handleMove(index: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;

    const nextList = [...testimonials];
    const temp = nextList[index]!;
    nextList[index] = nextList[targetIdx]!;
    nextList[targetIdx] = temp;

    update("testimonials", nextList);
    if (onSave) {
      await onSave({ ...draft, testimonials: nextList });
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <section className="glass rounded-3xl p-6 sm:p-8 border border-hairline bg-surface/70">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Testimonials & Reviews
              </h2>
              <Badge variant="gold" className="text-xs py-0.5">
                {testimonials.length} Active
              </Badge>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Add, edit, or delete student, parent, and institutional testimonials displayed on the
              public site.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRestoreDefaults}
              className="rounded-xl text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset to Default
            </Button>
            <Button
              type="button"
              variant="pill-gold"
              size="sm"
              onClick={handleAddNew}
              className="gap-1.5 shrink-0 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Testimonial</span>
            </Button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, quote, or category tag..."
              className="pl-9 h-10 rounded-xl bg-background/80 text-xs"
            />
          </div>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </div>
      </section>

      {/* 2. USER REVIEW SUBMISSIONS & MODERATION (NEEDS ADMIN APPROVAL TO SHOW) */}
      <section className="glass rounded-3xl p-6 sm:p-8 border-2 border-brand-gold/30 bg-white/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy">
                  User Review Submissions
                </h3>
                {pendingReviews.length > 0 ? (
                  <Badge
                    variant="warning"
                    className="text-xs px-2.5 py-0.5 animate-pulse font-bold"
                  >
                    {pendingReviews.length} Awaiting Approval
                  </Badge>
                ) : (
                  <Badge variant="gold" className="text-xs px-2 py-0.5">
                    All Caught Up
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                Reviews submitted by students and parents on the website. User profile photos are
                automatically loaded from their email addresses. Reviews require admin approval
                before appearing publicly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="pill-outline"
              size="sm"
              onClick={() => refetchReviews()}
              disabled={isFetchingReviews}
              className="gap-1.5 text-xs bg-white cursor-pointer"
              title="Refresh submitted reviews list"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetchingReviews && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs for Moderation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setModerationTab("pending")}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              moderationTab === "pending"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:bg-surface/80 hover:text-foreground",
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Approval</span>
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                moderationTab === "pending"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {pendingReviews.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModerationTab("approved")}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              moderationTab === "approved"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:bg-surface/80 hover:text-foreground",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approved (Live)</span>
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                moderationTab === "approved"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {approvedReviews.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModerationTab("rejected")}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              moderationTab === "rejected"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:bg-surface/80 hover:text-foreground",
            )}
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Declined</span>
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                moderationTab === "rejected"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {rejectedReviews.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModerationTab("all")}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              moderationTab === "all"
                ? "bg-brand-navy text-white shadow-xs"
                : "bg-surface text-muted-foreground hover:bg-surface/80 hover:text-foreground",
            )}
          >
            <span>All Submissions</span>
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                moderationTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {submittedReviews.length}
            </span>
          </button>
        </div>

        {/* Reviews Moderation Cards List */}
        <div className="space-y-3 pt-1">
          {displayModerationReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hairline bg-surface/40 p-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                {moderationTab === "pending"
                  ? "No reviews awaiting approval"
                  : `No ${moderationTab} reviews found`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {moderationTab === "pending"
                  ? "New reviews submitted by visitors from the testimonials page will show up here for moderation."
                  : "Any reviews in this category will appear here."}
              </p>
            </div>
          ) : (
            displayModerationReviews.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "rounded-2xl border p-5 transition-all",
                  r.status === "pending"
                    ? "border-amber-300 bg-amber-50/30 hover:bg-amber-50/50 shadow-xs"
                    : r.status === "approved"
                      ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40"
                      : "border-hairline bg-surface/40 opacity-80",
                )}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Profile Photo (from mail ID) + Reviewer Details */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Profile Photo loaded from user's email or custom upload */}
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-brand-gold/60 bg-brand-navy/10 shrink-0 shadow-xs flex items-center justify-center">
                      <img
                        src={resolveTestimonialAvatar(r)}
                        alt={r.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallbackApplied) {
                            img.dataset.fallbackApplied = "true";
                            img.src = getGoogleMaterialAvatarSvg(r.name, r.email);
                          }
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                          {r.name}
                        </h4>
                        <span className="text-hairline" aria-hidden="true">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{r.role}</span>

                        <Badge variant="outline" className="text-[10px] py-0 px-2 border-hairline">
                          {r.category || "Career Guidance Session"}
                        </Badge>

                        {/* Status Badge */}
                        {r.status === "pending" && (
                          <Badge
                            variant="warning"
                            className="text-[10px] py-0 px-2 font-bold gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            <span>Awaiting Approval</span>
                          </Badge>
                        )}
                        {r.status === "approved" && (
                          <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-2 font-bold gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Approved &amp; Live</span>
                          </Badge>
                        )}
                        {r.status === "rejected" && (
                          <Badge
                            variant="outline"
                            className="text-slate-500 border-slate-300 text-[10px] py-0 px-2 font-bold gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Declined</span>
                          </Badge>
                        )}
                      </div>

                      {/* Email and Submission Date */}
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <a
                          href={`mailto:${r.email}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono text-[11px] bg-blue-50 px-2 py-0.5 rounded-full"
                          title="Contact reviewer"
                        >
                          <Mail className="h-2.5 w-2.5" />
                          <span>{r.email}</span>
                        </a>
                        <span>Submitted: {when(r.createdAt)}</span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mt-2 text-amber-400">
                        {Array.from({ length: r.rating || 5 }).map((_, sIdx) => (
                          <Star key={sIdx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-semibold text-muted-foreground ml-1">
                          {r.rating || 5} / 5
                        </span>
                      </div>

                      {/* Feedback Quote */}
                      <div className="mt-2.5 rounded-xl border border-hairline/70 bg-white/95 p-3 text-xs text-foreground italic leading-relaxed">
                        “{r.quote}”
                      </div>
                    </div>
                  </div>

                  {/* Right: Moderation Actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 self-end sm:self-center shrink-0">
                    {r.status === "pending" && (
                      <>
                        <Button
                          type="button"
                          variant="pill-gold"
                          size="sm"
                          onClick={() => handleApproveSubmission(r)}
                          className="gap-1.5 text-xs shadow-xs cursor-pointer font-bold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve &amp; Publish</span>
                        </Button>
                        <Button
                          type="button"
                          variant="pill-outline"
                          size="sm"
                          onClick={() => handleRejectSubmission(r)}
                          className="gap-1.5 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </Button>
                      </>
                    )}

                    {r.status === "approved" && (
                      <Button
                        type="button"
                        variant="pill-outline"
                        size="sm"
                        onClick={() => handleRejectSubmission(r)}
                        className="gap-1.5 text-xs text-muted-foreground hover:text-amber-600 cursor-pointer"
                        title="Unpublish from live site"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Unpublish</span>
                      </Button>
                    )}

                    {r.status === "rejected" && (
                      <Button
                        type="button"
                        variant="pill-gold"
                        size="sm"
                        onClick={() => handleApproveSubmission(r)}
                        className="gap-1.5 text-xs shadow-xs cursor-pointer font-bold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Re-Approve &amp; Publish</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubmission(r)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Permanently delete submission"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 2. Hero Banner & Header Callout Controls */}
      <section className="glass rounded-3xl p-6 sm:p-8 border border-hairline bg-surface/70 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Hero Banner Header</h3>
              <p className="text-xs text-muted-foreground">
                Customize the testimonials page hero headline, badge, and description.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="pill-gold"
            size="sm"
            disabled={isSaving}
            onClick={handleSavePage}
            className="gap-1.5 text-xs shadow-sm cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Header</span>
          </Button>
        </div>

        {/* Live Visual Preview: Sleek, Compact, Fully Aligned Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-[#F2F7FD] min-h-[180px] sm:min-h-[210px] relative overflow-hidden flex items-end">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-5 sm:p-6 pb-0">
            {/* Left Content (Cols 1 to 7) */}
            <div className="md:col-span-7 space-y-2 pb-4 sm:pb-6 z-10">
              <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block">
                {page.badge || "TESTIMONIALS"}
              </span>
              <h4 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">
                {page.title} <span className="text-[#0F172A]">{page.titleHighlight}</span>
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-sm">
                {page.lead}
              </p>
            </div>

            {/* Right: Student Girl Illustration (Cols 8 to 12) - Fully Visible & Flush with bottom border */}
            <div className="md:col-span-5 flex items-end justify-center md:justify-end h-full">
              <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden flex items-end w-full max-w-[240px]">
                <img
                  src={heroBannerImg}
                  alt="Hero Banner Visual"
                  className="h-full w-auto max-w-none object-cover object-right-bottom block select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1">
          <span>
            Visual Layout:{" "}
            <strong className="text-foreground">Fully Aligned (No Box Frame, Bottom-Flush)</strong>
          </span>
          <span>
            Source Asset:{" "}
            <code className="bg-surface px-1.5 py-0.5 rounded text-blue-600 font-mono">
              src/assets/testimonials/hero-banner.jpg (2187×892)
            </code>
          </span>
        </div>

        {/* Header Content Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-foreground font-medium">Badge Text</Label>
            <Input
              value={page.badge}
              onChange={(e) => updatePage("badge", e.target.value)}
              placeholder="TESTIMONIALS"
              className="mt-1 h-9 rounded-xl text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-foreground font-medium">Headline</Label>
            <Input
              value={page.title}
              onChange={(e) => updatePage("title", e.target.value)}
              placeholder="Real Stories."
              className="mt-1 h-9 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <Label className="text-xs text-foreground font-medium">Headline Highlight</Label>
            <Input
              value={page.titleHighlight}
              onChange={(e) => updatePage("titleHighlight", e.target.value)}
              placeholder="Brighter Futures."
              className="mt-1 h-9 rounded-xl text-xs font-bold text-blue-600"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-foreground font-medium">Lead Description</Label>
          <Textarea
            value={page.lead}
            onChange={(e) => updatePage("lead", e.target.value)}
            rows={2}
            className="mt-1 rounded-xl text-xs leading-relaxed resize-none"
          />
        </div>
      </section>

      {/* 3. Impact Numbers & Milestone Bar Controls */}
      <section className="glass rounded-3xl p-6 sm:p-8 border border-hairline bg-surface/70 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Impact Numbers & Milestone Bar
              </h3>
              <p className="text-xs text-muted-foreground">
                Update the 4 milestone metrics and success story banner shown on the testimonials
                page.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="pill-gold"
            size="sm"
            disabled={isSaving}
            onClick={handleSaveStats}
            className="gap-1.5 text-xs shadow-sm cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Metrics</span>
          </Button>
        </div>

        {/* 4 Milestone Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Programs Conducted */}
          <div className="rounded-2xl border border-hairline bg-background/80 p-4 space-y-2.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Metric #1
            </Label>
            <div>
              <Label className="text-xs text-foreground font-medium">Value (e.g. 100+)</Label>
              <Input
                value={stats.programsConducted}
                onChange={(e) => updateStat("programsConducted", e.target.value)}
                placeholder="100+"
                className="mt-1 h-9 rounded-xl text-xs font-bold text-brand-navy"
              />
            </div>
            <div>
              <Label className="text-xs text-foreground font-medium">Label</Label>
              <Input
                value={stats.programsLabel}
                onChange={(e) => updateStat("programsLabel", e.target.value)}
                placeholder="Programs Conducted"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Stat 2: Institutions Partnered */}
          <div className="rounded-2xl border border-hairline bg-background/80 p-4 space-y-2.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Metric #2
            </Label>
            <div>
              <Label className="text-xs text-foreground font-medium">Value (e.g. 50+)</Label>
              <Input
                value={stats.institutionsPartnered}
                onChange={(e) => updateStat("institutionsPartnered", e.target.value)}
                placeholder="50+"
                className="mt-1 h-9 rounded-xl text-xs font-bold text-brand-navy"
              />
            </div>
            <div>
              <Label className="text-xs text-foreground font-medium">Label</Label>
              <Input
                value={stats.institutionsLabel}
                onChange={(e) => updateStat("institutionsLabel", e.target.value)}
                placeholder="Institutions Partnered"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Stat 3: Students Reached */}
          <div className="rounded-2xl border border-hairline bg-background/80 p-4 space-y-2.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Metric #3
            </Label>
            <div>
              <Label className="text-xs text-foreground font-medium">Value (e.g. 10,000+)</Label>
              <Input
                value={stats.studentsReached}
                onChange={(e) => updateStat("studentsReached", e.target.value)}
                placeholder="10,000+"
                className="mt-1 h-9 rounded-xl text-xs font-bold text-brand-navy"
              />
            </div>
            <div>
              <Label className="text-xs text-foreground font-medium">Label</Label>
              <Input
                value={stats.studentsLabel}
                onChange={(e) => updateStat("studentsLabel", e.target.value)}
                placeholder="Students Reached"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Stat 4: Average Rating */}
          <div className="rounded-2xl border border-hairline bg-background/80 p-4 space-y-2.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Metric #4
            </Label>
            <div>
              <Label className="text-xs text-foreground font-medium">Value (e.g. 4.8/5)</Label>
              <Input
                value={stats.averageRating}
                onChange={(e) => updateStat("averageRating", e.target.value)}
                placeholder="4.8/5"
                className="mt-1 h-9 rounded-xl text-xs font-bold text-brand-navy"
              />
            </div>
            <div>
              <Label className="text-xs text-foreground font-medium">Label</Label>
              <Input
                value={stats.ratingLabel}
                onChange={(e) => updateStat("ratingLabel", e.target.value)}
                placeholder="Average Rating"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Success Story Callout Settings */}
        <div className="pt-2 border-t border-hairline">
          <details className="group cursor-pointer">
            <summary className="text-xs font-semibold text-brand-navy hover:underline list-none flex items-center justify-between">
              <span>Edit Success Story CTA & Button</span>
              <span className="text-[11px] text-muted-foreground group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <Label className="text-xs text-foreground font-medium">Headline</Label>
                <Input
                  value={stats.ctaTitle}
                  onChange={(e) => updateStat("ctaTitle", e.target.value)}
                  placeholder="Be a part of their success story"
                  className="mt-1 h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-foreground font-medium">Description</Label>
                <Input
                  value={stats.ctaDescription}
                  onChange={(e) => updateStat("ctaDescription", e.target.value)}
                  placeholder="Join EDUARC and help more students..."
                  className="mt-1 h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-foreground font-medium">Button Label</Label>
                <Input
                  value={stats.ctaButtonText}
                  onChange={(e) => updateStat("ctaButtonText", e.target.value)}
                  placeholder="Explore Our Programs"
                  className="mt-1 h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* 3. Testimonials List */}
      <div className="space-y-3">
        {filteredTestimonials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface/30 p-12 text-center">
            <Quote className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">
              {testimonials.length === 0
                ? "No testimonials published"
                : "No testimonials match your filter"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {searchQuery
                ? "No items match your search. Try different keywords."
                : testimonials.length === 0
                  ? "All testimonials have been removed. You can approve incoming user reviews from above, add a custom testimonial, or restore the default reference list."
                  : "Try clearing your search query."}
            </p>
            {!searchQuery && testimonials.length === 0 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRestoreDefaults}
                  className="rounded-xl text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Restore Default List
                </Button>
                <Button
                  type="button"
                  variant="pill-gold"
                  size="sm"
                  onClick={handleAddNew}
                  className="rounded-xl text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Testimonial
                </Button>
              </div>
            )}
          </div>
        ) : (
          filteredTestimonials.map((t) => {
            const originalIndex = testimonials.findIndex((item) => item === t);
            const rating = t.rating ?? 5;

            return (
              <div
                key={t.name + originalIndex}
                className="group rounded-2xl border border-hairline bg-surface/80 p-5 hover:bg-white hover:border-brand-gold/40 hover:shadow-card transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Avatar + Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden bg-brand-navy border border-hairline shrink-0 shadow-2xs flex items-center justify-center">
                      <img
                        src={resolveTestimonialAvatar(t)}
                        alt={t.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallbackApplied) {
                            img.dataset.fallbackApplied = "true";
                            img.src = getGoogleMaterialAvatarSvg(t.name, t.email);
                          }
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground leading-tight">
                          {t.name}
                        </h4>
                        <span className="text-hairline" aria-hidden="true">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{t.role}</span>

                        {t.category && (
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 px-2 border-hairline"
                          >
                            {t.category}
                          </Badge>
                        )}

                        {t.email && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-mono">
                            <Mail className="h-2.5 w-2.5" />
                            <span>{t.email}</span>
                          </span>
                        )}
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mt-1 text-amber-400">
                        {Array.from({ length: rating }).map((_, sIdx) => (
                          <Star key={sIdx} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Quote preview */}
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
                        “{t.quote}”
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Reorder Buttons */}
                    <div className="flex items-center border border-hairline rounded-lg overflow-hidden bg-background/60 mr-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={originalIndex === 0}
                        onClick={() => handleMove(originalIndex, "up")}
                        className="h-8 w-8 p-0 hover:bg-surface text-muted-foreground disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={originalIndex === testimonials.length - 1}
                        onClick={() => handleMove(originalIndex, "down")}
                        className="h-8 w-8 p-0 hover:bg-surface text-muted-foreground disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(originalIndex)}
                      className="h-8 px-2.5 gap-1.5 text-xs rounded-lg hover:border-brand-gold/60 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-brand-navy" />
                      <span>Edit</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTargetIndex(originalIndex)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Add / Edit Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px] p-6 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Quote className="h-4 w-4 text-brand-gold" />
              <span>{editingIndex !== null ? "Edit Testimonial" : "Add New Testimonial"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure reviewer identity, star rating, program category, and feedback quote.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-foreground">Reviewer Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ananya S"
                  className="mt-1 h-9 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground">
                  Email Address (Optional)
                </Label>
                <Input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ananya@example.com"
                  className="mt-1 h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Reviewer Photo Preview & Upload */}
            <div className="rounded-xl border border-hairline bg-surface/60 p-3">
              <div className="flex items-center gap-3.5">
                <div className="relative h-13 w-13 rounded-full overflow-hidden bg-brand-navy border-2 border-brand-gold/60 shrink-0 shadow-2xs flex items-center justify-center">
                  <img
                    key={form.avatar || form.email || form.name}
                    src={resolveTestimonialAvatar(form)}
                    alt="Reviewer Avatar Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallbackApplied) {
                        img.dataset.fallbackApplied = "true";
                        img.src = getGoogleMaterialAvatarSvg(form.name || "User", form.email);
                      }
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Reviewer Photo</span>
                    {form.avatar && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, avatar: "" }))}
                        className="text-[11px] text-destructive hover:underline cursor-pointer"
                      >
                        Reset to Email Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {form.avatar
                      ? "Custom photo uploaded for this testimonial."
                      : form.email && form.email.includes("@")
                        ? "Auto-detected from reviewer's Gmail / Google profile."
                        : "Enter reviewer's email above or upload a photo."}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-surface hover:bg-surface/80 border border-hairline cursor-pointer shadow-2xs transition-colors">
                      <Camera className="h-3.5 w-3.5 text-brand-gold" />
                      <span>{form.avatar ? "Change Photo" : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            toast.loading("Compressing photo...", { id: "avatar-upload" });
                            const compressed = await compressImage(file, {
                              maxWidth: 240,
                              maxHeight: 240,
                              quality: 0.85,
                              format: "image/webp",
                            });
                            setForm((prev) => ({ ...prev, avatar: compressed.dataUrl }));
                            toast.dismiss("avatar-upload");
                            toast.success("Reviewer photo updated!");
                          } catch (err) {
                            toast.dismiss("avatar-upload");
                            toast.error(
                              err instanceof Error ? err.message : "Failed to compress photo",
                            );
                          } finally {
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-foreground">Role / Designation *</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Class 12 Student, Parent"
                  className="mt-1 h-9 rounded-xl text-xs"
                  required
                />
                {/* Role quick pills */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {roleSuggestions.slice(0, 4).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface text-muted-foreground hover:text-foreground border border-hairline cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground">Star Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "h-5 w-5",
                          star <= (form.rating ?? 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30",
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground ml-2">
                    {form.rating ?? 5} / 5 Stars
                  </span>
                </div>
              </div>
            </div>

            {/* Program Category Tag */}
            <div>
              <Label className="text-xs font-medium text-foreground">
                Program Category / Event Tag
              </Label>
              <Input
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Career Guidance Session, Parent Feedback"
                className="mt-1 h-9 rounded-xl text-xs"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {categorySuggestions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, category: c })}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface text-muted-foreground hover:text-foreground border border-hairline cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div>
              <Label className="text-xs font-medium text-foreground">Testimonial Quote *</Label>
              <Textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="Write the feedback or experience shared by the reviewer..."
                rows={4}
                className="mt-1 rounded-xl text-xs resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="pill-gold"
              size="sm"
              disabled={isSaving}
              onClick={handleSaveItem}
              className="gap-1.5 text-xs shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{editingIndex !== null ? "Update Testimonial" : "Add Testimonial"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Delete Confirmation Dialog */}
      <Dialog
        open={deleteTargetIndex !== null}
        onOpenChange={(open) => !open && setDeleteTargetIndex(null)}
      >
        <DialogContent className="sm:max-w-[420px] p-6 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>Delete Testimonial?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to remove the testimonial for{" "}
              <strong>
                {deleteTargetIndex !== null ? testimonials[deleteTargetIndex]?.name : ""}
              </strong>
              ? This will remove it from the public testimonials page once saved.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteTargetIndex(null)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isSaving}
              onClick={handleConfirmDelete}
              className="rounded-full text-xs gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Testimonial</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
