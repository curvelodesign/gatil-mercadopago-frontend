/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ORDER_ID_PARAM: string;
  readonly VITE_META_PIXEL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}