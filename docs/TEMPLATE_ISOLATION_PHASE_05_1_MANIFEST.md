# Sapphire Invoice Generator — Phase 5.1 Template Isolation & Landscape Receipt

## Status

Source-level implementation complete. Windows dependency-backed `pnpm qualify` remains the authoritative final gate.

## Purpose

This corrective release removes unintended state coupling between templates and converts Classic Receipt to a true landscape document.

## State isolation

- **Octalve Template** continues to use the original `sq_invoice_draft_v5` invoice draft and existing Octalve business/payment state.
- **Classic Ledger** now uses its own invoice draft, payment settings, currency and paper-size storage namespace:
  - `sq_classic_ledger_invoice_draft_v1`
  - `sq_classic_ledger_payment_settings_v1`
  - `sq_classic_ledger_currency_v1`
  - `sq_classic_ledger_paper_size_v1`
- **Classic Receipt** keeps its existing independent receipt draft/counter.
- Classic Ledger and Classic Receipt now have separate editable business-profile stores:
  - `sq_template_business_profile_v1:classic-ledger`
  - `sq_template_business_profile_v1:classic-receipt`

Editing line items, quantities, prices, discounts, taxes, customer data or payment settings in Classic Ledger no longer changes Octalve. Receipt data remains separate from both invoice templates.

## Editable company identity

Classic Ledger and Classic Receipt now expose editable business-name/contact/address fields directly in their template headers. Classic Ledger additionally exposes independent TIN and RC fields. The Sapphire logo image remains a separate visual asset.

The independent business profiles flow into native PDF presentation data so browser/PNG/PDF use the same template-specific identity.

## Classic Receipt landscape

Classic Receipt is now a true landscape composition rather than a portrait receipt:

- A4 browser: `1123 × 794 px`
- Letter browser: `1056 × 816 px`
- A5 browser: `794 × 559 px`
- A4 PDF: `841.89 × 595.28 pt`
- Letter PDF: `792 × 612 pt`
- A5 PDF: `595.28 × 419.53 pt`

PNG capture receives an explicit `landscape` orientation descriptor so portrait minimum-height logic does not create unnecessary blank space.

## Octalve protection

The frozen Octalve visual/PDF authority remains byte-identical. The Phase 5.1 verification gate still validates all nine frozen hashes.

## Other corrections retained

- Phase 5 template-gallery `useMemo` lint error is corrected with an inline callback.
- Unused `Path` and `Svg` imports are removed from Classic Ledger PDF.
- Gallery receipt preview uses its actual wider landscape renderer rather than a portrait-width preview frame.

## Files added

- `src/features/invoice/templates/business-profile.ts`
- `src/features/invoice/hooks/use-template-business-profile.ts`
- `src/features/invoice/templates/classic-ledger/storage.ts`
- `tests/template-isolation-phase51.test.mjs`
- `scripts/run-template-isolation-phase51-tests.mjs`
- `scripts/verify-template-isolation-phase51.mjs`
- `scripts/qualify-template-isolation-phase51-windows.ps1`

## Qualification

Source-level functional tests: **53/53 PASS**.

Structural gates:

- Classic Ledger Phase 2 — PASS
- Classic Ledger Phase 3 — PASS
- Classic Receipt Phase 4 — PASS
- Multi-template Phase 5 — PASS
- Template Isolation Phase 5.1 — PASS
- Frozen Octalve authority — **9/9 unchanged**

Run the supplied Windows qualification script on the dependency-backed local project to complete TypeScript, ESLint, Next production build and every regression gate.
