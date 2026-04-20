# Complete Migration Guide - Google OAuth Columns

## Problem
Error: `Unknown column 'auth_provider' in 'field list'`

This happens because the database doesn't have the Google OAuth columns yet.

## Solution: Run SQL Migration

### Step 1: Run the Migration SQL

**Option A: Using phpMyAdmin (XAMPP) - Recommended**

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Select `hairvelous` database from left sidebar
4. Click **SQL** tab at the top
5. Open file: `database/migration_add_google_oauth_final.sql`
6. Copy **ALL** contents
7. Paste into phpMyAdmin SQL editor
8. Click **Go** button
9. You should see: "Migration completed successfully!"

**Option B: Using Node.js Script**

```bash
cd backend
node scripts/run_google_oauth_migration.js
```

**Option C: Using MySQL Command Line**

```bash
mysql -u root -p hairvelous < database/migration_add_google_oauth_final.sql
```

(Leave password blank if using XAMPP default)

### Step 2: Verify Migration

After running migration, verify columns were added:

```sql
DESCRIBE users;
```

You should see these columns:
- `auth_provider` (ENUM: 'local', 'google')
- `google_sub` (VARCHAR(64), UNIQUE, NULL)
- `is_email_verified` (BOOLEAN)

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
cd backend
npm start
```

## Migration SQL File

**File:** `database/migration_add_google_oauth_final.sql`

This migration:
- ✅ Adds `auth_provider` column (ENUM: 'local', 'google')
- ✅ Adds `google_sub` column (VARCHAR(64), UNIQUE)
- ✅ Adds `is_email_verified` column (BOOLEAN)
- ✅ Creates indexes for performance
- ✅ Updates existing users to mark email as verified
- ✅ Safe to run multiple times (checks if columns exist)

## Updated Code

### 1. `backend/services/authService.js`

**Register Query (with columns):**
```javascript
INSERT INTO users (name, email, password_hash, role_id, auth_provider, is_email_verified) 
VALUES (?, ?, ?, 1, ?, 1)
```

**Register Query (fallback - no columns):**
```javascript
INSERT INTO users (name, email, password_hash, role_id) 
VALUES (?, ?, ?, 1)
```

**Login Query (with columns):**
```javascript
SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, u.auth_provider, r.role_name 
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
WHERE u.email = ?
```

**Login Query (fallback - no columns):**
```javascript
SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, r.role_name 
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
WHERE u.email = ?
```

### 2. `backend/services/googleAuthService.js`

**Check user by google_sub:**
```javascript
SELECT user_id, name, email, role_id, auth_provider 
FROM users 
WHERE google_sub = ?
```

**Check user by email:**
```javascript
SELECT user_id, name, email, role_id, auth_provider 
FROM users 
WHERE email = ?
```

**Link Google account:**
```javascript
UPDATE users 
SET auth_provider = ?, google_sub = ?, is_email_verified = ? 
WHERE user_id = ?
```

**Create new Google user:**
```javascript
INSERT INTO users (name, email, password_hash, role_id, auth_provider, google_sub, is_email_verified) 
VALUES (?, ?, ?, 1, 'google', ?, ?)
```

## Column Definitions

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| `auth_provider` | ENUM('local','google') | 'local' | NOT NULL | Authentication method used |
| `google_sub` | VARCHAR(64) | NULL | NULL | Google's unique user ID |
| `is_email_verified` | BOOLEAN | 0 | NOT NULL | Email verification status |

## Indexes Created

- `idx_google_sub` - Index on `google_sub` for fast lookups
- `idx_auth_provider` - Index on `auth_provider` for filtering

## After Migration

✅ Registration will work (with or without columns)
✅ Login will work (with or without columns)  
✅ Google Sign-In will work (requires columns)
✅ Existing users marked as `auth_provider='local'` and `is_email_verified=1`

## Troubleshooting

### "Column already exists"
- Migration already ran successfully
- You can ignore this message
- Try registering again

### "Table doesn't exist"
- Run the main schema first: `database/schema_hairvelous.sql`
- Then run the migration

### Still getting errors?
1. Verify columns exist: `DESCRIBE users;` in phpMyAdmin
2. Restart Node.js server
3. Clear browser cache
4. Check `.env` file has correct database credentials
