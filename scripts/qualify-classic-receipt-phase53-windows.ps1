Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath (Join-Path (Get-Location).Path "package.json"))) {
    throw "Run this script from the invoice-generator project root."
}

Write-Host "Classic Receipt Phase 5.3 qualification" -ForegroundColor Cyan
Write-Host "Running full project qualification..." -ForegroundColor Yellow

pnpm qualify

if ($LASTEXITCODE -ne 0) {
    throw "Classic Receipt Phase 5.3 qualification failed."
}

Write-Host "CLASSIC RECEIPT PHASE 5.3 QUALIFICATION PASSED" -ForegroundColor Green
