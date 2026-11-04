@echo off
title CityPlus Marketplace Platform - Launcher
chcp 65001 >nul

pushd "%~dp0"
set "ROOT_DIR=%CD%"

REM Determine if running from parent folder or repo folder
if exist "%ROOT_DIR%\uber-marketplace-brain\frontend" (
    set "APP_DIR=%ROOT_DIR%\uber-marketplace-brain"
) else (
    set "APP_DIR=%ROOT_DIR%"
)

echo ======================================================================
echo   CITYPLUS INTELLIGENCE PLATFORM - ONE-CLICK LAUNCHER
echo ======================================================================
echo.

REM --- 1. Ensure .env exists ---
if not exist "%APP_DIR%\.env" (
    if exist "%APP_DIR%\.env.example" (
        echo [Setup] Creating .env from .env.example...
        copy "%APP_DIR%\.env.example" "%APP_DIR%\.env" >nul
        echo [Setup] .env file configured with team Gemini keys.
    )
)

REM --- 2. Local Model Status ---
echo [1/4] Checking Local Model (Ollama)...
echo   - Configured Remote Ollama Server: http://10.151.32.198:11434
echo   - Primary Model: sam860/dolphin3-llama3.2:3b
echo   - Available Models: sam860/dolphin3-llama3.2:3b, huihui_ai/smallthinker-abliterated:3b, jaahas/qwen3.5-uncensored:4b
echo   - Hybrid Fallback: Google Gemini API with 4 team keys active.

REM --- 3. Check Python Backend ---
echo [2/4] Checking Backend API...
set "PY_CMD="
if exist "C:\msys64\ucrt64\bin\python.exe" set "PY_CMD=C:\msys64\ucrt64\bin\python.exe"
if "%PY_CMD%"=="" (
    python --version >nul 2>nul
    if %errorlevel% equ 0 set "PY_CMD=python"
)
if "%PY_CMD%"=="" (
    py -3 --version >nul 2>nul
    if %errorlevel% equ 0 set "PY_CMD=py -3"
)

set "RUN_BACKEND=0"
if defined PY_CMD (
    "%PY_CMD%" -c "import uvicorn, fastapi" >nul 2>nul
    if %errorlevel% equ 0 set "RUN_BACKEND=1"
)

if "%RUN_BACKEND%"=="1" (
    echo   - Starting FastAPI backend on port 8000...
    start "Backend - FastAPI :8000" /D "%APP_DIR%\backend" cmd /k "%PY_CMD% -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
) else (
    echo   - Backend Python/Uvicorn not configured.
    echo   - Standalone mode active: Rider and Driver apps run with full client-side AI marketplace brain & real-time cross-tab sync!
)

REM --- 4. Start Rider App port 5173 ---
echo [3/4] Starting Rider App port 5173...
start "Rider App :5173" /D "%APP_DIR%\frontend\rider-app" cmd /k "npm run dev"

REM --- 5. Start Driver App port 5174 ---
echo [4/4] Starting Driver App port 5174...
start "Driver App :5174" /D "%APP_DIR%\frontend\driver-app" cmd /k "npm run dev"

REM --- 6. Start Admin Dashboard port 5175 (Optional) ---
if exist "%APP_DIR%\frontend\admin-dashboard" (
    start "Admin Dashboard :5175" /D "%APP_DIR%\frontend\admin-dashboard" cmd /k "npm run dev"
)

echo.
echo ======================================================================
echo   All services launched successfully!
echo ======================================================================
echo.
echo   Rider App        : http://localhost:5173
echo   Driver App       : http://localhost:5174
echo   Admin Dashboard  : http://localhost:5175
echo.
echo Waiting 3 seconds, then opening Rider App and Driver App in your browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173
start http://localhost:5174

echo.
echo Both apps are running in their respective windows.
echo To stop any service, simply close its window.
pause
popd
