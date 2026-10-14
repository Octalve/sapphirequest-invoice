# Classic Receipt Phase 4 Manifest

## Scope

Phase 4 introduces **Classic Receipt** as a third, independent document template beside the frozen Octalve Template and approved Classic Ledger invoice.

The earlier Drip Mall receipt is treated only as layout inspiration. No Drip Mall identity, property-specific wording or industry-specific business assumptions are hard-coded.

## Semantic separation

Classic Receipt is not an invoice mode. It has its own:

- receipt state/draft;
- receipt numbering (`SQ-00001-RCT`);
- amount received;
- optional real balance field;
- received-from party;
- payment purpose;
- payment method;
- generic reference;
- presentation builder;
- browser renderer;
- native React-PDF renderer;
- export filename.

Invoice state/calculation/numbering remains unchanged for Octalve and Classic Ledger.

## Receipt fields

- Date
- Receipt number
- Received From
- The Sum Of (automatic amount-in-words)
- Being Payment For
- Amount in Figure
- Optional Balance
- Payment Method: Cash / Transfer / Cheque / POS / Other
- Generic Reference
- Authorised Signatory
- Customer Signature

Balance is not invented from invoice totals. It is omitted semantically (`null`) until explicit receipt balance data is supplied.

## Generic business identity

The template uses the shared Sapphire business identity:

- logo asset as an image;
- business name as real text;
- phone/email/website as real text.

This keeps the template reusable for a future configurable business profile.

## Styling

- default accent: Sapphire `#0755DB`;
- independent CSS module and PDF profile;
- bordered formal receipt composition;
- A4 authority;
- deliberate A5 and Letter compositions;
- no color picker in Phase 4.

## Export

- PNG uses the existing isolated static DOM capture, generalized to accept any document with paper size + currency.
- Receipt PDF uses `ClassicReceiptPdfDocument` and never reuses Octalve or Classic Ledger PDF documents.
- Receipt amounts use native currency formatting with a composed Naira mark for NGN.

## Freeze protection

Phase 4 verifies:

- Octalve frozen visual/PDF hashes: unchanged;
- Classic Ledger Phase 3 browser + PDF hashes: unchanged.

## Phase 5 boundary

Phase 5 owns the post-login template gallery, persistent template selection policy, controlled accent-color customization and final production qualification. Phase 4 does not implement the gallery.
