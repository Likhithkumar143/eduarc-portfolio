import { Link } from "@tanstack/react-router";
import { Mail, Phone, Shield, UserCheck } from "lucide-react";
import { phoneHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";
import { BrandLogo } from "@/components/site/BrandLogo";

export function SiteFooter() {
  const { contact } = useSiteContent();

  return (
    <footer className="border-t border-hairline/80 bg-background/80 backdrop-blur-xs py-2.5 sm:py-3 text-xs text-muted-foreground">
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Logo & Copyright */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Link to="/" className="inline-block transition-opacity hover:opacity-90">
            <BrandLogo className="scale-90 origin-left" />
          </Link>
          <span className="text-hairline/80" aria-hidden="true">
            |
          </span>
          <p>© 2026 EDUARC Connect. All rights reserved.</p>
        </div>

        {/* Right: Contact details, Privacy Policy & Portal Icons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3.5 gap-y-1.5">
          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1.5 hover:text-brand-navy transition-colors"
          >
            <Mail className="h-3 w-3 text-[#1E5450]" />
            <span>{contact.email}</span>
          </a>

          <span className="text-hairline/80" aria-hidden="true">
            ·
          </span>

          {/* Contact Phone Number */}
          <a
            href={phoneHref(contact.phone)}
            className="inline-flex items-center gap-1.5 hover:text-brand-navy transition-colors"
          >
            <Phone className="h-3 w-3 text-[#1E5450]" />
            <span>{contact.phone}</span>
          </a>

          <span className="text-hairline/80" aria-hidden="true">
            ·
          </span>

          {/* Privacy Policy */}
          <Link
            to="/privacy-policy"
            className="hover:text-brand-navy hover:underline transition-colors font-medium"
          >
            Privacy Policy
          </Link>

          <span className="text-hairline/80" aria-hidden="true">
            ·
          </span>

          {/* Clickable Portal Icons */}
          <div className="flex items-center gap-1.5 pl-0.5">
            <Link
              to="/reception"
              title="Reception Desk"
              aria-label="Reception Desk"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-hairline/80 bg-surface/50 text-muted-foreground hover:border-[#1E5450]/40 hover:bg-[#EBF5F3] hover:text-[#1E5450] transition-all shadow-2xs"
            >
              <UserCheck className="h-3 w-3" />
            </Link>

            <Link
              to="/admin"
              title="Admin Portal"
              aria-label="Admin Portal"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-hairline/80 bg-surface/50 text-muted-foreground hover:border-[#1E5450]/40 hover:bg-[#EBF5F3] hover:text-[#1E5450] transition-all shadow-2xs"
            >
              <Shield className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
