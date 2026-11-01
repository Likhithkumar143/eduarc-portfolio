import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
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
import { ProgressiveImage } from "@/components/site/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/lib/site-content";
import {
  conductedPrograms,
  type ProgramSessionData as ConductedProgram,
} from "@/content/programs-data";

export type { ConductedProgram };

type FilterType = "all" | "school" | "college";

export function ProgramsSection({ id }: { id?: string }) {
  const c = useSiteContent();
  const [filter, setFilter] = useState<FilterType>("all");

  const programsList =
    c.conductedPrograms && c.conductedPrograms.length > 0 ? c.conductedPrograms : conductedPrograms;

  const filteredPrograms = useMemo(() => {
    if (filter === "all") return programsList;
    return programsList.filter((p) => p.type === filter);
  }, [filter, programsList]);

  return (
    <div id={id} className="bg-[#FAF9F5]">
      {/* 1. Header Section */}
      <section className="pt-10 md:pt-16 pb-6 md:pb-8">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold text-brand-navy tracking-tight leading-[1.18] sm:leading-[1.15]">
              {c.programsPage?.title || "Our Programs"}
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
              {c.programsPage?.lead ||
                "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges."}
            </p>

            {/* Apple-style Segmented Filter Controls */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === "all"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy hover:border-brand-navy/30"
                }`}
              >
                <span>All Programs</span>
                <span className="text-xs opacity-75">({programsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("school")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === "school"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy hover:border-brand-navy/30"
                }`}
              >
                <School className="h-4 w-4" />
                <span>School Sessions</span>
                <span className="text-xs opacity-75">
                  ({programsList.filter((p) => p.type === "school").length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("college")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === "college"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-white text-muted-foreground border border-hairline hover:text-brand-navy hover:border-brand-navy/30"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Colleges & Universities</span>
                <span className="text-xs opacity-75">
                  ({programsList.filter((p) => p.type === "college").length})
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
                <Link
                  to="/programs/$sessionId"
                  params={{ sessionId: program.id }}
                  className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-3.5 sm:p-4 shadow-xs hover-lift transition-all hover:border-brand-gold/40 hover:shadow-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 block text-left"
                >
                  <article className="flex h-full flex-col justify-between">
                    <div>
                      {/* Campus Image Frame */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-surface">
                        <ProgressiveImage
                          src={program.image}
                          alt={`${program.institution} - ${program.title}`}
                          priority={idx < 3}
                          className="h-full w-full"
                          imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 right-2.5 z-10">
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
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Empty Filter State (defensive fallback) */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-hairline">
              <p className="text-sm font-semibold text-brand-navy">
                No programs found in this category.
              </p>
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
              <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-semibold text-brand-navy tracking-tight leading-snug">
                Bring authentic career workshops to your campus.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
                We design and deliver interactive seminars, 1-on-1 counselor sessions, and
                structured student roadmaps tailored to your school or college academic schedule.
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
