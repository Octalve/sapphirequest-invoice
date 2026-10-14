$ErrorActionPreference = "Stop"

pnpm run verify:classic-receipt:phase5.4
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

pnpm qualify
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Classic Receipt Phase 5.4 qualification passed." -ForegroundColor Green
