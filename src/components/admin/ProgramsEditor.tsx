import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Layers,
  School,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Landmark,
  User,
  Phone,
  Mail,
  FileText,
  Star,
  Upload,
  Camera,
  Check,
  Loader2,
  Sparkles,
  Search,
  Quote,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { uploadProgramImage } from "@/lib/admin.functions";
import { compressImage } from "@/lib/image-compression";
import {
  type SiteContent,
  type ProgramSessionItem,
  type ProgramSessionReview,
} from "@/content/eduarc";
import {
  conductedPrograms as defaultConductedPrograms,
  defaultSessionGallery,
} from "@/content/programs-data";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function createEmptyProgram(): ProgramSessionItem {
  const sample = defaultConductedPrograms[0];
  return {
    id: "",
    institution: "",
    title: "",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    duration: "2 Hours",
    location: "",
    image: sample?.image || "",
    heroImage: sample?.heroImage || "",
    gallery: [...defaultSessionGallery],
    type: "school",
    tag: "Higher Secondary",
    category: "Career Guidance Session",
    description: "",
    institutionDetails: {
      name: "",
      type: "Higher Secondary School",
      city: "",
      contactPerson: "",
      phone: "+91 ",
      email: "",
    },
    summary: {
      text: "",
      quote: "Very informative and motivating session for all students.",
      quoteAuthor: "Student, Class 10",
    },
    feedback: {
      rating: "4.8",
      totalResponses: 85,
      reviews: [
        {
          quote: "The mentors explained all streams with utmost clarity and patience.",
          author: "Rahul S, Student",
        },
        {
          quote: "Helped me understand entrance exam pathways and timelines.",
          author: "Ananya M, Student",
        },
        {
          quote: "Interactive Q&A answered all our doubts about college admissions.",
          author: "Kavya P, Student",
        },
      ],
    },
  };
}

