$ErrorActionPreference = "Stop"

Write-Host "" 
Write-Host "=== Sapphire Quest Invoice Generator — Phase 2.5 ===" -ForegroundColor Cyan
Write-Host ""

$nodeVersion = node --version
$pnpmVersion = pnpm --version

Write-Host "Node: $nodeVersion"
Write-Host "pnpm: $pnpmVersion"
Write-Host ""

Write-Host "=== Installing pinned dependencies ===" -ForegroundColor Cyan
pnpm install
if ($LASTEXITCODE -ne 0) { throw "pnpm install failed." }

Write-Host ""
Write-Host "=== Running complete qualification ===" -ForegroundColor Cyan
pnpm qualify
if ($LASTEXITCODE -ne 0) { throw "pnpm qualify failed." }

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host " PHASE 2.5 AUTOMATED QUALIFICATION PASSED" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next:" -ForegroundColor Yellow
Write-Host "  pnpm dev" -ForegroundColor White
Write-Host "  open http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Runtime checks: A4/A5/Letter, 10 short rows, NGN/USD/GBP/EUR, PDF, PNG." -ForegroundColor Yellow
