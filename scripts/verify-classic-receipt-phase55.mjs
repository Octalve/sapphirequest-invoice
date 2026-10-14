import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "public/branding/classic-receipt/receipt-header.png",
  "src/features/invoice/templates/classic-receipt/lib/receipt-header-asset.ts",
  "src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-export.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx",
  "tests/classic-receipt-phase55.test.mjs",
  "scripts/run-classic-receipt-phase55-tests.mjs",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Classic Receipt Phase 5.5 required files missing:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const asset = read("src/features/invoice/templates/classic-receipt/lib/receipt-header-asset.ts");
const browser = read("src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx");
const css = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
const pdfExport = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-export.tsx");
const pdfDoc = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx");
const pdfHeader = read("src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx");
const pdfStyles = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-styles.ts");

const checks = [
  [packageJson.scripts?.["verify:classic-receipt:phase5.5"], "Phase 5.5 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:classic-receipt:phase5.5"), "full qualification includes receipt Phase 5.5"],
  [asset.includes('/branding/classic-receipt/receipt-header.png'), "stable header asset path is registered"],
  [browser.includes("headerImageFailed") && browser.includes("RECEIPT_HEADER_IMAGE_PATH"), "browser header is image-first with fallback"],
  [browser.includes("styles.brandPanel") && browser.includes("styles.logoRail"), "coded editable fallback header remains available"],
  [css.includes(".brandImagePanel") && css.includes("object-fit: cover"), "browser header image fills the approved slot without stretching"],
  [pdfExport.includes("loadReceiptHeaderDataUrl") && pdfExport.includes("headerImageSrc"), "PDF export loads the shared header asset"],
  [pdfDoc.includes("headerImageSrc={headerImageSrc}"), "PDF document forwards the header image"],
  [pdfHeader.includes("if (headerImageSrc)") && pdfHeader.includes("receiptPdfStyles.brandHeaderImagePanel"), "PDF header prefers image and preserves coded fallback"],
  [pdfStyles.includes('objectFit: "cover"'), "PDF header image uses matching cover geometry"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Classic Receipt Phase 5.5 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

const freeze = JSON.parse(read("docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json"));
const expected = Object.fromEntries(
  Object.entries(freeze.files ?? {}).map(([key, value]) => [key.replaceAll("\\", "/"), value]),
);
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
const sha256 = (relative) =>
  createHash("sha256").update(readFileSync(resolve(root, relative))).digest("hex").toUpperCase();
const drift = octalveFiles.filter(
  (relative) => sha256(relative) !== String(expected[relative] ?? "").toUpperCase(),
);
if (drift.length) {
  console.error("Frozen Octalve visual regression detected:\n" + drift.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log("Classic Receipt Phase 5.5 image-header verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
