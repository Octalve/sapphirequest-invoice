# Phase 2 Reference Research

Phase 2 was implemented from the Sapphire Quest Phase 1 checkpoint and official/upstream documentation. No third-party invoice application source code was copied.

Relevant implementation references include:

- html2canvas configuration documentation: https://html2canvas.hertzen.com/configuration
  - confirms explicit `scale`, `backgroundColor`, `useCORS`, `windowWidth`, scroll offsets and related capture controls.
- html2canvas supported CSS documentation: https://html2canvas.hertzen.com/features/
  - used to avoid depending on unsupported rendering effects for critical document structure.
- jsPDF 4.2.1 documentation: https://parallax.github.io/jsPDF/
- jsPDF `addImage` documentation: https://parallax.github.io/jsPDF/docs/module-addImage.html
  - confirms JPEG image support and `FAST`/`MEDIUM`/`SLOW` image compression modes.
- Phase 1 Next.js/Tailwind/package references retained from the original checkpoint.

Design/pagination principles previously reviewed from Zoho Invoice informed the product requirements (paper size, margins and document-first layout), but Zoho source code was not used or copied.
