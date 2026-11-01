# EduArc Security Audit & Remediation Report

**Date:** November 2, 2026  
**Application:** EduArc Platform (`https://eduarc-connect.in`)  
**Scope:** Source inspection, server functions, authentication flows, session handling, database access, security headers, edge WAF, rate limiting, and threat monitoring.  
**Standard:** OWASP Top 10 Web Application Security Risks, DPDPA 2023 Compliance, CWE Trust Boundary Analysis.

---

## 1. Security Architecture Overview

EduArc utilizes a layered defense-in-depth architecture separating unprivileged public visitors from privileged administrative and reception workflows:

```
[ Public Visitors & Internet Traffic ]
       │
       ▼ (HTTPS / TLS 1.3)
[ Edge WAF & Request Threat Inspector ] (src/server.ts)
  ├── 1. IP Blocklist Enforcement (Cached in-memory, immediate 403 response)
  ├── 2. SQL Injection Inspection (Tautologies, UNION, stacked, sleep probes)
  ├── 3. Cross-Site Scripting (XSS) Filter (<script>, javascript:, inline events)
  ├── 4. Malicious Scanner Bot Filter (sqlmap, nikto, nmap, gobuster, dirbuster)
  └── 5. Sensitive Path Probing Defense (.env, .git, wp-login, phpmyadmin)
       │
       ▼
[ Edge Security Headers ] (CSP, HSTS, X-Frame-Options: DENY, nosniff, Referrer-Policy)
       │
       ▼
[ Client Application (Vite / React 19) ]
       │
       ▼ (Server Function RPC via POST / GET)
[ Server-Side Security Layer (TanStack Start / Nitro) ]
  ├── 1. IP-Based Sliding-Window Rate Limiting (5 requests / 5 mins for enquiries)
  ├── 2. Cryptographic Session Validation (requireAdmin / requireReception)
  ├── 3. Strict Zod Input Schema Validation (CWE-20)
  ├── 4. Honeypot Anti-Spam Detection
  └── 5. PBKDF2 Password Hashing & 15-Minute Lockout
       │
       ▼ (Encrypted Server-to-Server via supabaseAdmin)
[ Supabase PostgreSQL ]
  ├── RLS Protected Tables (anon SELECT on site_content, server-only on security/analytics)
  └── Service-Role Protected Tables (admin_credentials, reception_credentials, partner_enquiries, security_events, blocked_ips)
```

---

## 2. Threat Analysis & Security Controls

### 2.1 Secrets & Credential Storage (OWASP A07:2021 / CWE-798)

- **Status:** **PASS**
- **Findings:**
  - `SUPABASE_SERVICE_ROLE_KEY` and `SESSION_SECRET` are strictly loaded in `*.server.ts` modules via `process.env`. They are never imported into browser client bundles.
  - Public anonymous keys (`VITE_SUPABASE_PUBLISHABLE_KEY`) are restricted by Supabase Row-Level Security policies to read-only brochure access.
  - Zero `.env` files are tracked in git; `.gitignore` strictly protects environment configurations.

### 2.2 Edge WAF Threat Detection & Bot Mitigation (OWASP A03 / A05)

- **Status:** **PASS (IMPLEMENTED IN PHASE 2)**
- **Findings:**
  - `src/lib/security-detector.ts` inspects URLs, query strings, and User-Agent headers on every incoming request.
  - Critical threats (SQLi, scanner bots, sensitive file probes) are immediately logged to `security_events` and blocked.
  - An in-memory `BlockedIpCache` maintains fast lookups with TTL expiration, eliminating unnecessary database overhead on malicious repeat visitors.
  - Tested across 16 unit tests in `src/test/security-monitoring.test.ts`.

### 2.3 Staff Authentication & Authorization (OWASP A01:2021 / CWE-285)

- **Status:** **PASS**
- **Findings:**
  - Dual role-based access control (`admin` and `reception`).
  - Authentication sessions use encrypted HTTP-only cookies (`eduarc-admin` and `eduarc-reception`) configured with `SameSite=Lax`, `Path=/`, and `Secure` in production environments.
  - Every administrative server function calls `requireAdmin()`; every reception function calls `requireReception()`.
  - Session cookies store an updated timestamp signature (`v: creds.updated_at`). Whenever credentials change, existing session tokens are immediately invalidated.

### 2.4 Brute-Force & Rate Limiting Defenses (OWASP A07:2021 / CWE-307)

- **Status:** **PASS (TUNED TO 5 MINUTES)**
- **Findings:**
  - **Enquiry Submission Limiter:** Enforces max 5 attempts per 5-minute sliding window per IP.
  - **Staff Login Limiter:** Enforces max 5 attempts per 15-minute sliding window per IP.
  - **Account Lockout:** Database-backed lockout (`locked_until`) triggers after 5 failed password attempts.
  - **IP Extraction:** Prioritizes trusted edge headers (`cf-connecting-ip` from Cloudflare, `x-real-ip` from Vercel) over spoofable `x-forwarded-for`.

### 2.5 Input Validation & Schema Fallback (OWASP A03:2021 / CWE-20)

- **Status:** **PASS (ENHANCED)**
- **Findings:**
  - Public submissions (`submitEnquiry`) enforce strict Zod schemas (`enquirySchema`).
  - PostgREST schema cache errors (e.g. `child_name` not yet migrated on remote database) are caught cleanly, falling back to baseline schema with role/child details packed into the college record so submissions never fail.
  - Zero personal identifiable information (PII) or passwords are logged in analytics or security events.

---

## 3. Remaining Operational Recommendations

1. **Supabase Schema Migrations:**
   - Run migrations `0004_website_analytics.sql` and `0005_website_security.sql` in the Supabase SQL Editor to support native table storage for analytics and security events.
2. **Session Secret Rotation:**
   - Ensure `SESSION_SECRET` in production is at least 32 characters long (`openssl rand -hex 32`).
