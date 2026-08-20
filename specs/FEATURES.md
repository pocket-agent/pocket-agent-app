# Features (contract)

| Feature | Route / UI | Auth |
|---------|------------|------|
| Health | `GET /health` | Public |
| Status | `GET /status` | Public |
| Auth | `/auth/*` | Google JWT or local bypass |
| Me | `GET /me` | Secured |
| Chat | `POST /chat` | Secured → proxies Pocket Node |
| Settings | `/settings/*` | Secured |
| Dashboard | React `src/app/` | OAuth or `VITE_AUTH_MODE=none` |

See numbered specs under `specs/features/`.
