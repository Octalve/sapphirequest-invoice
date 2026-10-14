# Verification Record — Phase 2.5

## Source-level verification executed in the build sandbox

### Phase 1 structure

**PASS**

### Phase 2 structure

**PASS**

### Historical Phase 2 pagination suite

**PASS — 7/7**

The regression suite still covers A4/A5 one-page cases, long descriptions, multi-page output, totals near boundaries, pathological tall content and exact-capacity/no-blank-page behavior.

### Phase 2.4 presentation/profile suite

**PASS — 6/6**

Updated to the Phase 2.5 item model while retaining the native-PDF paper/profile contract. It verifies true A4/A5/Letter dimensions, description-under-title semantics, computed item presentation, export invoice-number override behavior and PDF number formatting.

### Phase 2.5 core/refinement suite

**PASS — 5/5**

Covered:

- line amount = quantity × unit price after line discount;
- invoice subtotal uses computed line amounts;
- `SQ-00144-INV` numbering format and parser;
- Octalve attribution color `#0064E0`;
- compact A4/A5 row profiles for the ten-normal-row target.

### Phase 2.5 structural verification

Checks include:

- Phase 2.5 package marker;
- `SQ` company prefix and `INV` document type;
- five-digit sequence width;
- five-column line-item model;
- no editable line total;
- icon-only Sapphire header mark;
- issue date / due date / TIN / RC metadata;
- editable sender details with role icon;
- customer contact icons;
- locked currency-prefix treatment;
- computed line amounts;
- isolated clone-based PNG capture;
- Sapphire v4 renderer marker;
- native PDF currency-symbol component;
- native PDF five-column table;
- Octalve footer color in both HTML and PDF;
- A4/A5 density markers.

## Real dependency-backed gate still required on Windows

The network-restricted sandbox cannot honestly replace the user's real package/runtime qualification. On the user's machine run:

```powershell
pnpm install
pnpm qualify
pnpm dev
```

Then test A4, A5 and Letter PDF/PNG exports and a ten-short-row invoice visually.

## Phase 2.6 final-refinement gates

Phase 2.6 adds verification for:

- sequence-only `SQ-[00000]-INV` editing and counter-floor safety;
- balanced A4/A5 row-density limits;
- five-column structure and description nesting;
- left-aligned Unit Price, Amount and summary monetary values in HTML and native PDF;
- measured-geometry PNG clone capture with font/image/layout stabilization;
- native React-PDF preservation and no jsPDF regression;
- purpose-built A5 composition with no scale transform.

Run `pnpm verify:phase2.6` or the full `pnpm qualify` pipeline.
