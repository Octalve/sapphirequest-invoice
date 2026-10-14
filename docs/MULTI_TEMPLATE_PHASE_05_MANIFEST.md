# Sapphire Invoice Generator — Multi-Template Phase 5 Manifest

## Status

Phase 5 implements the multi-template workspace and release-layer architecture on top of the verified Phase 4 checkpoint.

## Template platform

The secured workspace now exposes three independent document experiences:

1. **Octalve Template** — modern invoice; frozen visual/PDF authority and not color-customizable.
2. **Classic Ledger** — classical invoice with browser + native PDF rendering and controlled accent customization.
3. **Classic Receipt** — receipt-specific document with browser + native PDF rendering and controlled accent customization.

The template registry remains the single dispatch boundary for template identity, document kind, PDF availability and personalization eligibility.

## Post-login gallery

After successful PIN unlock, the user enters a dedicated template-gallery screen before the editor. Each card renders the actual template component using deterministic sample data. Cards expose Preview and Use Template actions. The editor toolbar contains a Templates action that returns to the gallery rather than mixing template selection into the invoice controls.

Template choice persists under `sq_invoice_template_v1`. Missing or invalid historical selection values are migrated safely to `octalve` and persisted.

## Personalization

Classic Ledger and Classic Receipt support a per-template accent color stored under `sq_template_accent_v1:<template-id>`.

Default colors remain exactly:

- Accent: `#0755DB`
- Dark companion: `#043996`

The Octalve Template does not expose or consume customization and remains protected by the original SHA-256 freeze contract.

Color customization propagates consistently to:

- editable browser rendering,
- PNG export (through the live browser renderer), and
- native React-PDF export for Classic Ledger and Classic Receipt.

## Isolation

No frozen Octalve visual file is modified by Phase 5. Classic Ledger and Classic Receipt retain separate browser/PDF implementations. Receipt semantics remain separate from invoice calculations and numbering.

## Qualification

Phase 5 adds:

- `tests/multi-template-phase5.test.mjs`
- `scripts/run-multi-template-phase5-tests.mjs`
- `scripts/verify-multi-template-phase5.mjs`
- `scripts/qualify-multi-template-phase5-windows.ps1`

Historical structural verifiers were made forward-compatible only where scoped theme plumbing intentionally changes Classic Ledger/Receipt source bytes. The Octalve hash freeze remains strict.

See `MULTI_TEMPLATE_PHASE_05_TEST_RESULTS.md` for evidence and environment limitations.
