# Residential Building Voting System

## Project Overview

The Residential Building Voting System is a production-oriented, full-stack web application designed to manage secure, real-time voting during residential assembly meetings. The system prioritizes data integrity, fairness, and operational reliability under concurrent usage, enforcing strict one-vote-per-apartment constraints at the database level.

Architected as a TypeScript monorepo using npm workspaces, the platform demonstrates strong software engineering practices including shared type contracts across layers, Docker-based orchestration, structured repository governance, and layered testing. It reflects production-grade architectural thinking with a focus on correctness, security, and maintainability.

# Architecture

## Monorepo Structure (npm Workspaces)

```
voting-app/
│
├── apps/
│   ├── frontend/        # React client
│   └── backend/         # Express API
│
├── packages/
│   └── shared-types/    # Shared TypeScript contracts
│
├── docker-compose.yml
├── package.json
└── ...
```

### Why Monorepo?

* Single source of truth
* Shared type safety between layers
* Unified tooling and governance
* Simplified CI/CD
* Coordinated releases

# Technology Stack

## Frontend (`apps/frontend`)

* React
* TypeScript
* shadcn/ui
* Axios
* Nginx (production serving)

## Backend (`apps/backend`)

* Node.js
* Express
* TypeScript
* JWT Authentication
* bcrypt
* PostgreSQL

## Shared Package (`packages/shared-types`)

Contains:

* DTO definitions
* API request/response interfaces
* Shared enums
* Vote value definitions

Example:

```ts
export type VoteValue = 'yes' | 'no' | 'na'

export interface QuestionDTO {
  id: string
  title: string
  description: string
  isOpen: boolean
}
```

Imported in both apps:

```ts
import { QuestionDTO } from '@voting-app/shared-types'
```

This prevents API contract drift.

---

# Database Design

## users

* UUID primary key
* Unique apartment number
* Role (`admin` | `resident`)
* Password hash (bcrypt)
* Activation flag

## sessions

Enforces one active session per user:

```
UNIQUE (user_id) WHERE is_active = true
```

## questions

* Title
* Description
* `is_open` boolean

## votes

Prevents duplicate votes:

```
UNIQUE (question_id, user_id)
```

# Authentication Flow

1. User submits apartment number + password
2. Backend:

   * Validates credentials
   * Invalidates previous session
   * Creates new session record
   * Issues 4-hour JWT
3. JWT stored in HTTP-only cookie
4. Middleware verifies:

   * JWT signature
   * Session exists and active
   * Session not expired

Only one active session per apartment is allowed.

# Docker Architecture

## Services

* `db` → PostgreSQL
* `backend` → Express API
* `frontend` → React production build via Nginx

Run locally:

```bash
docker-compose up --build
```

---

# Testing Architecture

The project uses layered testing to guarantee stability during live meetings.

## Backend Testing

### Test Categories

#### Unit Tests

* Business logic services
* Vote validation
* Session invalidation logic
* Utility functions

#### Integration Tests

* Full request lifecycle
* Authentication flow
* Duplicate vote enforcement
* Role-based access control

Example:

```ts
await request(app)
  .post('/api/votes')
  .send({ questionId, vote: 'yes' })
  .expect(201)
```

Each test suite:

* Uses isolated DB
* Resets schema between runs
* Runs independently from development database

## Frontend Testing

### Coverage

* Login form validation
* Voting buttons
* Question rendering
* Admin actions
* API error handling
* Loading states

## Optional E2E Testing

Can be extended using:

* Playwright
* Cypress

Example scenarios:

* Resident login → vote → logout
* Admin closes question
* Export results workflow

# Branch Strategy

The repository follows a structured Git workflow to maintain stability and traceability.

## Main Branches

### `main`

* Production-ready code

> Nice to have but i wont pay GH enterprise:
> * Protected branch
> * Only merge via Pull Request
> * Requires passing CI checks

### `develop`

* Active integration branch
* All feature branches merge here first
* Tested before promotion to `main`

---

## Supporting Branches

### Feature Branches

```
feature/<scope>-<short-description>
```

Examples:

```
feature/auth-login
feature/votes-duplicate-check
feature/admin-question-management
```

### Fix Branches

```
fix/<scope>-<description>
```

Example:

```
fix/votes-unique-constraint-error
```

---

## Commit Convention

Enforced via Husky + Commitlint.

Examples:

```
feat(auth): implement login endpoint
fix(votes): prevent duplicate voting
refactor(shared-types): centralize enums
chore(docker): update base image
```
### Production Considerations

* `JWT_SECRET` must be strong and rotated periodically
* HTTPS must be enforced
* Database credentials stored securely
* Use environment injection via Docker or CI secrets

# Code Quality & Governance

* ESLint (root-configured)
* Prettier
* Husky pre-commit hooks
* lint-staged
* Conventional Commits
* CI lint verification

All governance is centralized at the monorepo root.

# Development Commands

Run backend:
```bash
npm run dev --workspace=apps/backend
```

Run frontend:
```bash
npm run dev --workspace=apps/frontend
```