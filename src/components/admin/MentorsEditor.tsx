import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  GraduationCap,
  Layers,
  MapPin,
  Mail,
  MoveDown,
  MoveUp,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  defaultContent,
  initials,
  type MentorArea,
  type MentorEducation,
  type MentorHighlight,
  type MentorProfile,
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

function createDefaultMentor(): MentorProfile {
  return {
    id: `mentor-${Date.now()}`,
    name: "",
    role: "Academic Mentor",
    designation: "Associate Professor",
    qualification: "Ph.D. in Computer Science & Engineering",
    experience: "7+ Years",
    location: "Karnataka, India",
    email: "",
    imageUrl: "",
    bio: "",
    quote: "",
    highlights: [
      { value: "7+ Years", label: "Academic Experience", icon: "graduation" },
      { value: "6 Publications", label: "Research Papers", icon: "file" },
      { value: "40+ Programmes", label: "FDPs, Webinars & Conferences", icon: "layers" },
      { value: "Ph.D.", label: "Specialization", icon: "star" },
    ],
    mentorshipAreas: [
      {
        title: "Computer Science & Engineering",
        icon: "laptop",
        topics: ["Computer Networks", "Cloud Computing", "Software Engineering", "Information Security"],
      },
      {
        title: "Artificial Intelligence & Machine Learning",
        icon: "brain",
        topics: ["Machine Learning Fundamentals", "Neural Networks", "Deep Learning"],
      },
    ],
    researchInterests: ["Cloud Security", "Machine Learning", "Data Protection", "Cryptography"],
    education: [
      {
        degree: "Ph.D., Computer Science & Engineering",
        year: "2024",
        institution: "State University / Institute",
        note: null,
      },
      {
        degree: "M.Tech., Computer Science",
        year: "2017",
        institution: "Technical University",
        note: null,
      },
    ],
  };
}

