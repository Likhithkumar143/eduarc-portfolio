# EduArc Website Repair & Optimization Checklist

**Tracking Document:** Implementation status across all prioritized repair items.  
**Target Completion:** All P0 and P1 issues completed; P2 and P3 issues implemented and verified.

---

## 1. P0 — Critical Security & Production Blocker Items

| Task ID | Component / File | Description | Status | Verification |
|---|---|---|---|---|
| **P0-1** | `client.server.ts` | Verify service role key is isolated from client bundles | ✅ COMPLETED | Tested in `src/test/auth-security.test.ts`. |
| **P0-2** | `staff.server.ts` | Enforce 32+ character `SESSION_SECRET` requirement | ✅ COMPLETED | Validated via `getSessionConfig()`. |
| **P0-3** | `staff.server.ts` | Enforce `requireAdmin()` on all content and credential mutations | ✅ COMPLETED | Validated via unit tests and RPC boundaries. |
| **P0-4** | `vercel.json` | Configure strict production Content-Security-Policy & HSTS | ✅ COMPLETED | Inspected in `vercel.json`. |

---

## 2. P1 — High Priority Functional & Reliability Items

| Task ID | Component / File | Description | Status | Verification |
|---|---|---|---|---|
| **P1-1** | `MentorsEditor.tsx` | Add 10MB maximum file size limit on mentor photo uploads | ✅ COMPLETED | Added pre-read `file.size` check in `compressImage()`. |
| **P1-2** | `contact.tsx` | Fix hero banner visual cropping & top-side icon fading | ✅ COMPLETED | Visual clearance established; zero top fade over icons. |
| **P1-3** | `SiteFooter.tsx` | Streamline footer, remove redundant links, compress padding | ✅ COMPLETED | Padding set to `py-2.5 sm:py-3`; portal icon buttons added. |
| **P1-4** | `partner.tsx` | Preserve standalone student guidance pathway & `PartnerForm` | ✅ COMPLETED | Fully preserved and tested. |
| **P1-5** | `PartnerForm.tsx` | Prevent duplicate submissions via button disable on `busy` | ✅ COMPLETED | Verified in `PartnerForm.tsx`. |
| **P1-6** | `__root.tsx` | Provide accessible 404 (`NotFoundComponent`) & error boundary | ✅ COMPLETED | Mounted in `src/routes/__root.tsx`. |

---

## 3. P2 — Medium Priority SEO, Accessibility & Discoverability Items

| Task ID | Component / File | Description | Status | Verification |
|---|---|---|---|---|
| **P2-1** | `public/sitemap.xml` | Generate comprehensive XML sitemap for all 9 public routes | ✅ COMPLETED | Created XML sitemap adhering to sitemaps.org schema. |
| **P2-2** | `public/robots.txt` | Add `Sitemap: https://eduarc-connect.in/sitemap.xml` directive | ✅ COMPLETED | Added directive to `public/robots.txt`. |
| **P2-3** | `src/routes/*` | Add canonical URL tags (`<link rel="canonical" ...>`) to public routes | ✅ COMPLETED | Added canonical tags to all 9 public route headers. |
| **P2-4** | `src/test/site-header.test.tsx` | Fix `@typescript-eslint/no-explicit-any` warning in test | ✅ COMPLETED | Replaced `: any` with typed `MockLinkProps`. |
| **P2-5** | Codebase formatting | Run `npm run format` (Prettier) across source files | ✅ COMPLETED | Prettier formatted all files; 0 ESLint errors in `src`. |

---

## 4. P3 — Low Priority Cosmetic & Hygiene Refinements

| Task ID | Component / File | Description | Status | Verification |
|---|---|---|---|---|
| **P3-1** | `SiteHeader.tsx` | Verify responsive mobile menu transitions and touch targets | ✅ COMPLETED | Verified in unit tests. |
| **P3-2** | `BrandLogo.tsx` | Ensure consistent branding scaling across header and footer | ✅ COMPLETED | Tested on multiple viewports. |
