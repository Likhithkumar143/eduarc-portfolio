import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  School,
  Camera,
  Landmark,
  User,
  Phone,
  Mail,
  FileText,
  Star,
  Quote,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSiteContent, siteContentQuery } from "@/lib/site-content";
import type { SiteContent } from "@/content/eduarc";
import {
  conductedPrograms,
  getProgramSessionById,
  type ProgramSessionData,
} from "@/content/programs-data";

const defaultProgram = conductedPrograms[0]!;

export const Route = createFileRoute("/programs_/$sessionId")({
  loader: async ({ params, context }): Promise<ProgramSessionData> => {
    let session = getProgramSessionById(params.sessionId);
    try {
      const siteContent = context?.queryClient?.getQueryData<SiteContent>(siteContentQuery.queryKey);
      if (siteContent?.conductedPrograms?.length) {
        const found = siteContent.conductedPrograms.find((p) => p.id === params.sessionId);
        if (found) session = found;
      }
    } catch {
      // fallback
    }
    if (!session) {
      throw notFound();
    }
    return session;
  },
  head: ({ loaderData }) => {
    const program = loaderData || defaultProgram;
    return {
      meta: [
        { title: `${program.title} — ${program.institution} | EDUARC Programs` },
        {
          name: "description",
          content: `${program.description} Conducted at ${program.location} on ${program.date}.`,
        },
        {
          name: "keywords",
          content: `${program.institution}, ${program.title}, EDUARC program case study, school career seminar, student guidance workshop, career roadmap`,
        },
        { property: "og:title", content: `${program.title} | EDUARC Programs` },
        { property: "og:description", content: program.description },
        { property: "og:url", content: `https://eduarc-connect.in/programs/${program.id}` },
        { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://eduarc-connect.in/programs/${program.id}`,
        },
      ],
    };
  },
  component: ProgramSessionDetailPage,
});

