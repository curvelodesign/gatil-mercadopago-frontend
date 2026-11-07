/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ORDER_ID_PARAM: string;
  readonly VITE_META_PIXEL_ID: string;
  readonly VITE_GA4_ID?: string;
  /** "true" liga o Pix dentro do site (ver src/features/pix/pixNoSite.ts) */
  readonly VITE_PIX_NO_SITE?: string;
  /** "true": a Ação de Natal escolhe os números antes de pagar (reserva). */
  readonly VITE_FLUXO_COMPLETO?: string;
  /** Chave pública (site key) do Cloudflare Turnstile, usada na reserva. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  /** "true" (só em `npm run dev`): backend falso em memória, para testar a jornada sem backend. */
  readonly VITE_API_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}