# Prompt for Phase 2

Continue from the exact verified `invoice-generator` Phase 1 checkpoint. Do not recreate the project and do not collapse the Octalve feature/component structure.

Execute **Sapphire Invoice Generator Phase 2 — Paper-Aware Rendering & Export Refinement** with precision and verification.

Use the Phase 1 repository as the only implementation base, especially:

- `docs/PHASE_01_MANIFEST.md`
- `docs/ARCHITECTURE.md`
- `src/features/invoice/renderers/sapphire-invoice-renderer.tsx`
- `src/features/invoice/lib/export-adapter.ts`
- the preserved `docs/reference/sapphire-legacy-index.html`

Requirements:

1. Preserve the approved Sapphire Quest invoice visual identity and all Phase 1 functionality.
2. Keep invoice appearance isolated from state/calculation/numbering logic.
3. Add paper-size selection to the toolbar: A4, A5 and Letter.
4. Treat A5 as a deliberate responsive document composition, not simply a scaled A4 screenshot.
5. Add explicit safe print margins and internal `compact`/`normal` document density behavior.
6. Eliminate unnecessary second pages. A normal invoice that reasonably fits must remain on one page.
7. Reduce ordinary PDF output dramatically from the legacy ~35 MB behavior; target approximately 500 KB–2 MB for a typical one-page invoice without visibly poor quality.
8. Replace or substantially improve the legacy full-resolution PNG-in-PDF path. Use the best reliable implementation for this standalone client-side tool, but keep the export implementation behind the adapter boundary.
9. Ensure genuine multi-page invoices paginate intentionally: avoid splitting service rows where possible, keep subtotal/discount/tax/total together, and provide sensible continuation context.
10. Fix the footer so it does not create accidental page overflow.
11. Make the browser/export preview reflect the selected physical paper proportion.
12. Preserve NGN/USD/GBP/EUR behaviour without FX conversion.
13. Preserve draft restore, monthly numbering, New Invoice modal, payment details, PIN lock, auto-lock and filenames.
14. Add/update tests and verification fixtures for at least: A4 short invoice, A5 short invoice, long descriptions, many rows, totals near a page boundary, genuine multi-page invoice and no blank trailing page.
15. Run lint, typecheck, production build and Phase 2 verification. Fix source-level issues found.
16. Update documentation/manifests and return one complete zipped project checkpoint.

Do not introduce Neon, Prisma, multi-user authentication or the commercial dashboard in this phase. This phase finishes and hardens the standalone Sapphire invoice generator only.
