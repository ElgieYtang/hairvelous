# Database Setup Guide for Hairvelous

## Quick Start

### Step 1: Install MySQL (if not installed)

**Windows:**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run installer and choose "Developer Default" or "Server only"
3. Set root password during installation
4. Make sure MySQL service is running (check Windows Services)

**Check if MySQL is installed:**
```bash
mysql --version
```

### Step 2: Start MySQL Service

**Windows:**
- Open Services (Win+R → `services.msc`)
- Find "MySQL80" or "MySQL"
- Right-click → Start (if not running)

Or use Command Prompt as Administrator:
```bash
net start MySQL80
```

### Step 3: Create Database and Run Schema

**Option A: Using MySQL Command Line**

1. Open Command Prompt or PowerShell
2. Login to MySQL:
   ```bash
   mysql -u root -p
   ```
   (Enter your MySQL root password when prompted)

3. Run the schema file:
   ```bash
   source C:/Users/AMD/Desktop/elai/database/schema_hairvelous.sql
   ```
   
   Or from outside MySQL:
   ```bash
   mysql -u root -p < C:/Users/AMD/Desktop/elai/database/schema_hairvelous.sql
   ```

**Option B: Using MySQL Workbench (GUI)**

1. Open MySQL Workbench
2. Connect to your MySQL server (localhost, root, password)
3. File → Open SQL Script
4. Select: `database/schema_hairvelous.sql`
5. Click "Execute" (⚡ icon) or press Ctrl+Shift+Enter

### Step 4: Run Migrations (if needed)

If you need Google OAuth support:
```bash
mysql -u root -p hairvelous < database/migration_add_google_oauth.sql
```

### Step 5: Verify Database Setup

**Check tables:**
```bash
mysql -u root -p -e "USE hairvelous; SHOW TABLES;"
```

**Check roles:**
```bash
mysql -u root -p -e "USE hairvelous; SELECT * FROM roles;"
```

Should show:
- `user` role
- `admin` role

### Step 6: Configure .env File

Make sure your `.env` file has correct database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=hairvelous
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password!

### Step 7: Test Database Connection

Start your server:
```bash
cd backend
npm start
```

If you see:
```
✓ Hairvelous server running at http://localhost:3000
```

And no database errors, you're good! ✅

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check your MySQL password in `.env`
- Try resetting MySQL root password

### "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check if MySQL is on port 3306 (default)
- Verify `DB_HOST=localhost` in `.env`

### "Unknown database 'hairvelous'"
- Run the schema file first (Step 3)
- Check database name matches in `.env`

### "Table doesn't exist"
- Make sure you ran `schema_hairvelous.sql`
- Check if migrations are needed

## Complete Setup Script (Windows)

Create a file `setup_database.bat`:

```batch
@echo off
echo Setting up Hairvelous database...
echo.
echo Enter MySQL root password:
mysql -u root -p < database\schema_hairvelous.sql
echo.
echo Database setup complete!
pause
```

Run it: Double-click `setup_database.bat`

## Quick Commands Reference

```bash
# Login to MySQL
mysql -u root -p

# Create database manually
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hairvelous;"

# Run schema
mysql -u root -p hairvelous < database/schema_hairvelous.sql

# Check tables
mysql -u root -p -e "USE hairvelous; SHOW TABLES;"

# Check users
mysql -u root -p -e "USE hairvelous; SELECT * FROM users;"

# Check roles
mysql -u root -p -e "USE hairvelous; SELECT * FROM roles;"
```

## Next Steps

After database is set up:
1. ✅ Update `.env` with your MySQL password
2. ✅ Start the server: `cd backend && npm start`
3. ✅ Open browser: `http://localhost:3000`
4. ✅ Register a new account or use existing test data

## Need Help?

- Check MySQL is running: `net start MySQL80`
- Verify connection: `mysql -u root -p`
- Check server logs for database errors
- Make sure `.env` has correct credentials
