import { recordAnalyticsEvent } from "./analytics.functions";
import type { AnalyticsEventType, TrackEventInput } from "./analytics.types";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const STORAGE_KEY_VID = "eduarc_vid";
const STORAGE_KEY_FIRST_SEEN = "eduarc_v_first";
const STORAGE_KEY_SID = "eduarc_sid";
const STORAGE_KEY_SLOG = "eduarc_s_last";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function getOrCreateVisitorId(): { visitorId: string; isNewVisitor: boolean } {
  if (typeof window === "undefined") {
    return { visitorId: "anon_server", isNewVisitor: false };
  }

  try {
    let vid = localStorage.getItem(STORAGE_KEY_VID);
    let isNew = false;
    if (!vid) {
      vid = `v_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem(STORAGE_KEY_VID, vid);
      localStorage.setItem(STORAGE_KEY_FIRST_SEEN, new Date().toISOString());
      isNew = true;
    }
    return { visitorId: vid, isNewVisitor: isNew };
  } catch {
    return { visitorId: "anon_storage_restricted", isNewVisitor: false };
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "s_server";

  try {
    const now = Date.now();
    const lastActiveStr = sessionStorage.getItem(STORAGE_KEY_SLOG);
    const existingSid = sessionStorage.getItem(STORAGE_KEY_SID);

    if (existingSid && lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      if (now - lastActive < SESSION_TIMEOUT_MS) {
        sessionStorage.setItem(STORAGE_KEY_SLOG, String(now));
        return existingSid;
      }
    }

    // New session
    const newSid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    sessionStorage.setItem(STORAGE_KEY_SID, newSid);
    sessionStorage.setItem(STORAGE_KEY_SLOG, String(now));
    return newSid;
  } catch {
    return "s_ephemeral";
  }
}

function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua)) {
    return "tablet";
  }
  if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo)/i.test(ua) || width < 768) {
    return "mobile";
  }
  if (width >= 768 && width <= 1024 && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return "tablet";
  }
  return "desktop";
}

function detectBrowser(): string {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent;

  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/") && !ua.includes("Chromium/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  return "Other";
}

function detectOS(): string {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent;

  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac") && !ua.includes("iPhone") && !ua.includes("iPad")) return "macOS";
  if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

let sessionStartTime = typeof window !== "undefined" ? Date.now() : 0;

/**
 * Send an analytics event to our backend and Google Tag (gtag)
 */
export async function trackEvent(
  eventType: AnalyticsEventType,
  path: string,
  eventLabel?: string | null,
) {
  if (typeof window === "undefined") return;

  // Do not track admin or reception routes
  if (path.startsWith("/admin") || path.startsWith("/reception")) return;

  const { visitorId, isNewVisitor } = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const deviceType = detectDevice();
  const browser = detectBrowser();
  const os = detectOS();
  const referrer = document.referrer || null;
  const durationSeconds = Math.max(0, Math.round((Date.now() - sessionStartTime) / 1000));

  const payload: TrackEventInput = {
    eventType,
    path,
    referrer,
    eventLabel: eventLabel || null,
    sessionId,
    visitorId,
    deviceType,
    browser,
    os,
    isNewVisitor,
    durationSeconds,
  };

  // 1. Google Analytics (gtag.js) sync
  try {
    if (typeof window.gtag === "function") {
      if (eventType === "page_view") {
        window.gtag("event", "page_view", {
          page_path: path,
          page_title: document.title,
        });
      } else {
        window.gtag("event", eventType, {
          event_label: eventLabel || undefined,
          event_category: "Engagement",
        });
      }
    }
  } catch {
    // Non-blocking
  }

  // 2. EduArc backend analytics storage
  try {
    await recordAnalyticsEvent({ data: payload });
  } catch (err) {
    // Silent fail to avoid disrupting user experience
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string) {
  sessionStartTime = Date.now();
  return trackEvent("page_view", path);
}

/**
 * Track CTA button click
 */
export function trackCtaClick(label: string, path?: string) {
  const currentPath = path || (typeof window !== "undefined" ? window.location.pathname : "/");
  return trackEvent("cta_click", currentPath, label);
}

/**
 * Track Contact (phone/email) click
 */
export function trackContactClick(type: "phone" | "email" | "whatsapp", detail?: string) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  return trackEvent("contact_click", currentPath, `${type}:${detail || "direct"}`);
}

/**
 * Track Enquiry conversion submission
 */
export function trackEnquirySubmit(role: string) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/partner";
  return trackEvent("enquiry_submit", currentPath, `role:${role}`);
}