export function MentorsEditor({ draft, update }: EditorProps) {
  const mentors = draft.mentors ?? [];

  // Edit / Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentMentor, setCurrentMentor] = useState<MentorProfile>(createDefaultMentor());
  const [activeTab, setActiveTab] = useState("overview");

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
      role: currentMentor.role.trim() || "Academic Mentor",
      designation: currentMentor.designation.trim(),
      qualification: currentMentor.qualification.trim(),
      experience: currentMentor.experience.trim(),
      location: currentMentor.location.trim(),
      email: currentMentor.email.trim(),
      imageUrl: currentMentor.imageUrl.trim(),
      bio: currentMentor.bio.trim(),
      quote: currentMentor.quote.trim(),
      researchInterests: currentMentor.researchInterests.filter((t) => t.trim().length > 0),
      mentorshipAreas: currentMentor.mentorshipAreas.map((area) => ({
        ...area,
        topics: area.topics.filter((t) => t.trim().length > 0),
      })),
      education: currentMentor.education.map((edu) => ({
        ...edu,
        degree: edu.degree.trim(),
        year: edu.year.trim(),
        institution: edu.institution.trim(),
        note: edu.note?.trim() || null,
      })),
    };

    let next: MentorProfile[];
    if (editingIndex === null) {
      // Add new
      next = [...mentors, cleaned];
      toast.success(`Mentor "${cleaned.name}" added! Don't forget to click "Save changes".`);
    } else {
      // Update existing
      next = mentors.map((m, i) => (i === editingIndex ? cleaned : m));
      toast.success(`Mentor "${cleaned.name}" updated! Don't forget to click "Save changes".`);
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
    toast.success("Restored default mentor profiles.");
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <section className="glass animate-rise rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand dark:text-brand-light">
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
              Add, update, or remove mentors and advisors displayed on the public{" "}
              <Link to="/mentors" target="_blank" className="text-brand underline inline-flex items-center gap-0.5">
                Mentors page <ExternalLink className="h-3 w-3" />
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mentors.length === 0 && (
              <Button variant="outline" size="sm" onClick={handleRestoreDefault} className="rounded-xl">
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Restore default
              </Button>
            )}
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
        {mentors.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
            <h3 className="mt-3 text-lg font-semibold text-foreground">No mentors added yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Add your first mentor profile or restore the default mentor to showcase academic and industry experts to students.
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
            const hasPhoto = Boolean(mentor.imageUrl?.trim());
            return (
              <div
                key={mentor.id || index}
                className="glass hover-lift group relative overflow-hidden rounded-3xl border border-hairline p-5 md:p-6 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative shrink-0">
                      {hasPhoto ? (
                        <img
                          src={mentor.imageUrl}
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
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] ring-2 ring-surface">
                        <Check className="h-3 w-3" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground truncate">{mentor.name || "Untitled Mentor"}</h3>
                        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                          {mentor.role || "Academic Mentor"}
                        </span>
                        {mentor.experience && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {mentor.experience} Exp
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-medium text-foreground/80 truncate">
                        {mentor.designation || "Faculty / Advisor"}
                        {mentor.qualification ? ` · ${mentor.qualification}` : ""}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {mentor.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                            {mentor.location}
                          </span>
                        )}
                        {mentor.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                            {mentor.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {mentor.mentorshipAreas?.length || 0} Domain(s)
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {mentor.researchInterests?.length || 0} Research Tags
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {editingIndex === null ? "Add New Mentor Profile" : `Edit Mentor — ${currentMentor.name || "Untitled"}`}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Configure mentor details, biography, expertise areas, highlights, and academic qualifications.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted/60 rounded-xl gap-1">
              <TabsTrigger value="overview" className="rounded-lg text-xs py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="bio" className="rounded-lg text-xs py-2">
                Bio & Quote
              </TabsTrigger>
              <TabsTrigger value="highlights" className="rounded-lg text-xs py-2">
                Highlights
              </TabsTrigger>
              <TabsTrigger value="domains" className="rounded-lg text-xs py-2">
                Domains
              </TabsTrigger>
              <TabsTrigger value="research" className="rounded-lg text-xs py-2">
                Research
              </TabsTrigger>
              <TabsTrigger value="education" className="rounded-lg text-xs py-2">
                Education
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Full Name & Salutation *</Label>
                  <Input
                    value={currentMentor.name}
                    onChange={(e) =>
                      setCurrentMentor({
                        ...currentMentor,
                        name: e.target.value,
                        id: currentMentor.id || slugify(e.target.value),
                      })
                    }
                    placeholder="e.g. Dr. Gayathri G N"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Role Badge</Label>
                  <Input
                    value={currentMentor.role}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, role: e.target.value })}
                    placeholder="e.g. Academic Mentor, Industry Mentor"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Designation / Title</Label>
                  <Input
                    value={currentMentor.designation}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, designation: e.target.value })}
                    placeholder="e.g. Associate Professor"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Highest Qualification</Label>
                  <Input
                    value={currentMentor.qualification}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, qualification: e.target.value })}
                    placeholder="e.g. Ph.D. in Computer Science & Engineering"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Total Experience</Label>
                  <Input
                    value={currentMentor.experience}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, experience: e.target.value })}
                    placeholder="e.g. 7+ Years"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input
                    value={currentMentor.location}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, location: e.target.value })}
                    placeholder="e.g. Tumkur, Karnataka, India"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Contact Email</Label>
                  <Input
                    type="email"
                    value={currentMentor.email}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, email: e.target.value })}
                    placeholder="e.g. gaytri.infosea@gmail.com"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Profile Image URL (Optional)</Label>
                  <Input
                    value={currentMentor.imageUrl}
                    onChange={(e) => setCurrentMentor({ ...currentMentor, imageUrl: e.target.value })}
                    placeholder="e.g. /assets/mentor-gayathri.jpg or https://..."
                    className="rounded-xl h-11"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Leave blank to show custom styled monogram initials or default mentor portrait.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: BIO & QUOTE */}
            <TabsContent value="bio" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">About the Mentor (Detailed Bio)</Label>
                <Textarea
                  value={currentMentor.bio}
                  onChange={(e) => setCurrentMentor({ ...currentMentor, bio: e.target.value })}
                  placeholder="Overview of mentor's career, teaching experience, research specializations and mentorship passion..."
                  rows={6}
                  className="rounded-xl resize-y text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Message to Students / Philosophy Quote</Label>
                <Textarea
                  value={currentMentor.quote}
                  onChange={(e) => setCurrentMentor({ ...currentMentor, quote: e.target.value })}
                  placeholder="Personal quote or words of encouragement for students..."
                  rows={4}
                  className="rounded-xl resize-y text-sm"
                />
              </div>
            </TabsContent>

            {/* TAB 3: HIGHLIGHTS */}
            <TabsContent value="highlights" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Key Highlights & Metrics</h4>
                  <p className="text-xs text-muted-foreground">Up to 4 quick statistic badges shown at the top of the profile.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      highlights: [
                        ...currentMentor.highlights,
                        { value: "New Metric", label: "Description", icon: "star" },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Highlight
                </Button>
              </div>

              <div className="space-y-3">
                {currentMentor.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/40 p-3 rounded-2xl border border-hairline">
                    <div className="w-1/3">
                      <Label className="text-[11px] text-muted-foreground">Metric / Value</Label>
                      <Input
                        value={h.value}
                        onChange={(e) => {
                          const nextH = [...currentMentor.highlights];
                          nextH[i] = { ...nextH[i]!, value: e.target.value };
                          setCurrentMentor({ ...currentMentor, highlights: nextH });
                        }}
                        placeholder="7+ Years"
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[11px] text-muted-foreground">Label</Label>
                      <Input
                        value={h.label}
                        onChange={(e) => {
                          const nextH = [...currentMentor.highlights];
                          nextH[i] = { ...nextH[i]!, label: e.target.value };
                          setCurrentMentor({ ...currentMentor, highlights: nextH });
                        }}
                        placeholder="Academic Experience"
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive self-end mb-0.5"
                      onClick={() => {
                        const nextH = currentMentor.highlights.filter((_, idx) => idx !== i);
                        setCurrentMentor({ ...currentMentor, highlights: nextH });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: MENTORSHIP AREAS */}
            <TabsContent value="domains" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Mentorship Domains</h4>
                  <p className="text-xs text-muted-foreground">Areas of guidance offered to students with specific sub-topics.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      mentorshipAreas: [
                        ...currentMentor.mentorshipAreas,
                        {
                          title: "New Domain",
                          icon: "laptop",
                          topics: ["Topic 1", "Topic 2", "Topic 3"],
                        },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Domain
                </Button>
              </div>

              <div className="space-y-4">
                {currentMentor.mentorshipAreas.map((area, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-hairline bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <Label className="text-[11px] text-muted-foreground">Domain Title</Label>
                        <Input
                          value={area.title}
                          onChange={(e) => {
                            const nextA = [...currentMentor.mentorshipAreas];
                            nextA[i] = { ...nextA[i]!, title: e.target.value };
                            setCurrentMentor({ ...currentMentor, mentorshipAreas: nextA });
                          }}
                          placeholder="e.g. Cloud Computing & Security"
                          className="rounded-lg h-9 font-medium text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive self-end mb-0.5"
                        onClick={() => {
                          const nextA = currentMentor.mentorshipAreas.filter((_, idx) => idx !== i);
                          setCurrentMentor({ ...currentMentor, mentorshipAreas: nextA });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-[11px] text-muted-foreground">Topics (Comma separated)</Label>
                      <Input
                        value={area.topics.join(", ")}
                        onChange={(e) => {
                          const topics = e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean);
                          const nextA = [...currentMentor.mentorshipAreas];
                          nextA[i] = { ...nextA[i]!, topics };
                          setCurrentMentor({ ...currentMentor, mentorshipAreas: nextA });
                        }}
                        placeholder="e.g. Cloud Security, Cryptography, Data Protection"
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 5: RESEARCH */}
            <TabsContent value="research" className="space-y-4 pt-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Research Interests & Focus Areas</h4>
                <p className="text-xs text-muted-foreground">Keywords displayed as interactive skill and topic tags.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Interests (Comma separated)</Label>
                <Textarea
                  value={currentMentor.researchInterests.join(", ")}
                  onChange={(e) => {
                    const list = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    setCurrentMentor({ ...currentMentor, researchInterests: list });
                  }}
                  placeholder="Cloud Security, Neural Networks, Cryptography, Machine Learning, Brain Tumor Classification"
                  rows={4}
                  className="rounded-xl resize-y text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentMentor.researchInterests.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-brand/10 text-brand px-2.5 py-1 text-xs font-medium border border-brand/20 flex items-center gap-1.5"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const next = currentMentor.researchInterests.filter((_, i) => i !== idx);
                        setCurrentMentor({ ...currentMentor, researchInterests: next });
                      }}
                      className="text-brand/60 hover:text-brand"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </TabsContent>

            {/* TAB 6: EDUCATION */}
            <TabsContent value="education" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Education Timeline</h4>
                  <p className="text-xs text-muted-foreground">Degrees, diplomas, and institutions attended.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    setCurrentMentor({
                      ...currentMentor,
                      education: [
                        ...currentMentor.education,
                        {
                          degree: "Degree / Qualification",
                          year: "2024",
                          institution: "University Name",
                          note: null,
                        },
                      ],
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Degree
                </Button>
              </div>

              <div className="space-y-3">
                {currentMentor.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-hairline bg-muted/30 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Degree / Programme</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const nextE = [...currentMentor.education];
                            nextE[i] = { ...nextE[i]!, degree: e.target.value };
                            setCurrentMentor({ ...currentMentor, education: nextE });
                          }}
                          placeholder="e.g. Ph.D., Computer Science & Engineering"
                          className="rounded-lg h-9 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Year / Period</Label>
                        <Input
                          value={edu.year}
                          onChange={(e) => {
                            const nextE = [...currentMentor.education];
                            nextE[i] = { ...nextE[i]!, year: e.target.value };
                            setCurrentMentor({ ...currentMentor, education: nextE });
                          }}
                          placeholder="e.g. 2026 or 2014 – 2017"
                          className="rounded-lg h-9 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] text-muted-foreground">Institution / University</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const nextE = [...currentMentor.education];
                            nextE[i] = { ...nextE[i]!, institution: e.target.value };
                            setCurrentMentor({ ...currentMentor, education: nextE });
                          }}
                          placeholder="e.g. Sri Siddhartha Academy of Higher Education (SSAHE), Tumkur"
                          className="rounded-lg h-9 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="text-[11px] text-muted-foreground">Research / Specialization Note (Optional)</Label>
                          <Input
                            value={edu.note || ""}
                            onChange={(e) => {
                              const nextE = [...currentMentor.education];
                              nextE[i] = { ...nextE[i]!, note: e.target.value };
                              setCurrentMentor({ ...currentMentor, education: nextE });
                            }}
                            placeholder="e.g. Research: Neural networks for brain tumor classification"
                            className="rounded-lg h-9 text-xs"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive self-end mb-0.5"
                          onClick={() => {
                            const nextE = currentMentor.education.filter((_, idx) => idx !== i);
                            setCurrentMentor({ ...currentMentor, education: nextE });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2 border-t border-hairline pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveCurrent}
              className="rounded-xl bg-brand text-brand-contrast hover:bg-brand/90 font-medium"
            >
              {editingIndex === null ? "Add Mentor" : "Apply Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle className="text-lg font-bold">Delete Mentor Profile</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {deleteIndex !== null && mentors[deleteIndex]?.name ? `"${mentors[deleteIndex]?.name}"` : "this mentor"}
              </strong>
              ? This action removes them from the website once you save changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteIndex(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteIndex !== null && handleDelete(deleteIndex)}
              className="rounded-xl"
            >
              Delete Mentor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
