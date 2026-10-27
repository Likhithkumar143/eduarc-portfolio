import { Link } from "@tanstack/react-router";
import markUrl from "@/assets/eduarc-mark.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="EduArc home">
      <img src={markUrl} alt="" width={28} height={32} className="h-7 w-auto" />
      <span className="text-[19px] font-bold tracking-tight">
        <span className={light ? "text-ink-foreground" : "text-brand"}>Edu</span>
        <span className="text-brand-teal">Arc</span>
      </span>
    </Link>
  );
}
