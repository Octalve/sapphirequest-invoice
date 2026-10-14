# Sapphire Quest Invoice Generator — Phase 2.6

Phase 2.6 is the consolidated final-refinement checkpoint for the standalone Sapphire Quest invoice generator. It preserves the Phase 2.5 architecture while restoring the stronger visual balance of the earlier document composition.

## Highlights

- locked `SQ-` prefix + editable five-digit sequence + locked `-INV` suffix;
- manual sequence safely raises the counter floor;
- round Sapphire icon with company name as text;
- five-column items: Item Name / Quantity / Unit Price / Discount / Amount;
- description remains directly beneath the item name;
- Unit Price, Amount and summary monetary values are left aligned;
- editable sender/customer information with correct icons;
- locked currency symbols for NGN/USD/GBP/EUR;
- balanced A4 layout with a ten-normal-row target;
- purpose-built A5 and Letter layouts;
- native React-PDF export;
- geometry-preserving static-clone PNG export;
- Octalve attribution uses Deep Navy `#021A34` for the footer treatment.

## Architecture

```text
InvoiceGenerator
├── useInvoiceGenerator              state + persistence + numbering
├── SapphireInvoiceRenderer          editable HTML document
│   └── renderers/html/*             header/parties/items/closing/footer
├── buildInvoicePresentation         immutable export snapshot
├── SapphirePdfDocument              native React-PDF document
└── export-adapter
    ├── PDF → native PDF renderer
    └── PNG → measured static clone + html2canvas-pro
```

## Install and qualify

```powershell
cd "C:\Users\Bi Creativity\invoice-generator"
pnpm install
pnpm qualify
```

Or:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\qualify-phase26-windows.ps1
```

Then:

```powershell
pnpm dev
```

Open `http://localhost:3000`. See `docs/PHASE_02_6_MANIFEST.md` and `docs/LOCAL_QUALIFICATION.md`.
