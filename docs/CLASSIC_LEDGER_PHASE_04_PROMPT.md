# Phase 4 — Classic Receipt

Continue from the exact verified Classic Ledger Phase 3 checkpoint stored in the Library.

Execute **Phase 4 — Classic Receipt** with precision and regression protection.

Preserve the frozen Octalve Template and the approved Classic Ledger browser/native-PDF implementation unchanged.

Use the previously supplied formal receipt reference only as visual inspiration. Build a generic receipt template suitable for different businesses; do not hard-code Drip Mall or real-estate-specific identity/fields.

Requirements:

1. Keep invoice and receipt semantics separate.
2. Add `classic-receipt` as its own template/document renderer rather than conditionally mutating Classic Ledger.
3. Reuse shared business identity, customer/currency/security/storage infrastructure where semantically correct.
4. Implement receipt-specific fields deliberately: received-from, payment purpose, amount received, automatic amount in words, payment method, reference, balance only when supported by real payment data, and signature areas.
5. Give Classic Receipt independent browser components, design tokens and native React-PDF renderer.
6. Keep business logo and business-name text separate and data-driven.
7. Keep Sapphire blue as the default accent; do not build the user color picker yet.
8. A4 is the visual authority; A5 and Letter must be deliberate compositions, never scaled screenshots.
9. Preserve native selectable/searchable PDF text; do not introduce jsPDF or screenshot-PDF.
10. Test long customer/business text, all currencies, large amounts, payment methods, multi-page behavior, optional fields and signature placement.
11. Run all Octalve, Classic Ledger and new Classic Receipt regressions and prove frozen files remain unchanged.
12. Create a complete Phase 4 checkpoint ZIP, SHA-256 manifest/test results, store it in the Library, and provide the exact Phase 5 continuation prompt.
