import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Map, Quote } from "lucide-react";
import heroImg from "@/assets/hero-students-clean.jpg";
import futureImg from "@/assets/future-student.jpg";
import campusImg from "@/assets/campus.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { AmbientBlobs, CtaBand, GradientText, SectionHeading } from "@/components/site/Section";
import { FeatureIcon } from "@/components/site/icons";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduArc — Empowering Students for a Brighter Future" },
      {
        name: "description",
        content:
          "Career guidance and education support platform for schools and colleges. Personalized roadmaps, expert mentors and real outcomes.",
      },
      { property: "og:title", content: "EduArc — Empowering Students for a Brighter Future" },
      {
        property: "og:description",
        content: "Career guidance and education support platform for schools and colleges.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const c = useSiteContent();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-soft">
        <AmbientBlobs />
        <div className="container-apple pt-20 text-center md:pt-28">
          <div className="animate-rise">
            <p className="type-eyebrow">{c.home.eyebrow}</p>
            <h1 className="type-hero mx-auto mt-4 max-w-4xl text-foreground">
              {c.home.title} <GradientText>{c.home.titleHighlight}</GradientText>
            </h1>
          </div>
          <p className="type-lead animate-rise mx-auto mt-6 max-w-2xl text-muted-foreground [animation-delay:120ms]">
            {c.home.lead}
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-6 [animation-delay:220ms]">
            <Button asChild variant="pill" size="pill">
              <Link to="/partner">Partner with us</Link>
            </Button>
            <Button asChild variant="text-link" size="inline">
              <Link to="/features">
                Explore the platform <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="container-wide relative mt-14 md:mt-20">
          <div className="animate-zoom-in relative mx-auto max-w-5xl [animation-delay:200ms]">
            <img
              src={heroImg}
              alt="Two smiling students with backpacks, books and a laptop"
              width={1264}
              height={848}
              className="w-full rounded-t-[2rem] object-cover"
            />
            <div className="glass animate-float absolute left-3 top-[18%] hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex md:-left-8">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                <Map className="h-4 w-4" />
              </span>
              <span className="text-left">
                <span className="block text-[13px] font-semibold text-foreground">
                  Career Roadmap
                </span>
                <span className="mt-1 block h-1.5 w-28 rounded-full bg-hairline">
                  <span className="block h-1.5 w-[72%] rounded-full bg-brand-teal" />
                </span>
              </span>
            </div>
            <div className="glass animate-float-delayed absolute bottom-[22%] right-3 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex md:-right-8">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-brand">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <span className="text-left">
                <span className="block text-[13px] font-semibold text-foreground">
                  Mentor session
                </span>
                <span className="block text-[12px] text-muted-foreground">One‑on‑one guidance</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-apple">
          <SectionHeading
            eyebrow="Our mission"
            title={c.home.missionTitle}
            lead={c.home.missionLead}
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.pillars.map((p, i) => (
              <Reveal key={p.title + i} delay={i * 80}>
                <article className="hover-lift h-full rounded-3xl bg-surface p-7">
                  <FeatureIcon name={p.icon} />
                  <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[15px] text-muted-foreground">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tiles */}
      <section className="bg-surface py-3">
        <div className="container-wide grid gap-3 md:grid-cols-2">
          <Tile
            eyebrow="Platform"
            title="Everything students need. In one place."
            body="Roadmaps, mentor sessions, certificates and an admin dashboard."
            to="/features"
            cta="See features"
            art={<IconsArt />}
          />
          <Tile
            eyebrow="Partner with us"
            title="Talk to a counsellor."
            body="Share your details and our team will reach out to guide you."
            to="/partner"
            cta="Share your details"
            dark
            art={<PartnerArt />}
          />
          <Tile
            eyebrow="Programs"
            title="Built for schools & colleges."
            body="From high schools to professional and technical institutions."
            to="/programs"
            cta="View programs"
            dark
            image={campusImg}
          />
          <Tile
            eyebrow="Impact"
            title={(c.impacts[0]?.title ?? "Real results") + "."}
            body="More focused, engaged and future‑ready student communities."
            to="/impact"
            cta="See the impact"
            image={futureImg}
          />
        </div>
      </section>

      {/* Quote */}
      <section className="bg-background py-24 md:py-32">
        <Reveal className="container-apple text-center">
          <Quote className="mx-auto h-10 w-10 text-brand-teal" strokeWidth={1.5} />
          <p className="type-headline mx-auto mt-6 max-w-3xl text-foreground">
            {c.home.quote} <GradientText>{c.home.quoteHighlight}</GradientText>
          </p>
          <p className="type-lead mx-auto mt-5 max-w-xl text-muted-foreground">{c.home.quoteSub}</p>
        </Reveal>
      </section>

      {/* Full-bleed image with glass panel */}
      <section className="relative isolate overflow-hidden">
        <img
          src={futureImg}
          alt="A student with a backpack looking out over a city at sunrise"
          width={1600}
          height={1008}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-ink" />
        <div className="container-apple flex min-h-[640px] flex-col justify-end pb-16 md:min-h-[760px] md:pb-20">
          <Reveal>
            <div className="glass-dark max-w-xl rounded-[2rem] p-8 md:p-10">
              <h2 className="type-title text-ink-foreground md:text-5xl md:leading-[1.08]">
                {c.home.bannerTitle}
              </h2>
              <div className="mt-8">
                <Button asChild variant="pill-light" size="pill">
                  <Link to="/about">Why partner with EduArc</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function Tile({
  eyebrow,
  title,
  body,
  to,
  cta,
  dark = false,
  image,
  art,
}: {
  eyebrow: string;
  title: string;
  body: string;
  to: "/features" | "/partner" | "/programs" | "/impact";
  cta: string;
  dark?: boolean;
  image?: string;
  art?: React.ReactNode;
}) {
  return (
    <Reveal>
      <Link
        to={to}
        className={
          "group relative isolate flex min-h-[420px] flex-col items-center justify-start overflow-hidden rounded-[2rem] px-8 pt-16 text-center transition-shadow duration-500 hover:shadow-lift md:min-h-[520px] " +
          (dark ? "bg-ink text-ink-foreground" : "bg-background text-foreground")
        }
      >
        {dark && (
          <span
            className="blob blob-teal -bottom-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 opacity-25"
            aria-hidden="true"
          />
        )}
        <p className="type-eyebrow">{eyebrow}</p>
        <h3 className="type-title mt-3 max-w-md">{title}</h3>
        <p
          className={
            "mt-3 max-w-sm text-[17px] " + (dark ? "text-ink-muted" : "text-muted-foreground")
          }
        >
          {body}
        </p>
        <span className="mt-6 inline-flex items-center gap-1 text-[17px] text-brand-teal group-hover:underline">
          {cta}{" "}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            width={1600}
            height={1008}
            className="mt-auto h-48 w-full max-w-md rounded-t-[1.5rem] object-cover transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02] md:h-60"
          />
        ) : (
          <div
            className={
              "mt-auto h-48 w-full max-w-md rounded-t-[1.5rem] transition-transform duration-700 group-hover:-translate-y-2 md:h-60 " +
              (dark ? "bg-gradient-brand" : "bg-surface")
            }
            aria-hidden="true"
          >
            {art}
          </div>
        )}
      </Link>
    </Reveal>
  );
}

function PartnerArt() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-8">
      {["w-[78%]", "w-[62%]", "w-[70%]"].map((w, i) => (
        <div
          key={w}
          className={
            "glass-dark flex h-10 items-center rounded-xl px-4 " +
            (i % 2 ? "animate-float-delayed" : "animate-float")
          }
        >
          <span className={"h-2 rounded-full bg-ink-foreground/50 " + w} />
        </div>
      ))}
      <div className="flex h-10 items-center justify-center self-end rounded-full bg-ink-foreground px-6 text-[13px] font-semibold text-brand">
        Submit
      </div>
    </div>
  );
}

function IconsArt() {
  return (
    <div className="grid h-full grid-cols-3 content-center gap-4 px-8">
      {(["map", "video", "user", "award", "bell", "layout"] as const).map((n, i) => (
        <div key={n} className="flex justify-center">
          <FeatureIcon
            name={n}
            className={
              "h-14 w-14 bg-background shadow-card " +
              (i % 2 ? "animate-float" : "animate-float-delayed")
            }
          />
        </div>
      ))}
    </div>
  );
}
