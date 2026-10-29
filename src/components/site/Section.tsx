import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";

export function AmbientGlow({ className }: { className?: string | undefined }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-soft opacity-70",
        className,
      )}
      aria-hidden="true"
    />
  );
}

// Keep AmbientBlobs for backwards compatibility but render calm, refined light fields
export function AmbientBlobs({ className }: { className?: string | undefined }) {
  return <AmbientGlow className={className} />;
}

export function PageIntro({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-soft border-b border-hairline/60">
      <div className="container-apple pb-14 pt-16 text-center md:pb-20 md:pt-24">
        <div>
          <p className="type-eyebrow">{eyebrow}</p>
          <h1 className="type-hero mx-auto mt-4 max-w-4xl text-brand-navy tracking-tight">
            {title}
          </h1>
        </div>
        {lead && <p className="type-lead mx-auto mt-5 max-w-2xl text-muted-foreground">{lead}</p>}
        {children && <div className="mt-8 flex justify-center">{children}</div>}
      </div>
    </section>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return <span className="text-gradient-gold">{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "center",
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  lead?: ReactNode | undefined;
  className?: string | undefined;
  align?: "center" | "left" | undefined;
}) {
  return (
    <Reveal className={cn(align === "center" ? "mx-auto text-center" : "", "max-w-3xl", className)}>
      {eyebrow && <p className="type-eyebrow">{eyebrow}</p>}
      <h2 className="type-headline mt-3 text-brand-navy">{title}</h2>
      {lead && <p className="type-lead mt-4 text-muted-foreground leading-relaxed">{lead}</p>}
    </Reveal>
  );
}

export function CtaBand({
  title,
  lead,
}: {
  title?: string | undefined;
  lead?: string | undefined;
}) {
  const { cta } = useSiteContent();
  return (
    <section className="relative isolate overflow-hidden bg-surface border-t border-hairline/80">
      <div className="container-apple py-20 md:py-28">
        <Reveal>
          <div className="glass-dark mx-auto max-w-4xl rounded-3xl p-10 text-center md:p-16 border border-brand-gold/30 shadow-card">
            <p className="type-eyebrow text-brand-gold">Next Steps</p>
            <h2 className="type-headline mx-auto max-w-2xl mt-2 text-white">
              {title ?? cta.title}
            </h2>
            <p className="type-lead mx-auto mt-4 max-w-xl text-ink-muted leading-relaxed">
              {lead ?? cta.lead}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                asChild
                variant="pill-gold"
                size="pill"
                className="w-full sm:w-auto justify-center"
              >
                <Link to="/partner">Partner with us</Link>
              </Button>
              <Button
                asChild
                variant="pill-outline"
                size="pill"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto justify-center"
              >
                <Link to="/contact" className="gap-1.5 justify-center">
                  <span>Contact Our Team</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
