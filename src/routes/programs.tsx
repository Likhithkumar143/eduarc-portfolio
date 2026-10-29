import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Landmark,
  ArrowRight,
  Sparkles,
  School,
  GraduationCap,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/lib/site-content";

// Campus Program Images cropped from official event portfolio
import imgSriVenkateshwara from "@/assets/programs/program-sri-venkateshwara.jpg";
import imgStMarys from "@/assets/programs/program-st-marys.jpg";
import imgKendriyaVidyalaya from "@/assets/programs/program-kendriya-vidyalaya.jpg";
import imgDavPublic from "@/assets/programs/program-dav-public.jpg";
import imgPsgCollege from "@/assets/programs/program-psg-college.jpg";
import imgSriChaitanya from "@/assets/programs/program-sri-chaitanya.jpg";
import imgChinmayaVidyalaya from "@/assets/programs/program-chinmaya-vidyalaya.jpg";
import imgVitVellore from "@/assets/programs/program-vit-vellore.jpg";
import imgBishopHeber from "@/assets/programs/program-bishop-heber.jpg";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Our Programs — EDUARC Connect" },
      {
        name: "description",
        content:
          "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges across India.",
      },
      { property: "og:title", content: "Our Programs — EDUARC Connect" },
      {
        property: "og:description",
        content:
          "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/programs" }],
  }),
  component: ProgramsPage,
});

export interface ConductedProgram {
  id: string;
  institution: string;
  title: string;
  date: string;
  location: string;
  image: string;
  type: "school" | "college";
  tag: string;
}

const conductedPrograms: ConductedProgram[] = [
  {
    id: "sri-venkateshwara",
    institution: "Sri Venkateshwara Higher Secondary School",
    title: "Career Options After 10th – Discover Your Path",
    date: "15 Oct 2025",
    location: "Coimbatore, Tamil Nadu",
    image: imgSriVenkateshwara,
    type: "school",
    tag: "Higher Secondary",
  },
  {
    id: "st-marys",
    institution: "St. Mary's College",
    title: "Building a Successful Career in Science",
    date: "12 Aug 2025",
    location: "Tiruchirappalli, Tamil Nadu",
    image: imgStMarys,
    type: "college",
    tag: "Undergraduate",
  },
  {
    id: "kendriya-vidyalaya",
    institution: "Kendriya Vidyalaya",
    title: "Higher Education & Future Opportunities",
    date: "20 Jul 2025",
    location: "Bengaluru, Karnataka",
    image: imgKendriyaVidyalaya,
    type: "school",
    tag: "Senior School",
  },
  {
    id: "dav-public",
    institution: "DAV Public School",
    title: "Personality Development & Life Skills Workshop",
    date: "10 Jun 2025",
    location: "Mysuru, Karnataka",
    image: imgDavPublic,
    type: "school",
    tag: "Life Skills",
  },
  {
    id: "psg-college",
    institution: "PSG College of Arts & Science",
    title: "Stream Selection Guidance (Session 1)",
    date: "25 Apr 2025",
    location: "Coimbatore, Tamil Nadu",
    image: imgPsgCollege,
    type: "college",
    tag: "Degree College",
  },
  {
    id: "sri-chaitanya",
    institution: "Sri Chaitanya Junior College",
    title: "Resume Building & Interview Preparation",
    date: "15 Mar 2025",
    location: "Hyderabad, Telangana",
    image: imgSriChaitanya,
    type: "college",
    tag: "Junior College",
  },
  {
    id: "chinmaya-vidyalaya",
    institution: "Chinmaya Vidyalaya",
    title: "Career Guidance Session for Class 12 Students",
    date: "22 Feb 2025",
    location: "Ernakulam, Kerala",
    image: imgChinmayaVidyalaya,
    type: "school",
    tag: "Class 12 Focus",
  },
  {
    id: "vit-vellore",
    institution: "VIT Vellore",
    title: "Career Guidance & Goal Setting Workshop",
    date: "18 Jan 2025",
    location: "Vellore, Tamil Nadu",
    image: imgVitVellore,
    type: "college",
    tag: "University",
  },
  {
    id: "bishop-heber",
    institution: "Bishop Heber College",
    title: "Higher Education Pathways and Career Choices",
    date: "12 Dec 2024",
    location: "Tiruchirappalli, Tamil Nadu",
    image: imgBishopHeber,
    type: "college",
    tag: "Higher Education",
  },
];

