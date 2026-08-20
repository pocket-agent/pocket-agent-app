---
type: Feature
title: Fullstack runtime
description: Vite, Cloudflare Vite plugin, Worker + SPA assets on one port.
tags: [vite, wrangler, deployment]
timestamp: 2026-08-20T00:00:00Z
---

# Fullstack runtime

```text
bun run dev     →  Vite + @cloudflare/vite-plugin (:5173, UI + API same origin)
bun run build   →  dist/client (SPA) + Worker bundle
bun run deploy  →  wrangler deploy
```

```text
src/
├── api-server/   # Hono Worker (@api-server/* imports)
└── app/          # React SPA (@/* imports)
```

`wrangler.toml`:

- `main = src/api-server/index.ts`
- `[assets]` with `not_found_handling = single-page-application`
- `run_worker_first` for `/health`, `/status`, `/auth`, `/me`, `/chat`, `/settings`

API base URL in UI defaults to `window.location.origin` (omit `VITE_API_BASE_URL` locally).

Pocket Node must run at `http://127.0.0.1:8787` for chat proxy during dev.
