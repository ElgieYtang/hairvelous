@echo off
echo ========================================
echo Create Admin Account Script
echo ========================================
echo.
echo This will create/update the admin account.
echo.
pause

cd backend
node scripts/create-admin.js

echo.
echo ========================================
echo Done! You can now login with:
echo Email: admin@hairvelous.com
echo Password: admin123
echo ========================================
pause
