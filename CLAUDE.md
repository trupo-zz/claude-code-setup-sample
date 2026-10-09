# Acme Widgets - Claude Code project guide

## Project overview
Acme Widgets is a small web app where customers browse and order widgets. An Express API serves JSON and a static front end; orders are stored in a Postgres database.

- Stack: TypeScript, Node 20, Express, Postgres, Vitest, ESLint
- Package manager: npm
- Main source dir: `src/`
- Tests live in: `tests/`

## Commands
| Task | Command |
|------|---------|
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Test (all) | `npm test` |
| Lint | `npm run lint` |

Run build, lint and tests before saying a task is done.

## Conventions
- Strict TypeScript; no `any` without a comment explaining why.
- One route per file in `src/routes/`, business logic in `src/services/`.
- Named exports only; files in kebab-case.
- Tests mirror the source path: `src/services/order.ts` is tested by `tests/services/order.test.ts`.
- Conventional commit messages (`feat:`, `fix:`, `chore:`).

## Do
- Validate all request input with the schemas in `src/schemas/`.
- Add or update a test with every behaviour change.
- Keep functions small and pure where possible.

## Don't
- Do not add new dependencies without asking.
- Do not edit generated files in `src/generated/`.
- Do not read, print or edit `.env*` files or anything under `secrets/`.
- Do not force-push, and do not run destructive `rm` commands.

## Gotchas
- `npm run build` regenerates `src/generated/`; commit the result.
- The `orders` integration tests need a local Postgres; they are skipped when `DATABASE_URL` is unset.
- Money values are integer cents everywhere; never use floats.
- The dev server restarts on file change but not on `.env` change.
