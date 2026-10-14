# Phase 5 — Template Gallery, Personalization & Release

Continue from the exact verified Classic Receipt Phase 4 checkpoint stored in the Library.

Execute **Phase 5 — Multi-Template Gallery, Selection, Personalization and Production Qualification**.

After authentication, route the user to a professional template gallery before the document editor.

Provide three isolated choices:

- Octalve Template
- Classic Ledger
- Classic Receipt

Requirements:

1. Each template card must use a genuine template preview, not an unrelated static mockup.
2. Provide Preview and Use Template actions.
3. Persist template selection deliberately. Existing invoice drafts with no template identifier must default safely to Octalve Template.
4. Receipt state remains semantically separate from invoice drafts.
5. Browser, PNG and native PDF export must always use the selected template/document type consistently.
6. Add controlled business accent-color customization where appropriate, with Sapphire blue as the default.
7. Do not mutate the frozen Octalve visual contract through color customization unless explicitly enabled for that template.
8. Preserve authentication and auto-lock behavior; direct template/editor routes must remain protected.
9. Keep template-specific CSS, browser renderer and native PDF renderer isolated.
10. Run complete TypeScript, lint, production build, security, migration, template-isolation, financial, browser, PNG, PDF, A4/A5/Letter and regression qualification.
11. Prove frozen Octalve, Classic Ledger and Classic Receipt authority files remain unchanged where required.
12. Create the final production-ready checkpoint ZIP, SHA-256 manifest, Library checkpoint, and deployment/run documentation.
