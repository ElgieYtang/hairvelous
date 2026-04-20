# Database Migration Instructions

## Problem
You're getting the error: `Unknown column 'auth_provider' in 'field list'`

This happens because the Google OAuth columns haven't been added to your database yet.

## Solution: Run the Migration

### Option 1: Using the Batch Script (Easiest - Windows)

1. **Double-click** `RUN_MIGRATION.bat` in the project root folder
2. The script will automatically run the migration
3. Wait for "Migration completed!" message

### Option 2: Using Node.js Script

1. Open terminal/command prompt
2. Navigate to project folder:
   ```bash
   cd c:\Users\AMD\Desktop\elai
   ```
3. Run the migration script:
   ```bash
   cd backend
   node scripts/run_google_oauth_migration.js
   ```

### Option 3: Using phpMyAdmin (XAMPP)

1. **Start XAMPP** and make sure MySQL is running
2. Open **phpMyAdmin** (usually http://localhost/phpmyadmin)
3. Select the `hairvelous` database
4. Click on the **SQL** tab
5. Copy and paste the contents of `database/migration_add_google_oauth.sql`
6. Click **Go** to execute

### Option 4: Using MySQL Command Line

If you have MySQL command line available:

```bash
mysql -u root -p hairvelous < database/migration_add_google_oauth.sql
```

(Leave password blank if using XAMPP default)

## What the Migration Does

The migration adds these columns to the `users` table:
- `auth_provider` - Tracks if user registered with 'local' or 'google'
- `google_sub` - Stores Google's unique user ID
- `is_email_verified` - Tracks if email is verified

## After Migration

1. **Restart your Node.js server** (if running)
2. **Try registering again** - it should work now!

## Verification

After running the migration, you can verify it worked by:

1. Opening phpMyAdmin
2. Selecting `hairvelous` database
3. Clicking on `users` table
4. Clicking "Structure" tab
5. You should see the new columns:
   - `auth_provider`
   - `google_sub`
   - `is_email_verified`

## Troubleshooting

### "Migration already applied"
- This means the columns already exist
- Your registration should work now
- Try registering again

### "Connection refused" or "Can't connect to MySQL"
- Make sure XAMPP MySQL is running
- Check your `.env` file has correct database credentials:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=hairvelous
  ```

### Still getting errors?
- Make sure you restarted your Node.js server after migration
- Check that the migration script completed successfully
- Verify columns exist in phpMyAdmin

## Code Fallback

The code has been updated to work **without** the migration (as a fallback), but it's **recommended** to run the migration for full Google OAuth support.

If you don't run the migration:
- ✅ Registration will work
- ✅ Login will work
- ❌ Google Sign-In won't work
- ❌ Some features may be limited
