Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot "package.json"))) {
    throw "Run this script from C:\Users\Bi Creativity\invoice-generator"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CLASSIC RECEIPT PHASE 5.2 - WINDOWS QUALIFICATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

pnpm qualify

if ($LASTEXITCODE -ne 0) {
    throw "Phase 5.2 qualification failed. Send the terminal output beginning at the first failing command."
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " CLASSIC RECEIPT PHASE 5.2 QUALIFICATION PASSED" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
