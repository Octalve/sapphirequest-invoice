# Phase 2.4 Manifest — Componentized Sapphire Renderer + Native PDF

## Purpose

Phase 2.4 refines the qualified standalone Sapphire Quest invoice generator after the Phase 2 paper/export work and the Phase 2.1/2.2 local-qualification fixes.

The goal is not to change numbering, draft persistence, currency switching, PIN behavior or invoice calculations. The goal is to improve document composition and move PDF generation from a raster screenshot wrapper to a real PDF document renderer.

## Visual direction

The browser invoice is rebuilt from reusable sections inspired by the supplied Figma invoice reference:

- compact company/invoice header;
- amount due and date metadata without an oversized decorative title block;
- light invoice-from / customer card;
- spacious line-item rows;
- service description rendered directly beneath the service name;
- notes/payment area paired with totals;
- restrained Sapphire-blue full-width footer;
- dedicated A5 density instead of scaling an A4 page.

The existing `InvoiceLine.description` field is deliberately kept inside the same line item and displayed directly under `serviceName`. It is not a second "Price Description" column.

## Renderer structure

```text
src/features/invoice/renderers/
├── sapphire-invoice-renderer.tsx
├── html/
│   ├── auto-resize-textarea.tsx
│   ├── invoice-header.tsx
│   ├── invoice-parties.tsx
│   ├── invoice-items-table.tsx
│   ├── invoice-closing.tsx
│   └── invoice-footer.tsx
└── pdf/
    └── sapphire-pdf-document.tsx
```

Presentation/document tokens are isolated in:

```text
src/features/invoice/presentation/
├── document-profile.ts
└── invoice-presentation.ts
```

## Native PDF architecture

PDF export now uses `@react-pdf/renderer@4.9.0`.

```text
Invoice draft + payment settings + calculated totals
                    ↓
        buildInvoicePresentation()
                    ↓
          SapphirePdfDocument
                    ↓
       @react-pdf/renderer pdf()
                    ↓
              PDF Blob
                    ↓
                download
```

The PDF is therefore not an HTML screenshot embedded in a PDF page. Text and layout are emitted through PDF primitives.

### Paper geometry

The PDF renderer uses explicit physical page profiles:

- A4: 210 × 297 mm
- A5: 148 × 210 mm
- Letter: 612 × 792 PDF points

A5 has separate padding, typography and row-density tokens.

### Pagination strategy

- ordinary line-item rows use `wrap={false}` so a normal row moves intact to the next page;
- unusually long rows are allowed to wrap rather than risking content disappearance;
- fixed continuation context appears on page 2+;
- the footer and page numbers repeat on every page;
- normal notes + totals stay together;
- unusually long notes use a safe fallback layout with notes flowing before the totals block.

## PNG architecture

PNG export remains DOM based because a PNG is inherently raster output:

```text
Editable browser invoice
        ↓
replace form controls with capture text
        ↓
html2canvas-pro@2.5.2
        ↓
PNG Blob
        ↓
download
```

`html2canvas-pro` remains necessary because Tailwind 4 uses modern color functions that upstream html2canvas 1.4.1 cannot reliably parse.

## Dependency changes

Added:

- `@react-pdf/renderer@4.9.0`
- `html2canvas-pro@2.5.2`

Removed from the active dependency graph:

- `jspdf`
- `html2canvas`

## Currency note

The editable HTML preview continues to show native currency symbols. The native PDF currently uses ISO currency codes (`NGN`, `USD`, `GBP`, `EUR`) before numeric values. This avoids relying on the Naira glyph in PDF standard Helvetica and keeps the PDF small without adding an embedded font asset.

## Qualification

`pnpm qualify` now runs:

1. strict TypeScript;
2. ESLint;
3. Next.js production build;
4. Phase 1 structural verification;
5. Phase 2 paper/pagination verification + regression tests;
6. Phase 2.4 structural verification + presentation/paper-profile tests.

Phase 2.4 tests cover:

- exact A4 PDF point dimensions;
- exact A5 PDF point dimensions;
- Letter dimensions;
- description remains under the service item;
- committed invoice-number override does not mutate the draft;
- native PDF money formatting uses an ISO currency prefix.

## Deliberately unchanged

- local PIN/security scope;
- inactivity lock;
- browser-local invoice numbering;
- localStorage draft persistence;
- NGN/USD/GBP/EUR selection;
- existing subtotal/discount/tax calculations;
- payment-detail persistence;
- New Invoice flow;
- A4/A5/Letter selector.
