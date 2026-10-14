# Classic Ledger Phase 3 Manifest

## Scope

Phase 3 adds a **native React-PDF implementation for Classic Ledger** while preserving the approved Phase 2 browser design as the visual source of truth and keeping the frozen Octalve Template unchanged.

Implementation base: reviewed `sapphire-invoice-classic-ledger-phase-02.zip`.

## Invariants

- The nine frozen Octalve visual/PDF authority files remain byte-identical to `docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json`.
- The six approved Classic Ledger Phase 2 browser files remain byte-identical to `docs/CLASSIC_LEDGER_PHASE_02_BROWSER_FREEZE.json`.
- Octalve PDF still uses `src/features/invoice/lib/native-pdf-export.tsx` + `SapphirePdfDocument`.
- Classic Ledger PDF uses its own `templates/classic-ledger/pdf/` implementation and never falls through to the Octalve PDF renderer.
- PNG export remains the existing isolated DOM-clone capture path.

## Native PDF architecture

New files:

- `src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-profile.ts`
- `src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx`
- `src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export.tsx`

The profile encodes the approved browser geometry explicitly using the physical conversion:

```text
1 CSS px = 72 / 96 PDF pt = 0.75pt
```

True page sizes remain authoritative. Because 794 CSS px converts to 595.5pt while true ISO A4 is 595.28pt, fixed browser-derived columns retain their exact pt conversion and the flexible Description column absorbs the sub-point physical-width correction. The same rule is used for A5. Letter is exact at 816px -> 612pt.

## Visual mapping

The PDF preserves the approved Classic Ledger hierarchy:

- centered Sapphire logo and text business identity;
- Sapphire blue accent and classical border frame;
- business phone/email/website and optional TIN/RC;
- INVOICE title treatment;
- invoice number, issue date and due date;
- Bill To name/address/email/phone;
- Quantity / Description / Unit Price / Discount / Total ledger table;
- title + description inside the Description column;
- automatic amount-in-words;
- subtotal/discount/tax/total;
- optional payment details and notes;
- customer and authorised-signatory signature lines.

Built-in Times/Helvetica fonts are used deliberately in this phase so the PDF remains self-contained and no new font asset/dependency is introduced.

## Paper and pagination

- A4 uses true 210 x 297 mm physical dimensions.
- A5 uses true 148 x 210 mm physical dimensions and its own compact composition.
- Letter uses true 612 x 792 pt dimensions.
- normal rows are kept together where practical;
- exceptionally long item content may wrap across pages rather than overflow;
- the table header requests presence of at least one following row;
- continuation context is fixed on pages after page 1;
- multi-page documents receive page `n / total` context;
- totals/amount-in-words are kept together as a closing unit;
- signatures are non-wrapping and move as a unit when required.

## Currency handling

Classic Ledger PDF supports NGN, USD, GBP and EUR with no FX conversion. NGN uses an independent native composed Naira mark to avoid relying on built-in Helvetica/Times glyph coverage.

## Export routing

`exportInvoiceDocument` now dispatches explicitly:

- `octalve` -> existing Octalve native PDF exporter;
- `classic-ledger` -> independent Classic Ledger native PDF exporter.

There is no generic fallback from one template to the other.

## Regression strategy

Phase 3 adds:

- browser-px -> PDF-pt conversion tests;
- real A4/A5/Letter size tests;
- exact table-width conservation tests;
- A4/A5 row-geometry tests;
- date-display mapping tests;
- native-PDF registry availability tests;
- shared amount-in-words regression;
- structural checks for independent PDF routing and pagination primitives;
- SHA-256 freeze verification for Octalve and the approved Classic Ledger browser renderer.

## Qualification

Authoritative Windows qualification remains:

```powershell
pnpm install
pnpm qualify
```

This environment does not contain the project's installed `node_modules`, so the dependency-backed Next.js production build must be re-run on the user's Windows environment. Source-level TypeScript syntax and all dependency-free regression suites are executed before checkpointing.
