# Fix Admin Login - "Invalid email or password" Error

## Quick Fix

### Option 1: Run the Admin Creation Script (Easiest)

**Double-click:** `CREATE_ADMIN.bat`

Or manually:
```bash
cd backend
node scripts/create-admin.js
```

This will:
- ✅ Create admin role if it doesn't exist
- ✅ Create admin account if it doesn't exist
- ✅ Set password to `admin123`
- ✅ Verify the account is ready

### Option 2: Create Admin via SQL (phpMyAdmin)

1. **Open phpMyAdmin**: http://localhost/phpmyadmin
2. **Select `hairvelous` database**
3. **Click SQL tab**
4. **Run this SQL:**

```sql
USE hairvelous;

-- Ensure admin role exists
INSERT IGNORE INTO roles (role_id, role_name) VALUES (2, 'admin');

-- Create admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role_id) 
VALUES (
  'Admin User', 
  'admin@hairvelous.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  2
)
ON DUPLICATE KEY UPDATE 
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  role_id = 2;
```

**Note:** The password hash above is for `admin123`.

## Verify Admin Account Exists

Run this SQL to check:

```sql
SELECT 
  u.user_id, 
  u.name, 
  u.email, 
  r.role_name,
  u.password_hash
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
WHERE u.email = 'admin@hairvelous.com';
```

You should see:
- Email: `admin@hairvelous.com`
- Role: `admin`
- Password hash: Should start with `$2a$10$`

## Login Credentials

After running the script:

**Email:** `admin@hairvelous.com`  
**Password:** `admin123`

## Common Issues

### 1. Admin Account Doesn't Exist
**Solution:** Run `CREATE_ADMIN.bat` or the SQL above

### 2. Wrong Password Hash
**Solution:** The script will update the password hash automatically

### 3. Wrong Role ID
**Solution:** The script ensures role_id = 2 (admin)

### 4. Email Case Sensitivity
**Solution:** Make sure email is exactly: `admin@hairvelous.com` (lowercase)

### 5. Database Connection Issues
**Solution:** Check `.env` file has correct database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hairvelous
```

## Test Login

1. **Start your server** (if not running):
   ```bash
   cd backend
   npm start
   ```

2. **Go to login page**: http://localhost:3000/login.html

3. **Enter credentials**:
   - Email: `admin@hairvelous.com`
   - Password: `admin123`

4. **Click "Sign in"**

5. **Should redirect to dashboard** with admin access

## Still Not Working?

### Check Database Connection
```bash
cd backend
node -e "require('dotenv').config(); const pool = require('./config/db'); pool.query('SELECT 1').then(() => console.log('✅ DB connected')).catch(e => console.error('❌ DB error:', e.message));"
```

### Check Admin Account in Database
```bash
cd backend
node -e "require('dotenv').config(); const pool = require('./config/db'); pool.query('SELECT u.email, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.email = ?', ['admin@hairvelous.com']).then(([rows]) => console.log('Admin:', rows)).catch(e => console.error('Error:', e.message));"
```

### Reset Admin Password Manually
If you need a different password, generate a hash:

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your-password', 10).then(hash => console.log(hash));
```

Then update in database:
```sql
UPDATE users 
SET password_hash = 'YOUR_GENERATED_HASH_HERE' 
WHERE email = 'admin@hairvelous.com';
```

## Next Steps

After successful login:
1. ✅ You'll be redirected to dashboard
2. ✅ Access Admin Dashboard from navigation
3. ✅ Manage users, products, guides, etc.
