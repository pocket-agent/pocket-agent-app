# Agent & developer instructions — pocket-agent-app

**pocket-agent-app** — fullstack **Hono + React** monorepo on Cloudflare Workers. Dashboard UI and OAuth worker share one origin in dev (`:5173`).

## What ships out of the box

| Surface | Route / area | Description |
|---------|----------------|-------------|
| `GET /health` | API | Liveness |
| `GET /status` | API | Worker + agent status |
| `/auth`, `/me`, `/chat`, `/settings` | API | Secured; chat proxies Pocket Node |
| React app | `src/app/` | Chat, monitor, settings, OAuth |

Details: [`index.md`](index.md) · Feature specs: [`specs/`](specs/)

## Key modules

| Area | Path |
|------|------|
| Worker entry | `src/api-server/index.ts` |
| Middleware | `src/api-server/middleware/` |
| Pocket Node proxy | `src/api-server/lib/pocket-node.ts` |
| React app | `src/app/App.tsx` |
| API client | `src/app/api/api.ts` |
| Vite config | `vite.config.ts` |
| Deploy | `wrangler.toml`, `docs/DEPLOYMENT.md` |

## Layout

| Alias | Path |
|-------|------|
| `@/` | `src/app/` |
| `@api-server/` | `src/api-server/` |

## Shared contracts

Depends on `pocket-agent-sdk` (`file:../pocket-agent-sdk`). Update SDK when API shapes or auth modes change.

## Do not duplicate here

| Concern | Repo |
|---------|------|
| Pocket Node / LLM | `../pocket-agent/` |
| Workspace bootstrap | `../pocket-agent/` CLI + `../config/modules.yaml` |

## Local development

```bash
cp .env.example .env.local && cp .dev.vars.example .dev.vars
bun install && bun run dev
```

Terminal 1: `pocket-agent serve` in `../pocket-agent`.

## Deploy

```bash
bun run deploy:production
```

Set secrets per [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Agent checklist

1. Read [index.md](index.md) and [specs/FEATURES.md](specs/FEATURES.md).
2. Keep worker env (`.dev.vars`) and Vite env (`.env.local`) in sync for auth mode.
3. Add new API paths to `run_worker_first` in `wrangler.toml`.

## Repository documents

[README](README.md) | **INSTRUCTIONS** | [CHANGELOG](CHANGELOG.md) | [CONTRIBUTING](CONTRIBUTING.md) | [SECURITY](SECURITY.md) | [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)
