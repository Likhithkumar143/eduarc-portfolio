import { createFileRoute, Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content";
import { phoneHref, websiteHref } from "@/content/eduarc";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  Mail,
  Phone,
  ArrowLeft,
  CalendarCheck,
  Clock,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Data Protection — EDUARC Connect" },
      {
        name: "description",
        content:
          "Official Privacy Policy of EDUARC Connect. Understand how we collect, protect, and process student, parent, and institutional guidance information under applicable Indian data protection laws.",
      },
      { property: "og:title", content: "Privacy Policy — EDUARC Connect" },
      {
        property: "og:description",
        content:
          "Transparent, student-first privacy standards and verifiable parental consent practices for educational guidance.",
      },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const { contact } = useSiteContent();
  const effectiveDate = "October 28, 2026";
  const policyVersion = "2026.1";

  return (
    <div className="relative isolate min-h-screen bg-background">
      {/* Header intro */}
      <section className="relative isolate overflow-hidden border-b border-hairline/80 bg-gradient-soft pb-12 pt-14 md:pb-16 md:pt-20">
        <div className="container-apple text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold-soft px-3.5 py-1 text-xs font-semibold text-brand-navy shadow-xs mb-4">
            <ShieldCheck className="h-4 w-4 text-brand-gold" />
            <span>Digital Personal Data Protection &amp; Ethics</span>
          </div>

          <h1 className="type-headline text-brand-navy max-w-3xl mx-auto">
            Privacy Policy &amp; Consent Framework
          </h1>

          <p className="type-lead max-w-2xl mx-auto mt-4 text-muted-foreground">
            How EDUARC Connect handles personal data, mentorship consultations, and parental consent
            with transparency and academic integrity.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5 text-brand-gold" />
              <span>Effective Date: {effectiveDate}</span>
            </span>
            <span className="text-hairline">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-gold" />
              <span>Version: {policyVersion}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main content body */}
      <main className="container-apple py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-12 text-sm leading-relaxed text-foreground/85">
          {/* Section A */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section A</Badge>
              <h2 className="text-lg font-bold text-brand-navy">Introduction &amp; Purpose</h2>
            </div>
            <p>
              EDUARC Connect (&ldquo;EDUARC&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or
              &ldquo;us&rdquo;) provides structured educational guidance, career exploration,
              academic roadmaps, and 1-on-1 mentoring to students, parents/guardians, schools, and
              colleges.
            </p>
            <p>
              We are committed to processing personal data lawfully, fairly, and transparently in
              accordance with applicable Indian data protection laws, including the{" "}
              <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>. This Privacy
              Policy explains what information we collect when you use our website or submit an
              enquiry, how we safeguard it, and your legal rights regarding your personal
              information.
            </p>
          </section>

          {/* Section B */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section B</Badge>
              <h2 className="text-lg font-bold text-brand-navy">Information We Collect</h2>
            </div>
            <p>
              We only collect personal information that is reasonably necessary to provide
              educational guidance, answer your queries, or fulfill institutional partnerships.
              Depending on the role you select when submitting an enquiry, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>
                <strong>Contact Information:</strong> Full name, telephone number, WhatsApp number,
                and email address.
              </li>
              <li>
                <strong>Role &amp; Academic Background:</strong> Whether you are a Student, Parent /
                Guardian, School / College Representative, or Academic Mentor.
              </li>
              <li>
                <strong>Educational Stage:</strong> Current study stage (Class 10, Class 12 / PUC,
                Degree / College, or other).
              </li>
              <li>
                <strong>Institutional &amp; Professional Details:</strong> For institutions, the
                official school or college name and your designation. For mentors, your professional
                designation and academic area of expertise.
              </li>
              <li>
                <strong>Child Details (Parent Submissions):</strong> Child&rsquo;s current
                educational stage and child&rsquo;s name (optional).
              </li>
              <li>
                <strong>Enquiry Remarks &amp; Questions:</strong> Optional questions or career goals
                you choose to share in the remarks field (up to 500 characters).
              </li>
              <li>
                <strong>Technical Session Data:</strong> Strictly functional, encrypted session
                cookies used solely to authenticate authorized staff accessing the{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/admin</code> and{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/reception</code>{" "}
                workspaces. We do not use third-party advertising tracking pixels or data-broker
                cookies.
              </li>
            </ul>
          </section>

          {/* Section C */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section C</Badge>
              <h2 className="text-lg font-bold text-brand-navy">How We Use Information</h2>
            </div>
            <p>
              We use submitted personal information solely for legitimate educational purposes,
              including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>Responding to your counselling and guidance enquiries.</li>
              <li>Scheduling 1-on-1 career exploration calls and sending guidance roadmaps.</li>
              <li>Coordinating institutional career workshops and school orientation programs.</li>
              <li>Verifying academic mentor credentials and scheduling advisory sessions.</li>
              <li>Maintaining operational records in our secure Reception desk.</li>
              <li>
                Sending optional newsletters, guidance updates, or programme notices{" "}
                <strong>only when you explicitly opt in</strong> via the separate promotional
                checkbox.
              </li>
            </ul>
          </section>

          {/* Section D */}
          <section className="space-y-3 rounded-2xl border border-brand-gold/30 bg-brand-gold-soft/50 p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Badge variant="gold">Section D</Badge>
              <h2 className="text-lg font-bold text-brand-navy">
                Children &amp; Parental Consent (DPDPA 2023)
              </h2>
            </div>
            <p className="text-foreground/90">
              EDUARC Connect frequently assists secondary school and senior secondary students under
              the age of 18. We take the privacy and safety of minors with paramount seriousness.
            </p>
            <p className="text-foreground/90">
              In accordance with Section 9 of the Digital Personal Data Protection Act, 2023:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>
                A generic website checkbox alone does not substitute for verifiable parental consent
                where applicable law requires such verification for processing a minor&rsquo;s
                personal data.
              </li>
              <li>
                Guidance roadmaps and consultation sessions for school-age students are conducted
                with parent or lawful guardian awareness and involvement.
              </li>
              <li>
                Parents and lawful guardians may contact us at any time to review, update, or
                request the complete deletion of any personal data submitted by or regarding their
                child.
              </li>
            </ul>
          </section>

          {/* Section E */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section E</Badge>
              <h2 className="text-lg font-bold text-brand-navy">Sharing of Information</h2>
            </div>
            <p className="font-semibold text-brand-navy">
              EDUARC Connect does not sell, rent, trade, or monetize your personal information under
              any circumstances.
            </p>
            <p>
              We share information only under strict confidentiality and on a need-to-know basis
              with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>
                <strong>Authorized EDUARC Staff &amp; Mentors:</strong> Academic coordinators and
                counsellors who conduct sessions and coordinate your requested services.
              </li>
              <li>
                <strong>Vetted Infrastructure Providers:</strong> Trusted cloud database hosting
                (Supabase PostgreSQL) and deployment infrastructure (Vercel) operating under strict
                data protection terms.
              </li>
              <li>
                <strong>Legal Compliance:</strong> When required by court order, law enforcement, or
                statutory authorities in accordance with applicable Indian law.
              </li>
            </ul>
          </section>

          {/* Section F */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section F</Badge>
              <h2 className="text-lg font-bold text-brand-navy">Data Security &amp; Retention</h2>
            </div>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards. All
              data transmitted between your browser and our servers is encrypted using modern TLS
              (HTTPS). Internal staff dashboards are protected with salted PBKDF2 credential
              hashing, encrypted session cookies, and strict database Row-Level Security (RLS).
            </p>
            <p>
              We retain personal data only for as long as necessary to complete your educational
              counselling, maintain ongoing institutional partnerships, and satisfy statutory
              record-keeping requirements. Records that are no longer active or required are
              securely archived or deleted.
            </p>
          </section>

          {/* Section G */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section G</Badge>
              <h2 className="text-lg font-bold text-brand-navy">Your Rights &amp; Choices</h2>
            </div>
            <p>Under the DPDPA 2023 and applicable privacy principles, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>
                <strong>Access &amp; Review:</strong> Request a summary of personal data held about
                you.
              </li>
              <li>
                <strong>Correction &amp; Updating:</strong> Request correction of inaccurate or
                incomplete information.
              </li>
              <li>
                <strong>Withdrawal of Consent:</strong> Withdraw consent for processing or marketing
                communications at any time without penalty.
              </li>
              <li>
                <strong>Erasure &amp; Deletion:</strong> Request the deletion of your personal data
                where ongoing retention is no longer necessary for the original guidance purpose.
              </li>
            </ul>
            <p>
              To exercise any of these rights, simply email our coordinator desk at{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-bold text-brand-gold hover:underline"
              >
                {contact.email}
              </a>
              .
            </p>
          </section>

          {/* Section H */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section H</Badge>
              <h2 className="text-lg font-bold text-brand-navy">
                Cookies &amp; Tracking Technologies
              </h2>
            </div>
            <p>
              EDUARC Connect prioritizes student privacy. We use only strictly essential HTTP
              cookies required for staff portal authentication and CSRF security. We do not deploy
              third-party behavioral tracking cookies, ad retargeting pixels, or invasive
              surveillance scripts.
            </p>
          </section>

          {/* Section I */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section I</Badge>
              <h2 className="text-lg font-bold text-brand-navy">
                Third-Party Links &amp; Services
              </h2>
            </div>
            <p>
              Our website may provide direct action links to third-party services, such as opening
              WhatsApp click-to-chat (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">wa.me</code>) or email
              clients. Once you leave our domain, your interactions are governed by the respective
              third party&rsquo;s privacy policy.
            </p>
          </section>

          {/* Section J */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section J</Badge>
              <h2 className="text-lg font-bold text-brand-navy">Policy Updates</h2>
            </div>
            <p>
              We may periodically revise this Privacy Policy to reflect updates in our guidance
              programs or evolving statutory standards. Any modifications will be posted directly to
              this page with an updated Effective Date and Version identifier.
            </p>
          </section>

          {/* Section K */}
          <section className="space-y-3 rounded-2xl border border-hairline bg-surface/60 p-6">
            <div className="flex items-center gap-2">
              <Badge variant="navy">Section K</Badge>
              <h2 className="text-lg font-bold text-brand-navy">
                Contact Information &amp; Grievance Redressal
              </h2>
            </div>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your
              personal data, please reach out to us:
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-gold shrink-0" />
                <span className="font-semibold text-brand-navy">Email:</span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-brand-navy font-medium hover:underline"
                >
                  {contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-gold shrink-0" />
                <span className="font-semibold text-brand-navy">Phone:</span>
                <a
                  href={phoneHref(contact.phone)}
                  className="text-brand-navy font-medium hover:underline"
                >
                  {contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-brand-gold shrink-0" />
                <span className="font-semibold text-brand-navy">Desk:</span>
                <span>EDUARC Privacy &amp; Guidance Coordination Office</span>
              </p>
            </div>
          </section>

          {/* Back to partner CTA */}
          <div className="border-t border-hairline pt-8 flex flex-wrap items-center justify-between gap-4">
            <Button asChild variant="pill-outline" size="sm">
              <Link to="/partner" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Guidance Enquiry</span>
              </Link>
            </Button>
            <Button asChild variant="pill-gold" size="sm">
              <Link to="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
