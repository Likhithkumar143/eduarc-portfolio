/**
 * In-memory sliding-window rate limiter for server endpoints.
 * Defends against automated brute-force attacks and enquiry spam.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Prune expired records every 5 minutes to avoid memory leaks
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;
let lastPrune = Date.now();

function pruneExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL_MS) return;
  lastPrune = now;

  const expiryThreshold = now - windowMs;
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > expiryThreshold);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const { maxRequests, windowMs } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  pruneExpired(windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0] ?? now;
    const retryAfterMs = Math.max(0, oldestTimestamp + windowMs - now);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Extracts the best candidate client IP from the request headers.
 * Prioritizes tamper-resistant edge headers (Cloudflare, Vercel/reverse proxy)
 * before client-controllable X-Forwarded-For headers to prevent spoofing (CWE-290).
 */
export function getClientIp(headers?: Headers | null): string {
  if (!headers) return "unknown";

  // 1. Cloudflare authenticated client IP
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  // 2. Vercel / reverse-proxy authenticated real IP
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  // 3. Fallback to X-Forwarded-For
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "unknown";
}

/**
 * Staff login rate limiter: 5 attempts per 15 minutes per IP.
 */
export const LOGIN_RATE_LIMIT_OPTIONS: RateLimitOptions = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

/**
 * Enquiry submission rate limiter: 5 submissions per 5 minutes per IP.
 */
export const ENQUIRY_RATE_LIMIT_OPTIONS: RateLimitOptions = {
  maxRequests: 5,
  windowMs: 5 * 60 * 1000, // 5 minutes
};

/**
 * Helper strictly for testing to reset state between test cases.
 */
export function _resetRateLimitsForTesting(): void {
  rateLimitStore.clear();
}
