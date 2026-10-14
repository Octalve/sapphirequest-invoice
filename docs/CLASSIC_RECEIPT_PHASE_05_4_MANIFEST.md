# Classic Receipt Phase 5.4 — Balanced Brand Header

## Scope

Header-only refinement for Classic Receipt. The A5 header keeps the approved 101px vertical footprint while changing its internal composition to a 20% logo rail and 80% editable identity rail.

## Browser

- Logo occupies its own 20% rail and scales within that domain.
- Business name remains editable and is constrained to the 80% identity rail.
- Neue Plak Extended Bold is declared through a licensed local TTF/WOFF path with safe fallbacks.
- Phone, email, website and address remain editable.
- Browser contact fields use Lucide Phone, Mail, Globe2 and MapPin icons with intentional colors.
- Company name uses regular / compact / tight density classes for longer legal names.

## Native PDF

- Mirrors the same 20/80 composition.
- Uses a PDF-specific vector contact-icon component with matching colors.
- Registers the licensed Neue Plak asset only when the installer confirms a supported user-provided TTF/WOFF is available.
- Falls back to Helvetica-Bold if the font asset is not available; no unlicensed font file is bundled.

## Preserved

- Classic Receipt A5 body, signatures, amount fields and footer.
- Template independence introduced in Phase 5.1.
- Signature uploads introduced in Phase 5.3.
- Octalve frozen visual/PDF authority.
- Classic Ledger behavior.

## Dependency note

`lucide-react` was already pinned in the project at 1.55.0, so no lockfile change was required.
