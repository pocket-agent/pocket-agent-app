# Deployment — pocket-agent-app

Single Cloudflare Worker deploy serves both the Hono API and the React SPA (`[assets]` + `run_worker_first`).

## Prerequisites

- Cloudflare account and `wrangler login`
- Google OAuth client ID (when `AUTH_MODE=google`)
- Pocket Node reachable from the worker (Cloudflare Tunnel URL or public agent URL)

## Production secrets

```bash
bun run build
wrangler secret put GOOGLE_CLIENT_ID --env production
wrangler secret put POCKET_NODE_URL --env production
wrangler secret put ALLOWED_ORIGINS --env production
bun run deploy:production
```

Set `ALLOWED_ORIGINS` to your workers.dev or custom domain (e.g. `https://pocket-agent.pages.dev`).

## Staging

```bash
bun run deploy:staging
```

## Local dev

Same-origin API on port 5173 — no separate worker port. Pocket Node must run on `:8787` (see root `README.md`).
