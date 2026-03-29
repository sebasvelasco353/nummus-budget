# Nummus Budget

A self-hosted personal finance dashboard. Track spending, manage budgets, and visualize your financial data — all on infrastructure you control.

This project is also a learning exercise in fullstack engineering: moving from frontend expertise into backend development, DevOps, and production deployment patterns.

## Table of Contents

- [Goals](#goals)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running in Development](#running-in-development)
  - [Running in Production](#running-in-production)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
  - [Commit Convention](#commit-convention)
  - [Linting](#linting)
- [Deployment Notes](#deployment-notes)
- [Roadmap](#roadmap)

## Goals

**Product goals:**
- A privacy-first budgeting tool with no third-party data sharing
- Dashboard with spending categories, budget limits, and historical trends
- Simple authentication for single-user or family use

**Learning goals:**
- Design and implement a RESTful API with Express + TypeScript
- Manage a relational database schema with PostgreSQL
- Containerize a full application stack with Docker Compose
- Apply production deployment patterns: reverse proxying, health checks, security hardening
- Practice monorepo tooling: shared configs, workspaces, lint-staged hooks

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS , shadcn/ui |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM / Query | `pg` (node-postgres, raw SQL) might use Drizzle in the future |
| Containerization | Docker, Docker Compose |
| Dev Server | Vite (frontend), nodemon + tsx (backend) |
| Code Quality | ESLint 9, Husky, lint-staged, commitlint |

## Project Structure

```
nummus-budget/
│
├── apps/
│   ├── frontend/               # React + Vite application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   │   └── ui/         # shadcn/ui primitives (Button, Card, Input…)
│   │   │   ├── views/          # Page-level components (Dashboard, Login…)
│   │   │   ├── lib/            # Shared utilities (cn helper, etc.)
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css       # Tailwind + CSS variables
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── components.json     # shadcn/ui configuration
│   │
│   └── backend/                # Express API server
│       ├── src/
│       │   ├── app.ts          # Express app setup (middleware, routes, DB pool)
│       │   └── server.ts       # HTTP server entry point
│       ├── nodemon.json        # Hot-reload config for development
│       └── tsconfig.json
│
├── docker/
│   ├── frontend/
│   │   ├── Dockerfile.dev      # Dev server container
│   │   ├── Dockerfile.prod     # Multi-stage: build → nginx
│   │   └── nginx.conf          # nginx: serve static + proxy /api/* to backend
│   └── backend/
│       ├── Dockerfile.dev      # nodemon + tsx live reload
│       └── Dockerfile.prod     # Compiled JS, production deps only, non-root user
│
├── compose.base.yml            # Shared service definitions (postgres, backend, frontend)
├── compose.dev.yml             # Dev overrides: ports, bind mounts, hot reload
├── compose.prod.yml            # Prod overrides: builds, no exposed backend port
│
├── .husky/                     # Git hooks
│   ├── pre-commit              # Runs lint-staged
│   └── commit-msg              # Runs commitlint
│
├── eslint.config.mts           # Flat ESLint config (v9)
├── commitlint.config.ts
└── package.json                # Root workspace manifest + shared dev tooling
```

---

## Architecture Overview

### Development

```
Browser
  │
  ├─── localhost:5173 ──► Vite Dev Server
  │                           │ /api/* proxy
  │                           ▼
  └─── localhost:3000 ──► Express (nodemon + tsx)
                              │
                              ▼
                          PostgreSQL :5432
```

In development, the Vite config proxies all `/api/*` requests to the backend. Both frontend and backend source directories are bind-mounted into their containers, giving you live reload without rebuilding images.

### Production

```
Internet
  │
  ▼
nginx :80  (frontend container — the only publicly exposed port)
  │
  ├─── /* ───────────► Static files built by Vite (in /usr/share/nginx/html)
  │
  └─── /api/* ───────► Express :3000 (backend container, internal network only)
                            │
                            ▼
                        PostgreSQL (internal network only, no host port)
```

In production, only port 80 of the nginx container is exposed. The backend and database are isolated on an internal Docker network and are unreachable from outside the host.

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v24+) with the Compose plugin
- [Node.js](https://nodejs.org/) v20+ (only needed locally for the git hooks / linting — the app runs inside Docker)
- [npm](https://docs.npmjs.com/) v10+

Install local tooling (for hooks and linting):

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. It is git-ignored and must never be committed.

```bash
cp .env.example .env   # if the example file exists, otherwise create it manually
```

Required variables:

```env
# PostgreSQL
POSTGRES_USER=nummus
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=nummus_budget

# Application
NODE_ENV=development   # or production
```

> **Security note:** In production, use a long random string for `POSTGRES_PASSWORD`. Never reuse development credentials.

### Running in Development

```bash
npm run dev
```

This runs `docker compose -f compose.base.yml -f compose.dev.yml up --build`.

Once running:

| Service | URL |
|---|---|
| Frontend (Vite HMR) | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

Source files are bind-mounted, so changes to `apps/frontend/src` and `apps/backend/src` reload automatically without rebuilding the image.

To stop:

```bash
npm run dev:down
```

To follow logs:

```bash
npm run logs
```

### Running in Production

```bash
npm run prod
```

This runs `docker compose -f compose.base.yml -f compose.prod.yml up --build -d` in detached mode.

The application will be available at **http://localhost** (port 80).

To stop:

```bash
npm run prod:down
```

> **TLS / HTTPS:** For public deployments, place a reverse proxy (Caddy, Traefik, or a host-level nginx) in front of port 80 to handle TLS termination and certificate renewal.

---

## Available Scripts

All scripts are defined at the root `package.json` and operate on the Docker Compose stack.

| Script | Description |
|---|---|
| `npm run dev` | Start the full stack in development mode with hot reload |
| `npm run dev:down` | Stop and remove development containers |
| `npm run prod` | Build and start the full stack in production mode (detached) |
| `npm run prod:down` | Stop and remove production containers |
| `npm run logs` | Follow logs from all running development containers |

---

## Development Workflow

### Commit Convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via `commitlint` and Husky. Every commit message must follow the format:

```
<type>(optional scope): <description>

Examples:
  feat(dashboard): add monthly spending chart
  fix(auth): handle expired session tokens
  chore: update Docker base images
  docs: add deployment notes to README
```

Common types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`.

Commits that don't match this format will be rejected by the `commit-msg` hook.

### Linting

ESLint runs automatically on staged files before every commit via `lint-staged`. To run it manually:

```bash
# Lint everything
npx eslint .

# Lint only backend
npx eslint apps/backend/src
```

The ESLint config (`eslint.config.mts`) uses flat config format (ESLint v9) and includes:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` for hooks rules
- `eslint-plugin-react-refresh` for Vite HMR compatibility

---

## Deployment Notes

### Database Persistence

PostgreSQL data is stored in a named Docker volume (`postgres_data`). This volume persists across container restarts and `down` commands. To fully reset the database:

```bash
docker volume rm nummus-budget_postgres_data
```

### Health Checks

The `postgres` service includes a health check (`pg_isready`) that the backend depends on. The backend container will not start until the database is accepting connections, preventing connection errors on cold start.

### Security Considerations

- The backend is never exposed to the host in production (no port binding in `compose.prod.yml`)
- The backend container runs as a non-root user (`appuser`) in production
- Production builds install only `--omit=dev` dependencies, reducing the image attack surface
- All secrets are passed via environment variables, never baked into images (enforced by `.dockerignore`)

---

## Roadmap

- [ ] Database schema: users, accounts, transactions, categories, budgets
- [ ] REST API: CRUD for all entities
- [ ] Authentication: session-based auth
- [ ] Protected routes on the frontend
- [ ] Dashboard view: spending summary, budget progress bars
- [ ] Transaction list with filtering and search
- [ ] Monthly trend charts
- [ ] CSV import for bank statement data
- [ ] Dark mode support (CSS variables already wired)
- [ ] Docker health check for the backend service