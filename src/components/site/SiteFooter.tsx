import { Link } from "@tanstack/react-router";
import { phoneHref, websiteHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";
import { BrandLogo } from "./BrandLogo";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/", label: "Overview" },
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
    <footer className="bg-surface text-[12px] text-muted-foreground">
      <div className="container-apple py-12">
        <div className="grid gap-10 border-b border-hairline pb-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLogo />
            <p className="mt-3 max-w-xs text-[13px]">
              {brand.tagline}. {brand.footerBlurb}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-[12px] font-semibold text-foreground">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-foreground hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
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
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={`mailto:${contact.email}`} className="hover:text-foreground">
              {contact.email}
            </a>
            <a href={phoneHref(contact.phone)} className="hover:text-foreground">
              {contact.phone}
            </a>
            <a href={websiteHref(contact.website)} className="hover:text-foreground">
              {contact.website}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
