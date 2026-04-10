# Roadmap
## Phase 1 — Data Layer & Authentication
### Database
- [ ] Write and run migrations for all core tables:
  - `users` — id, email, password_hash, name, created_at
  - `accounts` — id, user_id (FK), name, type (checking/savings/credit), balance, currency
  - `categories` — id, user_id (FK), name, color, icon
  - `budgets` — id, user_id (FK), category_id (FK), amount, period (monthly), start_date
  - `transactions` — id, account_id (FK), category_id (FK), amount, description, date, type (income/expense)
- [ ] Add appropriate indexes (e.g. `transactions.user_id`, `transactions.date`, `transactions.category_id`)

### Authentication
The authentication system follows a token-based approach with Express and JWT.
#### Implementation Tasks
- [ ] `POST /api/auth/register` — accept email and password, hash the password, create a user record in the `users` table
- [ ] `POST /api/auth/login` — accept email and password, retrieve the user, hash the submitted password and compare to the stored hash, generate both access and refresh tokens on success
- [ ] `POST /api/auth/refresh` — validate the refresh token, issue a new access token (and optionally a new refresh token)
- [ ] `POST /api/auth/logout` — optional server-side: add the refresh token to a blacklist to prevent future use; client must discard both tokens
- [ ] `GET /api/auth/me` — validate the access token from the request, return the authenticated user's profile
- [ ] **Auth middleware**: extract access token from `Authorization` header, validate signature and expiry, attach user context to the request, or return `401 Unauthorized` if invalid or expired
- [ ] Apply auth middleware to all non-auth API routes (`/api/accounts`, `/api/transactions`, `/api/categories`, `/api/budgets`)
- [ ] **Error handling**: return clear error messages for invalid credentials (e.g. "Email or password incorrect"), expired tokens, and missing auth headers
- [ ] **Client-side refresh logic**: intercept 401 responses, automatically call `POST /api/auth/refresh`, retry the original request with the new token, or redirect to login if refresh fails

### Frontend
- [ ] Re-enable React Router with full route config (`/login`, `/dashboard`)
- [ ] Wire `ProtectedRoute` to redirect unauthenticated users to `/login`
- [ ] Implement login form submission via Axios to `/api/auth/login`
- [ ] Store session state in React context or Zustand; persist across page refreshes via `/api/auth/me`
- [ ] Implement logout button that calls `/api/auth/logout` and clears client state

## Phase 2 — Core APIs & Data Wiring
### Backend
- [ ] `GET /api/accounts` — list accounts for the authenticated user
- [ ] `POST /api/accounts` — create a new account
- [ ] `PUT /api/accounts/:id` — update account name/type/balance
- [ ] `DELETE /api/accounts/:id` — delete an account
- [ ] `GET /api/transactions` — list transactions with optional query filters (account, category, date range, type)
- [ ] `POST /api/transactions` — create a transaction
- [ ] `PUT /api/transactions/:id` — update a transaction
- [ ] `DELETE /api/transactions/:id` — delete a transaction
- [ ] `GET /api/categories` — list categories
- [ ] `POST /api/categories` — create a category
- [ ] `PUT /api/categories/:id` — update a category
- [ ] `DELETE /api/categories/:id` — delete a category
- [ ] `GET /api/budgets` — list budgets for the current period
- [ ] `POST /api/budgets` — create or update a budget for a category
- [ ] `DELETE /api/budgets/:id` — delete a budget
- [ ] Input validation on all mutation endpoints (return `400` with descriptive errors)
- [ ] Consistent error handling: wrap all route handlers, return structured `ApiError` responses
- [ ] Wire `/api/health` Docker health check into `compose.base.yml` for the backend service

### Shared Types
- [ ] Add `Account` interface to `packages/types`
- [ ] Add `Budget` interface (if not already complete) to `packages/types`

### Frontend
- [ ] Axios service layer: typed wrappers for all API endpoints
- [ ] Accounts page or selector component
- [ ] Transaction form: create/edit with account, category, amount, date, description, type
- [ ] Category management: list, create, color/icon picker

## Phase 3 — Dashboard & UI
### Dashboard Page
- [ ] **Spending summary cards**: total income, total expenses, and net balance for the current month
- [ ] **Budget progress bars**: per-category bar showing budget limit vs. actual spend, with over-budget state
- [ ] **Recent transactions**: last 5–10 transactions with quick-link to the full list
- [ ] **Monthly trend chart**: bar or line chart of income vs. expenses over the last 6–12 months (Recharts recommended)

### Transactions Page
- [ ] Paginated transaction table (server-side pagination)
- [ ] Filter by: date range (date picker), category (multi-select), type (income / expense / all), keyword search on description
- [ ] Inline delete with confirmation
- [ ] Bulk actions: delete selected, re-categorize selected

### UX & Polish
- [ ] Loading skeletons for all data-fetching views (cards, tables, charts)
- [ ] Empty states with helpful CTAs (e.g. "No transactions yet — add your first one")
- [ ] Toast notifications for create / update / delete actions
- [ ] Responsive layout for mobile screens

## Phase 4 — Polish & Quality of Life
### Features
- [ ] **CSV import**: upload a bank statement CSV, map columns to transaction fields, preview before import
- [ ] **Dark mode toggle**: CSS variables are already wired — add a theme toggle and persist preference

### Quality
- [ ] Integration tests for all API routes (e.g. with Supertest)
- [ ] Frontend component tests (Vitest + React Testing Library)
- [ ] CI workflow (GitHub Actions): lint → type-check → test on every pull request
