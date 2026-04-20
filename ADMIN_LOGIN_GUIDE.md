# Admin Login Guide

## Default Admin Credentials

### Option 1: After Running Seed Script (Recommended)
If you've run `backend/scripts/seed-users.js`:

**Email:** `admin@hairvelous.com`  
**Password:** `admin123`

### Option 2: Without Seed Script
If you haven't run the seed script yet, use:

**Email:** `admin@hairvelous.com`  
**Password:** `password`

## How to Log In as Admin

1. **Go to Login Page:**
   - Open your browser
   - Navigate to: `http://localhost:3000/login.html`

2. **Enter Admin Credentials:**
   - Email: `admin@hairvelous.com`
   - Password: `admin123` (or `password` if seed script not run)

3. **Click "Sign in"**

4. **Access Admin Dashboard:**
   - After login, you'll be redirected to the dashboard
   - Click on "Admin Dashboard" or navigate to `/admin_dashboard.html`
   - You'll have access to:
     - User Management
     - Product Management
     - Guide Management
     - System Reports

## Setting Up Admin Password (If Needed)

If the admin account doesn't exist or you need to reset the password:

### Method 1: Run Seed Script
```bash
cd backend
node scripts/seed-users.js
```

This sets:
- User: `hairvelian@example.com` / `password123`
- Admin: `admin@hairvelous.com` / `admin123`

### Method 2: Create Admin Manually via SQL

1. **Open phpMyAdmin** (if using XAMPP: http://localhost/phpmyadmin)
2. **Select `hairvelous` database**
3. **Go to SQL tab**
4. **Run this SQL:**

```sql
-- Check if admin role exists
INSERT IGNORE INTO roles (role_id, role_name) VALUES (2, 'admin');

-- Create admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role_id) 
VALUES (
  'Admin User', 
  'admin@hairvelous.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  2
)
ON DUPLICATE KEY UPDATE role_id = 2;
```

**Note:** The password hash above is for `admin123`. If you want a different password, generate a new hash using Node.js:

```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your-password', 10).then(hash => console.log(hash));
```

### Method 3: Reset Admin Password via Admin Panel

If you're already logged in as admin:
1. Go to Admin Dashboard
2. Click "User Management"
3. Find `admin@hairvelous.com`
4. Click "Reset Password"
5. New password will be shown/generated

## Verifying Admin Account Exists

### Check via SQL:
```sql
SELECT u.user_id, u.name, u.email, r.role_name 
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
WHERE r.role_name = 'admin';
```

### Check via API (if logged in):
```bash
GET http://localhost:3000/api/admin/users
```

## Admin Features Available

Once logged in as admin, you can access:

1. **Admin Dashboard** (`/admin_dashboard.html`)
   - Overview of system statistics
   - Quick access to all admin features

2. **User Management** (`/user_management.html`)
   - View all users
   - Create new users
   - Suspend/activate users
   - Reset user passwords

3. **Product Management** (`/product_management.html`)
   - Add/edit/delete products
   - Manage product categories
   - Update product details

4. **Guide Management** (`/guide_management.html`)
   - Create/edit/delete DIY guides
   - Manage guide categories and difficulty levels

5. **System Reports** (via API)
   - User statistics
   - Assessment statistics
   - Product recommendations stats

## Troubleshooting

### "Invalid email or password"
- Verify admin account exists in database
- Check password is correct (`admin123` or `password`)
- Run seed script: `node backend/scripts/seed-users.js`

### "Access Denied" on Admin Pages
- Make sure you're logged in as admin (check role in dashboard)
- Clear browser cache and cookies
- Log out and log back in

### Admin Account Doesn't Exist
- Run the seed script: `node backend/scripts/seed-users.js`
- Or manually create via SQL (see Method 2 above)
- Or create via Admin panel if you have another admin account

## Quick Test

To quickly test admin login:

```bash
# 1. Make sure database is set up
# 2. Run seed script
cd backend
node scripts/seed-users.js

# 3. Start server
npm start

# 4. Open browser
# Go to: http://localhost:3000/login.html
# Login with: admin@hairvelous.com / admin123
```

## Security Note

⚠️ **Important:** Change the default admin password in production!

The default credentials are for development/testing only. In production:
1. Change admin password immediately
2. Use strong passwords
3. Consider enabling 2FA if available
4. Regularly audit admin access logs
