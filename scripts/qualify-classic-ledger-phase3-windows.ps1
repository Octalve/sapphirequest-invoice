$ErrorActionPreference = "Stop"

Write-Host "=== Classic Ledger Phase 3 qualification ===" -ForegroundColor Cyan
pnpm typecheck
if ($LASTEXITCODE -ne 0) { throw "TypeScript failed." }

pnpm lint
if ($LASTEXITCODE -ne 0) { throw "Lint failed." }

pnpm build
if ($LASTEXITCODE -ne 0) { throw "Production build failed." }

pnpm verify:phase1
if ($LASTEXITCODE -ne 0) { throw "Phase 1 regression failed." }
pnpm verify:phase2
if ($LASTEXITCODE -ne 0) { throw "Phase 2 regression failed." }
pnpm verify:phase2.4
if ($LASTEXITCODE -ne 0) { throw "Phase 2.4 regression failed." }
pnpm verify:phase2.5
if ($LASTEXITCODE -ne 0) { throw "Phase 2.5 regression failed." }
pnpm verify:phase2.6
if ($LASTEXITCODE -ne 0) { throw "Phase 2.6 regression failed." }
pnpm verify:classic-ledger:phase2
if ($LASTEXITCODE -ne 0) { throw "Classic Ledger Phase 2 regression failed." }
pnpm verify:classic-ledger:phase3
if ($LASTEXITCODE -ne 0) { throw "Classic Ledger Phase 3 regression failed." }

Write-Host "Classic Ledger Phase 3 qualification PASSED." -ForegroundColor Green
