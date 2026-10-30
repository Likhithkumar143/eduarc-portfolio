import { useState, useMemo } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { type SiteContent, type TestimonialItem, initials } from "@/content/eduarc";
import heroBannerImg from "@/assets/testimonials/hero-banner.jpg";
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

export function TestimonialsEditor({ draft, update, onSave, isSaving }: EditorProps) {
  const testimonials = draft.testimonials || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

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
      avatar: form.avatar?.trim() || undefined,
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

      {/* 2. Hero Banner & Header Callout Controls */}
      <section className="glass rounded-3xl p-6 sm:p-8 border border-hairline bg-surface/70 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Hero Banner & Header Callout
              </h3>
              <p className="text-xs text-muted-foreground">
                Customize the hero section headline, badge, and script callout. Styled fully aligned with no box container.
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

        {/* Live Visual Preview: Sleek, Compact, Fully Aligned Banner matching reference */}
        <div className="rounded-2xl border border-slate-200/80 bg-[#F2F7FD] min-h-[190px] sm:min-h-[220px] relative overflow-hidden flex items-end">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 sm:p-6 pb-0">
            {/* Left Content (Cols 1 to 5) */}
            <div className="md:col-span-5 space-y-1.5 pb-4 sm:pb-6 z-10">
              <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase block">
                {page.badge || "TESTIMONIALS"}
              </span>
              <h4 className="text-base sm:text-xl font-black text-[#0F172A] tracking-tight leading-snug">
                {page.title}{" "}
                <span className="text-[#0F172A]">{page.titleHighlight}</span>
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {page.lead}
              </p>
            </div>

            {/* Middle: Student Girl Illustration (Cols 6 to 9) - Flush with bottom border */}
            <div className="md:col-span-4 flex items-end justify-center h-full">
              <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden flex items-end w-full max-w-[200px]">
                <img
                  src={heroBannerImg}
                  alt="Hero Banner Visual"
                  className="h-full w-auto max-w-none object-cover object-right-bottom block select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Right: Script Callout in its own column (Cols 10 to 12) - Never on her face */}
            <div className="md:col-span-3 pb-4 sm:pb-6 flex items-center justify-start z-10">
              <div className="text-left select-none pointer-events-none rotate-[-2deg]">
                <p className="font-serif italic font-bold text-[#1E40AF] text-xs sm:text-sm leading-tight drop-shadow-2xs">
                  {page.calloutLine1 || "Better Guidance"}<br />
                  <span className="text-indigo-800">{page.calloutLine2 || "Brighter Futures"}</span>
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

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1">
          <span>Visual Layout: <strong className="text-foreground">Fully Aligned (No Box Frame, Bottom-Flush)</strong></span>
          <span>Source Asset: <code className="bg-surface px-1.5 py-0.5 rounded text-blue-600 font-mono">src/assets/testimonials/hero-banner.jpg (2187×892)</code></span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-foreground font-medium">Script Callout Line 1</Label>
            <Input
              value={page.calloutLine1}
              onChange={(e) => updatePage("calloutLine1", e.target.value)}
              placeholder="Better Guidance"
              className="mt-1 h-9 rounded-xl text-xs font-medium"
            />
          </div>
          <div>
            <Label className="text-xs text-foreground font-medium">Script Callout Line 2</Label>
            <Input
              value={page.calloutLine2}
              onChange={(e) => updatePage("calloutLine2", e.target.value)}
              placeholder="Brighter Futures"
              className="mt-1 h-9 rounded-xl text-xs font-medium"
            />
          </div>
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
                Update the 4 milestone metrics and success story banner shown on the testimonials page.
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
            <p className="text-sm font-semibold text-foreground">No testimonials found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery
                ? "No items match your search. Try different keywords."
                : "Click 'Add Testimonial' above to create your first entry."}
            </p>
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
                    <div className="h-11 w-11 rounded-full bg-brand-navy text-brand-gold font-bold flex items-center justify-center shrink-0 shadow-2xs text-xs">
                      {initials(t.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground leading-tight">{t.name}</h4>
                        <span className="text-hairline" aria-hidden="true">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{t.role}</span>

                        {t.category && (
                          <Badge variant="outline" className="text-[10px] py-0 px-2 border-hairline">
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
                <Label className="text-xs font-medium text-foreground">Email Address (Optional)</Label>
                <Input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ananya@example.com"
                  className="mt-1 h-9 rounded-xl text-xs"
                />
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
              <strong>{deleteTargetIndex !== null ? testimonials[deleteTargetIndex]?.name : ""}</strong>?
              This will remove it from the public testimonials page once saved.
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

