import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { getSessionConfig, staffLogin } from "@/lib/staff.server";
import {
  checkRateLimit,
  getClientIp,
  LOGIN_RATE_LIMIT_OPTIONS,
  ENQUIRY_RATE_LIMIT_OPTIONS,
  _resetRateLimitsForTesting,
} from "@/lib/rate-limit.server";
import { sanitizeSpreadsheetValue } from "@/lib/export-excel";
import { addSecurityHeaders } from "@/server";

describe("Security Hardening - Priority 1: Session Secret Integrity", () => {
  const originalSecret = process.env["SESSION_SECRET"];

  afterEach(() => {
    if (originalSecret !== undefined) {
      process.env["SESSION_SECRET"] = originalSecret;
    } else {
      delete process.env["SESSION_SECRET"];
    }
  });

  it("throws if SESSION_SECRET is missing", () => {
    delete process.env["SESSION_SECRET"];
    expect(() => getSessionConfig("admin")).toThrow(/SESSION_SECRET/i);
    expect(() => getSessionConfig("reception")).toThrow(/SESSION_SECRET/i);
  });

  it("throws if SESSION_SECRET is shorter than 32 characters", () => {
    process.env["SESSION_SECRET"] = "short-secret-under-32";
    expect(() => getSessionConfig("admin")).toThrow(/shorter than 32 characters/i);
  });

  it("succeeds with secure cookie properties when SESSION_SECRET is valid (>=32 chars)", () => {
    process.env["SESSION_SECRET"] = "a-very-strong-and-secure-session-secret-key-32chars!";
    const config = getSessionConfig("admin");
    expect(config.password).toBe("a-very-strong-and-secure-session-secret-key-32chars!");
    expect(config.name).toBe("eduarc-admin");
    expect(config.cookie.httpOnly).toBe(true);
    expect(config.cookie.path).toBe("/");
    expect(config.maxAge).toBe(60 * 60 * 8);
  });
});

describe("Security Hardening - Priority 3: Rate Limiting", () => {
  beforeEach(() => {
    _resetRateLimitsForTesting();
  });

  it("correctly extracts client IP from request headers and prioritizes tamper-resistant edge headers", () => {
    // Basic extraction
    const headers1 = new Headers({ "x-forwarded-for": "203.0.113.195, 70.41.3.18" });
    expect(getClientIp(headers1)).toBe("203.0.113.195");

    const headers2 = new Headers({ "x-real-ip": "198.51.100.42" });
    expect(getClientIp(headers2)).toBe("198.51.100.42");

    const headers3 = new Headers({ "cf-connecting-ip": "192.0.2.1" });
    expect(getClientIp(headers3)).toBe("192.0.2.1");

    // CWE-290 defense: cf-connecting-ip takes precedence over client-controllable x-forwarded-for
    const spoofAttempt1 = new Headers({
      "x-forwarded-for": "1.1.1.1, 2.2.2.2",
      "cf-connecting-ip": "203.0.113.50",
    });
    expect(getClientIp(spoofAttempt1)).toBe("203.0.113.50");

    // CWE-290 defense: x-real-ip takes precedence over client-controllable x-forwarded-for
    const spoofAttempt2 = new Headers({
      "x-forwarded-for": "1.1.1.1",
      "x-real-ip": "198.51.100.88",
    });
    expect(getClientIp(spoofAttempt2)).toBe("198.51.100.88");

    // Missing headers return unknown
    expect(getClientIp(null)).toBe("unknown");
    expect(getClientIp(new Headers())).toBe("unknown");
  });

  it("allows requests under the limit and blocks when exceeded", () => {
    const key = "test-client-ip";
    const options = { maxRequests: 3, windowMs: 60_000 };

    const first = checkRateLimit(key, options);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = checkRateLimit(key, options);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = checkRateLimit(key, options);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    // 4th request exceeds maxRequests = 3
    const fourth = checkRateLimit(key, options);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("isolates rate limits by client IP address", () => {
    const options = { maxRequests: 2, windowMs: 60_000 };
    checkRateLimit("ip-1", options);
    checkRateLimit("ip-1", options);
    expect(checkRateLimit("ip-1", options).allowed).toBe(false);

    // ip-2 is unaffected
    expect(checkRateLimit("ip-2", options).allowed).toBe(true);
  });

  it("enforces staff login rate limits (5 attempts per window)", () => {
    const testIp = "login-test-ip";
    for (let i = 0; i < LOGIN_RATE_LIMIT_OPTIONS.maxRequests; i++) {
      const res = checkRateLimit(`login:admin:${testIp}`, LOGIN_RATE_LIMIT_OPTIONS);
      expect(res.allowed).toBe(true);
    }
    const blocked = checkRateLimit(`login:admin:${testIp}`, LOGIN_RATE_LIMIT_OPTIONS);
    expect(blocked.allowed).toBe(false);
  });

  it("enforces enquiry rate limits (5 submissions per window)", () => {
    const testIp = "enquiry-test-ip";
    for (let i = 0; i < ENQUIRY_RATE_LIMIT_OPTIONS.maxRequests; i++) {
      const res = checkRateLimit(`enquiry:${testIp}`, ENQUIRY_RATE_LIMIT_OPTIONS);
      expect(res.allowed).toBe(true);
    }
    const blocked = checkRateLimit(`enquiry:${testIp}`, ENQUIRY_RATE_LIMIT_OPTIONS);
    expect(blocked.allowed).toBe(false);
  });
});

describe("Security Hardening - Priority 4: Sanitized Authentication Responses", () => {
  beforeEach(() => {
    _resetRateLimitsForTesting();
  });

  it("sanitizes internal errors and never discloses server-side secrets or DB exceptions", async () => {
    // Calling staffLogin with an isolated client IP
    const res = await staffLogin("reception", "some-password", "isolated-ip-1");
    // Should be generic, NOT leak table names, missing env vars, or SQL details
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.message).toBe(
        "Authentication service temporarily unavailable. Please try again later.",
      );
      expect(res.message).not.toContain("SUPABASE");
      expect(res.message).not.toContain("table");
      expect(res.message).not.toContain("Postgres");
      expect(res.message).not.toContain("ADMIN_INITIAL_PASSWORD");
      expect(res.message).not.toContain("Vercel");
    }
  });

  it("blocks rapid brute-force attempts with rate limit message", async () => {
    const ip = "rapid-brute-forcer";
    for (let i = 0; i < 5; i++) {
      await staffLogin("admin", "wrong-attempt", ip);
    }
    const blocked = await staffLogin("admin", "wrong-attempt", ip);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.message).toMatch(/Too many login attempts/i);
    }
  });
});

