import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-profile.ts",
  "src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx",
  "src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export.tsx",
  "tests/classic-ledger-phase3.test.mjs",
  "scripts/run-classic-ledger-phase3-tests.mjs",
  "docs/CLASSIC_LEDGER_PHASE_03_MANIFEST.md",
  "docs/CLASSIC_LEDGER_PHASE_03_TEST_RESULTS.md",
  "docs/CLASSIC_LEDGER_PHASE_04_PROMPT.md",
  "docs/CLASSIC_LEDGER_PHASE_02_BROWSER_FREEZE.json",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Classic Ledger Phase 3 required files missing:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const registry = read("src/features/invoice/templates/registry.ts");
const adapter = read("src/features/invoice/lib/export-adapter.ts");
const pdf = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx");
const pdfExport = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export.tsx");
const pdfProfile = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-profile.ts");

const checks = [
  [packageJson.scripts?.["verify:classic-ledger:phase3"], "Phase 3 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:classic-ledger:phase3"), "full qualification includes Classic Ledger Phase 3"],
  [registry.includes('id: "classic-ledger"') && registry.includes('version: "0.3"') && registry.includes("pdfAvailable: true"), "Classic Ledger registry enables independent Phase 3 native PDF"],
  [adapter.includes('templateId === "octalve"') && adapter.includes('templateId === "classic-ledger"'), "export adapter dispatches explicitly by template"],
  [adapter.includes("exportClassicLedgerPdf") && adapter.includes("exportNativeInvoicePdf"), "Octalve and Classic Ledger use different native PDF export modules"],
  [pdfExport.includes('import("./classic-ledger-pdf-document")') && !pdfExport.includes("SapphirePdfDocument"), "Classic Ledger PDF exporter cannot reuse the Octalve PDF document"],
  [pdf.includes("ClassicLedgerPdfDocument") && pdf.includes("@react-pdf/renderer"), "Classic Ledger is composed from native React-PDF primitives"],
  [pdf.includes("CLASSIC_LEDGER_PDF_PROFILES") && pdfProfile.includes("CSS_PX_TO_PDF_PT = 72 / 96"), "browser-to-PDF geometry is explicitly derived"],
  [pdf.includes("formatAmountInWords") && pdf.includes("formatPdfNumber"), "PDF reuses shared amount-in-words and number formatting"],
  [pdf.includes("wrap={allowWrap}") && pdf.includes("minPresenceAhead={profile.tableRowMinHeight}"), "table pagination has row-level and header presence controls"],
  [pdf.includes("fixed") && pdf.includes("Continued") && pdf.includes("totalPages"), "multi-page output has continuation and page-number context"],
  [pdf.includes("presentation.paperSize") && pdfProfile.includes('code: "A5"') && pdfProfile.includes('buildWideProfile("LETTER")'), "A4/A5/Letter use deliberate physical profiles"],
  [pdf.includes("PdfCurrencySymbol") && pdf.includes('currency === "NGN"'), "Naira symbol remains a native composed PDF glyph"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Classic Ledger Phase 3 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

function sha256(relative) {
  return createHash("sha256").update(readFileSync(resolve(root, relative))).digest("hex").toUpperCase();
}

// Octalve visual/PDF authority remains immutable.
const octalveFreeze = JSON.parse(read("docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json"));
const octalveExpected = Object.fromEntries(Object.entries(octalveFreeze.files ?? {}).map(([key, value]) => [key.replaceAll("\\", "/"), value]));
const octalveFiles = [
  "src/app/globals.css",
  "src/features/invoice/renderers/sapphire-invoice-renderer.tsx",
  "src/features/invoice/renderers/html/invoice-header.tsx",
  "src/features/invoice/renderers/html/invoice-parties.tsx",
  "src/features/invoice/renderers/html/invoice-items-table.tsx",
  "src/features/invoice/renderers/html/invoice-closing.tsx",
  "src/features/invoice/renderers/html/invoice-footer.tsx",
  "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx",
  "src/features/invoice/presentation/document-profile.ts",
];

const octalveDrift = octalveFiles.filter((relative) => sha256(relative) !== String(octalveExpected[relative] ?? "").toUpperCase());
if (octalveDrift.length) {
  console.error("Frozen Octalve visual regression detected:\n" + octalveDrift.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

// Later phases may add scoped theme plumbing, but the approved Phase 2 structure must remain intact.
const browserFreeze = JSON.parse(read("docs/CLASSIC_LEDGER_PHASE_02_BROWSER_FREEZE.json"));
const immutableBrowserFiles = [
  "src/features/invoice/templates/classic-ledger/components/classic-auto-textarea.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-items.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-closing.tsx",
];
const immutableBrowserDrift = immutableBrowserFiles.filter((relative) => sha256(relative) !== String(browserFreeze.files?.[relative] ?? "").toUpperCase());
if (immutableBrowserDrift.length) {
  console.error("Classic Ledger approved component regression detected:\n" + immutableBrowserDrift.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const browserRenderer = read("src/features/invoice/templates/classic-ledger/classic-ledger-renderer.tsx");
const browserCss = read("src/features/invoice/templates/classic-ledger/classic-ledger.module.css");
if (!browserRenderer.includes('data-template-id="classic-ledger"') ||
    !browserRenderer.includes("normalizeAccentColor") ||
    !browserCss.includes("--classic-accent: var(--template-accent, #0755db)") ||
    !browserCss.includes("--classic-accent-dark: var(--template-accent-dark, #043996)")) {
  console.error("Classic Ledger browser parity/theme invariants are missing.");
  process.exit(1);
}

console.log("Classic Ledger Phase 3 structural verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
const ledgerHeader = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx");
if (!ledgerHeader.includes("businessProfile.name") || !ledgerHeader.includes("onBusinessProfileChange")) {
  console.error("Classic Ledger independent business-profile editor is missing.");
  process.exit(1);
}

console.log("Classic Ledger Phase 2 structural core: PASS (3 immutable components unchanged; isolated business-profile extension verified).");
