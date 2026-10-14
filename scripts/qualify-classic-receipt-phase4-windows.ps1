$ErrorActionPreference = "Stop"
Write-Host "=== Classic Receipt Phase 4 qualification ===" -ForegroundColor Cyan
pnpm qualify
if ($LASTEXITCODE -ne 0) { throw "Phase 4 qualification failed." }
Write-Host "Classic Receipt Phase 4 qualification PASSED." -ForegroundColor Green
