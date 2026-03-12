# Inicia backend (porta 3001) e frontend (porta 8080) juntos
# Execute na raiz do projeto: .\scripts\start-tudo.ps1

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path $root)) { $root = (Get-Location).Path }

Set-Location $root

Write-Host "Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no npm install. Verifique se Node/npm estao instalados." -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando backend (3001) e frontend (8080)..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Pressione Ctrl+C para parar." -ForegroundColor Gray
npm run dev:all
