import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const required = [
  "src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx",
  "src/features/invoice/templates/classic-receipt/components/receipt-document-meta.tsx",
  "src/features/invoice/templates/classic-receipt/components/receipt-details-section.tsx",
  "src/features/invoice/templates/classic-receipt/components/receipt-payment-section.tsx",
  "src/features/invoice/templates/classic-receipt/components/receipt-signature-footer.tsx",
  "src/features/invoice/templates/classic-receipt/lib/receipt-layout.ts",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-document-meta.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-details.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-payment.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-signature-footer.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-styles.ts",
  "tests/classic-receipt-phase52.test.mjs",
  "scripts/run-classic-receipt-phase52-tests.mjs",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error(
    "Classic Receipt Phase 5.2 required files missing:\n" +
      missing.map((x) => `- ${x}`).join("\n"),
  );
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const renderer = read(
  "src/features/invoice/templates/classic-receipt/classic-receipt-renderer.tsx",
);
const css = read(
  "src/features/invoice/templates/classic-receipt/classic-receipt.module.css",
);
const useReceipt = read(
  "src/features/invoice/templates/classic-receipt/use-classic-receipt.ts",
);
const layout = read(
  "src/features/invoice/templates/classic-receipt/lib/receipt-layout.ts",
);
const generator = read("src/features/invoice/components/invoice-generator.tsx");
const header = read(
  "src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx",
);
const meta = read(
  "src/features/invoice/templates/classic-receipt/components/receipt-document-meta.tsx",
);
const details = read(
  "src/features/invoice/templates/classic-receipt/components/receipt-details-section.tsx",
);
const payment = read(
  "src/features/invoice/templates/classic-receipt/components/receipt-payment-section.tsx",
);
const footer = read(
  "src/features/invoice/templates/classic-receipt/components/receipt-signature-footer.tsx",
);
const pdf = read(
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx",
);
const profile = read(
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts",
);

const componentImports = [
  "ReceiptBrandHeader",
  "ReceiptDocumentMeta",
  "ReceiptDetailsSection",
  "ReceiptPaymentSection",
  "ReceiptSignatureFooter",
];

const pdfComponentImports = [
  "ReceiptPdfBrandHeader",
  "ReceiptPdfDocumentMeta",
  "ReceiptPdfDetails",
  "ReceiptPdfPayment",
  "ReceiptPdfSignatureFooter",
];

const checks = [
  [
    packageJson.scripts?.["verify:classic-receipt:phase5.2"],
    "Phase 5.2 verification script is registered",
  ],
  [
    packageJson.scripts?.qualify?.includes("verify:classic-receipt:phase5.2"),
    "full qualification includes receipt Phase 5.2",
  ],
  [
    componentImports.every((name) => renderer.includes(name)),
    "browser receipt is composed from five dedicated sections",
  ],
  [
    header.includes("businessProfile.name") &&
      header.includes("businessProfile.phone") &&
      header.includes("businessProfile.address"),
    "brand header owns editable business identity",
  ],
  [
    meta.includes(">RECEIPT<") &&
      meta.includes("ReceiptSequenceEditor") &&
      meta.includes("Date:"),
    "document meta owns receipt title/date/number",
  ],
  [
    details.includes("splitReceiptAmountWords") &&
      details.includes("sumSecondLine") &&
      layout.includes("splitReceiptAmountWords"),
    "amount in words uses a two-line word-boundary layout",
  ],
  [
    payment.includes("Amount in Figure:") &&
      payment.includes("Payment Method:") &&
      payment.includes("receiptMoneyDensity"),
    "payment section owns amounts and fitted payment methods",
  ],
  [
    footer.includes("Authorised Signatory") &&
      (footer.includes("Customer&apos;s Signature") || footer.includes("Customer's Signature")) &&
      footer.includes("Reference:"),
    "signature/footer component owns the closing receipt region",
  ],
  [
    css.includes("width: 794px") &&
      css.includes("height: 559px") &&
      css.includes("overflow: hidden") &&
      css.includes(".signatureFooter") &&
      css.includes("margin-top: auto"),
    "A5 browser page is fixed to the physical canvas with anchored footer",
  ],
  [
    useReceipt.includes('paperSize: "A5"') &&
      useReceipt.includes("RECEIPT_A5_LAYOUT_MIGRATION_KEY"),
    "new and existing receipt drafts migrate to canonical A5",
  ],
  [
    generator.includes(
      'paperOptions={templates.templateId === "classic-receipt" ? ["A5"] : undefined}',
    ),
    "receipt editor exposes A5 as the intended paper",
  ],
  [
    pdfComponentImports.every((name) => pdf.includes(name)) &&
      pdf.includes("wrap={false}") &&
      pdf.includes("receiptPdfStyles.spacer"),
    "native PDF is componentized and constrained to one receipt page",
  ],
  [
    profile.includes('A5: createProfile("A5", mm(210), mm(148), 1)') &&
      profile.includes("brandPanelHeight") &&
      profile.includes("sumSecondHeight"),
    "native A5 PDF is a purpose-built 210 x 148 mm composition",
  ],
  [
    !renderer.includes("DRIP MALL") &&
      !header.includes("DRIP MALL") &&
      !footer.includes("Property / Unit / Shop"),
    "reference business/property wording is not hard-coded",
  ],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error(
    "Classic Receipt Phase 5.2 structural verification failed:\n" +
      failed.map(([, label]) => `- ${label}`).join("\n"),
  );
  process.exit(1);
}

// The receipt rebuild must not alter the frozen Octalve visual/PDF authority.
const freeze = JSON.parse(read("docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json"));
const expected = Object.fromEntries(
  Object.entries(freeze.files ?? {}).map(([key, value]) => [
    key.replaceAll("\\", "/"),
    value,
  ]),
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
  createHash("sha256")
    .update(readFileSync(resolve(root, relative)))
    .digest("hex")
    .toUpperCase();
const drift = octalveFiles.filter(
  (relative) =>
    sha256(relative) !== String(expected[relative] ?? "").toUpperCase(),
);
if (drift.length) {
  console.error(
    "Frozen Octalve visual regression detected:\n" +
      drift.map((x) => `- ${x}`).join("\n"),
  );
  process.exit(1);
}

console.log("Classic Receipt Phase 5.2 structural verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
