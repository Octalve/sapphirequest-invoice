Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    throw "Run this script from the invoice-generator project root."
}

Write-Host "" 
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " PHASE 5.1 TEMPLATE ISOLATION QUALIFICATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

pnpm qualify
if ($LASTEXITCODE -ne 0) {
    throw "Phase 5.1 qualification failed. Send the complete terminal output from the first failing command."
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " PHASE 5.1 TEMPLATE ISOLATION QUALIFICATION PASSED" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
