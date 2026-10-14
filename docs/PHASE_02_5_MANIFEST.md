# Sapphire Quest Invoice Generator — Phase 2.5 Manifest

Phase 2.5 supersedes the Phase 2.4 invoice presentation. The security, draft persistence, currency selector, paper selector, native PDF architecture and PNG export boundary remain, but the document model and visual composition have been replaced to match the approved invoice reference more faithfully.

## Document numbering

Invoice identifiers now use the business-document structure:

```text
SQ-00144-INV
```

- `SQ` — Sapphire Quest company code;
- `00144` — global five-digit sequential document number;
- `INV` — invoice document type.

The number is generated and locked in the document header. It is previewed before first export and committed when the invoice is first exported. The global counter no longer resets by month or appears as a date path.

## Header

- icon-only Sapphire Quest artwork (`public/SapphireQuestIcon.png`) is centered in a circular brand holder;
- company name is live text, not embedded in the logo image;
- website is a secondary line;
- amount due is locked/computed;
- issue date and due date are editable;
- TIN and RC fields are editable invoice metadata;
- the header is deliberately shorter to preserve document capacity.

## Invoice parties

`Invoice from` is editable sender identity:

- sender name;
- sender email with mail icon;
- sender phone with phone icon;
- sender role with briefcase/role icon.

`To Customer` contains:

- customer name;
- customer email with mail icon;
- customer phone with phone icon;
- customer location/address with map-pin icon.

## Item model

The active item table is:

```text
Item Name | Quantity | Unit Price | Discount | Amount
```

The description textarea is rendered directly under the item/service name. It is not another column.

Each row stores:

```text
serviceName
description
quantity
unitPrice
discount
```

`Amount` is computed and never directly edited:

```text
amount = quantity × unitPrice × (1 - discount / 100)
```

The invoice subtotal is the sum of those computed line amounts. Existing invoice-level discount and tax continue to apply after line-level discounts.

## Currency behavior

Currency is controlled only by the toolbar selector. The symbol is a locked visual prefix in editable price fields and computed amounts. Changing NGN/USD/GBP/EUR updates the visible symbol everywhere without making the symbol itself editable.

Native PDF uses a dedicated currency-symbol component. NGN uses a vector-composed naira mark so the PDF no longer falls back to `NGN` text simply because the standard Helvetica encoding lacks a reliable naira glyph.

## Document density

A4 and Letter target ten normal short item rows while preserving readable item title/description hierarchy. A5 has its own tighter composition and is never an A4 transform/scale.

The density gains come from:

- shorter header;
- shorter parties card;
- 50px normal A4/Letter row target;
- 36px normal A5 row target;
- tighter closing block;
- slimmer attribution footer.

Long descriptions are still allowed to grow and can reduce per-page row count naturally.

## Octalve attribution

`Powered by Octalve` uses the canonical Octalve blue `#0064E0`, not the Sapphire document blue.

## PNG export

PNG no longer mutates the live editable invoice before capture. It now:

1. clones the invoice DOM;
2. moves the clone to an off-screen static export stage;
3. replaces editable controls in the clone with fixed-value display spans while preserving computed dimensions/typography;
4. waits for images/fonts/paint;
5. captures the fixed paper-sized clone with `html2canvas-pro`;
6. removes the clone.

This prevents live input/textarea mutation and greatly reduces layout drift in PNG output.

## PDF export

PDF remains native React-PDF rather than screenshot PDF. The PDF renderer mirrors the five-column table, round Sapphire icon header, party icons, editable metadata snapshot, locked currency symbols, compact pagination and Octalve attribution color.

## Persistence migration

Draft storage moves to `sq_invoice_draft_v5`. Phase 2.4/2.3/2 drafts remain readable as migration sources. Legacy rows map to:

```text
quantity = 1
unitPrice = legacy total
discount = 0
```

Legacy date-based invoice identifiers are replaced by the new `SQ-xxxxx-INV` preview. Sender identity, TIN and RC persist across `New Invoice`; customer/items/notes reset.

## Qualification

`pnpm qualify` now runs:

1. strict TypeScript;
2. ESLint;
3. Next.js production build;
4. Phase 1 structural verification;
5. Phase 2 paper/pagination verification;
6. Phase 2.4 native-PDF regression verification;
7. Phase 2.5 refinement verification and tests.
