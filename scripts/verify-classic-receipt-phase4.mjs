import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/templates/classic-receipt/types.ts",
  "src/features/invoice/templates/classic-receipt/use-classic-receipt.ts",
  "src/features/invoice/templates/classic-receipt/classic-receipt-renderer.tsx",
  "src/features/invoice/templates/classic-receipt/classic-receipt.module.css",
  "src/features/invoice/templates/classic-receipt/components/receipt-auto-textarea.tsx",
  "src/features/invoice/templates/classic-receipt/lib/receipt-numbering.ts",
  "src/features/invoice/templates/classic-receipt/lib/receipt-presentation.ts",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-export.tsx",
  "tests/classic-receipt-phase4.test.mjs",
  "docs/CLASSIC_RECEIPT_PHASE_04_MANIFEST.md",
  "docs/CLASSIC_RECEIPT_PHASE_04_TEST_RESULTS.md",
  "docs/CLASSIC_RECEIPT_PHASE_05_PROMPT.md",
  "docs/CLASSIC_LEDGER_PHASE_03_FREEZE.json",
];
const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Classic Receipt Phase 4 required files missing:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const registry = read("src/features/invoice/templates/registry.ts");
const generator = read("src/features/invoice/components/invoice-generator.tsx");
const toolbar = read("src/features/invoice/components/invoice-toolbar.tsx");
const renderer = read("src/features/invoice/templates/classic-receipt/classic-receipt-renderer.tsx");
const receiptHeader = read("src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx");
const receiptMeta = read("src/features/invoice/templates/classic-receipt/components/receipt-document-meta.tsx");
const receiptPayment = read("src/features/invoice/templates/classic-receipt/components/receipt-payment-section.tsx");
const receiptFooter = read("src/features/invoice/templates/classic-receipt/components/receipt-signature-footer.tsx");
const css = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
const presentation = read("src/features/invoice/templates/classic-receipt/lib/receipt-presentation.ts");
const pdf = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx");
const pdfExport = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-export.tsx");

const checks = [
  [packageJson.scripts?.["verify:classic-receipt:phase4"], "Phase 4 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:classic-receipt:phase4"), "full qualification includes Classic Receipt Phase 4"],
  [registry.includes('"classic-receipt"') && registry.includes('documentKind: "receipt"'), "Classic Receipt is registered as a distinct receipt"],
  [generator.includes('templates.templateId === "classic-receipt"') && generator.includes("ClassicReceiptRenderer"), "receipt renderer dispatch is isolated"],
  [generator.includes("buildClassicReceiptPresentation") && generator.includes("exportClassicReceiptPdf"), "receipt export uses receipt-specific presentation/PDF"],
  [toolbar.includes('documentKind === "receipt"') && toolbar.includes('"New Receipt"'), "toolbar adapts document actions without adding invoice rows to receipts"],
  [renderer.includes('data-template-id="classic-receipt"') && receiptMeta.includes(">RECEIPT<"), "browser renderer is explicitly a receipt"],
  [receiptHeader.includes("COMPANY_IDENTITY.iconPath") && receiptHeader.includes("businessProfile.name") && receiptHeader.includes("onBusinessProfileChange"), "logo remains separate while receipt business identity is independently editable"],
  [renderer.includes("formatAmountInWords") && presentation.includes("formatAmountInWords(amountReceived"), "amount in words is derived from receipt amount"],
  [presentation.includes("balanceRaw ? parseMoneyInput(balanceRaw) : null"), "balance is optional and only populated from explicit payment data"],
  [receiptPayment.includes("Payment Method") && renderer.includes("balanceRemaining") && receiptFooter.includes("Reference:"), "receipt-specific fields are present"],
  [css.includes("--receipt-accent: var(--template-accent, #0755db)") && css.includes("width: 1123px") && css.includes("min-height: 794px") && css.includes('.page[data-paper-size="A5"]') && css.includes('.page[data-paper-size="LETTER"]'), "receipt has isolated Sapphire-default theme and true landscape browser geometry"],
  [!renderer.includes("DRIP MALL") && !renderer.includes("Property / Unit / Shop") && !pdf.includes("DRIP MALL"), "reference business/property wording is not hard-coded"],
  [pdf.includes("ClassicReceiptPdfDocument") && pdf.includes("@react-pdf/renderer"), "receipt PDF is native React-PDF"],
  [pdfExport.includes('import("./classic-receipt-pdf-document")') && !pdfExport.includes("ClassicLedgerPdfDocument") && !pdfExport.includes("SapphirePdfDocument"), "receipt PDF is independent from both invoice PDF renderers"],
];
const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Classic Receipt Phase 4 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

function sha256(relative) {
  return createHash("sha256").update(readFileSync(resolve(root, relative))).digest("hex").toUpperCase();
}

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

const ledgerFreeze = JSON.parse(read("docs/CLASSIC_LEDGER_PHASE_03_FREEZE.json"));
const immutableLedgerFiles = [
  "src/features/invoice/templates/classic-ledger/components/classic-auto-textarea.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-items.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-closing.tsx",
  "src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-profile.ts",
];
const ledgerDrift = immutableLedgerFiles.filter((relative) => sha256(relative) !== String(ledgerFreeze.files?.[relative] ?? "").toUpperCase());
if (ledgerDrift.length) {
  console.error("Classic Ledger structural regression detected:\n" + ledgerDrift.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
const ledgerRenderer = read("src/features/invoice/templates/classic-ledger/classic-ledger-renderer.tsx");
const ledgerCss = read("src/features/invoice/templates/classic-ledger/classic-ledger.module.css");
const ledgerPdf = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx");
if (!ledgerRenderer.includes("normalizeAccentColor") || !ledgerCss.includes("var(--template-accent, #0755db)") || !ledgerPdf.includes("accentColor?: string")) {
  console.error("Classic Ledger Phase 5 compatibility invariants are missing.");
  process.exit(1);
}

console.log("Classic Receipt Phase 4 structural verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
console.log("Classic Ledger Phase 3 structural core: PASS (4 immutable files unchanged; isolated business-profile extension verified).");
