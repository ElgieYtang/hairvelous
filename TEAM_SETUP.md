# Team Setup (Clone and Run)

Use this guide after cloning the repository.

## 1) Install dependencies

From the project root:

```bash
npm install
```

## 2) Run one-time local setup

```bash
npm run setup
```

What this does:
- Creates `backend/.env` from `backend/.env.example` if missing
- Ensures the root `uploads/` folder exists
- Bootstraps the MySQL database schema and migrations

## 3) Start the app

```bash
npm run dev
```

## Notes

- Ensure MySQL is running locally before `npm run setup`.
- Update `backend/.env` with your own local credentials/secrets.
- Database files/backups/secrets are intentionally excluded from Git via `.gitignore`.
