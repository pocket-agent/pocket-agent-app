/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CONNECTION_PROFILE?: string;
  readonly VITE_DESKTOP_BUNDLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
