import type { SecurityEventType, SecuritySeverity } from "./security.types";

export type DetectionResult = {
  isThreat: boolean;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  recommendedAction: "block" | "reject" | "log";
};

// Known directory probing signatures
const PROBING_PATTERNS = [
  /\/\.env(?:\..*)?$/i,
  /\/\.git(?:\/.*)?$/i,
  /\/wp-(?:admin|login|content|includes)/i,
  /\/xmlrpc\.php$/i,
  /\/phpmyadmin/i,
  /\/pma(?:\/.*)?$/i,
  /\/composer\.(?:json|lock)$/i,
  /\/package-lock\.json$/i,
  /\/(?:eval-stdin|shell|c99|r57)\.php$/i,
  /\/cgi-bin\//i,
  /\/\.aws\//i,
  /\/actuator(?:\/.*)?$/i,
  /\/solr(?:\/.*)?$/i,
  /\/\.vscode\//i,
  /\/\.DS_Store$/i,
];

// SQL injection heuristics
const SQLI_PATTERNS = [
  /(?:'|%27)\s*(?:or|and)\s*['"]?[\w\d]+['"]?\s*=\s*['"]?[\w\d]+/i,
  /union\s+(?:all\s+)?select/i,
  /exec(?:\s+|\+)+(?:sp_|xp_)/i,
  /information_schema\./i,
  /(?:sleep|benchmark)\s*\(\s*\d+\s*\)/i,
  /waitfor\s+delay\s+['"]/i,
  /(?:drop|truncate)\s+table/i,
  /--\s*$/m,
  /\/\*.*?\*\//,
];

// Cross-Site Scripting (XSS) heuristics
const XSS_PATTERNS = [
  /<script\b[^>]*>/i,
  /<\/script>/i,
  /javascript\s*:/i,
  /(?:onerror|onload|onclick|onmouseover)\s*=/i,
  /<svg\b[^>]*\bonload/i,
  /<img\b[^>]*\bonerror/i,
  /alert\s*\(/i,
  /document\.(?:cookie|location|write)/i,
];

// Malicious scanners & attack tool user-agents
const MALICIOUS_BOT_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /dirbuster/i,
  /wpscan/i,
  /acunetix/i,
  /havij/i,
];

/**
 * Fast in-memory blocked IP cache with automatic expiry.
 */
class BlockedIpCache {
  private cache = new Map<string, { expiresAt: number | null; reason: string }>();

  isBlocked(ip: string): { blocked: boolean; reason?: string } {
    const entry = this.cache.get(ip);
    if (!entry) return { blocked: false };

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(ip);
      return { blocked: false };
    }

    return { blocked: true, reason: entry.reason };
  }

  setBlock(ip: string, reason: string, durationSeconds?: number | null) {
    const expiresAt = durationSeconds ? Date.now() + durationSeconds * 1000 : null;
    this.cache.set(ip, { expiresAt, reason });
  }

  removeBlock(ip: string) {
    this.cache.delete(ip);
  }

  getAll(): { ip: string; reason: string; expiresAt: number | null }[] {
    const now = Date.now();
    const result: { ip: string; reason: string; expiresAt: number | null }[] = [];
    for (const [ip, entry] of this.cache.entries()) {
      if (!entry.expiresAt || entry.expiresAt > now) {
        result.push({ ip, reason: entry.reason, expiresAt: entry.expiresAt });
      }
    }
    return result;
  }
}

export const blockedIpCache = new BlockedIpCache();

/**
 * Analyzes request URL, parameters, and headers for known attacks.
 */
export function inspectRequestThreat(
  urlStr: string,
  method: string,
  userAgent: string | null,
): DetectionResult | null {
  let decodedPath = "";
  let fullTarget = "";
  try {
    const parsed = new URL(
      urlStr.startsWith("http") ? urlStr : `https://eduarc-connect.in${urlStr}`,
    );
    decodedPath = decodeURIComponent(parsed.pathname);
    fullTarget = decodeURIComponent(parsed.pathname + parsed.search);
  } catch {
    decodedPath = urlStr;
    fullTarget = urlStr;
  }

  // 1. Check known exploit scanner User-Agents
  if (userAgent) {
    for (const botPattern of MALICIOUS_BOT_PATTERNS) {
      if (botPattern.test(userAgent)) {
        return {
          isThreat: true,
          eventType: "bot_abuse",
          severity: "high",
          description: `Malicious security scanner detected (${userAgent.slice(0, 50)})`,
          recommendedAction: "block",
        };
      }
    }
  }

  // 2. Check SQL injection attempts
  for (const sqli of SQLI_PATTERNS) {
    if (sqli.test(fullTarget)) {
      return {
        isThreat: true,
        eventType: "sql_injection_attempt",
        severity: "critical",
        description: "SQL Injection attack signature detected in request URL/query",
        recommendedAction: "reject",
      };
    }
  }

  // 3. Check XSS attempts
  for (const xss of XSS_PATTERNS) {
    if (xss.test(fullTarget)) {
      return {
        isThreat: true,
        eventType: "xss_attempt",
        severity: "high",
        description: "Cross-Site Scripting (XSS) payload detected in request",
        recommendedAction: "reject",
      };
    }
  }

  // 4. Check Directory and Environment Probing
  for (const probe of PROBING_PATTERNS) {
    if (probe.test(decodedPath)) {
      return {
        isThreat: true,
        eventType: "probing_attempt",
        severity: "medium",
        description: `Unauthorized file / directory scanning probe: ${decodedPath}`,
        recommendedAction: "reject",
      };
    }
  }

  // 5. Method anomalies
  if (["PUT", "DELETE", "PATCH", "CONNECT", "TRACE"].includes(method.toUpperCase())) {
    // EduArc brochure does not expose public REST PUT/DELETE endpoints
    if (!decodedPath.startsWith("/api/")) {
      return {
        isThreat: true,
        eventType: "suspicious_request",
        severity: "low",
        description: `Unusual HTTP method ${method} on brochure route`,
        recommendedAction: "log",
      };
    }
  }

  return null;
}
