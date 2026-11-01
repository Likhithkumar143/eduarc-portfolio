import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/about", label: "About" },
  { to: "/mentors", label: "Mentors" },
  { to: "/programs", label: "Programs" },
  { to: "/features", label: "Features" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function MagneticDockNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rafId = useRef<number | null>(null);

  const [activeIndicator, setActiveIndicator] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  // Update the sliding active indicator position based on TanStack Router pathname
  const updateActiveIndicator = useCallback(() => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();

    const activeIndex = navItems.findIndex(
      (item) => pathname === item.to || pathname.startsWith(item.to + "/"),
    );

    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const activeEl = itemRefs.current[activeIndex];
      if (activeEl) {
        const itemRect = activeEl.getBoundingClientRect();
        setActiveIndicator({
          left: itemRect.left - navRect.left,
          width: itemRect.width,
          opacity: 1,
        });
        return;
      }
    }

    setActiveIndicator((prev) => ({ ...prev, opacity: 0 }));
  }, [pathname]);

  // Recalculate indicator position on route change, window resize, and font load
  useEffect(() => {
    updateActiveIndicator();
    const handleResize = () => updateActiveIndicator();
    window.addEventListener("resize", handleResize);

    // Minor delay to allow fonts/layouts to settle
    const timeout = setTimeout(updateActiveIndicator, 50);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [updateActiveIndicator]);

  // Magnetic dock hover handler (macOS dock physics)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check for prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Disable magnetic cursor effects on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    const mouseX = e.clientX;
    const isTablet = window.innerWidth < 1024;
    const maxScale = isTablet ? 1.07 : 1.14;
    const nearbyMaxScale = isTablet ? 1.04 : 1.07;
    const influenceRadius = isTablet ? 85 : 120;
    const magneticPull = isTablet ? 1.5 : 3.0;

    rafId.current = requestAnimationFrame(() => {
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - itemCenterX);

        if (distance < influenceRadius) {
          const factor = Math.cos((distance / influenceRadius) * (Math.PI / 2));
          // Scale interpolates smoothly between 1.0 and maxScale
          const scale = 1.0 + (maxScale - 1.0) * Math.pow(factor, 2);
          // Subtle horizontal magnetic pull towards mouse
          const shiftX = ((mouseX - itemCenterX) / (distance + 40)) * magneticPull;

          el.style.transform = `scale(${scale.toFixed(3)}) translate3d(${shiftX.toFixed(2)}px, -1px, 0)`;
          el.style.transition = "transform 100ms cubic-bezier(0.25, 1, 0.5, 1)";
          el.style.zIndex = "10";
        } else {
          el.style.transform = "scale(1) translate3d(0, 0, 0)";
          el.style.transition = "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)";
          el.style.zIndex = "1";
        }
      });
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    itemRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transform = "scale(1) translate3d(0, 0, 0)";
      el.style.transition = "transform 300ms cubic-bezier(0.25, 1, 0.5, 1)";
      el.style.zIndex = "1";
    });
  };

  return (
    <nav
      ref={navRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative hidden items-center gap-1.5 lg:gap-3 md:flex px-3 py-1.5 rounded-full border border-hairline/70 bg-white/60 backdrop-blur-md shadow-[0_2px_12px_rgba(36,59,53,0.04)]"
      aria-label="Main navigation"
    >
      {/* Sliding active route indicator (pill & subtle terracotta bottom bar) */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1 rounded-full bg-[#E8E0D1]/60 border border-hairline/60 -z-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
        style={{
          left: `${activeIndicator.left}px`,
          width: `${activeIndicator.width}px`,
          opacity: activeIndicator.opacity,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0.5 h-[2px] rounded-full bg-accent transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
        style={{
          left: `${activeIndicator.left + 8}px`,
          width: `${Math.max(0, activeIndicator.width - 16)}px`,
          opacity: activeIndicator.opacity,
        }}
      />

      {navItems.map((item, index) => {
        const isActive = pathname === item.to || pathname.startsWith(item.to + "/");

        return (
          <Link
            key={item.to}
            to={item.to}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={cn(
              "relative z-1 text-[13.5px] lg:text-[14px] font-medium px-3 py-1 rounded-full select-none cursor-pointer",
              "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive ? "text-primary font-semibold" : "text-foreground/80 hover:text-accent",
            )}
            style={{
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
