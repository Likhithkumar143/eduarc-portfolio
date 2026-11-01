import { Link } from "@tanstack/react-router";
import { Mail, Phone, Shield, UserCheck } from "lucide-react";
import { phoneHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";
import { BrandLogo } from "@/components/site/BrandLogo";

export function SiteFooter() {
  const { contact } = useSiteContent();

  return (
    <footer className="border-t border-[#1A2C27] bg-[#243B35] py-5 sm:py-6 text-xs text-[#E8E0D1]">
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo & Copyright */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Link to="/" className="inline-block transition-opacity hover:opacity-90">
            <BrandLogo light className="scale-90 origin-left" />
          </Link>
          <span className="text-[#9AAB94]/40" aria-hidden="true">
            |
          </span>
          <p className="text-[#E8E0D1]/85">© 2026 EDUARC Connect. All rights reserved.</p>
        </div>

        {/* Right: Contact details, Privacy Policy & Portal Icons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3.5 gap-y-1.5">
          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1.5 text-[#E8E0D1] hover:text-[#FAF9F5] transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-[#9AAB94]" />
            <span>{contact.email}</span>
          </a>

          <span className="text-[#9AAB94]/40" aria-hidden="true">
            ·
          </span>

          {/* Contact Phone Number */}
          <a
            href={phoneHref(contact.phone)}
            className="inline-flex items-center gap-1.5 text-[#E8E0D1] hover:text-[#FAF9F5] transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-[#9AAB94]" />
            <span>{contact.phone}</span>
          </a>

          <span className="text-[#9AAB94]/40" aria-hidden="true">
            ·
          </span>

          {/* Privacy Policy */}
          <Link
            to="/privacy-policy"
            className="text-[#E8E0D1] hover:text-[#FAF9F5] hover:underline transition-colors font-medium"
          >
            Privacy Policy
          </Link>

          <span className="text-[#9AAB94]/40" aria-hidden="true">
            ·
          </span>

          {/* Clickable Portal Icons */}
          <div className="flex items-center gap-1.5 pl-0.5">
            <Link
              to="/reception"
              title="Reception Desk"
              aria-label="Reception Desk"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-[#9AAB94]/30 bg-[#1A2C27] text-[#E8E0D1] hover:bg-[#2F4A42] hover:text-[#FAF9F5] hover:border-[#9AAB94]/60 transition-all shadow-2xs"
            >
              <UserCheck className="h-3 w-3" />
            </Link>

            <Link
              to="/admin"
              title="Admin Portal"
              aria-label="Admin Portal"
              className="flex h-6 w-6 items-center justify-center rounded-md border border-[#9AAB94]/30 bg-[#1A2C27] text-[#E8E0D1] hover:bg-[#2F4A42] hover:text-[#FAF9F5] hover:border-[#9AAB94]/60 transition-all shadow-2xs"
            >
              <Shield className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
