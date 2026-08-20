---
type: Feature
title: Auth and chat routes
description: Secured routes with Google JWT or local dev bypass; chat proxies to Pocket Node.
tags: [auth, oauth, chat, proxy]
timestamp: 2026-08-20T00:00:00Z
---

# Auth and chat routes

Secured routes (see `src/api-server/index.ts`):

| Route | Role |
|-------|------|
| `/auth/*` | OAuth helpers |
| `/me` | Current user profile |
| `/chat` | Chat proxy → `POCKET_NODE_URL` |
| `/settings/*` | Settings proxy |

**Local dev:** `AUTH_MODE=none` in `.dev.vars` uses synthetic local user (see `@api-server/lib/auth-mode`).

**Production:** `AUTH_MODE=google` + `GOOGLE_CLIENT_ID` secret; browser sends Bearer ID token.

UI auth: `VITE_AUTH_MODE` in `.env.local` must stay aligned with worker `AUTH_MODE`.
