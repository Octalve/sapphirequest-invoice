# Invoice Generator Engineering Notes

## Architecture rules

- Keep invoice document markup inside `src/features/invoice/renderers/`.
- Keep calculations, currency, storage, numbering and export logic outside renderer components.
- Do not query databases or call server APIs from renderer components.
- Preserve browser-local standalone behavior; this Sapphire build does not pretend to have server authentication, a database or RBAC.
- Keep one normalized presentation snapshot feeding exports.
- PDF is native React-PDF. Never reintroduce screenshot/JPEG/jsPDF PDF generation.
- PNG is browser capture only and must capture an isolated static clone, never mutate the live invoice before capture.
- A4/A5/Letter are first-class document profiles. Never implement A5 with CSS scale/transform.
- The active line-item model is Item + Description-under-title + Quantity + Unit Price + Line Discount + computed Amount.
- Currency symbols are display-derived from the toolbar currency and are not editable data fields.
- Invoice numbering is generated as `SQ-xxxxx-INV`; the counter is committed on first export.
- `Powered by Octalve` uses Octalve primary blue `#0064E0`; do not substitute Sapphire blue.
- Avoid CDN scripts and inline DOM event handlers.
- Prefer strict TypeScript, focused components and explicit regression tests.
