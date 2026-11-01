import { z } from "zod";

export const securitySeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export type SecuritySeverity = z.infer<typeof securitySeveritySchema>;

export const securityEventTypeSchema = z.enum([
  "failed_login",
  "rate_limit_exceeded",
  "sql_injection_attempt",
  "xss_attempt",
  "probing_attempt",
  "unauthorized_access",
  "bot_abuse",
  "suspicious_request",
]);
export type SecurityEventType = z.infer<typeof securityEventTypeSchema>;

export type SecurityEventRecord = {
  id: string;
  ip: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  path: string;
  method: string;
  statusCode: number;
  userAgent: string | null;
  country: string;
  actionTaken: "logged" | "blocked" | "rate_limited" | "locked_out";
  details?: Record<string, unknown> | null;
  createdAt: string;
};

export type BlockedIpRecord = {
  id: string;
  ip: string;
  reason: string;
  severity: SecuritySeverity;
  blockedBy: string;
  expiresAt: string | null;
  createdAt: string;
};

export type IpInvestigationResult = {
  ip: string;
  isBlocked: boolean;
  blockDetails: BlockedIpRecord | null;
  totalIncidents: number;
  firstSeen: string | null;
  lastSeen: string | null;
  severities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  eventTypes: Record<string, number>;
  recentEvents: SecurityEventRecord[];
};

export type SecurityOverview = {
  metrics: {
    totalEvents: number;
    blockedRequests: number;
    failedLogins: number;
    criticalAlerts: number;
    activeBlockedIps: number;
  };
  recentEvents: SecurityEventRecord[];
  topSuspiciousIps: {
    ip: string;
    incidentCount: number;
    highestSeverity: SecuritySeverity;
    isBlocked: boolean;
    lastSeen: string;
    country: string;
  }[];
  activeBlockedIps: BlockedIpRecord[];
  eventsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  defenseStatus: {
    rateLimiting: boolean;
    wafInspection: boolean;
    ipBlocking: boolean;
    bruteForceShield: boolean;
  };
  lastUpdated: string;
};
