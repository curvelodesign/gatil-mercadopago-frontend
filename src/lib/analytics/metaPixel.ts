// src/lib/analytics/metaPixel.ts
// Pixel exclusivo da campanha de doação: só é carregado pelo
// DonationLayout, pra não misturar as interações da rifa.
type PixelEvent =
  | "PageView"
  | "InitiateCheckout"
  | "Purchase"
  | "Donate"
  | "Lead";

const PIXEL_SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";

let initialized = false;

function callFbq(...args: unknown[]) {
  try {
    if (initialized && typeof window.fbq === "function") {
      window.fbq(...args);
    }
  } catch {
  }
}

/** Carrega o script do Pixel e inicializa o ID — idempotente. */
export function initMetaPixel() {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (initialized || typeof window === "undefined" || !pixelId) return;

  if (!window.fbq) {
    // Mesmo stub do snippet oficial: enfileira as chamadas até o
    // fbevents.js terminar de carregar.
    const fbq: FbqFunction = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as FbqFunction;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = PIXEL_SCRIPT_URL;
    document.head.appendChild(script);
  }

  // O PageView é disparado manualmente pelo DonationLayout; sem isso o
  // Pixel também contaria navegações do SPA pra fora da doação.
  window.fbq.disablePushState = true;
  window.fbq("init", pixelId);
  initialized = true;
}

export function trackPageView() {
  callFbq("track", "PageView");
}

export function trackEvent(event: PixelEvent, params?: Record<string, unknown>) {
  callFbq("track", event, params);
}
