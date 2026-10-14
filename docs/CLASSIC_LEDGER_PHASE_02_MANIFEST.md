# Classic Ledger Phase 2 Manifest

## Scope

Classic Ledger Phase 2 introduces a new **browser-only invoice template** beside the frozen Octalve Template.

The baseline archive was `sapphire-invoice-current-baseline-20261013-172502.zip` (SHA-256 `d4f47b8573eb2d73e09a7b3f3347b1547a10a719bbd57cd682e822de8d2fccb4`).

The uploaded baseline contained the approved Octalve Template freeze contract. Its nine visual/PDF authority files were verified byte-for-byte against `docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json` before Phase 2 changes.

## Important compatibility note

The uploaded baseline did not yet contain the multi-template registry assumed by the continuation prompt. Phase 2 therefore adds the minimum platform compatibility layer needed to render Classic Ledger safely:

- template ID/types and registry;
- local template selection with Octalve as the default;
- template boundary dispatch in `InvoiceGenerator`;
- toolbar selection for Phase 2 review only.

No existing invoice draft schema or stored invoice data is migrated in this phase. Phase 5 remains responsible for the post-login Template Gallery and draft-level template migration/persistence policy.

## New Classic Ledger browser template

Classic Ledger is deliberately independent from the frozen Octalve renderer and uses section-level components:

- centered logo + text business identity;
- invoice number, issue date and due date;
- customer name/address/email/phone;
- optional business TIN/RC kept with the centered business identity;
- classical ledger table with Quantity, Description, Unit Price, Discount and Total;
- shared line/invoice calculations;
- automatic amount-in-words for NGN/USD/GBP/EUR;
- invoice-level subtotal/discount/tax/total;
- optional payment details and notes;
- customer and authorised-signatory signature lines;
- Sapphire blue as an isolated template accent token;
- A4 authority with A5/Letter browser composition hooks.

Visual filler rows are presentation-only. They are not invoice line objects and never participate in totals or storage.

## Export behavior

- Octalve PDF remains the existing native React-PDF renderer.
- Classic Ledger PNG uses the existing isolated browser capture infrastructure.
- Classic Ledger PDF is explicitly gated/disabled until Phase 3.
- Classic Ledger never falls through to the Octalve native-PDF renderer.

## Frozen Octalve protection

The Phase 2 verifier recomputes SHA-256 for nine frozen visual authority files and fails if any drift from the recorded v1.0 freeze.

## Final Phase 2 hardening

The final review identified and corrected four browser-phase edge cases before checkpointing:

- the Classic Ledger sequence editor now resynchronizes when `New Invoice` or export commits a new number;
- customer name/address use auto-growing textareas so long identities remain visible instead of horizontally scrolling;
- the Classic Ledger page no longer clips many-row browser invoices with `overflow: hidden`;
- the export adapter itself rejects non-Octalve native PDF requests, preventing accidental Classic Ledger -> Octalve PDF fallback even outside the toolbar guard.

The presentation-only generated footer was removed so it cannot collide with long invoice content and because it was not part of the approved classical reference.

## Qualification

Authoritative Windows qualification command:

```powershell
pnpm install
pnpm qualify
```

Phase 2 adds:

```text
pnpm test:classic-ledger:phase2
pnpm verify:classic-ledger:phase2
```

The full `pnpm qualify` chain includes the new verification after all existing Octalve phases.

## Phase 3 boundary

Phase 3 must treat the approved Classic Ledger A4 browser design as the visual source of truth and add an independent native `@react-pdf/renderer` implementation. It must not modify the frozen Octalve renderer or reuse its PDF component as a Classic Ledger fallback.
