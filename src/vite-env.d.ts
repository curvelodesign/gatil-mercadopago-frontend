/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ORDER_ID_PARAM: string;
  readonly VITE_META_PIXEL_ID: string;
  readonly VITE_GA4_ID?: string;
  /** "true" liga o Pix dentro do site (ver src/features/donation/pixNoSite.ts) */
  readonly VITE_PIX_NO_SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}