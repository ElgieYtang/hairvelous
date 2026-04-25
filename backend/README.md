# Hairvelous Backend - Quick Start (Team Setup)

This backend now supports automatic database bootstrap and seeding on startup for local development/demo use.

## 1) Prerequisites

- Node.js 18+
- MySQL running (XAMPP is fine)
- Database credentials available in `.env`

## 2) Install dependencies

From `backend/`:

```bash
npm install
```

## 3) Configure environment

Create/update `backend/.env` (copy from `.env.example`).

Minimum important values:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `NODE_ENV=development`

Auto startup DB tasks (recommended for teammate setup):

- `AUTO_BOOTSTRAP_DB_ON_START=true`
- `AUTO_SEED_DB_ON_START=true`

## 4) Run backend

From `backend/`:

```bash
npm start
```

On startup, backend will:

1. run DB bootstrap (schema + migrations),
2. run DB seed,
3. start API server.

You should see `[startup-db]` logs in terminal.

## 5) Default seeded accounts

Seed script includes baseline demo users (for local/dev use).

If needed, create an extra specialist account on demand:

```bash
npm run seed:demo-specialist
```

This command prints generated credentials as JSON in terminal.

## Notes

- Auto bootstrap/seed is intended for dev/demo convenience.
- For production, set:
  - `AUTO_BOOTSTRAP_DB_ON_START=false`
  - `AUTO_SEED_DB_ON_START=false`
