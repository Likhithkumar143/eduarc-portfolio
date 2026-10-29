# EduArc Deployment & Rollback Guide

**Target Domain:** `https://eduarc-connect.in`  
**Hosting Platform:** Vercel (recommended) / Node.js Nitro Serverless Engine  
**Database:** Supabase PostgreSQL with Serverless RPC  
**Branch:** `main`

---

## 1. Prerequisites & Environment Setup

Before triggering a production deployment, ensure the following environment variables are securely configured in your deployment platform (e.g. Vercel Project Settings > Environment Variables):

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

## 2. Pre-Deployment Verification Pipeline

Run all verification checks locally before approving a production release:

```bash
# 1. Typecheck
npx tsc --noEmit

# 2. Automated Test Suite (36 tests)
npm test

# 3. Production Build Validation
npm run build
```

Both client assets (`.output/public`) and server bundle (`.output/server`) must compile with zero errors.

---

## 3. Deployment Steps (Vercel)

1. Connect the GitHub repository `https://github.com/Likhithkumar143/eduarc-portfolio.git` to Vercel.
2. Select Framework Preset: **Other** (or **Nitro / TanStack Start**).
3. Build Command: `npm run build` (or `vite build`).
4. Output Directory: `.output`.
5. Ensure all required environment variables above are configured.
6. Deploy.

---

## 4. Post-Deployment Verification Checklist

Once deployed to `https://eduarc-connect.in`:

1. **Public Navigation:** Visit `/`, `/about`, `/programs`, `/mentors`, `/features`, `/impact`, `/contact`, `/partner`. Confirm pages render without visual flaws or console errors.
2. **Contact Page:** Confirm the hero counselor banner displays clearly, top icons are sharp and not washed out, and communication channel links work.
3. **Partner Form Submission:** Fill out a test enquiry as "Student". Confirm success toast/confirmation screen appears and data records in `partner_enquiries`.
4. **Staff Portals:**
   - Test `/reception`: Attempt login with reception password. Confirm enquiries dashboard renders.
   - Test `/admin`: Log in with initial admin password. Confirm content editor tabs load.
5. **Security Headers:** Inspect response headers in Chrome DevTools Network tab. Verify `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, and `Content-Security-Policy` are present.
6. **SEO & Crawlers:** Verify `https://eduarc-connect.in/robots.txt` and `https://eduarc-connect.in/sitemap.xml` return HTTP 200.

---

## 5. Rollback Procedures

### 5.1 Code Rollback (Instant)

If an unexpected runtime regression occurs post-deployment:

1. In the Vercel Dashboard, navigate to **Deployments**.
2. Locate the previous known-healthy deployment.
3. Click the three dots `...` and select **Redeploy** or **Promote to Production**.
4. Traffic will instantly route back to the previous immutable release bundle.

### 5.2 Database Rollback Strategy

Database changes in EduArc are backward-compatible:

- Columns added in migrations (`role`, `consent_given`, etc.) allow NULL values, so older code versions continue to execute queries without syntax errors.
- The application code in `src/lib/enquiry.functions.ts` features automatic schema fallback: if a column is missing or rejected by remote check constraints, it polyfills defaults and writes to legacy columns gracefully.
