import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  FileText,
  Users,
  Laptop,
  Brain,
  ShieldCheck,
  BookOpen,
  Compass,
  MapPin,
  Mail,
  Send,
  Quote,
  Check,
  Copy,
  Layers,
  Sparkles,
  FlaskConical,
  Briefcase,
  Star,
  CheckCircle2,
} from "lucide-react";
import mentorImg from "@/assets/mentor-gayathri.jpg";
import { AmbientBlobs } from "@/components/site/Section";
import { toast } from "sonner";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Dr. Gayathri G N — Academic Mentor | EduArc" },
      {
        name: "description",
        content:
          "Dr. Gayathri G N is an Academic Mentor and Associate Professor specializing in Computer Science, Cloud Security, AI, and Machine Learning.",
      },
      { property: "og:title", content: "Dr. Gayathri G N — Academic Mentor | EduArc" },
      {
        property: "og:description",
        content:
          "Associate Professor · Ph.D. in Computer Science & Engineering. Guiding students in cloud computing, cybersecurity, and AI research.",
      },
    ],
  }),
  component: MentorProfilePage,
});

const mentorshipAreas = [
  {
    title: "Computer Science & Engineering",
    icon: Laptop,
    iconColor: "bg-blue-600 text-white",
    borderColor: "hover:border-blue-300",
    topics: [
      "Computer Networks",
      "Cloud Computing",
      "Software Engineering",
      "Data Mining",
      "Information Security",
    ],
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    icon: Brain,
    iconColor: "bg-purple-600 text-white",
    borderColor: "hover:border-purple-300",
    topics: [
      "Machine Learning Fundamentals",
      "Neural Networks",
      "Deep Learning",
      "Convolutional Neural Networks",
      "AI Research Applications",
    ],
  },
  {
    title: "Cybersecurity & Cloud Security",
    icon: ShieldCheck,
    iconColor: "bg-teal-600 text-white",
    borderColor: "hover:border-teal-300",
    topics: [
      "Cloud Security Fundamentals",
      "Cryptography",
      "Secure Cloud Storage",
      "Data Protection & Access Control",
      "Privacy-Preserving Technologies",
    ],
  },
  {
    title: "Research & Higher Education",
    icon: BookOpen,
    iconColor: "bg-amber-600 text-white",
    borderColor: "hover:border-amber-300",
    topics: [
      "Research Topic Exploration",
      "Student Project Guidance",
      "Postgraduate Dissertation Guidance",
      "Research Paper Preparation",
      "Academic Development",
    ],
  },
  {
    title: "Career & Academic Guidance",
    icon: Compass,
    iconColor: "bg-rose-600 text-white",
    borderColor: "hover:border-rose-300",
    topics: [
      "Exploring Computer Science Careers",
      "Identifying Technical Learning Paths",
      "Understanding Emerging Domains",
      "Planning Academic & Research Goals",
    ],
  },
];

const researchTags = [
  "Cloud Security",
  "Data Protection",
  "Cryptography",
  "Privacy-Preserving Access Control",
  "Neural Networks",
  "Computer Networks",
  "Mobile Ad-hoc Networks (MANET)",
  "Brain Tumor Classification",
];

const educationList = [
  {
    degree: "Ph.D., Computer Science & Engineering",
    year: "2026",
    institution: "Sri Siddhartha Academy of Higher Education (SSAHE), Tumkur",
    note: "Research: Neural networks for brain tumor classification",
    dotColor: "bg-emerald-500 ring-emerald-100",
  },
  {
    degree: "M.Tech., Computer Science",
    year: "2014 – 2017",
    institution: "SIET, VTU",
    note: null,
    dotColor: "bg-blue-500 ring-blue-100",
  },
  {
    degree: "B.E., Information Science",
    year: "2010 – 2014",
    institution: "SIET, VTU",
    note: null,
    dotColor: "bg-purple-500 ring-purple-100",
  },
];

const highlights = [
  {
    value: "7+ Years",
    label: "Academic Experience",
    icon: GraduationCap,
    bgColor: "bg-blue-50 text-blue-600",
  },
  {
    value: "6 Publications",
    label: "Research Papers",
    icon: FileText,
    bgColor: "bg-emerald-50 text-emerald-600",
  },
  {
    value: "40+ Programmes",
    label: "FDPs, Webinars & Conferences",
    icon: Layers,
    bgColor: "bg-purple-50 text-purple-600",
  },
  {
    value: "Ph.D. (2026)",
    label: "CSE",
    icon: Star,
    bgColor: "bg-amber-50 text-amber-600",
  },
];

