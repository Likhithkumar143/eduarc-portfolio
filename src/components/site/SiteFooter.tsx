import { Link } from "@tanstack/react-router";
import { phoneHref, websiteHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";
import { BrandLogo } from "./BrandLogo";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/", label: "Overview" },
      { to: "/mentors", label: "Mentors & Advisors" },
      { to: "/about", label: "About EduArc" },
      { to: "/features", label: "Platform Features" },
    ],
  },
  {
    title: "For Institutions",
    links: [
      { to: "/programs", label: "Programs" },
      { to: "/partner", label: "Partner with us" },
      { to: "/impact", label: "Impact" },
    ],
  },
] as const;

export function SiteFooter() {
  const { contact, brand } = useSiteContent();
  return (
    <footer className="bg-surface text-[11px] text-muted-foreground border-t border-hairline/60">
      <div className="container-apple py-6 sm:py-8">
        <div className="grid gap-6 border-b border-hairline pb-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLogo className="scale-95 origin-left" />
            <p className="mt-1.5 max-w-xs text-[11px] leading-relaxed">
              {brand.tagline}. {brand.footerBlurb}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-foreground hover:underline transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 pt-4 text-[11px] md:flex-row md:items-center md:justify-between">
          <p>
            Copyright © {new Date().getFullYear()} EduArc. All rights reserved.
            <span className="mx-2 text-hairline">|</span>
            <Link to="/admin" className="hover:text-foreground hover:underline">
              Admin
            </Link>
            <span className="mx-2 text-hairline">|</span>
            <Link to="/reception" className="hover:text-foreground hover:underline">
              Reception
            </Link>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">
              {contact.email}
            </a>
            <a href={phoneHref(contact.phone)} className="hover:text-foreground transition-colors">
              {contact.phone}
            </a>
            <a href={websiteHref(contact.website)} className="hover:text-foreground transition-colors">
              {contact.website}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
