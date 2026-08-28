// app/types/global.d.ts
export interface AppConfig {
  apiUrl: string;
  legacyRootUrl: string;
  // add whatever else your config.json actually contains
}

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig;
  }

  // Injected at build time via vite.config.ts `define`, from package.json's version field.
  const __APP_VERSION__: string;
}

export {};