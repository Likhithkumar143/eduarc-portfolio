import { describe, expect, it } from "vitest";
import {
  blockedIpCache,
  inspectRequestThreat,
} from "@/lib/security-detector";

describe("Website Security Monitoring & Threat Detection (Phase 2)", () => {
  describe("SQL Injection (SQLi) Detection", () => {
    it("detects basic tautology injection: ' OR '1'='1", () => {
      const threat = inspectRequestThreat("/programs?id=1' OR '1'='1", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("sql_injection_attempt");
      expect(threat?.severity).toBe("critical");
    });

    it("detects UNION SELECT injection", () => {
      const threat = inspectRequestThreat("/mentors?search=test' UNION SELECT username,password FROM admin_credentials--", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("sql_injection_attempt");
      expect(threat?.severity).toBe("critical");
    });

    it("detects time-based blind SQLi: sleep(5)", () => {
      const threat = inspectRequestThreat("/about?ref=1'; SLEEP(5);--", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("sql_injection_attempt");
    });

    it("allows harmless query parameters", () => {
      const safe = inspectRequestThreat("/programs?query=career+guidance&sort=recent", "GET", "Mozilla/5.0");
      expect(safe).toBeNull();
    });
  });

  describe("Cross-Site Scripting (XSS) Detection", () => {
    it("detects script tag injection", () => {
      const threat = inspectRequestThreat("/contact?name=<script>alert('pwned')</script>", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("xss_attempt");
      expect(threat?.severity).toBe("high");
    });

    it("detects inline event handler onerror attribute", () => {
      const threat = inspectRequestThreat('/partner?ref="><img src=x onerror=alert(1)>', "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("xss_attempt");
    });

    it("detects javascript: pseudo-protocol", () => {
      const threat = inspectRequestThreat("/testimonials?redirect=javascript:document.location='http://evil.com'", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("xss_attempt");
    });
  });

  describe("Directory & Environment Probing Detection", () => {
    it("detects .env file probing", () => {
      const threat = inspectRequestThreat("/.env", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("probing_attempt");
      expect(threat?.severity).toBe("medium");
    });

    it("detects .git probing", () => {
      const threat = inspectRequestThreat("/.git/config", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("probing_attempt");
    });

    it("detects WordPress scanner probes", () => {
      const threat = inspectRequestThreat("/wp-login.php", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("probing_attempt");
    });

    it("detects database admin probing (phpmyadmin)", () => {
      const threat = inspectRequestThreat("/phpmyadmin/index.php", "GET", null);
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("probing_attempt");
    });
  });

  describe("Malicious Bot & Attack Scanner Detection", () => {
    it("detects sqlmap user agent", () => {
      const threat = inspectRequestThreat("/features", "GET", "sqlmap/1.6#stable");
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("bot_abuse");
      expect(threat?.recommendedAction).toBe("block");
    });

    it("detects nikto vulnerability scanner user agent", () => {
      const threat = inspectRequestThreat("/", "GET", "Mozilla/5.0 (Nikto/2.1.6)");
      expect(threat).not.toBeNull();
      expect(threat?.eventType).toBe("bot_abuse");
    });
  });

  describe("IP Blocklist Cache & Enforcement", () => {
    const testIp = "203.0.113.42";

    it("correctly blocks and identifies blocked IP", () => {
      expect(blockedIpCache.isBlocked(testIp).blocked).toBe(false);

      blockedIpCache.setBlock(testIp, "Brute force exploit test", 3600);
      const check = blockedIpCache.isBlocked(testIp);
      expect(check.blocked).toBe(true);
      expect(check.reason).toBe("Brute force exploit test");
    });

    it("unblocks IP correctly upon administrative action", () => {
      blockedIpCache.removeBlock(testIp);
      expect(blockedIpCache.isBlocked(testIp).blocked).toBe(false);
    });

    it("expires temporary blocks when time limit has passed", () => {
      const tempIp = "203.0.113.99";
      blockedIpCache.setBlock(tempIp, "Expired test", -10); // already expired
      expect(blockedIpCache.isBlocked(tempIp).blocked).toBe(false);
    });
  });
});
