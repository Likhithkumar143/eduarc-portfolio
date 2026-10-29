# EduArc Security Audit & Remediation Report

**Date:** October 29, 2026  
**Application:** EduArc Platform (`https://eduarc-connect.in`)  
**Scope:** Source inspection, server functions, authentication flows, session handling, database access, security headers, rate limiting, and input validation.  
**Standard:** OWASP Top 10 Web Application Security Risks, DPDPA 2023 Compliance, CWE Trust Boundary Analysis.

---

## 1. Security Architecture Overview

EduArc utilizes a layered security architecture separating unprivileged public users from privileged administrative and reception workflows:

```
[ Public Visitors ]
       │
       ▼ (HTTPS / TLS 1.3)
[ Edge Security Headers ] (CSP, HSTS, X-Frame-Options: DENY, nosniff, Referrer-Policy)
       │
       ▼
[ Client Application (Vite / React 19) ]
       │
       ▼ (Server Function RPC via POST / GET)
[ Server-Side Security Layer (TanStack Start / Nitro) ]
  ├── 1. IP-Based Sliding-Window Rate Limiting (CWE-307)
  ├── 2. Cryptographic Session Validation (requireAdmin / requireReception)
  ├── 3. Strict Zod Input Schema Validation (CWE-20)
  ├── 4. Honeypot Anti-Spam Detection
  └── 5. PBKDF2 Password Hashing & 15-Minute Lockout
       │
       ▼ (Encrypted Server-to-Server)
[ Supabase PostgreSQL ]
  ├── RLS Protected Tables (anon SELECT on site_content)
  └── Service-Role Protected Tables (admin_credentials, reception_credentials, partner_enquiries)
```

---

## 2. Threat Analysis & Security Controls

### 2.1 Secrets & Credential Storage (OWASP A07:2021 / CWE-798)

- **Status:** **PASS**
- **Findings:**
  - No privileged secrets (such as `SUPABASE_SERVICE_ROLE_KEY` or `SESSION_SECRET`) are present in client bundles or git commits.
  - In `src/integrations/supabase/client.server.ts`, the client checks `process.env["SUPABASE_SERVICE_ROLE_KEY"]` dynamically at runtime. If missing, it throws a localized error rather than falling back to an unauthenticated connection.
  - Public anonymous keys (`sb_publishable_...`) are restricted by Supabase Row-Level Security policies to read-only brochure access.

### 2.2 Staff Authentication & Authorization (OWASP A01:2021 / CWE-285)

- **Status:** **PASS**
- **Findings:**
  - EduArc implements dual role-based access control (`admin` and `reception`).
  - Authentication sessions use encrypted HTTP-only cookies (`eduarc-admin` and `eduarc-reception`) configured with `SameSite=Lax`, `Path=/`, and `Secure` in production environments.
  - Session cookies store an updated timestamp signature (`v: creds.updated_at`). Whenever a staff member or administrator updates their password, existing session tokens are immediately revoked.
  - Privilege escalation prevention: `requireAdmin()` strictly guards all content mutations (`saveSiteContent`), reception password assignment (`adminSetReceptionPassword`), and admin credential updates. Reception staff credentials cannot access admin endpoints.

### 2.3 Brute-Force & Credential Stuffing Defenses (OWASP A07:2021 / CWE-307)

- **Status:** **PASS**
- **Findings:**
  - Two layers of brute-force prevention are active:
    1. **Sliding-Window Rate Limiter:** Enforces max 5 attempts per 15-minute window per IP in `src/lib/rate-limit.server.ts`.
    2. **Account Lockout:** Enforces a 15-minute lockout at the database level (`locked_until`) after 5 failed attempts in `src/lib/staff.server.ts`.
  - IP Spoofing Prevention (CWE-290): `getClientIp` prioritizes trusted proxy headers (`cf-connecting-ip` from Cloudflare, `x-real-ip` from Vercel) before falling back to client-supplied `x-forwarded-for`.
  - Timing attack mitigation: Artificial delay (`await sleep(600)`) is injected on invalid credential attempts.

### 2.4 Injection & Input Validation (OWASP A03:2021 / CWE-20, CWE-79)

- **Status:** **PASS**
- **Findings:**
  - All public forms (`submitEnquiry`) and administrative functions (`saveSiteContent`, `receptionLogin`, `updateEnquiryStatus`) enforce strict server-side Zod schemas (`enquirySchema`, `siteContentSchema`, `statusUpdateSchema`).
  - SQL injection is mitigated through parameterized queries via Supabase PostgREST client and Drizzle ORM.
  - Cross-Site Scripting (XSS) is mitigated by React's native JSX escaping and CSP `script-src 'self' 'unsafe-inline'`.

### 2.5 Denial of Service & Resource Exhaustion (OWASP A04:2021 / CWE-400)

- **Status:** **PASS (REMEDIATED)**
- **Finding SEC-03:**
  - In `src/components/admin/MentorsEditor.tsx`, mentor image upload compresses files via HTML5 Canvas, but lacked an explicit pre-read `file.size` check.
  - _Fix:_ Enforce a strict 10MB file size ceiling (`file.size > 10 * 1024 * 1024`) before `FileReader` execution, preventing memory exhaustion and tab crashes on low-spec admin devices.
- **Finding SEC-04 (High Availability & Database Resilience):**
  - In `src/lib/site-content.functions.ts`, unhandled transient database outages or network timeouts when querying Supabase could trigger an uncaught SSR error boundary.
  - _Fix:_ Wrapped `getSiteContent` in a defensive `try / catch` fallback that logs the warning and immediately returns `defaultContent`, ensuring zero downtime or blank page crashes for visitors.

### 2.6 Security Headers & Browser Hardening (OWASP A05:2021)

- **Status:** **PASS**
- **Findings:**
  - Configured in `vercel.json`:
    - `X-Content-Type-Options: nosniff` (Prevents MIME sniffing attacks)
    - `X-Frame-Options: DENY` (Clickjacking mitigation)
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS)
    - `Cross-Origin-Opener-Policy: same-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
    - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';`

---

## 3. Remediation Checklist & Verification

| Control                   | Status     | Mitigation Applied                                                            |
| ------------------------- | ---------- | ----------------------------------------------------------------------------- |
| Service-Role Protection   | Verified   | Kept exclusively in `.server.ts` modules.                                     |
| Session Hijacking         | Verified   | `httpOnly: true`, `secure: true`, PBKDF2 hash verification.                   |
| In-Memory DoS via Uploads | Remediated | 10MB file size ceiling added to `compressImage` in `MentorsEditor.tsx`.       |
| Anti-Spam Bot Abuse       | Verified   | Honeypot field and IP rate limiting on enquiry endpoint.                      |
| RLS Bypass Protection     | Verified   | Public client uses anon publishable key; writes require server admin session. |

---

## 4. Required Production Environment Variables

Ensure the following variables are configured in production (e.g. Vercel Dashboard):

| Variable Name               | Required     | Description                                       | Safe Example                       |
| --------------------------- | ------------ | ------------------------------------------------- | ---------------------------------- |
| `SESSION_SECRET`            | **Yes (P0)** | 32+ character random secret for cookie encryption | `openssl rand -hex 32`             |
| `ADMIN_INITIAL_PASSWORD`    | **Yes (P0)** | Initial seed password for the `/admin` portal     | Secure 16+ character password      |
| `SUPABASE_URL`              | **Yes (P0)** | Production Supabase project URL                   | `https://your-project.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY`  | **Yes (P0)** | Client/Anon publishable API key                   | `sb_publishable_...`               |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes (P0)** | Server-side elevated database key                 | `sb_secret_...`                    |
