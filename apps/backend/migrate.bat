@echo off
REM Mindwise Migration Script
REM This script helps migrate from the old Python Flask version to the new enhanced Node.js version

echo === Mindwise Migration Script ===
echo This script will help you migrate from the old Python Flask version to the new enhanced Node.js version
echo.

REM Check if we're in the right directory
if not exist "mindwise-backend" (
  echo Error: This script must be run from the root directory containing mindwise-backend and mindwise-frontend folders
  pause
  exit /b 1
)

if not exist "mindwise-frontend" (
  echo Error: This script must be run from the root directory containing mindwise-backend and mindwise-frontend folders
  pause
  exit /b 1
)

echo Found project directories:
echo - mindwise-backend
echo - mindwise-frontend
echo.

REM Backup the old project
echo Creating backup of the old project...
xcopy mindwise-backend mindwise-backend-backup /E /I
xcopy mindwise-frontend mindwise-frontend-backup /E /I
echo ✓ Backup created successfully
echo.

REM Show what will be replaced
echo The following will be replaced:
echo - mindwise-backend (Python Flask → Node.js/TypeScript)
echo - mindwise-frontend (Simple HTML → Next.js/Tailwind CSS)
echo.

REM Confirm migration
set /p CONFIRM=Do you want to proceed with the migration? (y/N): 
if /i "%CONFIRM%" neq "y" (
  echo Migration cancelled
  pause
  exit /b 0
)

REM Perform migration
echo Starting migration...

REM Replace backend
echo Replacing backend...
rmdir /s /q mindwise-backend
xcopy "..\botsonic-clone-enhanced\mindwise-backend" mindwise-backend /E /I
echo ✓ Backend replaced successfully

REM Replace frontend
echo Replacing frontend...
rmdir /s /q mindwise-frontend
xcopy "..\botsonic-clone-enhanced\mindwise-frontend" mindwise-frontend /E /I
echo ✓ Frontend replaced successfully

REM Show next steps
echo.
echo === Migration Complete ===
echo.
echo Next steps:
echo 1. Update environment variables in both frontend and backend
echo 2. Run 'npm install' in both directories
echo 3. Build both projects with 'npm run build'
echo 4. Start both servers:
echo    - Backend: cd mindwise-backend && npm run dev
echo    - Frontend: cd mindwise-frontend && npm run dev
echo.
echo Note: Make sure to update your Supabase configuration and API keys in the .env files
echo.

pause