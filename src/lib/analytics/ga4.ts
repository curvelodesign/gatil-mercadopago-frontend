// Google Analytics 4. Só é carregado depois do consentimento (ver rastreamento.ts).
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID;

export function initGA4() {
  if (!GA4_ID || typeof window === "undefined" || window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // page_view é enviado a cada troca de rota (ver rastreamento.ts)
  window.gtag("config", GA4_ID, { send_page_view: false });
}

export function gaEvent(nome: string, params?: Record<string, unknown>) {
  window.gtag?.("event", nome, params);
}

export function gaPageView() {
  gaEvent("page_view", { page_location: window.location.href, page_title: document.title });
}
