$ErrorActionPreference = "Stop"

Write-Host "Classic Ledger Phase 2 qualification" -ForegroundColor Cyan
Write-Host "Node: $(node --version)"
Write-Host "pnpm: $(pnpm --version)"

pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw "pnpm install failed" }

Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue

pnpm qualify
if ($LASTEXITCODE -ne 0) { throw "Phase 2 qualification failed" }

Write-Host "Classic Ledger Phase 2 qualification PASSED" -ForegroundColor Green
