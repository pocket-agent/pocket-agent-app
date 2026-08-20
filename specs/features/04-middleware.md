---
type: Feature
title: Middleware
description: Logger, CORS, auth gate, and global error handler.
tags: [middleware, cors, hono]
timestamp: 2026-08-20T00:00:00Z
---

# Middleware

Defined in `src/api-server/middleware/index.ts`:

| Middleware | Role |
|------------|------|
| `logger()` | Request logging |
| `corsMiddleware` | `ALLOWED_ORIGINS` from Worker env |
| `authMiddleware` | JWT verification or local bypass |
| `errorHandler` | JSON error envelope |

CORS origins for local dev: `http://localhost:5173` (same-origin in monorepo dev).
