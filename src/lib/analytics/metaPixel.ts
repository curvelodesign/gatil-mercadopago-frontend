// src/lib/analytics/metaPixel.ts
type PixelEvent =
  | "PageView"
  | "InitiateCheckout"
  | "Purchase"
  | "Donate"
  | "Lead";

function callFbq(...args: unknown[]) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq(...args);
    }
  } catch {
  }
}

export function trackPageView() {
  callFbq("track", "PageView");
}

export function trackEvent(event: PixelEvent, params?: Record<string, unknown>) {
  callFbq("track", event, params);
}