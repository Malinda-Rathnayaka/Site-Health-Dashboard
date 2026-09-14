# Site Health Dashboard

A small MERN app for tracking the health status of client websites: who owns each site, its current
status (healthy / warning / critical), when it was last checked, and free-text notes.

Monorepo layout:

```
/server   Express + Mongoose API
/client   React (Vite) frontend
```

## Requirements

- Node.js 18+
- A MongoDB connection string (local `mongod`, or a free MongoDB Atlas cluster)

## Setup & Run (clean clone → running app in under 5 minutes)

### 1. Server

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI to your Mongo connection string, and set JWT_SECRET
# to any long random string (e.g. `openssl rand -hex 32`)
npm install
npm run dev          # starts on http://localhost:5000
```

Public registration only ever creates `viewer` accounts (see "Security & Design Decisions" below).
To get an `admin` account for testing create/edit/delete, run the seed script once the server's
`.env` is configured:

```bash
npm run seed
# creates admin@example.com / ChangeMe123! (override with SEED_ADMIN_EMAIL /
# SEED_ADMIN_PASSWORD env vars), or promotes that email to admin if it already exists
```

### 2. Client

In a second terminal:

```bash
cd client
cp .env.example .env    # VITE_API_URL defaults to http://localhost:5000/api, matches the server above
npm install
npm run dev              # starts on http://localhost:5173
```

Open `http://localhost:5173`. Register a normal (viewer) account, or log in with the seeded admin
account to add/edit/delete sites.

### Quick smoke test

- `GET http://localhost:5000/api/health` should return `{"success":true,"data":{"status":"ok",...}}`.
- Register a viewer in the UI, confirm the dashboard loads but shows no Add/Edit/Delete controls.
- Log in as the seeded admin, add a site, edit it, delete it, and confirm search/status filter and
  pagination work once you have more than 8 sites.

## API Overview

All responses share one envelope shape:
- Success: `{ "success": true, "data": ..., "meta"?: { page, limit, total, totalPages } }`
- Error: `{ "success": false, "error": { "message": "...", "details"?: [...] } }`

| Method | Route              | Auth            | Notes                                   |
|--------|---------------------|-----------------|------------------------------------------|
| POST   | /api/auth/register  | public          | creates a `viewer` account               |
| POST   | /api/auth/login      | public (rate-limited) | returns JWT                        |
| GET    | /api/auth/me         | any logged-in user | current user profile                 |
| GET    | /api/sites            | any logged-in user | `?page&limit&status&search`         |
| GET    | /api/sites/:id        | any logged-in user |                                       |
| POST   | /api/sites             | admin only        | create a site record                  |
| PATCH  | /api/sites/:id         | admin only        | partial update                        |
| DELETE | /api/sites/:id         | admin only        | 403 (not 500) if called by a viewer   |

## Security & Design Decisions

- **Auth**: stateless JWT (not sessions) — simplest fit for a small SPA + API split, no server-side
  session store to manage. Tokens are signed with a secret from `.env`, expire in 1 day
  (`JWT_EXPIRES_IN`), and are sent as `Authorization: Bearer <token>`. Passwords are hashed with
  bcrypt (cost factor 12) and the schema uses `select: false` so the hash is never returned by a
  normal query, plus a `toJSON` transform as a second safety net.
- **Roles, not self-service admin**: registration always creates a `viewer`. If it created whatever
  role the client requested, anyone could `POST /register {"role":"admin"}` and grant themselves
  write access. The first admin is created via a one-off `npm run seed` script instead — deliberately
  out of the public API surface.
- **Role-protected routes return 403, not 500**: `requireRole('admin')` runs after `requireAuth` and
  throws a typed `ApiError.forbidden()`, which the central error handler maps to a clean 403 JSON
  body — never a crash or a raw stack trace.
- **Centralized error handling**: every controller is wrapped in `asyncHandler` so rejected promises
  reach one `errorHandler` middleware. Known `ApiError`s pass their status/message through; Mongoose
  validation/cast/duplicate-key errors are mapped to sane 400/409s; anything unrecognized is logged
  server-side only and returned to the client as a generic 500 message — internals never leak.
- **Input validation and sanitization**: `express-validator` checks shape/type/length on every
  auth and site route before a controller runs. Separately, free-text fields (`name`, `url`,
  `notes`) are passed through `sanitize-html` (strips all tags/attributes) before being stored, so a
  note like `<script>...</script>` is neutralized at write time rather than trusted at render time.
  `express-mongo-sanitize` strips any `$`/`.` keys from `body`/`query`/`params` to block MongoDB
  operator injection (e.g. `{"email": {"$gt": ""}}` as a login payload).
- **Rate limiting**: `express-rate-limit` on `POST /api/auth/login` only (10 attempts / 15 min by
  default, both tunable via `.env`) to blunt brute-force credential guessing without punishing normal
  API usage elsewhere.
- **No hardcoded secrets**: `JWT_SECRET`, `MONGO_URI`, CORS origin, and rate-limit knobs all come from
  environment variables via `dotenv`. The server refuses to start if `MONGO_URI` or `JWT_SECRET` is
  missing, so a misconfigured deploy fails loudly instead of silently running insecurely. `.env` is
  gitignored; `.env.example` documents every variable.
- **Pagination + filtering**: `GET /api/sites` takes `page`/`limit` (capped at 100/page) plus optional
  `status` and a text `search` (backed by a Mongo text index on `name`/`url`) so the endpoint never
  dumps the full collection.
- **Consistent response envelope**: every success and error response shares the same
  `{ success, data|error }` shape (see `utils/ApiResponse.js`), so the client's axios interceptor can
  normalize errors in one place instead of per-request try/catch spaghetti.
- **Helmet + CORS**: `helmet()` sets standard security headers; CORS is locked to `CLIENT_ORIGIN`
  from `.env` rather than left wide open.

### What I'd add with more time

- Refresh tokens / logout-everywhere (a leaked JWT is valid until it expires; there's no revocation
  list yet).
- An admin-only endpoint to change a user's role via the API, instead of only via the seed script —
  fine for a small internal tool, but doesn't scale past a couple of admins.
- Server-side + client-side automated tests (Jest/Supertest for the API, React Testing Library for
  the UI) — everything above was exercised manually and via `npm run build`, but there's no CI suite.
- Audit logging of who changed/deleted which site record, since this is explicitly an internal
  reliability tool.
- Optimistic UI updates on the dashboard instead of a full refetch after every mutation.

## Out of scope (per the brief)

Deployment/hosting, email verification, password reset, and third-party OAuth were intentionally
not implemented.
