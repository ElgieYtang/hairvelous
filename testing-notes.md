# Hairvelous – Testing Notes

Unit and integration testing placeholders and manual test scenarios.

## Unit tests (placeholder)

- **Auth middleware** (`backend/middleware/auth.js`): Mock JWT verify; assert `req.user` set when token valid; assert 401 when missing/invalid/suspended.
- **Auth routes** (`backend/routes/auth.js`): Stub DB; POST `/login` with valid/invalid credentials; POST `/forgot-password` and `/reset-password` with valid/expired token.
- **Users routes** (`backend/routes/users.js`): List users (admin vs user); create user (admin); update/suspend (admin); reset password (admin); update self (non-admin).
- **Assessments** (`backend/routes/assessments.js`): Get questions; create session (auth); submit responses; complete session and assert profile + recommendations returned; severity flag when scale ≥ 4.
- **Products** (`backend/routes/products.js`): List/filter by category; get by id; admin create/update/delete.
- **Guides** (`backend/routes/guides.js`): List published; get by id/slug; admin CRUD.
- **Routine** (`backend/routes/routine.js`): Log CRUD (own user); settings get/patch.
- **Uploads** (`backend/routes/uploads.js`): List/upload/delete (auth); multer file type/size rejection.
- **Admin** (`backend/routes/admin.js`): Reports stub; config get/patch (admin only).

Suggested stack: **Jest** + **supertest** for API; mock `mysql2/promise` or use a test DB.

## Integration tests (placeholder)

- **Flow: register → login → assessment → profile → recommendations**: Use test DB; create user; login; POST session; POST responses; POST complete; GET profile; assert recommendations length.
- **Flow: admin create product → list products**: Admin login; POST product; GET products; assert new product in list.
- **Flow: forgot password → reset**: POST forgot with existing email; capture token (or read from stub response); POST reset with token + new password; login with new password.
- **RBAC**: Endpoints under `/api/users` (list all), `/api/admin/*`, PATCH user suspend, POST reset-password must return 403 for non-admin.

## Manual test checklist

1. **Auth**: Login with hairvelian@example.com / password123; logout; login with admin@hairvelous.com / admin123. Forgot password (check token in response); reset with token.
2. **Assessment**: Open assessment; complete as guest (see login prompt at end); login and complete again; check result summary and recommendations.
3. **Products**: Browse products; filter by category; if logged in with profile, check “For you” section on recommendations page.
4. **Guides**: List guides; open one; check content.
5. **Routine tracker**: Login; add log (date, type, notes); check list; change notification settings.
6. **My Photos**: Login; upload image; see entry with demo analysis note; delete.
7. **Admin**: Login as admin; open Admin dashboard; check reports (counts); suspend/unsuspend user; reset user password; set system config key/value.
8. **Disclaimers**: Confirm disclaimer banner/text on key pages and in API error responses where specified.

## Running the app for testing

```bash
# MySQL
mysql -u root -p < database/schema.sql
mysql -u root -p hairvelous < database/seed.sql
cd backend && node scripts/seed-users.js   # optional: set password123 / admin123

# Backend
cd backend && npm install && node server.js

# Frontend
# Served at http://localhost:3000 (same server). Open /login.html, /index.html, /assessment.html, etc.
```

## Default credentials (after seed-users.js)

- User: hairvelian@example.com / password123  
- Admin: admin@hairvelous.com / admin123  

If seed-users.js is not run, use password `password` for both (seed.sql uses a common bcrypt hash for "password" as fallback).
