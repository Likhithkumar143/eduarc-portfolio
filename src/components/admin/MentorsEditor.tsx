import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Award,
  BookOpen,
  Camera,
  Check,
  Compass,
  Copy,
  Edit3,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Image as ImageIcon,
  Mail,
  MapPin,
  MoveDown,
  MoveUp,
  Plus,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
} from "lucide-react";
import mentorImg from "@/assets/mentor-gayathri.jpg";
import { toast } from "sonner";
import {
  defaultContent,
  initials,
  type MentorBeneficiary,
  type MentorGuideStep,
  type MentorImpactMetric,
  type MentorProfile,
  type MentorReason,
} from "@/content/eduarc";
import type { EditorProps } from "./editors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (PNG, JPG, or WEBP).");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Could not decode image."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function createDefaultMentor(): MentorProfile {
  return {
    id: `mentor-${Date.now()}`,
    name: "",
    role: "Career Guidance & Student Counselling Mentor",
    designation: "Associate Professor · Ph.D. in Computer Science & Engineering",
    location: "Tumkur, Karnataka, India",
    email: "",
    imageUrl: "",
    shortBio:
      "Helping students move from confusion to clarity with informed academic choices and future career roadmaps.",
    cardStats: [
      { label: "Experience", value: "7+ Yrs" },
      { label: "Research", value: "6 Pubs" },
      { label: "Education", value: "Ph.D." },
    ],
    about:
      "Choosing the right career path after Class 10 or Class 12 can be challenging for students and parents. With so many courses, streams, and career opportunities available, finding the right direction can make all the difference.\n\nDr. Gayathri G N is an experienced academician with over 7 years of experience in teaching, student mentoring, academic assessment, and research guidance.\n\nThrough EDUARC, she aims to help students discover their interests, explore suitable career options, make informed academic decisions, and build a clear roadmap for their future.\n\nWith her academic and research background, she brings an informed perspective to higher education, emerging career opportunities, and long-term academic planning.\n\nHer goal is simple: to help students move from confusion to clarity and make confident decisions about their future, with parents feeling informed and supported throughout the journey.",
    howICanGuide: [
      {
        title: "Discover Your Career",
        description:
          "Understand your interests, recognise your strengths, and explore career options that align with your aspirations.",
      },
      {
        title: "Choose the Right Stream",
        description:
          "Explore Science, Commerce, and Humanities after Class 10 and understand which pathways may suit your interests and future goals.",
      },
      {
        title: "Find the Right Course",
        description:
          "Discover degree programmes, college options, and educational pathways after Class 12.",
      },
      {
        title: "Build Your Career Roadmap",
        description:
          "Get a clearer plan for your next academic steps, skill development, and future career exploration.",
      },
      {
        title: "Explore Future Opportunities",
        description:
          "Discover emerging careers, new industries, and opportunities beyond the options you already know.",
      },
      {
        title: "Guidance for Students & Parents",
        description:
          "Make informed education decisions through supportive discussions about academic choices, career possibilities, and future goals.",
      },
    ],
    whyConnect: [
      {
        title: "7+ Years of Academic Experience",
        description: "Teaching, student mentoring, and academic guidance.",
      },
      {
        title: "Ph.D. in Computer Science & Engineering",
        description: "A strong academic foundation and understanding of higher education.",
      },
      {
        title: "Research Experience",
        description:
          "6 research publications across cloud security, cryptography, computer networks, and machine learning.",
      },
      {
        title: "Student-Focused Guidance",
        description:
          "Support for exploring interests, evaluating options, and planning future learning.",
      },
      {
        title: "A Wider View of Opportunities",
        description:
          "Academic and research experience that helps introduce students to emerging technology fields and higher education possibilities.",
      },
    ],
    whoCanBenefit: [
      {
        target: "Class 10 Students",
        benefit: "Explore streams and plan the next stage of education.",
      },
      {
        target: "Class 12 Students",
        benefit: "Understand undergraduate courses and future career pathways.",
      },
      {
        target: "Parents",
        benefit: "Gain clarity about available academic options and support their children's decisions.",
      },
      {
        target: "Students Exploring Their Future",
        benefit: "Discover opportunities, set goals, and identify useful next steps.",
      },
    ],
    impactNotice: "Verified EDUARC activity metrics can be added as the programme grows.",
    impactMetrics: [
      { label: "Students counselled", value: "To be updated" },
      { label: "Counselling sessions completed", value: "To be updated" },
      { label: "Career awareness workshops conducted", value: "To be updated" },
      { label: "Schools associated", value: "To be updated" },
      { label: "Colleges associated", value: "To be updated" },
    ],
    message:
      "Every student has different interests, strengths, and dreams. Choosing a career should not be about following the crowd, but about understanding the possibilities and making informed decisions.\n\nMy aim is to help students explore their options, identify a suitable direction, and approach their academic journey with greater clarity and confidence. I also believe parents play an important role in this process, and the right guidance can help families make decisions together.\n\nThrough EDUARC, let us turn career confusion into clarity and possibilities into purposeful action.",
    tagline: "Learn with direction. Grow with confidence. Build your future with EDUARC.",
  };
}

