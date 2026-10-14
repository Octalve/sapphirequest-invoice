# Classic Receipt Phase 5.2 — Componentized A5 Receipt

## Status

**IMPLEMENTED / SOURCE-LEVEL VERIFIED**

This checkpoint rebuilds **Classic Receipt only** around the approved formal receipt reference. The frozen Octalve Template remains byte-for-byte unchanged. Classic Ledger remains isolated from Receipt state/business data.

## Design authority

The supplied formal receipt reference is the visual authority for Classic Receipt Phase 5.2:

- true A5 landscape composition,
- framed classical document,
- centered business identity,
- compact RECEIPT title treatment,
- date line + boxed receipt number,
- Received From field,
- two-line “The Sum of” treatment,
- Being Payment for field,
- Amount in Figure + optional Balance,
- payment-method checkboxes,
- two signature lines,
- generic Reference line and payment-confirmation note.

The Drip Mall identity/property wording is reference-only and is **not hard-coded**.

## Architectural correction

The receipt is no longer implemented as one large renderer.

### Browser sections

- `components/receipt-brand-header.tsx`
- `components/receipt-document-meta.tsx`
- `components/receipt-details-section.tsx`
- `components/receipt-payment-section.tsx`
- `components/receipt-signature-footer.tsx`

`classic-receipt-renderer.tsx` now only coordinates theme/state and composes those sections.

### Native PDF sections

- `pdf/components/receipt-pdf-brand-header.tsx`
- `pdf/components/receipt-pdf-document-meta.tsx`
- `pdf/components/receipt-pdf-details.tsx`
- `pdf/components/receipt-pdf-payment.tsx`
- `pdf/components/receipt-pdf-signature-footer.tsx`
- shared PDF styles in `pdf/classic-receipt-pdf-styles.ts`

The PDF document is a composition shell rather than a monolithic layout.

## A5-first composition

Classic Receipt now treats **A5 landscape (210 × 148 mm)** as the canonical receipt paper.

Browser authority:
- width: 794 px
- height: 559 px
- fixed physical canvas
- overflow hidden
- flex-column section stack
- signature/footer anchored using remaining page space

Native PDF authority:
- 595.28 × 419.53 pt
- one-page `wrap={false}` receipt
- measured component metrics derived from the A5 browser composition

A4 and Letter landscape profiles remain available internally for future use, but the receipt editor intentionally exposes A5 as the receipt paper.

Existing receipt drafts are migrated once to A5 with:
`sq_classic_receipt_a5_layout_v2`.

## Overflow prevention

Phase 5.2 adds `lib/receipt-layout.ts`:

- amount-in-words is split at word boundaries into the reference’s two classical lines,
- unusually long wording steps down through controlled text-density levels,
- long Received From / Payment Purpose values use controlled font-density levels,
- very large monetary strings step down without changing financial values.

The large example around `45,579,777,888,888` remains readable rather than forcing the entire receipt into tiny typography.

## Independence retained

This checkpoint is cumulative over Phase 5 and includes the Phase 5.1 isolation corrections:

- Octalve invoice state remains independent,
- Classic Ledger invoice/payment/currency/paper state remains independent,
- Classic Receipt state remains independent,
- Classic Ledger and Classic Receipt business profiles persist under different keys,
- Receipt continues to use receipt-specific numbering and export routing.

## Frozen authority

Octalve frozen visual/PDF authority: **9/9 hashes unchanged**.

No Octalve visual renderer, CSS, presentation profile, or native PDF file is changed by this receipt redesign.
