# EduArc Website Comprehensive Audit Report

**Date of Audit:** October 29, 2026  
**Target Platform:** EduArc — Student Career Guidance Platform (`https://eduarc-connect.in`)  
**Repository:** `https://github.com/Likhithkumar143/eduarc-portfolio.git`  
**Audit Standard:** EduArc Website Audit, Repair & Optimization PRD (Phases 0–8)  
**Execution Mode:** Defensive, Source-First Inspection & Verification

---

## 1. Executive Summary

A comprehensive architectural, functional, security, and performance inspection was conducted on the EduArc codebase. The platform is built on modern web technologies (TanStack Start, TanStack Router, React 19, Vite, Tailwind CSS v4, and Supabase Serverless Postgres).

Overall, the core architecture is well-designed with strong separation between public marketing brochure content (`src/content/eduarc.ts`) and dynamic database storage (`site_content` and `partner_enquiries`). Critical security controls such as authenticated session cookies (`requireAdmin()`, `requireReception()`), sliding-window rate limiting, and password hashing with PBKDF2 are already implemented.

However, several actionable findings across security, discoverability, code quality, and responsive asset handling were identified that require prioritized remediation.

---

## 2. Baseline Status & Automated Checks

| Check                      | Tool / Command                 | Initial Result            | Status             | Notes                                                                    |
| -------------------------- | ------------------------------ | ------------------------- | ------------------ | ------------------------------------------------------------------------ |
| **TypeScript Typecheck**   | `npx tsc --noEmit`             | Clean exit (Code 0)       | ✅ PASSED          | Zero compilation errors across all modules.                              |
| **Unit Test Suite**        | `npm test` (Vitest)            | 36 / 36 tests passed      | ✅ PASSED          | All 5 test suites (Auth, Enquiries, Header, Admin, Routing) pass.        |
| **Production Build**       | `npm run build` (Vite + Nitro) | Clean client & SSR bundle | ✅ PASSED          | Both client and serverless Cloudflare/Vercel output compile cleanly.     |
| **Code Formatting / Lint** | `npm run lint` (`eslint .`)    | 38 errors, 7 warnings     | ⚠️ ACTION REQUIRED | 37 are Prettier formatting inconsistencies; 1 is an `any` type in tests. |

---

## 3. Findings by PRD Phase

### Phase 1: Security & Privacy (P0)

- **Finding SEC-01 (P0 — Addressed & Verified): Server-Side Service Role Key Isolation**
  - _Evidence:_ `src/integrations/supabase/client.server.ts` strictly checks `process.env["SUPABASE_SERVICE_ROLE_KEY"]` and throws an error if missing. It is never imported into browser client bundles.
  - _Evidence:_ Client code in `src/integrations/supabase/client.ts` uses only publishable anonymous keys (`VITE_SUPABASE_PUBLISHABLE_KEY` / `sb_publishable_...`).
  - _Status:_ Verified safe. Service role credentials are never leaked to client bundles.

- **Finding SEC-02 (P0 — Action Needed): Hardcoded Default Supabase Publishable Fallbacks**
  - _Evidence:_ `src/integrations/supabase/client.ts` lines 56–57 and `src/lib/site-content.functions.ts` lines 8–10 contain fallback project URLs and publishable anon keys:
    ```ts
    const DEFAULT_SUPABASE_URL = "https://lionurqqysgonxrpzovv.supabase.co";
    const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_a4Y9SoiVOegyPtFzoLG4lw_wcd39ojW";
    ```
  - _Risk:_ While publishable keys are public by design in Supabase RLS, committing specific project endpoints can cause development/staging traffic to accidentally leak into production instances if environment variables are unset.
  - _Recommended Fix:_ Ensure environment variables take strict precedence; provide graceful fallback to local brochure defaults (`defaultContent`) if Supabase is unconfigured, preventing unintended database calls.

- **Finding SEC-03 (P1 — Action Needed): Missing File Size Limit on Client-Side Mentor Photo Upload**
  - _Evidence:_ In `src/components/admin/MentorsEditor.tsx` (`compressImage` function), file type is checked (`file.type.startsWith("image/")`), but `file.size` is unconstrained before FileReader reads the file into memory.
  - _Risk:_ If an administrator attempts to upload an excessively large image (e.g., >25MB RAW or uncompressed image), browser memory exhaustion or canvas crash can occur.
  - _Recommended Fix:_ Enforce a strict 10MB ceiling in `compressImage` with user-friendly error feedback.

- **Finding SEC-04 (P1 — Verified Safe): Brute-Force & Rate Limiting Controls**
  - _Evidence:_ `src/lib/rate-limit.server.ts` provides sliding-window rate limiting with IP extraction that prioritizes tamper-resistant edge headers (`cf-connecting-ip`, `x-real-ip`) over client-spoofable `x-forwarded-for`.
  - _Evidence:_ Account lockout after 5 consecutive failures for 15 minutes is enforced in `src/lib/staff.server.ts`.

---

### Phase 2: Functional Reliability (P1)

- **Finding FUN-01 (P1 — Verified): Navigation Integrity & Legacy Route Handling**
  - _Evidence:_ All primary navigation header links (`/`, `/about`, `/mentors`, `/programs`, `/features`, `/impact`, `/contact`, `/partner`) resolve to valid routes.
  - _Evidence:_ Legacy route `/pricing` throws a 301 redirect to `/` in `src/routes/pricing.tsx`.
  - _Evidence:_ Legacy route `/mentor` redirects to `/mentors` in `src/routes/mentor.tsx`.
  - _Evidence:_ 404 handler (`NotFoundComponent`) and server error boundary (`ErrorComponent`) are mounted in `src/routes/__root.tsx`.

