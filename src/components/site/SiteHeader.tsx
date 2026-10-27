import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "@/components/ui/button";

export const navItems = [
  { to: "/about", label: "About" },
  { to: "/mentors", label: "Mentors" },
  { to: "/features", label: "Features" },
  { to: "/programs", label: "Programs" },
  { to: "/impact", label: "Impact" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-hairline/70">
      <div className="container-wide flex h-14 items-center justify-between">
        <BrandLogo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="pill" size="pill-sm">
            <Link to="/partner">Partner with us</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="container-wide flex flex-col gap-1 pb-6 pt-2 md:hidden animate-in fade-in slide-in-from-top-2"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="border-b border-hairline py-3 text-2xl font-semibold tracking-tight text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="pill" size="pill" className="mt-4">
            <Link to="/partner" onClick={() => setOpen(false)}>
              Partner with us
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
