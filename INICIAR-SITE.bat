@echo off
title Locar Lima - Servidor
cd /d "%~dp0"

REM Libera portas 3001 e 8080 se estiverem em uso
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
timeout /t 2 /nobreak >nul

REM Tenta achar Node.js se nao estiver no PATH
where npm >nul 2>nul || (
    if exist "C:\Program Files\nodejs\npm.cmd" set "PATH=C:\Program Files\nodejs;%PATH%"
    if exist "C:\Program Files (x86)\nodejs\npm.cmd" set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
    if exist "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
)

echo.
echo  ========================================
echo   LOCAR LIMA - Iniciando tudo
echo  ========================================
echo.

echo [1/2] Instalando dependencias (pode demorar na primeira vez)...
call npm install
if errorlevel 1 (
    echo.
    echo  ERRO: Node.js / npm nao encontrado.
    echo.
    echo  1. Baixe o Node.js em: https://nodejs.org
    echo  2. Instale e MARQUE a opcao "Add to PATH"
    echo  3. Feche e abra de novo esta janela, ou reinicie o PC
    echo  4. De dois cliques em INICIAR-SITE.bat de novo
    echo.
    pause
    exit /b 1
)

echo.
echo [2/2] Ligando o site e a API de pagamento...
echo.
echo  Quando aparecer "Local: http://localhost:8080" (ou 8081) abaixo,
echo  o site esta no ar. Abra no navegador a URL que aparecer.
echo.
echo  Para parar: feche esta janela ou pressione Ctrl+C
echo  ========================================
echo.

start /b cmd /c "timeout /t 12 /nobreak >nul && start http://localhost:8080"
call npm run dev:all

pause
