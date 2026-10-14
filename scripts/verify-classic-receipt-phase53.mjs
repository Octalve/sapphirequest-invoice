import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/templates/classic-receipt/components/receipt-signature-slot.tsx",
  "src/features/invoice/templates/classic-receipt/lib/signature-image.ts",
  "src/features/invoice/templates/classic-receipt/components/receipt-signature-footer.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-signature-footer.tsx",
  "tests/classic-receipt-phase53.test.mjs",
  "scripts/run-classic-receipt-phase53-tests.mjs",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error(
    "Classic Receipt Phase 5.3 required files missing:\n" +
      missing.map((x) => `- ${x}`).join("\n"),
  );
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const types = read("src/features/invoice/templates/classic-receipt/types.ts");
const hook = read("src/features/invoice/templates/classic-receipt/use-classic-receipt.ts");
const renderer = read("src/features/invoice/templates/classic-receipt/classic-receipt-renderer.tsx");
const footer = read("src/features/invoice/templates/classic-receipt/components/receipt-signature-footer.tsx");
const slot = read("src/features/invoice/templates/classic-receipt/components/receipt-signature-slot.tsx");
const signatureImage = read("src/features/invoice/templates/classic-receipt/lib/signature-image.ts");
const presentation = read("src/features/invoice/templates/classic-receipt/lib/receipt-presentation.ts");
const pdf = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx");
const pdfFooter = read("src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-signature-footer.tsx");
const profile = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts");
const css = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
const exportAdapter = read("src/features/invoice/lib/export-adapter.ts");
const gallery = read("src/features/invoice/template-gallery/template-gallery.tsx");

const checks = [
  [packageJson.scripts?.["verify:classic-receipt:phase5.3"], "Phase 5.3 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:classic-receipt:phase5.3"), "full qualification includes receipt Phase 5.3"],
  [types.includes("companySignatureDataUrl: string") && types.includes("customerSignatureDataUrl: string"), "receipt model owns independent company/customer signature data"],
  [hook.includes('companySignatureDataUrl: ""') && hook.includes('customerSignatureDataUrl: ""'), "new receipt drafts initialize optional signatures safely"],
  [hook.includes("companySignatureDataUrl: current.companySignatureDataUrl") && !hook.includes("customerSignatureDataUrl: current.customerSignatureDataUrl"), "new receipts preserve company signature but reset customer signature"],
  [footer.includes("ReceiptSignatureSlot") && footer.includes("companySignatureDataUrl") && footer.includes("customerSignatureDataUrl"), "browser footer composes two independent signature slots"],
  [slot.includes("optimizeReceiptSignatureImage") && slot.includes('type="file"') && slot.includes("Remove"), "signature slot supports upload/replace/remove"],
  [signatureImage.includes('image/svg+xml') === false && signatureImage.includes("image/png") && signatureImage.includes("image/jpeg") && signatureImage.includes("image/webp"), "signature upload policy excludes SVG and accepts PNG/JPEG/WebP"],
  [signatureImage.includes("MAX_OUTPUT_WIDTH = 700") && signatureImage.includes("MAX_OUTPUT_HEIGHT = 260") && signatureImage.includes("findInkBounds"), "signature images are cropped/resized before persistence"],
  [presentation.includes("companySignatureDataUrl: draft.companySignatureDataUrl") && presentation.includes("customerSignatureDataUrl: draft.customerSignatureDataUrl"), "signature data flows into receipt presentation"],
  [pdf.includes("companySignatureDataUrl={presentation.companySignatureDataUrl}") && pdf.includes("customerSignatureDataUrl={presentation.customerSignatureDataUrl}"), "native PDF receives both signatures"],
  [pdfFooter.includes("<Image") && pdfFooter.includes("signatureImageSlot") && pdfFooter.includes("Customer's Signature"), "native PDF renders optional signature images above signing lines"],
  [profile.includes("signatureImageWidth") && profile.includes("signatureImageHeight"), "native PDF profile reserves bounded signature geometry"],
  [css.includes(".signatureImageSlot") && css.includes(".signatureControls") && css.includes('body.sq-exporting'), "browser receipt reserves signature slots and hides controls during export"],
  [exportAdapter.includes('data-export-ignore="true"') && exportAdapter.includes("node.remove()"), "PNG clone removes non-print signature controls"],
  [renderer.includes("signatureUploadsEnabled") && gallery.includes("signatureUploadsEnabled={false}"), "signature upload controls are editor-only and hidden in gallery previews"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error(
    "Classic Receipt Phase 5.3 structural verification failed:\n" +
      failed.map(([, label]) => `- ${label}`).join("\n"),
  );
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
  console.error(
    "Frozen Octalve visual regression detected:\n" + drift.map((x) => `- ${x}`).join("\n"),
  );
  process.exit(1);
}

console.log("Classic Receipt Phase 5.3 signature verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
