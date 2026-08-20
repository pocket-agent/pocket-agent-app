---
type: Feature
title: Extension guidelines
description: Adding Worker routes, UI pages, and env vars safely.
tags: [extension, guidelines]
timestamp: 2026-08-20T00:00:00Z
---

# Extension guidelines

1. Read [index.md](../../index.md) and [FEATURES.md](../FEATURES.md).
2. New Worker routes → add router under `src/api-server/routes/`, register in `index.ts`, add to `run_worker_first` if needed.
3. New UI → add pages under `src/app/pages/`, routes in `src/app/App.tsx`.
4. Contract changes → update **pocket-agent-sdk** first, then worker and UI.
5. Run `bun run typecheck` and `bun run build` before PR.

Do not implement Pocket Node LLM logic here — proxy only.
