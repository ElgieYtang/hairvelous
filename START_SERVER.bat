@echo off
echo Hairvelous - Starting server...
echo.
cd /d "%~dp0"

if not exist "backend\node_modules" (
  echo First time: Installing backend dependencies...
  cd backend
  call npm install
  cd ..
  echo.
)

echo Starting server. Keep this window open.
echo Open your browser to:  http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.
node backend/server.js
pause
