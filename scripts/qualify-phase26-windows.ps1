$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

function Run-Step {
    param([string]$Name, [scriptblock]$Command)
    Write-Host ""
    Write-Host "=== $Name ===" -ForegroundColor Cyan
    & $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAILED: $Name" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "PASSED: $Name" -ForegroundColor Green
}

Write-Host "SAPPHIRE INVOICE GENERATOR - PHASE 2.6 QUALIFICATION" -ForegroundColor Cyan
node --version
pnpm --version
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
Run-Step "Install dependencies" { pnpm install }
Run-Step "Full automated qualification" { pnpm qualify }
Write-Host ""
Write-Host "PHASE 2.6 AUTOMATED QUALIFICATION PASSED" -ForegroundColor Green
Write-Host "Next: pnpm dev" -ForegroundColor Yellow
