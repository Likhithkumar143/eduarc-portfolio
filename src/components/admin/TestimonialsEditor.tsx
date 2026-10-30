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
} from "lucide-react";
import { toast } from "sonner";
import { type SiteContent, type TestimonialItem, initials } from "@/content/eduarc";
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

      {/* 2. Testimonials List */}
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