type FilterType = "all" | "school" | "college";

function ProgramsPage() {
  const c = useSiteContent();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredPrograms = useMemo(() => {
    if (filter === "all") return conductedPrograms;
    return conductedPrograms.filter((p) => p.type === filter);
  }, [filter]);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* 1. Header Section */}
      <section className="pt-10 md:pt-16 pb-6 md:pb-8">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-brand-navy tracking-tight leading-tight">
              {c.programsPage?.title || "Our Programs"}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {c.programsPage?.lead ||
                "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges."}
            </p>

            {/* Apple-style Segmented Filter Controls */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  filter === "all"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy hover:border-brand-navy/30"
                }`}
              >
                <span>All Programs</span>
                <span className="text-[11px] opacity-75">({conductedPrograms.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("school")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  filter === "school"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy hover:border-brand-navy/30"
                }`}
              >
                <School className="h-3.5 w-3.5" />
                <span>School Sessions</span>
                <span className="text-[11px] opacity-75">
                  ({conductedPrograms.filter((p) => p.type === "school").length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("college")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  filter === "college"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy hover:border-brand-navy/30"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Colleges & Universities</span>
                <span className="text-[11px] opacity-75">
                  ({conductedPrograms.filter((p) => p.type === "college").length})
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Program Cards Grid (Matches Reference Image 3x3) */}
      <section className="pb-16 md:pb-24">
        <div className="container-wide">
          <div className="grid gap-6 sm:gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program, idx) => (
              <Reveal key={program.id} delay={Math.min(idx * 60, 300)}>
                <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-3.5 sm:p-4 shadow-xs hover-lift transition-all hover:border-brand-gold/40 hover:shadow-card">
                  <div>
                    {/* Campus Image Frame */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-surface">
                      <img
                        src={program.image}
                        alt={`${program.institution} - ${program.title}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={idx < 3 ? "eager" : "lazy"}
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <Badge
                          variant="gold"
                          className="bg-white/95 text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs"
                        >
                          {program.tag}
                        </Badge>
                      </div>
                    </div>

                    {/* Institution Name */}
                    <div className="mt-3.5 flex items-center gap-1.5 px-1">
                      <Landmark className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      <span className="text-xs sm:text-[13px] font-semibold text-brand-navy/85 truncate">
                        {program.institution}
                      </span>
                    </div>

                    {/* Program Title */}
                    <h2 className="mt-2 px-1 text-base sm:text-lg font-bold text-brand-navy tracking-tight leading-snug line-clamp-2 min-h-[3rem] group-hover:text-brand-gold transition-colors">
                      {program.title}
                    </h2>
                  </div>

                  {/* Metadata Row: Date & Location */}
                  <div className="mt-4 px-1 pt-3 border-t border-hairline/80 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
                      <span className="font-medium text-foreground/75">{program.date}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 max-w-[55%]">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
                      <span className="truncate" title={program.location}>
                        {program.location}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Empty Filter State (defensive fallback) */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-hairline">
              <p className="text-sm font-semibold text-brand-navy">No programs found in this category.</p>
              <Button
                variant="pill-gold"
                size="sm"
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Apple-Style Institutional Partnership Band */}
      <section className="bg-surface py-16 md:py-20 border-t border-hairline">
        <div className="container-apple">
          <div className="rounded-3xl border border-hairline bg-white p-8 md:p-12 shadow-card flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold-border bg-brand-gold-soft/80 px-3 py-0.5 text-xs font-semibold text-brand-navy">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                <span>Host an EDUARC Program</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                Bring authentic career workshops to your campus.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We design and deliver interactive seminars, 1-on-1 counselor sessions, and structured
                student roadmaps tailored to your school or college academic schedule.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Button asChild variant="pill-gold" size="pill" className="w-full sm:w-auto">
                <Link to="/partner" className="gap-2 justify-center">
                  <span>Schedule Workshop</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="pill-outline" size="pill" className="w-full sm:w-auto">
                <Link to="/contact">Speak with Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
