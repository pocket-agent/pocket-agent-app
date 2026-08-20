---
type: Feature
title: Health and status
description: Public liveness and worker status endpoints.
tags: [health, status, api]
timestamp: 2026-08-20T00:00:00Z
---

# Health and status

| Route | Method | Description |
|-------|--------|-------------|
| `/health` | GET | Worker liveness; used by UI health hook |
| `/status` | GET | Worker + Pocket Node reachability summary |

Both routes are listed in `wrangler.toml` `run_worker_first` so they hit the Worker before SPA fallback.

Response shapes: `pocket-agent-sdk` (`HealthData`, `ApiWorkerStatusData`).
