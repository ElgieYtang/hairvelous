# Migration Summary - Google OAuth Columns

## ✅ Issues Found and Fixed

### 1. **Where `auth_provider` is Used**

#### `backend/services/authService.js`
- **Line 46**: `INSERT INTO users (name, email, password_hash, role_id, auth_provider, is_email_verified)`
- **Line 69**: `SELECT ... u.auth_provider ... FROM users u`
- **Line 89**: `if (hasGoogleColumns && user.auth_provider === 'google')`

#### `backend/services/googleAuthService.js`
- **Line 89**: `SELECT ... auth_provider FROM users WHERE google_sub = ?`
- **Line 113**: `SELECT ... auth_provider FROM users WHERE email = ?`
- **Line 123**: `UPDATE users SET auth_provider = ?, google_sub = ?, is_email_verified = ?`
- **Line 147**: `INSERT INTO users (..., auth_provider, google_sub, is_email_verified)`

## ✅ Migration SQL Created

**File:** `database/migration_add_google_oauth_final.sql`

```sql
-- Adds three columns:
ALTER TABLE users ADD COLUMN auth_provider ENUM('local', 'google') DEFAULT 'local' NOT NULL AFTER password_hash;
ALTER TABLE users ADD COLUMN google_sub VARCHAR(64) NULL UNIQUE AFTER auth_provider;
ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT 0 NOT NULL AFTER google_sub;

-- Creates indexes:
CREATE INDEX idx_google_sub ON users(google_sub);
CREATE INDEX idx_auth_provider ON users(auth_provider);

-- Updates existing users:
UPDATE users SET is_email_verified = 1 WHERE auth_provider = 'local';
```

## ✅ Code Updates

### `backend/services/authService.js`
- ✅ Added `hasGoogleOAuthColumns()` method to check if columns exist
- ✅ Updated `register()` to use conditional INSERT (with/without columns)
- ✅ Updated `login()` to use conditional SELECT (with/without columns)

### `backend/services/googleAuthService.js`
- ✅ Added `hasGoogleOAuthColumns()` method
- ✅ Added check in `handleGoogleCallback()` to ensure columns exist before using them
- ✅ Throws clear error if columns don't exist when Google OAuth is attempted

## 📋 Exact SQL Migration

See: `database/migration_add_google_oauth_final.sql`

**Key Features:**
- Safe to run multiple times (checks if columns exist)
- Adds all three required columns
- Creates performance indexes
- Updates existing users appropriately

## 📋 Updated Query Code

### Registration (with columns):
```javascript
INSERT INTO users (name, email, password_hash, role_id, auth_provider, is_email_verified) 
VALUES (?, ?, ?, 1, ?, 1)
```

### Registration (fallback - no columns):
```javascript
INSERT INTO users (name, email, password_hash, role_id) 
VALUES (?, ?, ?, 1)
```

### Login (with columns):
```javascript
SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, u.auth_provider, r.role_name 
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
WHERE u.email = ?
```

### Login (fallback - no columns):
```javascript
SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, r.role_name 
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
WHERE u.email = ?
```

### Google OAuth - Check by google_sub:
```javascript
SELECT user_id, name, email, role_id, auth_provider 
FROM users 
WHERE google_sub = ?
```

### Google OAuth - Link account:
```javascript
UPDATE users 
SET auth_provider = ?, google_sub = ?, is_email_verified = ? 
WHERE user_id = ?
```

### Google OAuth - Create user:
```javascript
INSERT INTO users (name, email, password_hash, role_id, auth_provider, google_sub, is_email_verified) 
VALUES (?, ?, ?, 1, 'google', ?, ?)
```

## 🚀 How to Apply

1. **Run Migration:**
   - phpMyAdmin: Copy SQL from `database/migration_add_google_oauth_final.sql` and execute
   - Or use: `node backend/scripts/run_google_oauth_migration.js`

2. **Restart Server:**
   ```bash
   cd backend
   npm start
   ```

3. **Test Registration:**
   - Should work immediately after migration
   - No more "Unknown column" errors

## ✅ Status

- ✅ Migration SQL file created
- ✅ Code updated to handle missing columns gracefully
- ✅ Code updated to use columns when they exist
- ✅ All INSERT/SELECT/UPDATE queries updated
- ✅ Fallback behavior implemented for backward compatibility