export function ProgramsEditor({ draft, update, onSave, isSaving }: EditorProps) {
  const programs: ProgramSessionItem[] =
    draft.conductedPrograms && draft.conductedPrograms.length > 0
      ? draft.conductedPrograms
      : defaultConductedPrograms;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "school" | "college">("all");

  // Add / Edit Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [form, setForm] = useState<ProgramSessionItem>(createEmptyProgram());

  // Delete Confirmation State
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Image Upload Refs
  const cardImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number>(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImageFn = useServerFn(uploadProgramImage);

  // Filtered Programs
  const filtered = programs.filter((p) => {
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.institution.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.tag.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  // Open Add Dialog
  function handleOpenAdd() {
    setEditingIndex(null);
    setForm(createEmptyProgram());
    setActiveTab("basic");
    setIsDialogOpen(true);
  }

  // Open Edit Dialog
  function handleOpenEdit(originalIndex: number) {
    setEditingIndex(originalIndex);
    const item = programs[originalIndex];
    if (item) {
      setForm(JSON.parse(JSON.stringify(item)));
    }
    setActiveTab("basic");
    setIsDialogOpen(true);
  }

  // Handle Image Upload directly to Supabase Storage bucket 'programs'
  async function handleImageFile(file: File, target: "card" | "hero" | "gallery", galleryIdx = 0) {
    try {
      setUploadingImage(true);
      toast.loading("Compressing photo to reduce storage size...", { id: "storage-upload" });

      // Target-specific compression configuration to minimize storage consumption
      const compressionConfig =
        target === "card"
          ? { maxWidth: 960, maxHeight: 600, quality: 0.78, targetMaxBytes: 120 * 1024 }
          : target === "hero"
            ? { maxWidth: 1280, maxHeight: 800, quality: 0.8, targetMaxBytes: 180 * 1024 }
            : { maxWidth: 1000, maxHeight: 750, quality: 0.78, targetMaxBytes: 140 * 1024 };

      const compressed = await compressImage(file, compressionConfig);

      toast.loading(
        `Uploading compressed photo (${compressed.readableCompressedSize}, ${compressed.savedPercent}% space saved)...`,
        { id: "storage-upload" },
      );

      const targetSessionId = form.id.trim() || slugify(form.institution || form.title) || "custom";

      const res = await uploadImageFn({
        data: {
          fileName: `${target}.${compressed.extension}`,
          contentType: compressed.contentType,
          base64Data: compressed.base64Data,
          sessionId: targetSessionId,
          type: target,
          galleryIndex: galleryIdx,
        },
      });

      const publicUrl = res.publicUrl;
      toast.dismiss("storage-upload");

      const label =
        target === "card"
          ? "Card photo"
          : target === "hero"
            ? "Hero photo"
            : `Gallery photo #${galleryIdx + 1}`;

      if (target === "card") {
        setForm((prev) => ({ ...prev, image: publicUrl }));
      } else if (target === "hero") {
        setForm((prev) => ({ ...prev, heroImage: publicUrl }));
      } else if (target === "gallery") {
        setForm((prev) => {
          const nextGallery = [...(prev.gallery || defaultSessionGallery)];
          nextGallery[galleryIdx] = publicUrl;
          return { ...prev, gallery: nextGallery };
        });
      }

      toast.success(
        `${label} uploaded! Reduced from ${compressed.readableOriginalSize} to ${compressed.readableCompressedSize} (${compressed.savedPercent}% space saved)`,
      );
    } catch (err) {
      toast.dismiss("storage-upload");
      toast.error(err instanceof Error ? err.message : "Failed to upload image to Supabase");
    } finally {
      setUploadingImage(false);
    }
  }

  // Auto-slugify
  function generateSlug() {
    const source = form.institution || form.title;
    if (!source) {
      toast.error("Please enter an institution name or title first");
      return;
    }
    const generated = slugify(source);
    setForm((prev) => ({ ...prev, id: generated }));
    toast.success(`URL slug set to: ${generated}`);
  }

  // Save Modal Form
  async function handleSaveProgram() {
    if (!form.title.trim()) {
      toast.error("Program Title is required");
      setActiveTab("basic");
      return;
    }
    if (!form.institution.trim()) {
      toast.error("Institution Name is required");
      setActiveTab("basic");
      return;
    }
    const finalId = form.id.trim() || slugify(form.institution);
    if (!finalId) {
      toast.error("A valid URL identifier is required");
      setActiveTab("basic");
      return;
    }

    // Check unique ID
    const duplicate = programs.find((p, idx) => p.id === finalId && idx !== editingIndex);
    if (duplicate) {
      toast.error(`A program with ID "${finalId}" already exists. Please pick a unique slug.`);
      setActiveTab("basic");
      return;
    }

    const completedProgram: ProgramSessionItem = {
      ...form,
      id: finalId,
      institutionDetails: {
        ...form.institutionDetails,
        name: form.institutionDetails.name || form.institution,
      },
    };

    let updatedPrograms: ProgramSessionItem[];
    if (editingIndex !== null) {
      updatedPrograms = programs.map((p, idx) => (idx === editingIndex ? completedProgram : p));
      toast.success(`Updated "${completedProgram.institution}" program details`);
    } else {
      updatedPrograms = [completedProgram, ...programs];
      toast.success(`Added new program for "${completedProgram.institution}"`);
    }

    update("conductedPrograms", updatedPrograms);
    setIsDialogOpen(false);

    // If auto-publish callback is available, trigger immediate live save
    if (onSave) {
      try {
        await onSave({ ...draft, conductedPrograms: updatedPrograms });
      } catch {
        // notification already handled in onSave
      }
    }
  }

  // Delete Action
  async function handleConfirmDelete() {
    if (deletingIndex === null) return;
    const toDelete = programs[deletingIndex];
    if (!toDelete) return;

    const updated = programs.filter((_, idx) => idx !== deletingIndex);
    update("conductedPrograms", updated);
    setDeletingIndex(null);
    toast.success(`Removed "${toDelete.institution}" program`);

    if (onSave) {
      try {
        await onSave({ ...draft, conductedPrograms: updated });
      } catch {
        // error handled
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-hairline/90 bg-white p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold-border bg-brand-gold-soft/80 px-3 py-0.5 text-xs font-semibold text-brand-navy mb-2">
            <Layers className="h-3.5 w-3.5 text-brand-gold" />
            <span>Interactive Program Catalog</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy tracking-tight">
            Conducted Programs & Session Details
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Add, update, or remove conducted school and college sessions. Edits update both the grid
            cards on <span className="font-semibold text-foreground">/programs</span> and their
            individual session pages in real time.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          variant="pill-gold"
          size="pill"
          className="shrink-0 gap-2 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Program</span>
        </Button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by school, college, title, or city..."
            className="pl-9 bg-white rounded-full border-hairline text-xs sm:text-sm h-10 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              typeFilter === "all"
                ? "bg-brand-navy text-white shadow-xs"
                : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy"
            }`}
          >
            All ({programs.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("school")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              typeFilter === "school"
                ? "bg-brand-navy text-white shadow-xs"
                : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy"
            }`}
          >
            <School className="h-3.5 w-3.5" />
            <span>Schools ({programs.filter((p) => p.type === "school").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("college")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              typeFilter === "college"
                ? "bg-brand-navy text-white shadow-xs"
                : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Colleges ({programs.filter((p) => p.type === "college").length})</span>
          </button>
        </div>
      </div>

      {/* 3. Program Cards Grid for Admin */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const originalIndex = programs.findIndex((p) => p.id === item.id);
          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-hairline bg-white p-4 shadow-2xs transition-all hover:border-brand-gold/40 hover:shadow-xs"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface border border-hairline/60">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.institution}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="gold" className="text-[10px] py-0.5 bg-white/95">
                      {item.tag}
                    </Badge>
                  </div>
                </div>

                {/* Institution & Title */}
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-navy/85">
                  <Landmark className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  <span className="truncate">{item.institution}</span>
                </div>

                <h3 className="mt-1 text-sm font-bold text-brand-navy line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* Date & Location */}
                <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate max-w-[50%]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions Bar */}
              <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-brand-navy"
                >
                  <Link
                    to="/programs/$sessionId"
                    params={{ sessionId: item.id }}
                    target="_blank"
                    className="gap-1 inline-flex items-center"
                  >
                    <span>View Live</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(originalIndex)}
                    className="h-8 px-2.5 text-xs gap-1 border-hairline"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-brand-navy" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingIndex(originalIndex)}
                    className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-hairline bg-white p-12 text-center">
          <p className="text-sm font-semibold text-brand-navy">No program sessions found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or add a new program.
          </p>
          <Button
            type="button"
            variant="pill-gold"
            size="sm"
            onClick={handleOpenAdd}
            className="mt-4"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Program</span>
          </Button>
        </div>
      )}

      {/* 4. Edit / Add Program Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-brand-navy">
              {editingIndex !== null ? "Edit Program Session" : "Add New Program Session"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure session credentials, institution contact card, photos, summary, and student
              reviews.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 w-full bg-surface p-1 rounded-2xl h-auto">
              <TabsTrigger value="basic" className="text-xs font-semibold py-2 rounded-xl">
                1. Overview
              </TabsTrigger>
              <TabsTrigger value="institution" className="text-xs font-semibold py-2 rounded-xl">
                2. Institution
              </TabsTrigger>
              <TabsTrigger value="photos" className="text-xs font-semibold py-2 rounded-xl">
                3. Photos
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs font-semibold py-2 rounded-xl">
                4. Feedback
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW & BASIC DETAILS */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-brand-navy">
                    Program Session Title *
                  </Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Career Options After 10th – Discover Your Path"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-brand-navy">Institution Name *</Label>
                  <Input
                    value={form.institution}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        institution: val,
                        institutionDetails: { ...prev.institutionDetails, name: val },
                      }));
                    }}
                    placeholder="e.g. Sri Venkateshwara Higher Secondary School"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-brand-navy">
                      URL Slug / Identifier *
                    </Label>
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="text-[11px] font-semibold text-brand-gold hover:underline"
                    >
                      Auto-generate Slug
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">/programs/</span>
                    <Input
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: slugify(e.target.value) })}
                      placeholder="e.g. sri-venkateshwara"
                      className="text-xs sm:text-sm rounded-xl font-mono flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">Institution Type</Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "school" })}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        form.type === "school"
                          ? "bg-brand-navy text-white border-brand-navy shadow-xs"
                          : "bg-white text-muted-foreground border-hairline hover:bg-surface"
                      }`}
                    >
                      🏫 School
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "college" })}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        form.type === "college"
                          ? "bg-brand-navy text-white border-brand-navy shadow-xs"
                          : "bg-white text-muted-foreground border-hairline hover:bg-surface"
                      }`}
                    >
                      🎓 College / Univ
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">Category Header</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Career Guidance Session"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">
                    Badge Tag (Card Top-Right)
                  </Label>
                  <Input
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="e.g. Higher Secondary, Class 12 Focus"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">Session Date</Label>
                  <Input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. 15 Oct 2025"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">Session Duration</Label>
                  <Input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 2 Hours"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">Venue / Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-brand-navy">Hero Lead Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the session purpose, target students, and overarching objective..."
                    rows={3}
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: INSTITUTION DETAILS (MOVED TO TOP SIDE) */}
            <TabsContent value="institution" className="space-y-4 pt-4">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Landmark className="h-4 w-4 text-blue-600" />
                  <span>Top-Side Institution Details Card</span>
                </div>
                <p className="text-[11px] text-blue-800/80 mt-1">
                  These details appear prominently in the top section card directly under the hero
                  overview.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-brand-navy">
                    Institution Official Name
                  </Label>
                  <Input
                    value={form.institutionDetails.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institutionDetails: { ...form.institutionDetails, name: e.target.value },
                      })
                    }
                    placeholder="e.g. Sri Venkateshwara Higher Secondary School"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">
                    Institution Subtitle / Type
                  </Label>
                  <Input
                    value={form.institutionDetails.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institutionDetails: { ...form.institutionDetails, type: e.target.value },
                      })
                    }
                    placeholder="e.g. Higher Secondary School or Degree College"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">City / Region</Label>
                  <Input
                    value={form.institutionDetails.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institutionDetails: { ...form.institutionDetails, city: e.target.value },
                      })
                    }
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">
                    Contact Person / Coordinator
                  </Label>
                  <Input
                    value={form.institutionDetails.contactPerson}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institutionDetails: {
                          ...form.institutionDetails,
                          contactPerson: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Mr. R. Kumar"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-brand-navy">Contact Phone</Label>
                  <Input
                    value={form.institutionDetails.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institutionDetails: { ...form.institutionDetails, phone: e.target.value },
                      })
                    }
                    placeholder="+91 98765 43210"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-brand-navy">Institutional Email</Label>
                  <Input
                    value={form.institutionDetails.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        institutionDetails: { ...form.institutionDetails, email: e.target.value },
                      })
                    }
                    placeholder="e.g. info@svhss.edu.in"
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: PHOTOS & MEDIA */}
            <TabsContent value="photos" className="space-y-6 pt-4">
              {/* Hidden file inputs */}
              <input
                ref={cardImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageFile(f, "card");
                }}
              />
              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageFile(f, "hero");
                }}
              />
              <input
                ref={galleryImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageFile(f, "gallery", selectedGalleryIdx);
                }}
              />

              {/* Image Compression & Storage Optimization Banner */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <span className="font-semibold text-emerald-800">
                    Automatic Image Compression Active:
                  </span>{" "}
                  Photos are automatically scaled and compressed before uploading to Supabase
                  Storage. This reduces storage consumption by up to 98% while keeping images
                  crystal clear on high-resolution displays.
                </div>
              </div>

              {/* 1. Catalog Card Thumbnail */}
              <div className="rounded-2xl border border-hairline bg-surface/30 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-32 rounded-xl overflow-hidden bg-white border border-hairline shadow-2xs shrink-0">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Card Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-navy">
                        Catalog Card Thumbnail
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Displayed on the /programs catalog cards (16:9 ratio).
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="pill-outline"
                    size="sm"
                    disabled={uploadingImage}
                    onClick={() => cardImageInputRef.current?.click()}
                    className="gap-1.5 text-xs shrink-0 bg-white"
                  >
                    <Upload className="h-3.5 w-3.5 text-brand-gold" />
                    <span>Upload Image</span>
                  </Button>
                </div>
              </div>

              {/* 2. Session Hero Visual Frame */}
              <div className="rounded-2xl border border-hairline bg-surface/30 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-32 rounded-xl overflow-hidden bg-white border border-hairline shadow-2xs shrink-0">
                      {form.heroImage ? (
                        <img
                          src={form.heroImage}
                          alt="Hero Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-navy">
                        Session Hero Presentation Photo
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Framed on the right side of the details page hero section.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="pill-outline"
                    size="sm"
                    disabled={uploadingImage}
                    onClick={() => heroImageInputRef.current?.click()}
                    className="gap-1.5 text-xs shrink-0 bg-white"
                  >
                    <Upload className="h-3.5 w-3.5 text-brand-gold" />
                    <span>Upload Hero Photo</span>
                  </Button>
                </div>
              </div>

              {/* 3. Session Photos Gallery (5 Photos) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-brand-gold" />
                    <span>Session Photo Gallery (5 Photos)</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Slot 1 is large; slots 2–5 form the 2x2 grid
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(form.gallery && form.gallery.length >= 5 ? form.gallery : defaultSessionGallery)
                    .slice(0, 5)
                    .map((photoUrl, gIdx) => (
                      <div
                        key={gIdx}
                        className="group relative rounded-xl overflow-hidden border border-hairline bg-white shadow-2xs aspect-[16/10]"
                      >
                        <img
                          src={photoUrl}
                          alt={`Gallery Slot ${gIdx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center">
                          <span className="text-[10px] font-bold text-white mb-1">
                            Photo #{gIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGalleryIdx(gIdx);
                              galleryImageInputRef.current?.click();
                            }}
                            className="text-[10px] bg-white text-brand-navy font-semibold px-2 py-0.5 rounded-full shadow-xs"
                          >
                            Replace
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: SUMMARY & STUDENT FEEDBACK */}
            <TabsContent value="summary" className="space-y-5 pt-4">
              {/* Summary Section */}
              <div className="space-y-3 rounded-2xl border border-hairline p-4 bg-surface/30">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                  <FileText className="h-4 w-4 text-brand-gold" />
                  <span>Session Summary Narrative</span>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Full Session Paragraph</Label>
                  <Textarea
                    value={form.summary.text}
                    onChange={(e) =>
                      setForm({ ...form, summary: { ...form.summary, text: e.target.value } })
                    }
                    placeholder="The session focused on helping students understand career options..."
                    rows={4}
                    className="text-xs sm:text-sm rounded-xl"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Featured Student Quote</Label>
                    <Input
                      value={form.summary.quote}
                      onChange={(e) =>
                        setForm({ ...form, summary: { ...form.summary, quote: e.target.value } })
                      }
                      placeholder="Very helpful session. Now I have a clear idea..."
                      className="text-xs sm:text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Quote Author</Label>
                    <Input
                      value={form.summary.quoteAuthor}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          summary: { ...form.summary, quoteAuthor: e.target.value },
                        })
                      }
                      placeholder="e.g. Ananya S, Class 10"
                      className="text-xs sm:text-sm rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Student Feedback Section */}
              <div className="space-y-3 rounded-2xl border border-hairline p-4 bg-surface/30">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>Student Feedback & Metrics</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Score Rating (e.g. 4.8)</Label>
                    <Input
                      value={form.feedback.rating}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          feedback: { ...form.feedback, rating: e.target.value },
                        })
                      }
                      placeholder="4.8"
                      className="text-xs sm:text-sm rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Total Responses Count</Label>
                    <Input
                      type="number"
                      value={form.feedback.totalResponses}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          feedback: {
                            ...form.feedback,
                            totalResponses: parseInt(e.target.value, 10) || 0,
                          },
                        })
                      }
                      placeholder="86"
                      className="text-xs sm:text-sm rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="text-xs font-bold text-brand-navy block mb-2">
                    Student Testimonial Cards (3 Reviews)
                  </Label>
                  <div className="space-y-3">
                    {form.feedback.reviews.map((rev, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-xl border border-hairline bg-white p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                          <span>Review #{rIdx + 1}</span>
                        </div>
                        <Input
                          value={rev.quote}
                          onChange={(e) => {
                            const next = [...form.feedback.reviews];
                            next[rIdx] = { ...next[rIdx]!, quote: e.target.value };
                            setForm({ ...form, feedback: { ...form.feedback, reviews: next } });
                          }}
                          placeholder="Student review quote..."
                          className="text-xs rounded-lg"
                        />
                        <Input
                          value={rev.author}
                          onChange={(e) => {
                            const next = [...form.feedback.reviews];
                            next[rIdx] = { ...next[rIdx]!, author: e.target.value };
                            setForm({ ...form, feedback: { ...form.feedback, reviews: next } });
                          }}
                          placeholder="Student Name & Class (e.g. Rahul K, Class 10)"
                          className="text-xs rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="pill-gold"
              size="sm"
              onClick={handleSaveProgram}
              disabled={isSaving}
              className="w-full sm:w-auto text-xs gap-1.5"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>{editingIndex !== null ? "Save Changes" : "Create Program"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Delete Confirmation Dialog */}
      <Dialog
        open={deletingIndex !== null}
        onOpenChange={(open) => !open && setDeletingIndex(null)}
      >
        <DialogContent className="max-w-md sm:rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2">
              Are you sure you want to delete this program session? This will remove the card from
              the programs page and unpublish its session details page immediately.
            </DialogDescription>
          </DialogHeader>

          {deletingIndex !== null && programs[deletingIndex] && (
            <div className="rounded-xl border border-hairline bg-surface/50 p-3 my-2 text-xs">
              <p className="font-bold text-brand-navy">{programs[deletingIndex]!.institution}</p>
              <p className="text-muted-foreground mt-0.5">{programs[deletingIndex]!.title}</p>
            </div>
          )}

          <DialogFooter className="mt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingIndex(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              className="text-xs gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Program</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Programs Page Text Settings */}
      <details className="rounded-2xl border border-hairline bg-white p-5 shadow-2xs group">
        <summary className="text-xs font-bold text-brand-navy cursor-pointer list-none flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>⚙️</span>
            <span>Programs Page Header & Intro Copy</span>
          </span>
          <span className="text-[11px] text-muted-foreground group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>
        <div className="pt-4 mt-3 border-t border-hairline space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-brand-navy font-semibold">Page Heading</Label>
            <Input
              value={draft.programsPage?.title || ""}
              onChange={(e) =>
                update("programsPage", { ...draft.programsPage, title: e.target.value })
              }
              placeholder="Our Programs"
              className="text-xs rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-brand-navy font-semibold">Page Intro Subtitle</Label>
            <Textarea
              value={draft.programsPage?.lead || ""}
              onChange={(e) =>
                update("programsPage", { ...draft.programsPage, lead: e.target.value })
              }
              placeholder="Explore the career guidance sessions, workshops and seminars conducted by EDUARC..."
              className="text-xs rounded-xl"
              rows={2}
            />
          </div>
        </div>
      </details>
    </div>
  );
}
