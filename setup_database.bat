@echo off
echo ========================================
echo Hairvelous Database Setup
echo ========================================
echo.

REM Check if MySQL is available
where mysql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL first: https://dev.mysql.com/downloads/installer/
    pause
    exit /b 1
)

echo MySQL found!
echo.
echo This will:
echo 1. Create database 'hairvelous'
echo 2. Create all tables
echo 3. Insert seed data (roles, sample products)
echo.
echo Enter MySQL root password when prompted:
echo.

REM Run schema
mysql -u root -p < database\schema_hairvelous.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database setup completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update .env file with your MySQL password
    echo 2. Run: cd backend ^&^& npm start
    echo 3. Open: http://localhost:3000
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database setup failed!
    echo ========================================
    echo.
    echo Common issues:
    echo - Wrong MySQL password
    echo - MySQL service not running
    echo - Database already exists (this is OK, will recreate tables)
    echo.
)

pause
