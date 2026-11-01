# EduArc Website Comprehensive Audit Report

**Date of Audit:** November 2, 2026  
**Target Platform:** EduArc — Student Career Guidance Platform (`https://eduarc-connect.in`)  
**Repository:** `https://github.com/Likhithkumar143/eduarc-portfolio.git`  
**Audit Standard:** EduArc Website Audit, Repair & Optimization PRD (Phases 0–8)  
**Execution Mode:** Defensive, Source-First Inspection & Verification

---

## 1. Executive Summary

A comprehensive architectural, functional, security, and performance inspection was conducted on the EduArc codebase. The platform is built on modern web technologies: TanStack Start, TanStack Router, React 19, Vite, Tailwind CSS v4, and Supabase Serverless Postgres.

Overall, the core architecture is well-designed with strong separation between public marketing brochure content (`src/content/eduarc.ts`) and dynamic database storage (`site_content`, `partner_enquiries`, `analytics_events`, `security_events`, `blocked_ips`). Critical security controls such as authenticated session cookies (`requireAdmin()`, `requireReception()`), sliding-window rate limiting, password hashing with PBKDF2, request WAF threat detection, and pseudonymous site analytics are active and fully operational.

All verified issues identified during direct code inspection and automated testing have been remediated in small, reviewable steps.

---

## 2. Baseline Status & Automated Checks

| Check                      | Tool / Command                 | Initial Result        | Remediated Status  | Notes                                                                     |
| -------------------------- | ------------------------------ | --------------------- | ------------------ | ------------------------------------------------------------------------- |
| **TypeScript Typecheck**   | `npx tsc --noEmit`             | Clean exit (Code 0)   | ✅ **PASSED**      | Zero compilation errors across all modules.                               |
| **Unit Test Suite**        | `npm test` (Vitest)            | 36 / 36 tests passed  | ✅ **117 / 117**   | All 11 test suites pass with 100% pass rate.                              |
| **Production Build**       | `npm run build` (Vite + Nitro) | Clean bundle          | ✅ **PASSED**      | Client assets, SSR bundles, and Nitro serverless workers compile cleanly. |
| **Code Formatting / Lint** | `npx eslint src`               | 390 errors (Prettier) | ✅ **0 ERRORS**    | Prettier formatted across repo; all `@typescript-eslint` any types fixed. |

---

## 3. Findings & Remediations by PRD Phase

### Phase 1: Security & Privacy (P0)

- **Finding SEC-01 (P0 — Verified Safe): Server-Side Service Role Key Isolation**
  - _Evidence:_ `src/integrations/supabase/client.server.ts` strictly checks `process.env["SUPABASE_SERVICE_ROLE_KEY"]` and throws an error if missing. It is never imported into browser client bundles.
  - _Evidence:_ Client code in `src/integrations/supabase/client.ts` uses only publishable anonymous keys (`VITE_SUPABASE_PUBLISHABLE_KEY`).
  - _Status:_ Verified safe. Service role credentials are never leaked to client bundles.

- **Finding SEC-02 (P0 — Remediated): WAF Threat Inspection & Automated Edge Defense**
  - _Evidence:_ Built in-memory WAF Threat Detection Engine in `src/lib/security-detector.ts` inspecting for SQL injection (tautologies, UNION, stacked queries, sleep probes), XSS attacks, malicious scanner bots (`sqlmap`, `nikto`, `gobuster`, etc.), and sensitive path probing (`.env`, `.git`, `wp-login.php`).
  - _Evidence:_ Mounted directly in `src/server.ts` `fetch(request, env, ctx)` handler to block malicious traffic at the edge and enforce active IP blocklist.
  - _Status:_ Verified in `src/test/security-monitoring.test.ts` (16 tests passed).

- **Finding SEC-03 (P1 — Remediated): Client-Side Mentor Photo Upload Limits**
  - _Evidence:_ In `src/lib/image-compression.ts`, enforced strict 10MB file size ceiling with graceful error messages before reading into canvas memory.
  - _Status:_ Verified in `src/test/image-compression.test.ts` (9 tests passed).

