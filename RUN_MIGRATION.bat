@echo off
echo ========================================
echo Google OAuth Migration Script
echo ========================================
echo.
echo This will add Google OAuth columns to your database.
echo.
pause

cd backend
node scripts/run_google_oauth_migration.js

echo.
echo ========================================
echo Migration completed!
echo ========================================
pause