- **Finding FUN-02 (P1 — Verified): Form Submission & Duplicate Prevention**
  - _Evidence:_ `PartnerForm.tsx` disables the submit button during submission (`disabled={busy}`), preventing double submission and race conditions.
  - _Evidence:_ Honeypot field (`data.website`) silently drops automated bot spam.
  - _Evidence:_ Consent recording (`consent_given`, `consent_version`, `consent_timestamp`) conforms to Indian DPDPA standards.

---

### Phase 3: UI/UX & Responsive Design (P1)

- **Finding UI-01 (P1 — Addressed): Hero Visual Clearance on Contact Page**
  - _Evidence:_ Previous counselor hero layout on `/contact` suffered from aggressive vertical crop on ultrawide monitors and top gradient overlay covering communication icons.
  - _Status:_ Remediated in previous commit by establishing proportional right-aligned framing (`w-[52%]–w-[65%]` with `object-[82%_top]`), clearing top gradient masks over the icons, and providing generous sky headroom.

- **Finding UI-02 (P2 — Addressed): Footer Density & Spacing**
  - _Evidence:_ Footer was previously expansive and duplicated primary header links.
  - _Status:_ Remediated; vertical padding compressed to `py-2.5 sm:py-3`, redundant navigation removed, and portal links converted to streamlined icon buttons.

---

### Phase 4: Mentor & Program Content (P1)

- **Finding CON-01 (P1 — Verified): Authentic Copy Standards**
  - _Evidence:_ All mentor profiles, program tier descriptions, and institutional deliverables in `src/content/eduarc.ts` reflect authentic educational guidance. No fabricated certifications, guaranteed job placements, or false university accreditations are present.
  - _Evidence:_ Fallback initials avatar (`initials(mentor.name)`) renders cleanly whenever a mentor photo URL is absent or invalid.

---

### Phase 5: Performance & Reliability (P1/P2)

- **Finding PERF-01 (P2 — Action Needed): Image Sizing & Priority Loading**
  - _Evidence:_ The HD counselor banner on the Contact page (`contact-hero-counselor-hd.png`) is 5.65 MB (4096x2286). While the visual quality is high, serving a 5.65 MB PNG directly over cellular connections can increase Time to First Contentful Paint (FCP).
  - _Recommended Fix:_ Ensure appropriate `fetchpriority="high"` and responsive scaling attributes are applied, or generate an optimized WebP variant alongside the PNG for modern browsers.

---

### Phase 6: SEO & Discoverability (P2)

- **Finding SEO-01 (P2 — Action Needed): Missing `sitemap.xml`**
  - _Evidence:_ `public/sitemap.xml` is completely absent from the repository. Search engines cannot discover all canonical public pages through a declarative XML sitemap.
  - _Recommended Fix:_ Generate `public/sitemap.xml` referencing all 9 public routes with canonical URLs (`https://eduarc-connect.in/...`).

- **Finding SEO-02 (P2 — Action Needed): Missing Sitemap Directive in `robots.txt`**
  - _Evidence:_ `public/robots.txt` exists and correctly disallows `/admin` and `/reception`, but does not declare `Sitemap: https://eduarc-connect.in/sitemap.xml`.
  - _Recommended Fix:_ Add the sitemap directive to `public/robots.txt`.

- **Finding SEO-03 (P2 — Action Needed): Missing Canonical Link Elements**
  - _Evidence:_ Public pages define `<title>`, `<meta name="description">`, and OpenGraph properties, but lack `<link rel="canonical" href="...">`.
  - _Recommended Fix:_ Add canonical URL links to all public routes to prevent duplicate content indexing.

---

### Phase 7: Accessibility (P2)

- **Finding A11Y-01 (P2 — Verified): Screen Reader & Keyboard Navigation**
  - _Evidence:_ Skip to main content link (`#main-content`) is present in `src/routes/__root.tsx`.
  - _Evidence:_ Interactive portal icons in `SiteFooter.tsx` include `aria-label` and `title` attributes ("Reception Desk", "Admin Portal").
  - _Evidence:_ Official X/Twitter SVG logo includes `aria-hidden="true"`.
  - _Evidence:_ Form fields in `PartnerForm.tsx` have associated `<Label htmlFor={...}>` elements and clear validation error alerts.

---

### Phase 8: Analytics & Trust (P2)

- **Finding TRU-01 (P2 — Verified): Transparent Privacy Policy**
  - _Evidence:_ `src/routes/privacy-policy.tsx` provides a comprehensive, multi-section privacy policy tailored specifically to student counselling, minor consent (under-18 parental involvement), and data retention under the Digital Personal Data Protection Act (DPDPA), 2023.
  - _Evidence:_ No third-party behavioral tracking or unconsented analytics trackers are loaded in client code.

---

## 4. Prioritized Action Matrix

| Issue ID    | Severity | Area         | Action Required                                                               |
| ----------- | -------- | ------------ | ----------------------------------------------------------------------------- |
| **SEC-03**  | P1       | Security     | Add 10MB file size validation to `MentorsEditor.tsx` image upload.            |
| **SEO-01**  | P2       | SEO          | Create `public/sitemap.xml` with all 9 public routes.                         |
| **SEO-02**  | P2       | SEO          | Add `Sitemap: https://eduarc-connect.in/sitemap.xml` to `public/robots.txt`.  |
| **SEO-03**  | P2       | SEO          | Add canonical URLs to route meta headers across all public pages.             |
| **CODE-01** | P2       | Code Quality | Run `npm run format` and resolve ESLint `any` type in `site-header.test.tsx`. |
