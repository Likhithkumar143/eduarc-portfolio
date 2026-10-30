import { Link, useRouterState } from "@tanstack/react-router";
import markUrl from "@/assets/eduarc-mark.png";
import textUrl from "@/assets/eduarc-text.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, light = false }: { className?: string; light?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHomePage = pathname === "/";

  return (
    <Link
      to="/"
      onClick={(e) => {
        if (isHomePage) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          history.replaceState(null, "", "/");
        }
      }}
      className={cn(
        "flex items-center gap-2 sm:gap-2.5 group transition-opacity hover:opacity-90 select-none",
        className,
      )}
      aria-label="EDUARC Home"
    >
      <img
        src={markUrl}
        alt="EDUARC Emblem"
        width={28}
        height={32}
        className="h-7 sm:h-8 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <img
        src={textUrl}
        alt="EduArc — Ambitious to Achievement"
        width={91}
        height={24}
        className={cn(
          "h-5 sm:h-[22px] w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105",
          light && "brightness-0 invert",
        )}
      />
    </Link>
  );
}