function ProgramSessionDetailPage() {
  const loaderSession = Route.useLoaderData();
  const c = useSiteContent();

  const session = useMemo(() => {
    const list =
      c.conductedPrograms && c.conductedPrograms.length > 0
        ? c.conductedPrograms
        : conductedPrograms;
    const match = list.find((p) => p.id === loaderSession?.id);
    return match || loaderSession;
  }, [c.conductedPrograms, loaderSession]);

  if (!session) {
    return (
      <div className="container-apple py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-navy">Program Session Not Found</h1>
        <Button asChild variant="pill-gold" className="mt-6">
          <Link to="/programs">Back to Programs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 md:pb-28">
      <div className="container-wide pt-6 md:pt-10">
        {/* 1. Breadcrumb Back Navigation */}
        <div className="mb-6">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-brand-navy transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Programs</span>
          </Link>
        </div>

        {/* 2. Hero / Overview Section */}
        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Session Details */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                    <span>{session.category}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-brand-navy border border-hairline shadow-2xs">
                    <Landmark className="h-3.5 w-3.5 text-brand-gold" />
                    <span>{session.institution}</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-brand-navy tracking-tight leading-tight">
                  {session.title}
                </h1>

                <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {session.description}
                </p>

                {/* Metadata Row: Date, Duration, Location */}
                <div className="mt-7 pt-6 border-t border-hairline/90 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface border border-hairline text-brand-gold">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Date
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-brand-navy mt-0.5">
                        {session.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface border border-hairline text-brand-gold">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Duration
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-brand-navy mt-0.5">
                        {session.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface border border-hairline text-brand-gold">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Location
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-brand-navy mt-0.5 leading-snug line-clamp-2">
                        {session.location}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Hero Visual Frame */}
            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-2 shadow-card">
                  <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
                    <img
                      src={session.heroImage}
                      alt={`${session.institution} Session Presentation`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. Card 1: Session Photos Gallery */}
        <section className="mb-7 md:mb-8">
          <Reveal delay={150}>
            <div className="rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-hairline/70">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Camera className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-brand-navy tracking-tight">Session Photos</h2>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">5 Photos</span>
              </div>

              {/* Gallery Grid: 1 large on left, 2x2 grid on right */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                {/* Large Main Photo */}
                <div className="md:col-span-6 overflow-hidden rounded-xl sm:rounded-2xl border border-hairline shadow-2xs aspect-[4/3] md:aspect-auto md:h-full">
                  <img
                    src={session.gallery[0]}
                    alt={`${session.institution} Main Presentation`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-102"
                    loading="lazy"
                  />
                </div>

                {/* 2x2 Smaller Photo Grid */}
                <div className="md:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-4">
                  {session.gallery.slice(1, 5).map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="overflow-hidden rounded-xl border border-hairline shadow-2xs aspect-[16/10]"
                    >
                      <img
                        src={photo}
                        alt={`${session.institution} Session Photo ${pIdx + 2}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4. Card 2: Institution Details */}
        <section className="mb-7 md:mb-8">
          <Reveal delay={200}>
            <div className="rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-hairline/70 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Landmark className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-brand-navy tracking-tight">Institution Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Left: School Identity */}
                <div className="md:col-span-7 flex items-start gap-4">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 shadow-xs">
                    <School className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy tracking-tight">
                      {session.institutionDetails.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-medium text-muted-foreground mt-0.5">
                      {session.institutionDetails.type}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      <span>{session.institutionDetails.city}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Contact Information */}
                <div className="md:col-span-5 space-y-3.5 md:border-l md:border-hairline md:pl-8 text-xs">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground/75 shrink-0" />
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Contact Person
                      </span>
                      <span className="font-semibold text-brand-navy">
                        {session.institutionDetails.contactPerson}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground/75 shrink-0" />
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Phone
                      </span>
                      <span className="font-semibold text-brand-navy">
                        {session.institutionDetails.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground/75 shrink-0" />
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Email
                      </span>
                      <span className="font-semibold text-brand-navy">
                        {session.institutionDetails.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 5. Card 3: Session Summary & Featured Quote */}
        <section className="mb-7 md:mb-8">
          <Reveal delay={250}>
            <div className="rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-hairline/70 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-brand-navy tracking-tight">Session Summary</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Left: Summary Paragraph */}
                <div className="lg:col-span-7">
                  <p className="text-sm sm:text-[15px] text-foreground/80 leading-relaxed">
                    {session.summary.text}
                  </p>
                </div>

                {/* Right: Featured Quote Card */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-6 relative">
                    <Quote className="h-8 w-8 text-blue-400/80 mb-2 rotate-180" />
                    <p className="text-sm sm:text-base font-semibold italic text-brand-navy leading-relaxed">
                      "{session.summary.quote}"
                    </p>
                    <span className="mt-3 block text-xs font-semibold text-muted-foreground">
                      {session.summary.quoteAuthor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 6. Card 4: Student Feedback */}
        <section className="mb-10 md:mb-12">
          <Reveal delay={300}>
            <div className="rounded-2xl sm:rounded-3xl border border-hairline/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-hairline/70 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Star className="h-4 w-4 fill-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-brand-navy tracking-tight">Student Feedback</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Left: Rating Metric Box */}
                <div className="lg:col-span-3 text-center lg:text-left lg:border-r lg:border-hairline lg:pr-6">
                  <div className="text-4xl sm:text-5xl font-black text-brand-navy tracking-tight font-display">
                    {session.feedback.rating}
                    <span className="text-xl sm:text-2xl font-normal text-muted-foreground">/5</span>
                  </div>

                  {/* 5 Stars */}
                  <div className="mt-2.5 flex items-center justify-center lg:justify-start gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Based on {session.feedback.totalResponses} responses
                  </p>
                </div>

                {/* Right: 3 Review Testimonial Cards */}
                <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  {session.feedback.reviews.map((rev, rIdx) => (
                    <div
                      key={rIdx}
                      className="rounded-xl border border-hairline bg-surface/50 p-4 flex flex-col justify-between hover:bg-white hover:border-brand-gold/30 hover:shadow-xs transition-all"
                    >
                      <p className="text-xs sm:text-[13px] text-foreground/85 leading-relaxed italic">
                        "{rev.quote}"
                      </p>
                      <span className="text-[11px] font-semibold text-muted-foreground mt-3 pt-2 border-t border-hairline/60">
                        {rev.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 7. Bottom Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-hairline bg-white shadow-xs">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy">
              Interested in a session for your school or college?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              EDUARC conducts customized student workshops and academic guidance seminars across India.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button asChild variant="pill-gold" size="pill" className="w-full sm:w-auto">
              <Link to="/partner" className="gap-1.5 justify-center">
                <span>Request Workshop</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="pill-outline" size="pill" className="w-full sm:w-auto">
              <Link to="/contact">Contact Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
