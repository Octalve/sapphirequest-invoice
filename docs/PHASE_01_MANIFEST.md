# Phase 1 Manifest

## Source baseline

- User-provided `index.html` preserved under `docs/reference/sapphire-legacy-index.html`.
- User-provided `SapphireQuest.png` copied unchanged to `public/`.
- User-provided `SapphireQuestIcon.png` copied unchanged to `public/`.

## Implemented

- Next.js App Router project shell.
- React + TypeScript conversion.
- Tailwind v4 PostCSS setup.
- Inter via `next/font`.
- Bundled lucide icons rather than Font Awesome CDN.
- Access portal conversion with original SHA-256 PIN hash, throttling and PIN alignment fix.
- Two-minute inactivity auto-lock.
- Currency selection: NGN/USD/GBP/EUR.
- Local draft restore/save with migration from `sq_invoice_draft_v2` to `v3`.
- Browser-local monthly invoice sequence retained.
- Controlled invoice lines with add/remove support.
- Auto-expanding service/description textareas.
- Discount/tax constraints and calculation utilities.
- Persistent bank/payment details.
- Extra details toggle.
- New Invoice confirmation modal.
- Invoice renderer isolated in `renderers/`.
- Export code isolated in `export-adapter.ts`.
- Legacy PDF/PNG behavior intentionally retained for Phase 1 parity.
- Security response headers baseline in `next.config.ts`.
- Error/not-found boundaries.
- Phase 1 structural verification script.

## Deferred explicitly to Phase 2

- A4/A5/Letter selector.
- A5-specific layout behavior.
- explicit page margins/density presets.
- PDF size reduction from the legacy raster workflow.
- JPEG/compressed export strategy or replacement PDF engine.
- one-page fit tolerance.
- deliberate row-aware pagination.
- totals-block page-break protection.
- repeated continuation headers.
- footer/page-flow correction.
- export preview matching selected page geometry.

## Not part of Sapphire Phase 1/2

The following belong to the later commercial Octalve Invoice product:

- Neon/PostgreSQL;
- Prisma;
- real user accounts;
- RBAC;
- multi-user invoice numbering;
- server authorization;
- audit trails;
- client/invoice history database;
- commercial template registry/dashboard.
