# Sapphire Phase 2.6 — Windows Local Qualification

From the extracted project root:

```powershell
cd "C:\Users\Bi Creativity\invoice-generator"
node --version
pnpm --version
pnpm install
pnpm qualify
```

Or run the ASCII-safe bundled script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\qualify-phase26-windows.ps1
```

Expected environment:

- Node.js 20.9+ (the current qualified machine uses 24.11.1)
- pnpm 12.11.2

After automated qualification passes:

```powershell
pnpm dev
```

Open `http://localhost:3000`.

## Phase 2.6 visual qualification

Create an A4 invoice with exactly ten normal rows (one-line title + zero/one short description). Verify:

- the page no longer looks miniaturized;
- margins are slightly tighter than Phase 2.4 but more generous than Phase 2.5;
- the round Sapphire icon is centered;
- `Sapphire Quest Travel & Tours Ltd` wraps naturally without broken words or metadata overlap;
- invoice number appears as one identifier while only the middle five-digit sequence is editable;
- entering `144` produces `SQ-00144-INV`;
- prefix `SQ-` and suffix `-INV` cannot be edited;
- Invoice From sender name/email/phone/role remain editable with the role icon;
- customer name/email/phone/location remain editable with contact icons;
- table columns remain Item Name / Quantity / Unit Price / Discount / Amount;
- item description remains directly under item name;
- Unit Price is left aligned;
- line Amount is left aligned;
- Subtotal / Discount / Tax / Total monetary values are left aligned in one stable value column;
- ten normal A4 rows fit when descriptions are short, without unreadable typography;
- longer descriptions are allowed to paginate rather than being crushed.

## Currency

Verify NGN / USD / GBP / EUR. Symbols must remain locked/derived and change everywhere from the toolbar without FX conversion.

## PDF

Export A4, A5 and Letter:

- text is selectable;
- paper size is physically correct;
- company-name wrap matches the refined hierarchy;
- Unit Price, Amount and summary monetary values are left aligned;
- no clipped rows, blank trailing pages or unnecessary second page;
- totals stay together;
- continuation context/page numbering remain correct.

## PNG

Export A4 and A5 PNG and compare each side-by-side against the browser preview. Logo, brand name, metadata, party card, item rows, money columns, totals and footer should not visibly shift. The live document should not move during download.