export function MentorsEditor({ draft, update }: EditorProps) {
  const mentors = draft.mentors ?? [];

  // Edit / Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentMentor, setCurrentMentor] = useState<MentorProfile>(createDefaultMentor());
  const [activeTab, setActiveTab] = useState("overview");

  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);
  const quickUploadIndexRef = useRef<number | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Processing photo...", { id: "mentor-photo" });
      const dataUrl = await compressImage(file);
      setCurrentMentor((prev) => ({ ...prev, imageUrl: dataUrl }));
      toast.success("Photo uploaded successfully!", { id: "mentor-photo" });
    } catch (err: any) {
      toast.error(err.message || "Failed to process photo.", { id: "mentor-photo" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleQuickFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const targetIdx = quickUploadIndexRef.current;
    if (!file || targetIdx === null) return;
    try {
      toast.loading("Processing photo...", { id: "mentor-quick-photo" });
      const dataUrl = await compressImage(file);
      const next = [...mentors];
      if (next[targetIdx]) {
        next[targetIdx] = { ...next[targetIdx], imageUrl: dataUrl };
        update("mentors", next);
        toast.success(
          `Photo updated for "${next[targetIdx].name}"! Click "Save changes" at the top to apply.`,
          { id: "mentor-quick-photo" },
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process photo.", { id: "mentor-quick-photo" });
    } finally {
      quickUploadIndexRef.current = null;
      if (quickFileInputRef.current) quickFileInputRef.current.value = "";
    }
  }

  // Delete confirmation modal state
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  function handleOpenAdd() {
    setEditingIndex(null);
    setCurrentMentor(createDefaultMentor());
    setActiveTab("overview");
    setModalOpen(true);
  }

  function handleOpenEdit(index: number) {
    setEditingIndex(index);
    // Deep clone to isolate edits
    setCurrentMentor(JSON.parse(JSON.stringify(mentors[index])));
    setActiveTab("overview");
    setModalOpen(true);
  }

  function handleSaveCurrent() {
    if (!currentMentor.name.trim()) {
      toast.error("Mentor name is required.");
      return;
    }

    const cleaned: MentorProfile = {
      ...currentMentor,
      name: currentMentor.name.trim(),
      id: currentMentor.id.trim() || slugify(currentMentor.name) || `mentor-${Date.now()}`,
      role: currentMentor.role.trim() || "Career Guidance & Student Counselling Mentor",
      designation: currentMentor.designation.trim(),
      location: currentMentor.location.trim(),
      email: currentMentor.email.trim(),
      imageUrl: currentMentor.imageUrl.trim(),
      shortBio: (currentMentor.shortBio || "").trim(),
      cardStats: (currentMentor.cardStats || []).map((s) => ({
        label: s.label.trim(),
        value: s.value.trim(),
      })),
      about: currentMentor.about.trim(),
      message: currentMentor.message.trim(),
      tagline: currentMentor.tagline.trim(),
      impactNotice: currentMentor.impactNotice.trim(),
      howICanGuide: currentMentor.howICanGuide.map((step) => ({
        title: step.title.trim(),
        description: step.description.trim(),
      })),
      whyConnect: currentMentor.whyConnect.map((reason) => ({
        title: reason.title.trim(),
        description: reason.description.trim(),
      })),
      whoCanBenefit: currentMentor.whoCanBenefit.map((item) => ({
        target: item.target.trim(),
        benefit: item.benefit.trim(),
      })),
      impactMetrics: currentMentor.impactMetrics.map((metric) => ({
        label: metric.label.trim(),
        value: metric.value.trim(),
      })),
    };

    let next: MentorProfile[];
    if (editingIndex === null) {
      next = [...mentors, cleaned];
      toast.success(`Mentor "${cleaned.name}" added! Click "Save changes" at the top to apply.`);
    } else {
      next = mentors.map((m, i) => (i === editingIndex ? cleaned : m));
      toast.success(`Mentor "${cleaned.name}" updated! Click "Save changes" at the top to apply.`);
    }

    update("mentors", next);
    setModalOpen(false);
  }

  function handleDelete(index: number) {
    const target = mentors[index];
    const next = mentors.filter((_, i) => i !== index);
    update("mentors", next);
    setDeleteIndex(null);
    toast.success(`Mentor "${target?.name ?? "profile"}" deleted.`);
  }

  function handleDuplicate(index: number) {
    const source = mentors[index];
    if (!source) return;
    const clone: MentorProfile = {
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${source.name} (Copy)`,
    };
    const next = [...mentors];
    next.splice(index + 1, 0, clone);
    update("mentors", next);
    toast.success(`Duplicated "${source.name}".`);
  }

  function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mentors.length) return;
    const next = [...mentors];
    const [moved] = next.splice(index, 1);
    if (!moved) return;
    next.splice(targetIndex, 0, moved);
    update("mentors", next);
  }

  function handleRestoreDefault() {
    update("mentors", defaultContent.mentors);
    toast.success("Restored default mentor profile.");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <section className="glass animate-rise rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <GraduationCap className="h-4 w-4" />
              </span>
              <h2 className="text-[19px] font-semibold tracking-tight text-foreground">
                Mentor Profiles
              </h2>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[12px] font-medium text-brand">
                {mentors.length} {mentors.length === 1 ? "mentor" : "mentors"}
              </span>
            </div>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Add, update, or remove mentors displayed on the public{" "}
              <Link
                to="/mentors"
                target="_blank"
                className="text-brand underline inline-flex items-center gap-0.5"
              >
                Mentors page <ExternalLink className="h-3 w-3" />
              </Link>
              . Standardized for Career Guidance, Stream & Course Planning, and Student Counselling.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestoreDefault}
              className="rounded-xl text-xs"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset to Default Profile
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenAdd}
              className="rounded-xl bg-brand text-brand-contrast hover:bg-brand/90 font-medium shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Mentor
            </Button>
          </div>
        </div>
      </section>

      {/* Mentors Cards List */}
      <div className="space-y-4">
        {/* Hidden file input for quick photo uploads */}
        <input
          ref={quickFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleQuickFileUpload}
        />

        {mentors.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
            <h3 className="mt-3 text-lg font-semibold text-foreground">No mentors configured</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Add a mentor profile to showcase academic and student counselling guidance to students and parents.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleRestoreDefault} variant="outline" className="rounded-xl">
                <RotateCcw className="h-4 w-4 mr-1.5" /> Restore Default Profile
              </Button>
              <Button onClick={handleOpenAdd} className="rounded-xl bg-brand text-brand-contrast">
                <Plus className="h-4 w-4 mr-1.5" /> Add New Mentor
              </Button>
            </div>
          </div>
        ) : (
          mentors.map((mentor, index) => {
            const isGayathri =
              mentor.id === "dr-gayathri-g-n" || mentor.name.toLowerCase().includes("gayathri");
            const photoSrc = mentor.imageUrl?.trim()
              ? mentor.imageUrl
              : isGayathri
                ? mentorImg
                : null;

            return (
              <div
                key={mentor.id || index}
                className="glass hover-lift group relative overflow-hidden rounded-3xl border border-hairline p-5 md:p-6 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative shrink-0 group/photo">
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={mentor.name}
                          className="h-16 w-16 md:h-18 md:w-18 rounded-2xl object-cover ring-2 ring-brand/10 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 md:h-18 md:w-18 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-teal/20 text-brand flex items-center justify-center font-bold text-xl ring-2 ring-brand/10">
                          {initials(mentor.name || "Mentor")}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          quickUploadIndexRef.current = index;
                          quickFileInputRef.current?.click();
                        }}
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-sm ring-2 ring-surface hover:bg-brand/90 hover:scale-110 transition-transform cursor-pointer"
                        title="Upload / Change Photo"
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground truncate">
                          {mentor.name || "Untitled Mentor"}
                        </h3>
                        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                          {mentor.role || "Career Guidance & Student Counselling Mentor"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-foreground/80 truncate">
                        {mentor.designation || "Associate Professor"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {mentor.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-rose-500" />
                            {mentor.location}
                          </span>
                        )}
                        {mentor.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-sky-600" />
                            {mentor.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Compass className="h-3.5 w-3.5 text-brand" />
                          {mentor.howICanGuide?.length || 0} Guide Areas
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          {mentor.whyConnect?.length || 0} Credentials
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Target className="h-3.5 w-3.5 text-purple-600" />
                          {mentor.whoCanBenefit?.length || 0} Audiences
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 border-t border-hairline pt-3 md:border-0 md:pt-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === mentors.length - 1}
                      title="Move Down"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                      onClick={() => handleDuplicate(index)}
                      title="Duplicate Profile"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-9 rounded-xl bg-brand/10 text-brand hover:bg-brand/20 font-medium"
                      onClick={() => handleOpenEdit(index)}
                    >
                      <Edit3 className="h-4 w-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteIndex(index)}
                      title="Delete Mentor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EDIT / ADD MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {editingIndex === null
                    ? "Add New Mentor Profile"
                    : `Edit Mentor — ${currentMentor.name || "Untitled"}`}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Update mentor identity, career guidance offerings, credentials, beneficiaries, and mentorship impact.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2 sm:grid-cols-6 h-auto p-1 bg-muted/60 rounded-xl gap-1">
              <TabsTrigger value="overview" className="rounded-lg text-xs py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg text-xs py-2">
                About & Message
              </TabsTrigger>
              <TabsTrigger value="guide" className="rounded-lg text-xs py-2">
                How I Guide
              </TabsTrigger>
              <TabsTrigger value="credentials" className="rounded-lg text-xs py-2">
                Why Connect
              </TabsTrigger>
              <TabsTrigger value="beneficiaries" className="rounded-lg text-xs py-2">
                Who Benefits
              </TabsTrigger>
              <TabsTrigger value="impact" className="rounded-lg text-xs py-2">
                Impact Metrics
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Full Name & Salutation *</Label>
                  <Input
                    value={currentMentor.name}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, name: e.target.value })}
                    placeholder="e.g. Dr. Gayathri G N"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Role / Position Title</Label>
                  <Input
                    value={currentMentor.role}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, role: e.target.value })}
                    placeholder="e.g. Career Guidance & Student Counselling Mentor"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Designation & Credentials</Label>
                  <Input
                    value={currentMentor.designation}
                    onChange={(e) =>
                      setCurrentMentor({ ...currentMentor, designation: e.target.value })
                    }
                    placeholder="e.g. Associate Professor · Ph.D. in Computer Science & Engineering"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input
                    value={currentMentor.location}
                    onChange={(e) =>
                      setCurrentMentor({ ...currentMentor, location: e.target.value })
                    }
                    placeholder="e.g. Tumkur, Karnataka, India"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Contact Email</Label>
                  <Input
                    type="email"
                    value={currentMentor.email}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, email: e.target.value })}
                    placeholder="e.g. gaytri.infosea@gmail.com"
                    className="rounded-xl"
                  />
                </div>

                {/* Profile Photo Uploader & Preview */}
                <div className="sm:col-span-2 rounded-2xl border border-hairline bg-surface/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-brand" />
                      Mentor Profile Photo
                    </Label>
                    {currentMentor.imageUrl?.trim() && (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600" /> Custom photo active
                      </span>
                    )}
                  </div>

                  {/* Hidden file input for modal uploads */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Photo preview thumbnail */}
                    <div className="relative shrink-0">
                      {currentMentor.imageUrl?.trim() ||
                      currentMentor.id === "dr-gayathri-g-n" ||
                      currentMentor.name.toLowerCase().includes("gayathri") ? (
                        <img
                          src={currentMentor.imageUrl?.trim() || mentorImg}
                          alt={currentMentor.name || "Preview"}
                          className="h-20 w-20 rounded-2xl object-cover ring-2 ring-brand/20 shadow-sm"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-teal/20 text-brand flex items-center justify-center font-bold text-2xl ring-2 ring-brand/10">
                          {initials(currentMentor.name || "Mentor")}
                        </div>
                      )}
                    </div>

                    {/* Actions and inputs */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-xl bg-brand text-brand-contrast hover:bg-brand/90 text-xs font-medium cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload from Computer
                        </Button>

                        {currentMentor.imageUrl?.trim() && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMentor({ ...currentMentor, imageUrl: "" })}
                            className="rounded-xl text-xs text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Remove Custom Photo
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          value={currentMentor.imageUrl}
                          onChange={(e) =>
                            setCurrentMentor({ ...currentMentor, imageUrl: e.target.value })
                          }
                          placeholder="Or paste direct image URL (https://...)"
                          className="rounded-xl h-8 text-xs font-normal"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Upload a PNG, JPG, or WEBP portrait from your device. Auto-resized and optimized for fast loading.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Card Short Bio (Shown on Profile Card)</Label>
                  <Textarea
                    value={currentMentor.shortBio || ""}
                    onChange={(e) =>
                      setCurrentMentor({ ...currentMentor, shortBio: e.target.value })
                    }
                    placeholder="Helping students move from confusion to clarity with informed academic choices and future career roadmaps."
                    rows={2}
                    className="rounded-xl text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    1–2 concise sentences displayed directly on the mentor's profile card in the gallery.
                  </p>
                </div>

                <div className="space-y-2 sm:col-span-2 border-t border-hairline pt-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Profile Card Quick Stats (3 Columns)</Label>
                    <span className="text-[11px] text-muted-foreground">e.g. 7+ Yrs / Experience, 6 Pubs / Research</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[0, 1, 2].map((idx) => {
                      const stat = (currentMentor.cardStats || [])[idx] || { label: "", value: "" };
                      return (
                        <div key={idx} className="p-2.5 rounded-xl border border-hairline bg-surface/40 space-y-1.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Stat #{idx + 1} Value</span>
                            <Input
                              value={stat.value}
                              onChange={(e) => {
                                const stats = [...(currentMentor.cardStats || [])];
                                while (stats.length <= idx) stats.push({ label: "", value: "" });
                                stats[idx] = { ...stats[idx], value: e.target.value, label: stats[idx]?.label || "" };
                                setCurrentMentor({ ...currentMentor, cardStats: stats });
                              }}
                              placeholder={idx === 0 ? "7+ Yrs" : idx === 1 ? "6 Pubs" : "Ph.D."}
                              className="rounded-lg h-8 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Stat #{idx + 1} Label</span>
                            <Input
                              value={stat.label}
                              onChange={(e) => {
                                const stats = [...(currentMentor.cardStats || [])];
                                while (stats.length <= idx) stats.push({ label: "", value: "" });
                                stats[idx] = { ...stats[idx], label: e.target.value, value: stats[idx]?.value || "" };
                                setCurrentMentor({ ...currentMentor, cardStats: stats });
                              }}
                              placeholder={idx === 0 ? "Experience" : idx === 1 ? "Research" : "Education"}
                              className="rounded-lg h-8 text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Footer Tagline</Label>
                  <Input
                    value={currentMentor.tagline}
                    onChange={(e) =>
                      setCurrentMentor({ ...currentMentor, tagline: e.target.value })
                    }
                    placeholder="Learn with direction. Grow with confidence. Build your future with EDUARC."
                    className="rounded-xl"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ABOUT & MESSAGE */}
            <TabsContent value="about" className="space-y-5 pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">About the Mentor (Paragraphs)</Label>
                  <span className="text-[11px] text-muted-foreground">
                    Separate paragraphs with a blank line
                  </span>
                </div>
                <Textarea
                  value={currentMentor.about}
                  onChange={(e) => setCurrentMentor({ ...currentMentor, about: e.target.value })}
                  placeholder="Choosing the right career path after Class 10 or Class 12 can be challenging..."
                  rows={8}
                  className="rounded-xl font-normal leading-relaxed text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    A Message to Students & Parents
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Separate paragraphs with a blank line
                  </span>
                </div>
                <Textarea
                  value={currentMentor.message}
                  onChange={(e) => setCurrentMentor({ ...currentMentor, message: e.target.value })}
                  placeholder="Every student has different interests, strengths, and dreams..."
                  rows={6}
                  className="rounded-xl font-normal leading-relaxed text-xs sm:text-sm"
                />
              </div>
            </TabsContent>

            {/* TAB 3: HOW I CAN GUIDE YOU */}
            <TabsContent value="guide" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Guidance Offerings ({currentMentor.howICanGuide.length})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step guidance pathways shown on the mentor profile
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      howICanGuide: [
                        ...currentMentor.howICanGuide,
                        { title: "New Guidance Area", description: "Description of what this guidance covers." },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Guidance Area
                </Button>
              </div>

              <div className="space-y-3">
                {currentMentor.howICanGuide.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-hairline bg-surface/50 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand uppercase tracking-wider">
                        Guidance #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const next = currentMentor.howICanGuide.filter((_, i) => i !== idx);
                          setCurrentMentor({ ...currentMentor, howICanGuide: next });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <Label className="text-[11px] font-medium">Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) => {
                            const next = [...currentMentor.howICanGuide];
                            next[idx] = { ...step, title: e.target.value };
                            setCurrentMentor({ ...currentMentor, howICanGuide: next });
                          }}
                          placeholder="e.g. Discover Your Career"
                          className="rounded-xl mt-1 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] font-medium">Guidance Details</Label>
                        <Input
                          value={step.description}
                          onChange={(e) => {
                            const next = [...currentMentor.howICanGuide];
                            next[idx] = { ...step, description: e.target.value };
                            setCurrentMentor({ ...currentMentor, howICanGuide: next });
                          }}
                          placeholder="Explain what the student and parent will explore and achieve..."
                          className="rounded-xl mt-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: WHY CONNECT WITH THIS MENTOR */}
            <TabsContent value="credentials" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Why Connect Credentials ({currentMentor.whyConnect.length})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Academic experience, degrees, publications, and student guidance record
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      whyConnect: [
                        ...currentMentor.whyConnect,
                        { title: "Specialized Credential", description: "Details about this credential or experience." },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Reason
                </Button>
              </div>

              <div className="space-y-3">
                {currentMentor.whyConnect.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-hairline bg-surface/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Credential #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const next = currentMentor.whyConnect.filter((_, i) => i !== idx);
                          setCurrentMentor({ ...currentMentor, whyConnect: next });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <Label className="text-[11px] font-medium">Highlight Title</Label>
                        <Input
                          value={reason.title}
                          onChange={(e) => {
                            const next = [...currentMentor.whyConnect];
                            next[idx] = { ...reason, title: e.target.value };
                            setCurrentMentor({ ...currentMentor, whyConnect: next });
                          }}
                          placeholder="e.g. 7+ Years of Academic Experience"
                          className="rounded-xl mt-1 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] font-medium">Elaboration</Label>
                        <Input
                          value={reason.description}
                          onChange={(e) => {
                            const next = [...currentMentor.whyConnect];
                            next[idx] = { ...reason, description: e.target.value };
                            setCurrentMentor({ ...currentMentor, whyConnect: next });
                          }}
                          placeholder="Teaching, student mentoring, and academic guidance..."
                          className="rounded-xl mt-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 5: WHO CAN BENEFIT */}
            <TabsContent value="beneficiaries" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Target Audiences ({currentMentor.whoCanBenefit.length})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Groups that benefit most (Class 10, Class 12, Parents, etc.)
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      whoCanBenefit: [
                        ...currentMentor.whoCanBenefit,
                        { target: "New Target Audience", benefit: "How they benefit from guidance." },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Audience
                </Button>
              </div>

              <div className="space-y-3">
                {currentMentor.whoCanBenefit.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-hairline bg-surface/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Target Group #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const next = currentMentor.whoCanBenefit.filter((_, i) => i !== idx);
                          setCurrentMentor({ ...currentMentor, whoCanBenefit: next });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <Label className="text-[11px] font-medium">Audience</Label>
                        <Input
                          value={item.target}
                          onChange={(e) => {
                            const next = [...currentMentor.whoCanBenefit];
                            next[idx] = { ...item, target: e.target.value };
                            setCurrentMentor({ ...currentMentor, whoCanBenefit: next });
                          }}
                          placeholder="e.g. Class 10 Students"
                          className="rounded-xl mt-1 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] font-medium">Specific Benefit</Label>
                        <Input
                          value={item.benefit}
                          onChange={(e) => {
                            const next = [...currentMentor.whoCanBenefit];
                            next[idx] = { ...item, benefit: e.target.value };
                            setCurrentMentor({ ...currentMentor, whoCanBenefit: next });
                          }}
                          placeholder="Explore streams and plan the next stage of education..."
                          className="rounded-xl mt-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 6: MENTORSHIP IMPACT */}
            <TabsContent value="impact" className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Impact Disclaimer / Notice</Label>
                <Input
                  value={currentMentor.impactNotice}
                  onChange={(e) =>
                    setCurrentMentor({ ...currentMentor, impactNotice: e.target.value })
                  }
                  placeholder="Verified EDUARC activity metrics can be added as the programme grows."
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Activity Metrics ({currentMentor.impactMetrics.length})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Students counselled, sessions completed, workshops, and associations
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      impactMetrics: [
                        ...currentMentor.impactMetrics,
                        { label: "New Metric", value: "To be updated" },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Metric
                </Button>
              </div>

              <div className="space-y-3">
                {currentMentor.impactMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-hairline bg-surface/50 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1">
                      <Label className="text-[11px] font-medium">Metric Label</Label>
                      <Input
                        value={metric.label}
                        onChange={(e) => {
                          const next = [...currentMentor.impactMetrics];
                          next[idx] = { ...metric, label: e.target.value };
                          setCurrentMentor({ ...currentMentor, impactMetrics: next });
                        }}
                        placeholder="e.g. Students counselled"
                        className="rounded-xl mt-1 text-xs"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <Label className="text-[11px] font-medium">Value / Status</Label>
                      <Input
                        value={metric.value}
                        onChange={(e) => {
                          const next = [...currentMentor.impactMetrics];
                          next[idx] = { ...metric, value: e.target.value };
                          setCurrentMentor({ ...currentMentor, impactMetrics: next });
                        }}
                        placeholder="To be updated"
                        className="rounded-xl mt-1 text-xs font-semibold"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 self-end sm:self-center shrink-0 rounded-lg text-destructive hover:bg-destructive/10 sm:mt-5"
                      onClick={() => {
                        const next = currentMentor.impactMetrics.filter((_, i) => i !== idx);
                        setCurrentMentor({ ...currentMentor, impactMetrics: next });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-hairline pt-4">
            <span className="text-xs text-muted-foreground order-2 sm:order-1">
              * Remember to click <strong>Save changes</strong> at the top of the admin page after saving here.
            </span>
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="rounded-xl bg-brand text-brand-contrast hover:bg-brand/90 font-medium"
                onClick={handleSaveCurrent}
              >
                Apply Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Delete Mentor Profile?</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-2">
              Are you sure you want to delete{" "}
              <strong>{deleteIndex !== null ? mentors[deleteIndex]?.name : "this mentor"}</strong>?
              This action removes their profile from the site once you click Save Changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setDeleteIndex(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={() => deleteIndex !== null && handleDelete(deleteIndex)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
