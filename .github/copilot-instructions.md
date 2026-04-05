# Copilot Instructions

This is a learning project that consists on a financial tracking system designed to keep track and budget your expenses during the month, it will be self hosted and used by all the people in a house.

## tech stack
- npm workspaces
- React
- express and nodejs
- PostgreSQL

## Commands

The app runs entirely inside Docker. There are no direct `node`/`vite`/`tsx` dev commands to run locally — everything goes through Compose.

```bash
# Start full stack (dev, with hot reload)
npm run dev

# Stop dev stack
npm run dev:down

# Follow container logs
npm run logs

# Lint everything
npx eslint .

# Lint a specific workspace
npx eslint apps/backend/src
npx eslint apps/frontend/src
```

## Architecture

**Monorepo** with npm workspaces: `apps/frontend`, `apps/backend`, `packages/types`.

**Shared types** live in `packages/types` and are published internally as `@nummus/types`. Both the frontend and backend import from it and all code that will be used in both should be added to the packages. Type definitions are `.d.ts` files (no runtime code).

**Dev request flow:**
```
Browser → Vite :5173 → /api/* proxy → Express :3000 → PostgreSQL :5432
```
The Vite dev server (`vite.config.ts`) proxies all `/api/*` traffic to `http://backend:3000`. There is no CORS configuration needed in development.

**Prod request flow:**
```
Internet → nginx :80 → /* (static files) | /api/* → Express :3000 (internal) → PostgreSQL (internal)
```
Only port 80 is exposed in production. Backend and database are on an internal Docker network.

**Compose layering:** `compose.base.yml` defines shared services; `compose.dev.yml` and `compose.prod.yml` extend it with environment-specific overrides (ports, bind mounts, build targets).

**Database:** Raw SQL via `pg` (node-postgres) `Pool`. The pool is configured via `DATABASE_URL` environment variable injected by Docker Compose. No ORM is used but will be.

## Key Conventions

**Route file naming:** Backend files use snake_case with a suffix representing their type (e.g., `auth_route.ts` or `auth_controller.ts`). Routes are mounted in `app.ts` under `/api/<resource>`.

**Frontend path alias:** `@/` maps to `apps/frontend/src/`. Use it for all non-relative imports in the frontend.

**Frontend module split:** 
- `src/views/` — page-level components (one per route)
- `src/components/ui/` — shadcn/ui primitives (generated, do not hand-edit)
- `src/components/` — custom reusable components
- `src/lib/` — utilities and helpers

**Module system:** `apps/backend` uses CommonJS (`"type": "commonjs"`). `apps/frontend` uses ESM (`"type": "module"`).

**Environment variables** are loaded from `.env` at the project root (git-ignored). Required vars: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `NODE_ENV`. The backend reads `DATABASE_URL` (constructed by Compose from the postgres vars) and `PORT`.
