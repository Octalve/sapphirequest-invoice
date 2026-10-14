import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/lib/numbering.ts",
  "src/features/invoice/hooks/use-invoice-generator.ts",
  "src/features/invoice/lib/export-adapter.ts",
  "src/features/invoice/renderers/html/invoice-header.tsx",
  "src/features/invoice/renderers/html/invoice-items-table.tsx",
  "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx",
  "src/features/invoice/presentation/document-profile.ts",
  "src/app/globals.css",
  "tests/phase26-final-refinement.test.mjs",
  "docs/PHASE_02_6_MANIFEST.md",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Missing required Phase 2.6 files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const numbering = readFileSync(resolve(root, "src/features/invoice/lib/numbering.ts"), "utf8");
const hook = readFileSync(resolve(root, "src/features/invoice/hooks/use-invoice-generator.ts"), "utf8");
const header = readFileSync(resolve(root, "src/features/invoice/renderers/html/invoice-header.tsx"), "utf8");
const items = readFileSync(resolve(root, "src/features/invoice/renderers/html/invoice-items-table.tsx"), "utf8");
const renderer = readFileSync(resolve(root, "src/features/invoice/renderers/sapphire-invoice-renderer.tsx"), "utf8");
const exportSource = readFileSync(resolve(root, "src/features/invoice/lib/export-adapter.ts"), "utf8");
const pdf = readFileSync(resolve(root, "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx"), "utf8");
const profiles = readFileSync(resolve(root, "src/features/invoice/presentation/document-profile.ts"), "utf8");
const css = readFileSync(resolve(root, "src/app/globals.css"), "utf8");

const checks = [
  [packageJson.version === "0.2.6", "package version is 0.2.6"],
  [packageJson.scripts?.["verify:phase2.6"], "Phase 2.6 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:phase2.6"), "full qualification includes Phase 2.6"],
  [numbering.includes("sanitizeDocumentSequenceInput") && numbering.includes("normalizeManualDocumentSequence"), "sequence-only numbering helpers exist"],
  [hook.includes("updateInvoiceSequence") && hook.includes("ensureCounterAtLeast(sequence)"), "manual sequence raises the counter floor"],
  [header.includes("InvoiceSequenceEditor") && header.includes("COMPANY_DOCUMENT_PREFIX") && header.includes("DOCUMENT_TYPE_CODE"), "header locks prefix/suffix around editable sequence"],
  [header.includes('aria-label="Invoice sequence number"') && header.includes('maxLength={5}'), "only five numeric sequence digits are editable"],
  [renderer.includes('data-invoice-renderer="sapphire-v6"'), "Phase 2.6 renderer marker is active"],
  [items.includes("Item Name") && items.includes("Quantity") && items.includes("Unit Price") && items.includes("Discount") && items.includes("Amount"), "five-column table remains active"],
  [items.indexOf("row.description") > items.indexOf("row.serviceName"), "description remains nested below the item title"],
  [css.includes("--sq-page-padding: 34px") && css.includes("min-height: 56px"), "approved browser A4 geometry remains unchanged"],
  [css.includes("overflow-wrap: normal") && css.includes("word-break: normal") && css.includes("text-wrap: balance"), "company-name wrapping remains protected"],
  [css.includes(".sq-v4-items-header span:nth-child(3)") && css.includes(".sq-v4-items-header span:nth-child(5)"), "Unit Price and Amount headers remain left aligned"],
  [css.includes(".sq-v4-line-amount") && css.includes("text-align: left"), "line amount remains left aligned"],
  [css.includes("grid-template-columns: minmax(0, 1fr) 150px") && css.includes(".sq-new-summary-row strong"), "browser totals retain stable left-aligned value column"],
  [profiles.includes("CSS_PX_TO_PT = 72 / 96") && profiles.includes("pxToPt(56)") && profiles.includes("pxToPt(124)"), "native PDF profile derives geometry from approved browser pixels"],
  [profiles.includes('surface: "#F5F8FC"'), "native PDF card surface matches browser document surface"],
  [profiles.includes('primary: "#021A34"'), "Octalve attribution uses approved Deep Navy footer treatment"],
  [pdf.includes("columnGap: ui.tableColumnGap") && pdf.includes("width: ui.unitColumnWidth") && pdf.includes("width: ui.amountColumnWidth"), "native PDF table uses browser-derived fixed columns and gaps"],
  [pdf.includes("minHeight: ui.itemTitleMinHeight") && pdf.includes("minHeight: ui.itemDescriptionMinHeight"), "native PDF preserves browser item title/description vertical rhythm"],
  [pdf.includes("minHeight: ui.partyMinHeight") && pdf.includes("iconSize={ui.partyIconSize}") && pdf.includes("fontSize={ui.partyTextSize}"), "native PDF party card follows browser dimensions"],
  [pdf.includes("ui.closingHeadingSize") && pdf.includes("ui.summaryTotalValueSize"), "native PDF closing section follows browser typography scale"],
  [pdf.includes('align="left"') && pdf.includes("styles.summaryValue"), "native PDF monetary and summary values remain left aligned"],
  [pdf.includes("hyphenationPenalty={Infinity}"), "native PDF protects approved brand/item word breaking"],
  [exportSource.includes("cloneNode(true)") && exportSource.includes("getBoundingClientRect") && exportSource.includes("document.fonts?.ready"), "PNG capture remains isolated and unchanged"],
  [(exportSource.match(/await nextPaint\(\);/g) ?? []).length >= 2, "PNG capture still waits for layout stabilization"],
  [exportSource.includes('import("html2canvas-pro")') && !exportSource.includes('import("jspdf")'), "PNG uses html2canvas-pro and PDF does not regress to jsPDF"],
  [profiles.includes('code: "A5"') && !css.includes("transform: scale("), "A5 remains a purpose-built paper composition"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Phase 2.6 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

console.log("Phase 2.6 structural verification passed.");
