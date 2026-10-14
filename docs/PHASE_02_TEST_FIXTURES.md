# Phase 2 Document/Pagination Fixtures

These fixtures define the minimum regression cases for the standalone Sapphire paper-aware renderer.

| Fixture | Purpose | Expected result |
| --- | --- | --- |
| A4 short invoice | ordinary client + a few rows | one A4 page |
| A5 short invoice | same class of content on compact paper | one readable A5 page |
| Long descriptions | rows with taller wrapped content | break only at safe row/section boundaries where possible |
| Many rows | genuine overflow | multiple pages with forward progress and no zero-height page |
| Totals near boundary | closing block begins close to page edge | closing/totals block moves together to the next page |
| Pathological tall item | one element taller than usable page | controlled hard-break fallback rather than infinite loop |
| Exact capacity | content ends on a page boundary | no blank trailing page |

The executable fixture assertions live in `tests/phase2-pagination.test.mjs` and execute against the compiled production `pagination.ts` implementation via `scripts/run-phase2-tests.mjs`.

Browser/PDF visual verification should additionally inspect:

- A4 and A5 visual proportions;
- footer placement;
- continuation header alignment;
- currency symbols in the first page invoice table;
- currency code in continuation table context;
- row boundaries around page cuts;
- PDF byte size for a realistic one-page invoice;
- PDF page size metadata in a PDF viewer/inspector.
