import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";

export function AmbientBlobs({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      <span className="blob blob-teal left-[8%] top-[6%] h-72 w-72" />
      <span className="blob blob-navy right-[6%] top-[18%] h-80 w-80 [animation-delay:-6s]" />
      <span className="blob blob-teal bottom-[-10%] left-[40%] h-64 w-64 opacity-30 [animation-delay:-11s]" />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-soft">
      <AmbientBlobs />
      <div className="container-apple pb-16 pt-20 text-center md:pb-24 md:pt-28">
        <div className="animate-rise">
          <p className="type-eyebrow">{eyebrow}</p>
          <h1 className="type-hero mx-auto mt-4 max-w-4xl text-foreground">{title}</h1>
        </div>
        {lead && (
          <p className="type-lead animate-rise mx-auto mt-6 max-w-2xl text-muted-foreground [animation-delay:120ms]">
            {lead}
          </p>
        )}
        {children && <div className="animate-rise mt-8 [animation-delay:220ms]">{children}</div>}
      </div>
    </section>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return <span className="text-gradient-brand animate-shimmer">{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn(align === "center" ? "mx-auto text-center" : "", "max-w-3xl", className)}>
      {eyebrow && <p className="type-eyebrow">{eyebrow}</p>}
      <h2 className="type-headline mt-3 text-foreground">{title}</h2>
      {lead && <p className="type-lead mt-5 text-muted-foreground">{lead}</p>}
    </Reveal>
  );
}

export function CtaBand({ title, lead }: { title?: string; lead?: string }) {
  const { cta } = useSiteContent();
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      <AmbientBlobs className="opacity-60" />
      <div className="container-apple py-24 md:py-32">
        <Reveal>
          <div className="glass mx-auto max-w-4xl rounded-[2.5rem] px-8 py-16 text-center md:px-16 md:py-20">
            <h2 className="type-headline mx-auto max-w-3xl text-foreground">
              {title ?? cta.title}
            </h2>
            <p className="type-lead mx-auto mt-5 max-w-2xl text-muted-foreground">
              {lead ?? cta.lead}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
              <Button asChild variant="pill" size="pill">
                <Link to="/partner">Partner with us</Link>
              </Button>
              <Button asChild variant="text-link" size="inline">
                <Link to="/contact">
                  Get in touch <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
