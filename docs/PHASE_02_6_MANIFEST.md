# Phase 2.6 — Layout Balance, Numbering UX & Export Fidelity

Phase 2.6 is the final refinement checkpoint for the standalone Sapphire Quest Invoice Generator. It supersedes Phase 2.5 visually while preserving the Phase 2.5 state model, five-column financial model, security, persistence, native PDF and PNG export architecture.

## Authoritative implementation decisions

- Phase 2.5 remains the functional/architectural base.
- Phase 2.4 is used only as a spacing and visual-balance reference.
- The Figma-derived screenshots remain the visual hierarchy reference.
- A4/A5/Letter remain real paper profiles; A5 is not produced by scaling A4.

## Layout balance

Phase 2.5 compounded several reductions at once (outer margins, section gaps, row height, party-card typography and closing typography), which made the invoice look miniaturized. Phase 2.6 selectively restores visual breathing room:

- A4 preview padding: 34px (between Phase 2.4's 36px and Phase 2.5's 30px).
- A4 normal item row: 56px minimum, with larger title/description typography.
- Sender/customer card height and typography restored modestly.
- Header gets more width on the company side and more natural vertical rhythm.
- Company name uses normal word breaking and balanced wrapping.
- Closing section typography is increased without reintroducing excessive whitespace.
- A5 uses its own refined compact values rather than a scale transform.

## Invoice numbering UX

The document identifier remains `SQ-00001-INV`:

- `SQ-` is locked.
- only the middle numeric sequence is editable;
- `-INV` is locked.
- typing `144` normalizes to `SQ-00144-INV`.
- manual numbering immediately raises the stored counter floor so a later automatic invoice cannot duplicate that number.
- repeated export preserves the selected number.
- New Invoice previews the next safe sequence.

## Five-column financial layout

The table remains:

`Item Name | Quantity | Unit Price | Discount | Amount`

The description remains directly under the item/service name. Amount stays computed from quantity × unit price after the line discount.

For the Phase 2.6 aesthetic direction:

- Unit Price header/value are left aligned.
- Amount header/value are left aligned.
- Subtotal, Discount, Tax and Total values use a fixed left-aligned value column.
- The same alignment is mirrored in native PDF.

## Octalve attribution

The bright `#0064E0` footer treatment was explicitly rejected during the Phase 2.6 visual review. The footer now uses Octalve Deep Navy `#021A34`, taken from the previously approved Octalve palette, while `#0064E0` remains available as an Octalve accent/product token. Sapphire document colors remain separate.

## PNG fidelity

PNG still uses `html2canvas-pro`, but capture is now performed against an isolated clone with measured geometry:

- source element width/height are measured from the actual rendered document;
- form controls are replaced with static export text using copied computed styles;
- textarea height is preserved from its rendered rectangle;
- flex sizing, box sizing, alignment and border properties are copied;
- document fonts and images are awaited;
- two animation-frame stabilization passes run after the export clone is inserted;
- capture width/height come from the stabilized clone rather than guessed paper width only;
- the live editor is never mutated for capture.

## Native PDF

PDF remains `@react-pdf/renderer` based. No jsPDF screenshot pipeline returns. Phase 2.6 updates native PDF spacing, paper profiles, row height, left-aligned money columns, summary values and footer treatment to track the corrected HTML composition.

## Verification

Run:

```powershell
pnpm install
pnpm qualify
```

Or on Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\qualify-phase26-windows.ps1
```

Then use `pnpm dev` and complete the visual matrix in `docs/LOCAL_QUALIFICATION.md`.
