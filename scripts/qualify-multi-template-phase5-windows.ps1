Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "" 
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " SAPPHIRE MULTI-TEMPLATE PHASE 5 QUALIFICATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".\package.json")) {
    throw "Run this script from the invoice-generator project root."
}

Write-Host "Node: $(node --version)" -ForegroundColor Yellow
Write-Host "pnpm: $(pnpm --version)" -ForegroundColor Yellow

Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue

pnpm qualify
if ($LASTEXITCODE -ne 0) {
    throw "Multi-template Phase 5 qualification failed. Do not deploy this checkpoint."
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " MULTI-TEMPLATE PHASE 5 QUALIFICATION PASSED" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Validated:" -ForegroundColor Cyan
Write-Host "- TypeScript"
Write-Host "- ESLint"
Write-Host "- Next.js production build"
Write-Host "- Historical Octalve regression gates"
Write-Host "- Classic Ledger browser/PDF gates"
Write-Host "- Classic Receipt browser/PDF gates"
Write-Host "- Multi-template gallery/theme gates"
