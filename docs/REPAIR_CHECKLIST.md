# EduArc Website Repair & Optimization Checklist

**Tracking Document:** Implementation status across all prioritized repair items.  
**Target Completion:** All P0 and P1 issues completed; P2 and P3 issues implemented and verified.

---

## 1. P0 — Critical Security & Production Blocker Items

| Task ID  | Component / File            | Description                                                      | Status       | Verification                                         |
| -------- | --------------------------- | ---------------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| **P0-1** | `client.server.ts`          | Verify service role key is isolated from client bundles          | ✅ COMPLETED | Tested in `src/test/auth-security.test.ts`.          |
| **P0-2** | `staff.server.ts`           | Enforce 32+ character `SESSION_SECRET` requirement               | ✅ COMPLETED | Validated via `getSessionConfig()`.                  |
| **P0-3** | `staff.server.ts`           | Enforce `requireAdmin()` on all content and credential mutations | ✅ COMPLETED | Validated via unit tests and RPC boundaries.         |
| **P0-4** | `server.ts`                 | Edge WAF threat inspection (SQLi, XSS, Scanners, URL Probing)    | ✅ COMPLETED | Tested in `src/test/security-monitoring.test.ts`.   |
| **P0-5** | `security-detector.ts`      | Active IP blocklist cache and enforcement                        | ✅ COMPLETED | Tested 403 blocking on blacklisted IPs.              |
| **P0-6** | `enquiry.functions.ts`      | Catch PostgREST schema cache errors and fallback gracefully      | ✅ COMPLETED | Tested fallback context packing in `submitEnquiry`.  |

---

## 2. P1 — High Priority Functional & Reliability Items

| Task ID  | Component / File            | Description                                                   | Status       | Verification                                         |
| -------- | --------------------------- | ------------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| **P1-1** | `MentorsEditor.tsx`         | Add 10MB maximum file size limit on mentor photo uploads      | ✅ COMPLETED | Added pre-read `file.size` check in `compressImage()`. |
| **P1-2** | `contact.tsx`               | Fix hero banner visual cropping & top-side icon fading        | ✅ COMPLETED | Visual clearance established; zero top fade.         |
| **P1-3** | `SiteFooter.tsx`            | Streamline footer, remove redundant links, compress padding   | ✅ COMPLETED | Padding set to minimal height; matching header tone. |
| **P1-4** | `PartnerForm.tsx`           | Prevent duplicate submissions via button disable on `busy`    | ✅ COMPLETED | Verified in `PartnerForm.tsx`.                       |
| **P1-5** | `rate-limit.server.ts`      | Reduce enquiry rate limit window from 10 minutes to 5 minutes | ✅ COMPLETED | Verified `windowMs: 5 * 60 * 1000`.                  |
| **P1-6** | `__root.tsx`                | Provide accessible 404 (`NotFoundComponent`) & error boundary | ✅ COMPLETED | Mounted in `src/routes/__root.tsx`.                  |
| **P1-7** | `site-content.functions.ts` | Graceful database outage fallback returning `defaultContent`  | ✅ COMPLETED | Wrapped `getSiteContent` with fallback.              |
| **P1-8** | `MagneticDockNav.tsx`       | macOS Dock magnetic scaling & sliding route indicator         | ✅ COMPLETED | Verified with spring easing and touch adaptation.    |
| **P1-9** | `ProgressiveImage.tsx`      | Progressive blur-up LQIP image loading with zero CLS          | ✅ COMPLETED | Tested in `src/test/animation-systems.test.tsx`.     |
| **P1-10**| `PaperPlaneButton.tsx`      | Paper plane flight animation upon confirmed backend success   | ✅ COMPLETED | Tested in `src/test/animation-systems.test.tsx`.     |

---

## 3. P2 — Medium Priority SEO, Analytics & Discoverability Items

| Task ID  | Component / File            | Description                                                    | Status       | Verification                                         |
| -------- | --------------------------- | -------------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| **P2-1** | `public/sitemap.xml`        | Generate comprehensive XML sitemap for canonical public routes | ✅ COMPLETED | Tested in `src/test/seo-sitemap.test.ts`.            |
| **P2-2** | `public/robots.txt`         | Add `Sitemap: https://eduarc-connect.in/sitemap.xml` directive | ✅ COMPLETED | Added directive to `public/robots.txt`.              |
| **P2-3** | `src/routes/*`              | Add canonical URL tags (`<link rel="canonical" ...>`)          | ✅ COMPLETED | Added canonical tags to all public route headers.    |
| **P2-4** | `AnalyticsAdminPanel.tsx`   | Admin site analytics dashboard with KPI cards and CSV export   | ✅ COMPLETED | Verified in `src/test/analytics.test.ts`.            |
| **P2-5** | `SecurityAdminPanel.tsx`    | Admin security monitoring dashboard with IP investigation tool | ✅ COMPLETED | Verified in `src/test/security-monitoring.test.ts`.  |
| **P2-6** | Codebase formatting & lint  | Zero ESLint errors and uniform Prettier formatting             | ✅ COMPLETED | 0 ESLint errors in `src`; Prettier formatted.        |

---

## 4. P3 — Low Priority Cosmetic & Hygiene Refinements

| Task ID  | Component / File    | Description                                                 | Status       | Verification                  |
| -------- | ------------------- | ----------------------------------------------------------- | ------------ | ----------------------------- |
| **P3-1** | `SiteHeader.tsx`    | Verify responsive mobile menu transitions and touch targets | ✅ COMPLETED | Verified in unit tests.       |
| **P3-2** | `BrandLogo.tsx`     | Ensure consistent branding scaling across header and footer | ✅ COMPLETED | Tested on multiple viewports. |
| **P3-3** | `PageTransition.tsx`| Subtle 300ms fade + 10px upward glide page transition       | ✅ COMPLETED | Mounted in `src/routes/__root.tsx`. |
