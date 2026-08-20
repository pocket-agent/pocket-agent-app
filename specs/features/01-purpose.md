---
type: Feature
title: Purpose
description: Fullstack Pocket Agent app — Hono on Cloudflare Workers + React SPA in one repo.
tags: [fullstack, hono, react, cloudflare, pocket-agent]
timestamp: 2026-08-20T00:00:00Z
---

# Purpose

**pocket-agent-app** merges the former `pocket-agent-web-app` and `pocket-agent-api-app` into a single deployable unit (same pattern as [dropafile](https://github.com/dropafile/dropafile)).

| Layer | Path |
|-------|------|
| Worker (Hono) | `src/api-server/` |
| React SPA | `src/app/` |
| Entry | `index.html` → `/src/app/main.tsx` |
| Deploy | `wrangler.toml` + `[assets]` SPA fallback |

The worker validates Google OAuth (or `AUTH_MODE=none` locally) and proxies chat/profile traffic to Pocket Node at `POCKET_NODE_URL`.