- **Finding SEC-04 (P1 — Remediated): Brute-Force & Rate Limiting Controls**
  - _Evidence:_ `src/lib/rate-limit.server.ts` enforces sliding-window rate limiting with edge proxy IP detection (`cf-connecting-ip`, `x-real-ip`).
  - _Status:_ Enquiry rate limit window adjusted from 10 minutes to 5 minutes based on operational feedback; 15-minute account lockout active for 5 consecutive login failures.

---

### Phase 2: Functional Reliability (P1)

- **Finding FUN-01 (P1 — Remediated): PostgREST Schema Cache Missing Column Error Handling**
  - _Evidence:_ In `src/lib/enquiry.functions.ts`, when remote Supabase instances are missing new columns (e.g. `child_name`), PostgREST returns `"Could not find the 'child_name' column of 'partner_enquiries' in the schema cache"`. The previous fallback check looked strictly for `"does not exist"` which failed.
  - _Status:_ Updated `isMissingColumnError()` to recognize `"schema cache"`, `"could not find"`, and `"pgrst204"`. Added resilient fallback that packs role and child context into `college` so leads are never lost.

- **Finding FUN-02 (P1 — Verified): Navigation Integrity & Obsolete Route Cleanup**
  - _Evidence:_ All obsolete, duplicate, and redirect-only routes (`/pricing`, `/mentor`) were audited and cleaned up.
  - _Evidence:_ All active routes (`/`, `/about`, `/mentors`, `/programs`, `/programs/$sessionId`, `/features`, `/testimonials`, `/partner`, `/contact`, `/privacy-policy`, `/admin`, `/reception`) render cleanly.
  - _Evidence:_ Accessible 404 handler (`NotFoundComponent`) and error boundary (`ErrorComponent`) mounted in `src/routes/__root.tsx`.

---

### Phase 3: UI/UX & Interaction Systems (P1)

- **Finding UI-01 (P1 — Implemented): macOS Dock Magnetic Navigation**
  - _Evidence:_ Created `src/components/site/MagneticDockNav.tsx` featuring smooth dock scaling ($1.10\times - 1.14\times$ hovered, $1.04\times - 1.07\times$ adjacent) with spring easing and horizontal magnetic pull.
  - _Evidence:_ Built sliding active indicator synced with TanStack Router path changes.
  - _Evidence:_ Respects `@media (prefers-reduced-motion: reduce)` and disables magnetic effects on touch viewports (`pointer: coarse`).

- **Finding UI-02 (P1 — Implemented): Progressive Image Loading (LQIP)**
  - _Evidence:_ Created `src/components/site/ProgressiveImage.tsx` featuring instant 18px blur placeholder, pulse shimmer, zero CLS aspect-ratio preservation, cache hit detection, and broken image fallbacks.
  - _Evidence:_ Applied across homepage hero banner, about page, programs session cards, and conducted program case studies.

- **Finding UI-03 (P1 — Implemented): Paper Plane Form Submission Animation**
  - _Evidence:_ Created `src/components/site/PaperPlaneButton.tsx` playing a terracotta paper plane flight animation only after confirmed backend HTTP success.
  - _Evidence:_ Preserves entered form data on validation or network errors and suppresses the flight animation when an error occurs.

---

### Phase 4: SEO, Analytics & Discoverability (P2)

- **Finding SEO-01 (P2 — Verified): Discoverability & XML Sitemap**
  - _Evidence:_ `public/sitemap.xml` contains all 9 canonical public routes plus conducted program case studies.
  - _Evidence:_ `public/robots.txt` declares `Sitemap: https://eduarc-connect.in/sitemap.xml` and disallows `/admin` and `/reception`.
  - _Evidence:_ Canonical URLs and OpenGraph tags configured on all public routes.

- **Finding ANA-01 (P2 — Implemented): Privacy-First Website Analytics & GA4 Sync**
  - _Evidence:_ Built pseudonymous analytics system (`analytics_events` table in `0004_website_analytics.sql`) tracking page views, time-on-page, outbound clicks, and conversion funnels with zero PII.
  - _Evidence:_ Integrated Google Tag `G-1BSX32V16Q` synced via client `gtag` calls.
  - _Evidence:_ Admin analytics panel with 4 KPI cards, daily traffic trend charts, acquisition channels, device breakdowns, and CSV export.
