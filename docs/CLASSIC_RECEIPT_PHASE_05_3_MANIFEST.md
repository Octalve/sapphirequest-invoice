# Classic Receipt Phase 5.3 — Optional Signature Uploads

## Status

Implemented as a focused signature-only release on top of the approved componentized A5 receipt.

The Classic Receipt header was intentionally **not redesigned** in this phase. Header refinement is deferred to the next controlled phase.

## Implemented

- Optional **Company / Authorised Signatory** image upload.
- Optional **Customer Signature** image upload.
- Upload, replace and remove controls are editor-only and do not render in PNG/PDF output.
- Company signature persists when starting a new receipt.
- Customer signature resets on a new receipt because it belongs to that individual transaction.
- Legacy stored receipt drafts without signature fields migrate safely to empty signature values.
- Accepted upload formats: PNG, JPEG and WebP.
- SVG is intentionally not accepted.
- Source files are capped at 5 MB before processing.
- Browser preprocessing crops excess whitespace, constrains the signature image to a signature-appropriate canvas, preserves transparency when practical, and falls back to compressed JPEG if the optimized PNG remains unusually large.
- Signature images are rendered in bounded slots above the signing lines, preserving the A5 layout whether images are present or absent.
- Signature images flow into browser rendering, PNG export and the independent Classic Receipt native PDF.
- Template-gallery previews suppress signature upload controls.
- PNG static-clone export now removes elements explicitly marked `data-export-ignore="true"` while keeping field replacement indexes aligned.

## Persistence

The signature values are stored inside the independent Classic Receipt draft:

- `companySignatureDataUrl`
- `customerSignatureDataUrl`

The existing receipt draft key remains:

- `sq_classic_receipt_draft_v1`

No Octalve or Classic Ledger document data is shared with these signature fields.

## Native PDF

The Classic Receipt PDF profile now includes bounded signature geometry:

- `signatureImageWidth`
- `signatureImageHeight`

Both signature images render with `objectFit: contain` above their corresponding signature lines.

## Regression protection

- Existing Phase 5.2 A5 component architecture retained.
- Existing receipt state isolation retained.
- Frozen Octalve visual/PDF authority remains byte-identical (9/9 files).
- Classic Ledger remains independent and unchanged by the receipt signature feature.

## Qualification

Source-level structural and functional regression chain: **61/61 tests passed**.

The authoritative dependency-backed gate remains the user's Windows project:

```powershell
pnpm qualify
```
