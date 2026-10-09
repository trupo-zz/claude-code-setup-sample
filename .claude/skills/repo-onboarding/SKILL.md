---
name: repo-onboarding
description: Explain the Acme Widgets repo layout and how to get productive. Use when a new developer or session needs orientation.
---

# Repo onboarding

1. Read `CLAUDE.md` first.
2. Summarise the layout of `src/` and `tests/` (one line per top-level folder).
3. Give the setup path: `npm ci`, then `npm run dev`.
4. Point out the entry points: `src/server.ts` (starts Express), `src/routes/index.ts` (route registry), `src/services/order.ts` (order logic).
5. List the three riskiest areas to change, using the Gotchas in `CLAUDE.md`.
6. Never open `.env*` files; refer to `.env.example` for variable names.
