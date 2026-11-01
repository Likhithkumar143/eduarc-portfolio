import { Link } from "@tanstack/react-router";
import { Mail, Phone, Shield, UserCheck } from "lucide-react";
import { phoneHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";
import { BrandLogo } from "@/components/site/BrandLogo";

export function SiteFooter() {
  const { contact } = useSiteContent();

  return (
    <footer
      id="site-footer"
      className="border-t border-hairline/80 bg-[#FAF9F5] py-2 sm:py-2.5 text-xs text-[#343A36]"
    >
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Brand Logo & Copyright */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <BrandLogo className="scale-90 origin-left" />
          <span className="text-[#E2DBD0]" aria-hidden="true">
            |
          </span>
          <p className="text-[#616A64]">© 2026 EDUARC Connect. All rights reserved.</p>
        </div>

        {/* Right: Contact details, Privacy Policy & Portal Icons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3.5 gap-y-1">
          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1.5 text-[#343A36] hover:text-[#B47A4B] transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-[#243B35]" />
            <span>{contact.email}</span>
          </a>

          <span className="text-[#E2DBD0]" aria-hidden="true">
            ·
          </span>

          {/* Contact Phone Number */}
          <a
            href={phoneHref(contact.phone)}
            className="inline-flex items-center gap-1.5 text-[#343A36] hover:text-[#B47A4B] transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-[#243B35]" />
            <span>{contact.phone}</span>
          </a>

          <span className="text-[#E2DBD0]" aria-hidden="true">
            ·
          </span>

          {/* Privacy Policy */}
          <Link
            to="/privacy-policy"
            className="text-[#343A36] hover:text-[#B47A4B] hover:underline transition-colors font-medium"
          >
            Privacy Policy
          </Link>

          <span className="text-[#E2DBD0]" aria-hidden="true">
            ·
          </span>

          {/* Clickable Portal Icons */}
          <div className="flex items-center gap-1.5 pl-0.5">
            <Link
              to="/reception"
              title="Reception Desk"
              aria-label="Reception Desk"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E2DBD0] bg-white text-[#243B35] hover:bg-[#FAF9F5] hover:border-[#243B35]/40 transition-all shadow-2xs"
            >
              <UserCheck className="h-3 w-3" />
            </Link>

            <Link
              to="/admin"
              title="Admin Portal"
              aria-label="Admin Portal"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E2DBD0] bg-white text-[#243B35] hover:bg-[#FAF9F5] hover:border-[#243B35]/40 transition-all shadow-2xs"
            >
              <Shield className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
