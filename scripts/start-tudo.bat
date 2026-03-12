@echo off
cd /d "%~dp0.."

REM Libera portas 3001 e 8080 se estiverem em uso
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
timeout /t 2 /nobreak >nul

echo Instalando dependencias...
call npm install
if errorlevel 1 (
    echo Erro no npm install. Verifique se Node/npm estao instalados.
    pause
    exit /b 1
)
echo.
echo Iniciando backend (3001) e frontend (8080)...
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:3001
echo Pressione Ctrl+C para parar.
echo.
call npm run dev:all
pause