function MentorProfilePage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("gaytri.infosea@gmail.com");
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative isolate overflow-hidden bg-slate-50/60 pb-24 pt-6 md:pb-32">
      <AmbientBlobs />

      <div className="container-wide">
        {/* Breadcrumb / Top Bar */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Mentors</span>
          <span>/</span>
          <span className="text-foreground/70">Dr. Gayathri G N</span>
        </nav>

        {/* HERO PROFILE BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-md sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Avatar & Bio */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <img
                  src={mentorImg}
                  alt="Dr. Gayathri G N"
                  className="h-32 w-32 rounded-2xl object-cover shadow-md ring-4 ring-white sm:h-40 sm:w-40 md:h-44 md:w-44"
                />
                <span className="absolute -bottom-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>

              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Academic Mentor
                </span>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                  Dr. Gayathri G N
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                  Associate Professor{" "}
                  <span className="mx-2 text-slate-300 font-light">|</span>{" "}
                  Ph.D. in Computer Science & Engineering
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Tumkur, Karnataka, India
                  </span>
                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 font-medium text-sky-700 hover:text-sky-800 transition-colors cursor-pointer"
                    title="Click to copy email"
                  >
                    <Mail className="h-4 w-4 text-sky-600" />
                    gaytri.infosea@gmail.com
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>

                <p className="mt-4 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Experienced academician and researcher with over 7 years of teaching, mentoring,
                  and research experience. Specializes in cloud security, cryptography, machine
                  learning, and neural networks. Passionate about guiding students in building strong
                  technical foundations and exploring career and research opportunities in emerging
                  technology domains.
                </p>
              </div>
            </div>

            {/* Right: Quote Box */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-white p-6 shadow-xs lg:w-[360px] lg:shrink-0">
              <Quote className="h-7 w-7 text-sky-500/80 mb-2" />
              <blockquote className="text-xs italic leading-relaxed text-slate-700 sm:text-sm">
                “Technology offers countless opportunities, but choosing the right learning path can
                be challenging. My goal is to help you build a stronger understanding of technical
                subjects, explore your interests, and make informed decisions about your academic and
                professional development.”
              </blockquote>
              <div className="mt-4 text-right">
                <span className="text-xs font-bold text-slate-900">— Dr. Gayathri G N</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 STATS HIGHLIGHTS STRIP */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="hover-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bgColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{item.value}</h2>
                  <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN 2-COLUMN SECTION */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Mentorship Areas & Research Interests */}
          <div className="space-y-8 lg:col-span-8">
            {/* Mentorship Areas */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Mentorship Areas
                  </h2>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Expert guidance across key areas of Computer Science & Engineering
                  </p>
                </div>
              </div>

              {/* Grid of Areas */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mentorshipAreas.map((area, idx) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={idx}
                      className={`hover-lift flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all ${area.borderColor}`}
                    >
                      <div>
                        <div
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${area.iconColor} shadow-xs mb-3`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-slate-900">
                          {area.title}
                        </h3>
                        <ul className="mt-3.5 space-y-2">
                          {area.topics.map((topic, tIdx) => (
                            <li
                              key={tIdx}
                              className="flex items-start gap-2 text-xs leading-snug text-slate-600"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Research Interests */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Research Interests
                  </h2>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Focused on secure and intelligent technology applications
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {researchTags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50/70 px-4 py-2 text-xs font-medium text-sky-900 transition-colors hover:bg-sky-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-xs text-slate-600 sm:text-sm leading-relaxed">
                Her research bridges secure computing and intelligent technologies, giving students
                the unique opportunity to explore both applied cybersecurity architectures and
                AI-driven diagnostic models.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Quick Info & Education) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Quick Info Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <Sparkles className="h-5 w-5 text-brand" />
                <h2 className="text-base font-bold text-slate-900">Quick Info</h2>
              </div>

              <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    Experience
                  </span>
                  <span className="font-semibold text-slate-900 text-right">7+ Years</span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    Qualification
                  </span>
                  <span className="font-semibold text-slate-900 text-right">Ph.D. (2026)</span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Location
                  </span>
                  <span className="font-semibold text-slate-900 text-right">
                    Tumkur, Karnataka
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Email
                  </span>
                  <a
                    href="mailto:gaytri.infosea@gmail.com"
                    className="font-medium text-sky-700 hover:underline text-right break-all"
                  >
                    gaytri.infosea@gmail.com
                  </a>
                </div>
              </div>

              {/* Embedded CTA Box */}
              <div className="mt-6 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/50 to-white p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
                  <Send className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  Let's build your future together
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Get personalized guidance from an experienced mentor.
                </p>

                <Link
                  to="/partner"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-brand/90 hover:shadow"
                >
                  Request Mentorship
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Education Timeline */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <GraduationCap className="h-5 w-5 text-brand" />
                <h2 className="text-base font-bold text-slate-900">Education</h2>
              </div>

              <div className="relative mt-5 ml-2.5 border-l-2 border-slate-200/90 pl-5 space-y-6">
                {educationList.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <span
                      className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full ring-4 ${edu.dotColor}`}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {edu.degree}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">{edu.year}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.institution}</p>
                    {edu.note && (
                      <p className="mt-1.5 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
                        {edu.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
