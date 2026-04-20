# XAMPP Setup Guide for Hairvelous

## Step 1: Install XAMPP

1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/download.html
   - Download **XAMPP for Windows** (latest version)
   - Choose the version with PHP 8.x (recommended)

2. **Install XAMPP:**
   - Run the installer
   - Choose installation directory (default: `C:\xampp`)
   - Select components: **MySQL** and **phpMyAdmin** (Apache is optional but useful)
   - Click "Install"
   - **Important:** During installation, Windows Firewall may ask permission - click "Allow access"

## Step 2: Start MySQL Service

1. **Open XAMPP Control Panel:**
   - Find XAMPP in Start Menu
   - Or go to: `C:\xampp\xampp-control.exe`

2. **Start MySQL:**
   - Click "Start" button next to MySQL
   - Should show green "Running" status
   - If it shows errors, check the "Logs" tab

## Step 3: Access phpMyAdmin

1. **Open phpMyAdmin:**
   - In XAMPP Control Panel, click "Admin" button next to MySQL
   - Or open browser and go to: **http://localhost/phpmyadmin**

2. **Login:**
   - Username: `root`
   - Password: **(leave blank)** - XAMPP default has no password
   - Click "Go"

## Step 4: Create Database and Import Schema

### Option A: Using phpMyAdmin (GUI - Easiest)

1. **Create Database:**
   - Click "New" in left sidebar
   - Database name: `hairvelous`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

2. **Import Schema:**
   - Click on `hairvelous` database (left sidebar)
   - Click "Import" tab at top
   - Click "Choose File" button
   - Navigate to: `C:\Users\AMD\Desktop\elai\database\schema_hairvelous.sql`
   - Click "Go" button at bottom
   - Wait for "Import has been successfully finished" message

3. **Verify:**
   - Click on `hairvelous` database
   - You should see tables: `roles`, `users`, `products`, etc.

### Option B: Using SQL Tab (Alternative)

1. Click on `hairvelous` database
2. Click "SQL" tab
3. Copy entire contents of `database/schema_hairvelous.sql`
4. Paste into SQL textarea
5. Click "Go"
6. Should show "Query OK" messages

## Step 5: Update .env File

Open `.env` file in project root and update:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hairvelous
```

**Note:** XAMPP default MySQL root password is **empty/blank**, so leave `DB_PASSWORD=` empty.

## Step 6: Test Database Connection

1. **Start your server:**
   ```bash
   cd backend
   npm start
   ```

2. **Check for errors:**
   - Should see: `✓ Hairvelous server running at http://localhost:3000`
   - No database connection errors

3. **Test in browser:**
   - Go to: http://localhost:3000
   - Try registering a new account
   - Should work without errors!

## Step 7: Run Migrations (Optional)

If you need Google OAuth support, import migration:

1. In phpMyAdmin:
   - Click on `hairvelous` database
   - Click "Import" tab
   - Choose: `database/migration_add_google_oauth.sql`
   - Click "Go"

## Troubleshooting

### MySQL won't start in XAMPP
- **Port 3306 already in use:**
  - Another MySQL instance is running
  - Stop other MySQL services: `net stop MySQL80` (in admin CMD)
  - Or change MySQL port in XAMPP config

- **Access denied:**
  - Check XAMPP MySQL logs: Click "Logs" button next to MySQL
  - Common issue: Port conflict

### Can't access phpMyAdmin
- Make sure Apache is running (if using web interface)
- Or use MySQL Workbench instead
- Or use the Node.js setup script

### "Access denied for user 'root'@'localhost'"
- XAMPP default: username `root`, password is **blank/empty**
- Make sure `.env` has: `DB_PASSWORD=` (empty)

### Database connection fails
- Check MySQL is running in XAMPP Control Panel
- Verify `.env` file has correct settings
- Test connection: `mysql -u root -p` (password is blank, just press Enter)

## Quick Commands (if MySQL is in PATH)

After XAMPP installation, MySQL is usually at:
`C:\xampp\mysql\bin\mysql.exe`

You can add this to PATH, or use full path:
```bash
C:\xampp\mysql\bin\mysql.exe -u root -e "SHOW DATABASES;"
```

## XAMPP File Locations

- **MySQL data:** `C:\xampp\mysql\data\`
- **MySQL config:** `C:\xampp\mysql\bin\my.ini`
- **phpMyAdmin:** `C:\xampp\phpMyAdmin\`

## Next Steps After Setup

1. ✅ Database is ready
2. ✅ Start server: `cd backend && npm start`
3. ✅ Open: http://localhost:3000
4. ✅ Register/login and start using the app!

## Pro Tips

- **Keep XAMPP Control Panel open** - Easy to start/stop MySQL
- **Use phpMyAdmin** - Great for viewing data, running queries
- **Backup database** - phpMyAdmin → Export → Save SQL file
- **Check MySQL logs** - XAMPP Control Panel → Logs button
