# Sapphire Invoice Generator — Multi-Template Release Guide

## User flow

1. Open the application.
2. Enter the existing secure PIN.
3. Choose Octalve Template, Classic Ledger or Classic Receipt from the template gallery.
4. Use Preview to inspect the real renderer or Use Template to enter the editor.
5. For Classic Ledger/Receipt, optionally choose a brand accent color from the toolbar; Reset restores Sapphire blue.
6. Complete the document and export PNG or native PDF.
7. Use Templates in the toolbar to return to the gallery without losing document drafts.

## Persistence

- Invoice draft and calculations retain the existing storage model.
- Classic Receipt retains its independent receipt draft and numbering counter.
- Template selection is stored separately and invalid/missing legacy values migrate to Octalve.
- Accent customization is stored independently per customizable template.

## Release qualification on Windows

From the project root:

```powershell
pnpm install --frozen-lockfile
pnpm qualify
```

Or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\qualify-multi-template-phase5-windows.ps1
```

Do not deploy when any gate fails.

## Deployment

After qualification passes, commit the exact checkpoint, push to the intended GitHub repository and deploy that commit to Vercel. Do not deploy from a working tree containing unreviewed template changes.
