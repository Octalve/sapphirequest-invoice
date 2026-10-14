# Phase 2.4 Architecture

## Core separation

```text
InvoiceGenerator (orchestration)
├── AccessPortal (local lock)
├── InvoiceToolbar (currency + paper + actions)
├── useInvoiceGenerator (state + persistence)
├── SapphireInvoiceRenderer (editable HTML document)
├── buildInvoicePresentation (normalized immutable export snapshot)
└── export-adapter
    ├── PDF → native-pdf-export → SapphirePdfDocument → @react-pdf/renderer
    └── PNG → html2canvas-pro
```

## Editable document boundary

The HTML renderer is now componentized under `renderers/html/`. It owns document appearance and editor controls, but it does not:

- read/write localStorage;
- allocate invoice numbers;
- calculate totals independently;
- export PDF bytes;
- hash PINs;
- perform authentication.

The service description field remains part of its line item and is rendered directly below the service title.

## Presentation boundary

`presentation/invoice-presentation.ts` converts current controlled state into one normalized export snapshot. The native PDF renderer receives that snapshot and never recalculates invoice totals.

`presentation/document-profile.ts` owns PDF paper geometry and Sapphire document tokens.

## PDF flow

```text
Current controlled invoice state
        ↓
buildInvoicePresentation()
        ↓
load Sapphire logo as same-origin data URL
        ↓
SapphirePdfDocument
        ↓
@react-pdf/renderer
        ↓
PDF Blob
        ↓
Browser download
```

The PDF does not depend on browser DOM dimensions, html2canvas or jsPDF.

## PDF pagination

React-PDF's own page-wrapping engine is responsible for page flow:

- normal rows are unbreakable and move intact;
- pathological long rows may wrap so content is never silently lost;
- continuation identity is fixed at the top of page 2+;
- footer/page numbers are fixed on all pages;
- normal closing blocks are kept together;
- unusually long notes use a safe flowing fallback.

The old pure `pagination.ts` helper and its Phase 2 regression tests remain in the repository as the historical browser-pagination utility and to protect the Phase 2 geometry work, but it is no longer the active PDF pagination engine.

## PNG flow

PNG still reflects the editable browser document:

```text
HTML document
  ↓
replace input/textarea controls with static capture spans
  ↓
html2canvas-pro at controlled 2x scale
  ↓
PNG Blob
```

## Persistence

The project remains local-only:

- current draft → localStorage;
- payment details → localStorage;
- selected currency → localStorage;
- selected paper size → localStorage;
- invoice sequence → localStorage.

No database or server user model is introduced in Phase 2.4.
