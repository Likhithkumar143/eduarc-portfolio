import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string | undefined;
  delay?: number | undefined;
  as?: ElementType | undefined;
};

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    // Immediately reveal if element is already within or near viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || 800) + 80 && rect.bottom > -80) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "60px 0px 60px 0px" },
    );
    io.observe(el);

    // Fallback: guarantee visibility within 800ms
    const timer = setTimeout(() => {
      if (el && !el.classList.contains("is-visible")) {
        el.classList.add("is-visible");
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <Tag ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
