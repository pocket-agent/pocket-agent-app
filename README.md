<img src=".github/icon-cropped.png" width="200" alt="Pocket Agent" align="left"/>

<div>
<h3>Pocket Agent App</h3>
<p>
Fullstack <strong>Pocket Agent</strong> dashboard — React UI and Hono API on <strong>Cloudflare Workers</strong> in one monorepo. Google OAuth on the edge (or local bypass); chat, monitor, and settings proxied to <strong>Pocket Node</strong> on your machine.
</p>
<a href="https://pocket-agent.pages.dev/"><img src="https://img.shields.io/badge/LIVE_DEMO-007ec6?style=flat-square&logo=cloudflare&logoColor=white" width="175" alt="Live demo"/></a>
&nbsp;
<a href="https://github.com/pocket-agent/pocket-agent-desktop-app/releases"><img src="https://img.shields.io/badge/Download%20for%20macOS-007ec6?style=flat-square&logo=apple" width="175" alt="Download for macOS"/></a>
</div>

<br/><br/>

<div align="center">

[![Release](https://img.shields.io/github/v/release/pocket-agent/pocket-agent-app)](https://github.com/pocket-agent/pocket-agent-app/releases)
[![License](https://img.shields.io/badge/License-MIT-blue)](https://github.com/pocket-agent/pocket-agent-app/blob/main/LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Hono%20%2B%20React-646cff)](https://github.com/pocket-agent/pocket-agent-app)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![CI](https://github.com/pocket-agent/pocket-agent-app/actions/workflows/ci.yml/badge.svg)](https://github.com/pocket-agent/pocket-agent-app/actions/workflows/ci.yml)

<br/>
<br/>

<img src=".github/screenshot.png" width="824" alt="Pocket Agent dashboard" style="border-radius: 5px;"/><br/>

<p>
  <a href="https://github.com/pocket-agent/pocket-agent"><strong>Pocket Node</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/pocket-agent/pocket-agent-sdk"><strong>SDK</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/orgs/pocket-agent/repositories"><strong>All repositories</strong></a>
</p>

</div>

<hr>

## Features

- **Monorepo fullstack** — Hono Worker (`src/api-server/`) + React SPA (`src/app/`) in one deploy
- **Same-origin dev** — UI and API on `:5173` via Vite + `@cloudflare/vite-plugin`
- **Dashboard** — chat, monitor, settings, connection profile label in the header
- **Google OAuth** — Bearer JWT on the worker, or `AUTH_MODE=none` for local all-local dev
- **Pocket Node proxy** — `/chat`, `/me`, `/settings` forwarded to `POCKET_NODE_URL`
- **Shared contracts** — types and envelopes from [pocket-agent-sdk](https://github.com/pocket-agent/pocket-agent-sdk)

## How it fits together

```text
Browser / desktop shell  →  pocket-agent-app (:5173 · UI + API)
                                    │
                                    ▼
                         pocket-agent Pocket Node (:8787)
```

Same layout pattern as [dropafile](https://github.com/dropafile/dropafile): `run_worker_first` for API routes, SPA fallback via `[assets]` in `wrangler.toml`.

## Requirements

- **Bun** or Node 20+
- **Pocket Node** at `http://127.0.0.1:8787` for full chat flow ([pocket-agent](https://github.com/pocket-agent/pocket-agent))

## Install

1. **End users:** visit [pocket-agent.pages.dev](https://pocket-agent.pages.dev) or download the [macOS app](https://github.com/pocket-agent/pocket-agent-desktop-app/releases) (bundled stack).
2. **Developers:** clone this repo and run locally (see Quick start).

## Quick start

**Terminal 1 — Pocket Node**

```bash
cd ../pocket-agent && source .venv/bin/activate
pip install -e ../pocket-agent-sdk/python
pocket-agent serve
```

**Terminal 2 — Fullstack app**

```bash
git clone https://github.com/pocket-agent/pocket-agent-app.git
cd pocket-agent-app
cp .env.example .env.local
cp .dev.vars.example .dev.vars
cd ../pocket-agent-sdk && npm run build
bun install && bun run dev
```

Open **http://localhost:5173** — `/health`, `/chat`, and the UI share one origin.

## Development

| Command | Description |
|---------|-------------|
| `bun run dev` | Vite + Cloudflare worker (port 5173) |
| `bun run build` | Production SPA + worker bundle |
| `bun run typecheck` | TypeScript (app + worker) |
| `bun run deploy` | Build and `wrangler deploy` |

Full workspace setup: `../scripts/setup-local.sh` or `pocket-agent wizard` from the org folder.

## Environment

| File | Purpose |
|------|---------|
| `.env.local` | Vite — `VITE_AUTH_MODE`, `VITE_GOOGLE_CLIENT_ID`, `VITE_CONNECTION_PROFILE` |
| `.dev.vars` | Wrangler — `AUTH_MODE`, `GOOGLE_CLIENT_ID`, `POCKET_NODE_URL`, `ALLOWED_ORIGINS` |

All-local dev: `AUTH_MODE=none` and `VITE_AUTH_MODE=none` (no Google sign-in).

## Documentation

| Doc | Description |
|-----|-------------|
| [index.md](index.md) | OKF knowledge bundle |
| [INSTRUCTIONS.md](INSTRUCTIONS.md) | Agent development rules |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Cloudflare production deploy |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

Ecosystem: [pocket-agent](https://github.com/pocket-agent) · Creator: [Charlie Rios (@xarlizard)](https://github.com/xarlizard)

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

Pocket Agent App is released under the [MIT License](LICENSE).
