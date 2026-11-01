import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView, trackContactClick, trackCtaClick } from "@/lib/analytics-client";

export function AnalyticsTracker() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const lastTrackedPath = useRef<string | null>(null);

  // Track page navigation changes
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/reception")) {
      return;
    }

    if (lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname;
      trackPageView(pathname);
    }
  }, [pathname]);

  // Global click listener for telephone, email, WhatsApp, and CTA buttons
  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!target) return;

      // Skip admin interactions
      if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/reception")) {
        return;
      }

      // Check explicit data-analytics attribute
      const explicitLabel = target.getAttribute("data-analytics");
      if (explicitLabel) {
        trackCtaClick(explicitLabel);
        return;
      }

      // Check anchor links
      if (target.tagName.toLowerCase() === "a") {
        const href = (target as HTMLAnchorElement).href || "";
        if (href.startsWith("tel:")) {
          trackContactClick("phone", href.replace("tel:", ""));
          return;
        }
        if (href.startsWith("mailto:")) {
          trackContactClick("email", href.replace("mailto:", ""));
          return;
        }
        if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
          trackContactClick("whatsapp", href);
          return;
        }
      }

      // Check high-intent CTA button text
      const text = (target.textContent || "").trim();
      if (text) {
        const lower = text.toLowerCase();
        if (
          lower.includes("book") ||
          lower.includes("enquire") ||
          lower.includes("counselling") ||
          lower.includes("proposal") ||
          lower.includes("partner") ||
          lower.includes("contact") ||
          lower.includes("schedule") ||
          lower.includes("get guidance")
        ) {
          trackCtaClick(`cta:${text.slice(0, 40)}`);
        }
      }
    }

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}

