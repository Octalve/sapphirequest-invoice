import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/types.ts",
  "src/features/invoice/constants.ts",
  "src/features/invoice/lib/numbering.ts",
  "src/features/invoice/lib/calculations.ts",
  "src/features/invoice/lib/export-adapter.ts",
  "src/features/invoice/renderers/html/invoice-header.tsx",
  "src/features/invoice/renderers/html/invoice-parties.tsx",
  "src/features/invoice/renderers/html/invoice-items-table.tsx",
  "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx",
  "tests/phase25-refinement.test.mjs",
  "docs/PHASE_02_5_MANIFEST.md",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Missing required Phase 2.5 files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const constants = readFileSync(resolve(root, "src/features/invoice/constants.ts"), "utf8");
const types = readFileSync(resolve(root, "src/features/invoice/types.ts"), "utf8");
const numbering = readFileSync(resolve(root, "src/features/invoice/lib/numbering.ts"), "utf8");
const exportSource = readFileSync(resolve(root, "src/features/invoice/lib/export-adapter.ts"), "utf8");
const header = readFileSync(resolve(root, "src/features/invoice/renderers/html/invoice-header.tsx"), "utf8");
const parties = readFileSync(resolve(root, "src/features/invoice/renderers/html/invoice-parties.tsx"), "utf8");
const items = readFileSync(resolve(root, "src/features/invoice/renderers/html/invoice-items-table.tsx"), "utf8");
const pdf = readFileSync(resolve(root, "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx"), "utf8");
const renderer = readFileSync(resolve(root, "src/features/invoice/renderers/sapphire-invoice-renderer.tsx"), "utf8");
const css = readFileSync(resolve(root, "src/app/globals.css"), "utf8");

const checks = [
  [Number(packageJson.version.split(".").at(-1)) >= 5, "package is Phase 2.5 or later"],
  [constants.includes('COMPANY_DOCUMENT_PREFIX = "SQ"'), "Sapphire company document prefix is SQ"],
  [constants.includes('DOCUMENT_TYPE_CODE: DocumentTypeCode = "INV"'), "document type suffix is INV"],
  [constants.includes('OCTALVE_PRIMARY = "#0064E0"'), "canonical Octalve blue is recorded"],
  [numbering.includes("SEQUENCE_WIDTH = 5"), "document sequence uses five digits"],
  [types.includes("quantity: string"), "line items contain quantity"],
  [types.includes("unitPrice: string"), "line items contain unit price"],
  [types.includes("discount: string"), "line items contain line discount"],
  [!types.includes("total: string"), "editable line total has been removed"],
  [header.includes("SapphireQuestIcon") || header.includes("COMPANY_IDENTITY.iconPath"), "header uses the icon-only Sapphire mark"],
  [header.includes("Date Issued") && header.includes("Due Date") && header.includes("TIN No.") && header.includes("RC No."), "header contains required metadata"],
  [parties.includes("BriefcaseBusiness"), "sender role uses a role icon"],
  [parties.includes("Mail") && parties.includes("Phone") && parties.includes("MapPin"), "party contact details use icons"],
  [items.includes("Item Name") && items.includes("Quantity") && items.includes("Unit Price") && items.includes("Discount") && items.includes("Amount"), "five-column item table is active"],
  [items.indexOf("row.description") > items.indexOf("row.serviceName"), "description remains under item name"],
  [items.includes("sq-locked-currency"), "currency symbol is a locked display element"],
  [items.includes("calculateLineAmount(row)"), "amount is computed rather than edited"],
  [exportSource.includes("cloneNode(true)"), "PNG export captures an isolated static clone"],
  [exportSource.includes("sq-png-export-stage"), "PNG export uses an off-screen export stage"],
  [renderer.includes("data-invoice-renderer=\"sapphire-v6\"") || renderer.includes("data-invoice-renderer=\"sapphire-v4\""), "Sapphire renderer is active"],
  [pdf.includes("PdfCurrencySymbol"), "native PDF renders currency as a locked symbol component"],
  [pdf.includes("Item Name") && pdf.includes("Unit Price") && pdf.includes("Discount"), "native PDF uses the five-column table"],
  [pdf.includes("OCTALVE_THEME.primary"), "native PDF footer uses Octalve brand color"],
  [css.includes("--octalve-blue:"), "HTML footer retains a dedicated Octalve brand token"],
  [css.includes(".sq-v4-item-row") && css.includes('data-paper-size="A5"'), "A4/A5 row structure remains present"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Phase 2.5 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

console.log("Phase 2.5 structural verification passed.");
