---
okf_version: "0.1"
---

# pocket-agent-app

OKF knowledge bundle for the **fullstack app** — Hono Worker + React SPA (monorepo).

## Documentation

* [README.md](README.md) — quick start, scripts, deploy
* [INSTRUCTIONS.md](INSTRUCTIONS.md) — maintainer and agent guide
* [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Cloudflare production deploy

## Features

* [01 — Purpose](specs/features/01-purpose.md) — monorepo goals and layout
* [02 — Health and status](specs/features/02-health-status.md) — public probes
* [03 — Auth and chat routes](specs/features/03-auth-chat-routes.md) — OAuth, `/chat`, `/me`
* [04 — Middleware](specs/features/04-middleware.md) — CORS, auth, errors
* [05 — Fullstack runtime](specs/features/05-fullstack-runtime.md) — Vite + Worker + SPA
* [06 — Extension guidelines](specs/features/06-extension-guidelines.md) — new routes and UI

## Related repos

* [pocket-agent](https://github.com/pocket-agent/pocket-agent) — Pocket Node proxy target
* [pocket-agent-sdk](https://github.com/pocket-agent/pocket-agent-sdk) — shared contracts

## History

* [specs/log.md](specs/log.md)
