import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/about", label: "About" },
  { to: "/mentors", label: "Mentors" },
  { to: "/programs", label: "Programs" },
  { to: "/features", label: "Features" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

const sectionIdMap: Record<string, string> = {
  "/about": "about",
  "/features": "features",
  "/testimonials": "testimonials",
  "/contact": "contact",
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("hero");
  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSectionNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    isManualScrollRef.current = true;
    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${sectionId}`);
    }

    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 1000);
  };

  // Robust scroll spy for active navigation on homepage
  useEffect(() => {
    if (!isHomePage) return;

    // Check hash on mount
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["hero", "about", "features", "contact", "testimonials"].includes(hash)) {
        setActiveSection(hash);
      }
    }

    const sectionIds = [
      "hero",
      "about",
      "features",
      "contact",
      "testimonials",
    ];

    const updateActiveSection = () => {
      if (isManualScrollRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page detection -> activate testimonials
      if (scrollY + viewportHeight >= documentHeight - 60) {
        setActiveSection("testimonials");
        return;
      }

      // 100px reading line below sticky header
      const readingLine = 100;

      // Check sections in reverse (bottom to top)
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]!;
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= readingLine) {
          setActiveSection(id);
          return;
        }
      }

      setActiveSection("hero");
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current);
      }
    };
  }, [isHomePage]);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close menu when viewport resizes to desktop width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-hairline/80 transition-all duration-200",
          open ? "bg-white" : "glass-nav",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between">
          <BrandLogo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:gap-9 md:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const sectionId = sectionIdMap[item.to];
              const isActive = isHomePage
                ? activeSection === sectionId
                : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={(e) => {
                    if (isHomePage && sectionId) {
                      e.preventDefault();
                      handleSectionNavigate(sectionId);
                    }
                  }}
                  className={cn(
                    "text-[14px] font-medium transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 py-0.5",
                    isActive
                      ? "text-primary font-semibold relative after:absolute after:-bottom-1.5 after:left-1 after:right-1 after:h-[2px] after:bg-accent after:rounded-full"
                      : "text-foreground/80",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="pill-gold" size="pill-sm">
              <Link to="/partner" className="gap-1.5">
                <span>Partner with us</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface md:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Rendered into document.body to prevent containing-block clipping) */}
      {mounted &&
        open &&
        createPortal(
          <div
            id="mobile-nav"
            ref={menuRef}
            className="fixed inset-x-0 top-16 bottom-0 z-50 bg-white md:hidden overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="container-wide py-6 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
              <div>
                <nav
                  className="flex flex-col divide-y divide-hairline"
                  aria-label="Mobile navigation"
                >
                  {navItems.map((item) => {
                    const sectionId = sectionIdMap[item.to];
                    const isActive = isHomePage
                      ? activeSection === sectionId
                      : pathname.startsWith(item.to);

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={(e) => {
                          setOpen(false);
                          if (isHomePage && sectionId) {
                            e.preventDefault();
                            setTimeout(() => {
                              handleSectionNavigate(sectionId);
                            }, 50);
                          }
                        }}
                        className={cn(
                          "py-4 text-lg font-semibold transition-colors flex items-center justify-between",
                          isActive
                            ? "text-primary font-bold"
                            : "text-foreground hover:text-primary",
                        )}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-accent" />
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-6 mt-4 border-t border-hairline flex flex-col gap-3">
                  <Button
                    asChild
                    variant="pill-gold"
                    size="pill"
                    className="w-full justify-center"
                  >
                    <Link
                      to="/partner"
                      onClick={() => setOpen(false)}
                    >
                      Partner with us
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="pill-outline"
                    size="pill"
                    className="w-full justify-center"
                  >
                    <Link
                      to="/contact"
                      onClick={(e) => {
                        setOpen(false);
                        if (isHomePage) {
                          e.preventDefault();
                          setTimeout(() => {
                            handleSectionNavigate("contact");
                          }, 50);
                        }
                      }}
                    >
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Bottom Quick Help & Legal */}
              <div className="pt-6 mt-8 border-t border-hairline/80 flex flex-col gap-3 text-xs text-muted-foreground pb-8">
                <div className="flex items-center justify-between">
                  <span>Helpline:</span>
                  <a
                    href="tel:+919901436625"
                    className="font-semibold text-primary hover:underline"
                  >
                    +91 99014 36625
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <a
                    href="mailto:connect@eduarc.in"
                    className="font-semibold text-accent hover:underline"
                  >
                    connect@eduarc.in
                  </a>
                </div>
                <div className="pt-2 text-center border-t border-hairline/60">
                  <Link
                    to="/privacy-policy"
                    onClick={() => setOpen(false)}
                    className="text-[11px] text-muted-foreground hover:text-primary hover:underline"
                  >
                    Privacy Policy &amp; Data Protection
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
