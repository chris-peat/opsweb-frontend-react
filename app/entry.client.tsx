// app/entry.client.tsx
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

async function bootstrap() {
  const config = await fetch("/client/config.json").then(r => r.json());
  window.__APP_CONFIG__ = config;

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    );
  });
}

bootstrap();