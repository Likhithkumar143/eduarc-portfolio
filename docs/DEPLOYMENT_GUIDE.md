# EduArc Deployment & Rollback Guide

**Target Domain:** `https://eduarc-connect.in`  
**Hosting Platform:** Vercel (recommended) / Nitro Serverless Engine  
**Database:** Supabase PostgreSQL with Serverless RPC  
**Branch:** `main`

---

## 1. Prerequisites & Environment Setup

Configure the following environment variables in your deployment platform (e.g. Vercel Project Settings > Environment Variables):

### Required Environment Variables

| Variable Name                   | Environment         | Description                                                                       | Example / Format           |
| ------------------------------- | ------------------- | --------------------------------------------------------------------------------- | -------------------------- |
| `SESSION_SECRET`                | Production, Preview | 32+ character random secret used to sign session cookies                          | `openssl rand -hex 32`     |
| `ADMIN_INITIAL_PASSWORD`        | Production, Preview | Initial seed password used to initialize the admin credentials table on first run | Secure 16+ char string     |
| `SUPABASE_URL`                  | Production, Preview | HTTPS URL of your Supabase project                                                | `https://<id>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY`      | Production, Preview | Public anonymous key for client brochure requests                                 | `sb_publishable_...`       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production, Preview | Elevated service role key (Never expose to client!)                               | `sb_secret_...`            |
| `VITE_SUPABASE_URL`             | Production, Preview | Mirror of `SUPABASE_URL` for Vite client runtime                                  | `https://<id>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Production, Preview | Mirror of `SUPABASE_PUBLISHABLE_KEY` for Vite client runtime                      | `sb_publishable_...`       |

---

## 2. Database Migrations

Apply the migration scripts located in `drizzle/migrations/` sequentially using the Supabase SQL Editor:

1. `0000_migration.sql` — Site content storage & brochure schema.
2. `0001_partner_enquiries_and_reception.sql` — Baseline partner leads & reception credentials.
3. `0002_role_based_enquiries_and_remarks.sql` — Role-based fields (`role`, `child_name`, `designation`, `remarks`).
4. `0003_privacy_and_consent.sql` — DPDPA consent tracking.
5. `0004_website_analytics.sql` — Privacy-first website analytics table.
6. `0005_website_security.sql` — Security incidents & active IP blocklist tables.

*Note: Application code includes automatic schema fallback for missing columns, so deployments will not crash even if migrations are applied after code deploy.*

---

## 3. Pre-Deployment Verification Pipeline

Run all verification checks locally before approving a production release:

```bash
# 1. Typecheck
npx tsc --noEmit

# 2. Automated Test Suite (117 tests across 11 test suites)
npm test

# 3. Linter & Formatting
npx eslint src

# 4. Production Build Validation
npm run build
```

Both client assets (`.output/public`) and server bundle (`.output/server`) must compile with zero errors.

---

## 4. Post-Deployment Verification Checklist

Once deployed to `https://eduarc-connect.in`:

1. **Public Navigation:** Visit `/`, `/about`, `/programs`, `/mentors`, `/features`, `/contact`, `/partner`. Confirm pages render without visual flaws or console errors.
2. **Magnetic Navigation & Transitions:** Hover over header navigation links; verify smooth dock scaling and smooth page transitions.
3. **Progressive Images:** Verify images load progressively with blur placeholder and zero layout shift.
4. **Partner Form Submission:** Fill out a test enquiry as "Student". Confirm paper plane animation triggers upon success and data records.
5. **Staff Portals:**
   - Test `/reception`: Attempt login with reception password. Confirm enquiries dashboard renders.
   - Test `/admin`: Log in with initial admin password. Confirm content editor, analytics, and security monitoring tabs load.
6. **Security Headers:** Inspect response headers in DevTools. Verify `nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, and `Content-Security-Policy` are active.
7. **SEO & Crawlers:** Verify `https://eduarc-connect.in/robots.txt` and `https://eduarc-connect.in/sitemap.xml` return HTTP 200.

---

## 5. Rollback Procedures

### 5.1 Code Rollback (Instant)

1. In the Vercel Dashboard, navigate to **Deployments**.
2. Locate the previous known-healthy deployment.
3. Click the three dots `...` and select **Promote to Production**.
4. Traffic will instantly route back to the previous immutable release bundle.

### 5.2 Database Rollback Strategy

Database changes are strictly backward-compatible:
- Columns added allow NULL values, allowing older code versions to function normally.
- Server functions in `src/lib/enquiry.functions.ts` automatically fall back to baseline columns if new columns are missing.
