# Classic Ledger Phase 2 — Test Results

## Baseline

- Uploaded baseline ZIP: `sapphire-invoice-current-baseline-20261013-172502.zip`
- Baseline SHA-256: `d4f47b8573eb2d73e09a7b3f3347b1547a10a719bbd57cd682e822de8d2fccb4`
- Baseline package manifest recorded qualification PASS before packaging on Node 24.11.1 / pnpm 12.11.2.

## Phase 2 source gates executed in the build sandbox

- Phase 1 structural verification: PASS
- Phase 2 structural verification: PASS
- Phase 2 pagination tests: 7/7 PASS
- Phase 2.4 structural verification: PASS
- Phase 2.4 presentation tests: 6/6 PASS
- Phase 2.5 structural verification: PASS
- Phase 2.5 financial/numbering tests: 5/5 PASS
- Phase 2.6 structural verification: PASS
- Phase 2.6 parity/numbering tests: 7/7 PASS
- Classic Ledger Phase 2 structural verification: PASS
- Classic Ledger amount/template tests: 5/5 PASS
- Frozen Octalve visual/PDF authority hashes: 9/9 unchanged
- TS/TSX parser/syntax pass: 44 files PASS
- Classic Ledger CSS-module reference integrity: PASS (34 referenced classes)
- Classic Ledger/template relative-import integrity: PASS
- Final hardening structural checks (sequence resync, long customer fields, many-row unclipped layout, export-adapter PDF gate): PASS

Total executed functional tests: **30/30 PASS**.

## Environment limitation

The build sandbox provides Node 22.16.0 and a global TypeScript compiler, but does not contain the project's installed `node_modules`/pnpm binary and cannot reach the npm registry. Therefore dependency-backed `pnpm typecheck`, ESLint and Next.js production build are not honestly reproducible here.

The checkpoint retains the exact lockfile and now wires Classic Ledger Phase 2 into `pnpm qualify`. The authoritative local Windows qualification remains:

```powershell
corepack enable
pnpm install --frozen-lockfile
pnpm qualify
```

Expected project environment from the verified baseline is Node 24.11.1 and pnpm 12.11.2.

## Final review conclusion

Phase 2 matches the intended boundary: the Octalve Template remains frozen; Classic Ledger is an independent browser template using shared invoice state/calculations; Classic Ledger native PDF, Classic Receipt, the post-login gallery and user color controls remain intentionally deferred to later phases.

The final review removed a presentation-only footer that could collide with long content, changed long customer name/address fields to auto-growing text areas, prevented many-row clipping, synchronized the sequence editor through keyed remounting, and enforced the Phase 3 PDF boundary inside the export adapter itself.
