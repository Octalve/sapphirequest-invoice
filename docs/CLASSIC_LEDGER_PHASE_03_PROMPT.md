# Phase 3 Continuation Prompt — Classic Ledger Native PDF

Continue from the exact verified Classic Ledger Phase 2 checkpoint stored in the Library.

Execute **Phase 3 — Classic Ledger Native PDF & Paper Qualification**.

Do not alter the approved Classic Ledger browser design except where an actual browser defect is found and documented. The approved browser A4 Classic Ledger invoice is the visual source of truth.

Treat the frozen Octalve Template as immutable. Its browser, PNG and native-PDF visual authority files must continue to match the recorded freeze hashes.

Requirements:

1. Create an independent native `@react-pdf/renderer` implementation under the Classic Ledger template boundary. Do not import or reuse `SapphirePdfDocument` as a Classic Ledger renderer.
2. Do not use screenshot-PDF, jsPDF, browser canvas or PNG embedding as the PDF implementation.
3. Translate approved browser geometry deliberately into PDF physical units. A4 is authoritative.
4. Build A5 and Letter as deliberate paper compositions rather than scaled A4 screenshots.
5. Preserve selectable/searchable text, real paper dimensions and crisp vector/table rules.
6. Preserve shared invoice numbering, calculations, currencies, amount-in-words, customer/business data and payment details without duplicating business rules.
7. Implement robust line-item pagination. Keep normal rows intact, allow pathological long descriptions to flow safely, repeat/continue table context where needed, and prevent totals/signatures from overlapping or being clipped.
8. Preserve NGN/USD/GBP/EUR rendering and automatic amount-in-words.
9. Keep totals and signature blocks together when they reasonably fit; allow safe continuation for unusually long notes/content.
10. Route Classic Ledger PDF export to its own renderer while Octalve PDF continues to use the frozen Octalve renderer.
11. Test short and long business/customer names, long addresses, all currencies, large monetary values, long descriptions, normal/many rows, true multipage invoices, page-boundary totals and signatures.
12. Run all existing Octalve regressions plus Classic Ledger Phase 2/3 qualification and prove frozen Octalve visual hashes remain unchanged.
13. Update manifests/tests/verification and create one complete Phase 3 checkpoint ZIP with SHA-256.
14. Store the complete Phase 3 checkpoint in the Library and provide the exact Phase 4 Classic Receipt continuation prompt.
