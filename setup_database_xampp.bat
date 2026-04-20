@echo off
echo ========================================
echo Hairvelous Database Setup (XAMPP)
echo ========================================
echo.

REM Check if XAMPP MySQL exists
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    echo ERROR: XAMPP MySQL not found at: %MYSQL_PATH%
    echo.
    echo Please:
    echo 1. Install XAMPP from: https://www.apachefriends.org/
    echo 2. Start MySQL from XAMPP Control Panel
    echo 3. Or update MYSQL_PATH in this script if XAMPP is installed elsewhere
    echo.
    pause
    exit /b 1
)

echo Found XAMPP MySQL at: %MYSQL_PATH%
echo.
echo Make sure MySQL is running in XAMPP Control Panel!
echo.
pause

echo.
echo Setting up database...
echo XAMPP default: username=root, password=(blank)
echo.
echo If you set a password, enter it when prompted.
echo Otherwise, just press Enter.
echo.

REM Run schema using XAMPP MySQL
"%MYSQL_PATH%" -u root -p < database\schema_hairvelous.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database setup completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update .env file: DB_PASSWORD= (leave empty for XAMPP default)
    echo 2. Start server: cd backend ^&^& npm start
    echo 3. Open: http://localhost:3000
    echo.
    echo To view database:
    echo - Open XAMPP Control Panel
    echo - Click "Admin" next to MySQL
    echo - Or visit: http://localhost/phpmyadmin
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database setup failed!
    echo ========================================
    echo.
    echo Troubleshooting:
    echo 1. Make sure MySQL is running in XAMPP Control Panel
    echo 2. Check if MySQL port (3306) is available
    echo 3. Try manual setup via phpMyAdmin (see XAMPP_SETUP.md)
    echo.
)

pause
