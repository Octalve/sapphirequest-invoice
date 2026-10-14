# Octalve Template v1.0 â€” Frozen Visual Contract

Status: **FROZEN / APPROVED**

The current Sapphire Quest invoice browser design, PNG export and native PDF implementation are the accepted **Octalve Template v1.0** baseline.

## Freeze rules

- The current browser UI is the visual authority for Octalve Template.
- Future templates must not alter Octalve Template appearance or behavior unless an Octalve revision is explicitly approved.
- New templates must use separate template-specific browser and native-PDF renderers/styles.
- Shared invoice data, numbering, calculations, currency, persistence, security and presentation logic should remain common.
- PDF export must remain native `@react-pdf/renderer`; do not regress to screenshot/jsPDF PDF.
- PNG export remains the isolated browser-capture path.
- A4, A5 and Letter remain purpose-built paper compositions.
- Invoice number format remains `SQ-00001-INV`, with only the sequence editable.
- Item model remains Item Name, Quantity, Unit Price, Discount and Amount, with description under Item Name.
- Unit Price, Amount and summary monetary values remain left-aligned.
- Octalve attribution keeps the approved Deep Navy footer treatment.

## Future template selector

The toolbar may later expose a `Template` control.

Initial planned choices:

- **Octalve Template** â€” this frozen v1.0 design.
- **Signature Template** â€” working name for the upcoming independent design. The final name can change after its visual model is reviewed.

## Isolation requirement

Changing a future template must not visually or functionally regress Octalve Template. Template-specific CSS and PDF layout code must not leak between templates.