describe("Security Hardening - Priority 5: Production Security Headers", () => {
  it("injects all essential security headers into responses", () => {
    const baseResponse = new Response("Hello World", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

    const secured = addSecurityHeaders(baseResponse);

    expect(secured.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(secured.headers.get("X-Frame-Options")).toBe("DENY");
    expect(secured.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(secured.headers.get("Strict-Transport-Security")).toContain("max-age=63072000");
    expect(secured.headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(secured.headers.get("Permissions-Policy")).toContain("camera=()");

    const csp = secured.headers.get("Content-Security-Policy");
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("connect-src 'self' https://*.supabase.co");
  });
});

describe("Security Hardening - CSV / Spreadsheet Formula Injection Sanitization (CWE-1236)", () => {
  it("neutralizes formula trigger characters (=, +, -, @, \\t, \\r)", () => {
    // Basic formula triggers
    expect(sanitizeSpreadsheetValue("=1+1")).toBe("'=1+1");
    expect(sanitizeSpreadsheetValue("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
    expect(sanitizeSpreadsheetValue("+123456789")).toBe("'+123456789");
    expect(sanitizeSpreadsheetValue("-25000")).toBe("'-25000");
    expect(sanitizeSpreadsheetValue("@SUM(A1:B10)")).toBe("'@SUM(A1:B10)");
    expect(sanitizeSpreadsheetValue("\tDDE_PAYLOAD")).toBe("'\tDDE_PAYLOAD");
    expect(sanitizeSpreadsheetValue("\rCARRIAGE_INJECT")).toBe("'\rCARRIAGE_INJECT");
  });

  it("leaves standard text inputs and benign values untouched", () => {
    expect(sanitizeSpreadsheetValue("Ananya Rao")).toBe("Ananya Rao");
    expect(sanitizeSpreadsheetValue("9876543210")).toBe("9876543210");
    expect(sanitizeSpreadsheetValue("student@example.com")).toBe("student@example.com");
    expect(sanitizeSpreadsheetValue("Looking for career counseling")).toBe(
      "Looking for career counseling",
    );
  });

  it("handles null, undefined, and empty string safely", () => {
    expect(sanitizeSpreadsheetValue("")).toBe("");
    expect(sanitizeSpreadsheetValue(null)).toBe("");
    expect(sanitizeSpreadsheetValue(undefined)).toBe("");
  });
});
