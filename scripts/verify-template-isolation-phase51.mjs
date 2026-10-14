import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/hooks/use-template-business-profile.ts",
  "src/features/invoice/templates/business-profile.ts",
  "src/features/invoice/templates/classic-ledger/storage.ts",
  "tests/template-isolation-phase51.test.mjs",
  "scripts/run-template-isolation-phase51-tests.mjs",
];
const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Template isolation Phase 5.1 required files missing:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const generator = read("src/features/invoice/components/invoice-generator.tsx");
const invoiceHook = read("src/features/invoice/hooks/use-invoice-generator.ts");
const businessHook = read("src/features/invoice/hooks/use-template-business-profile.ts");
const businessProfile = read("src/features/invoice/templates/business-profile.ts");
const ledgerStorage = read("src/features/invoice/templates/classic-ledger/storage.ts");
const ledgerHeader = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx");
const receiptRenderer = read("src/features/invoice/templates/classic-receipt/classic-receipt-renderer.tsx");
const receiptHeader = read("src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx");
const receiptCss = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
const receiptProfile = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts");
const exportAdapter = read("src/features/invoice/lib/export-adapter.ts");

const checks = [
  [packageJson.scripts?.["verify:template-isolation:phase5.1"], "Phase 5.1 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:template-isolation:phase5.1"), "full qualification includes Phase 5.1 isolation gate"],
  [generator.includes("const octalveInvoice = useInvoiceGenerator();") && generator.includes("useInvoiceGenerator(CLASSIC_LEDGER_INVOICE_STORAGE_SCOPE)"), "Octalve and Classic Ledger instantiate independent invoice state"],
  [ledgerStorage.includes("sq_classic_ledger_invoice_draft_v1") && ledgerStorage.includes("sq_classic_ledger_payment_settings_v1"), "Classic Ledger has dedicated persisted financial state"],
  [invoiceHook.includes("scope.draftStorageKey") && invoiceHook.includes("scope.paymentSettingsStorageKey") && invoiceHook.includes("scope.currencyStorageKey"), "shared invoice hook is storage-scoped instead of globally shared"],
  [businessProfile.includes("sq_template_business_profile_v1:classic-ledger") && businessProfile.includes("sq_template_business_profile_v1:classic-receipt"), "Ledger and Receipt business profiles have different storage keys"],
  [businessHook.includes("storageSet(storageKey") && businessHook.includes("TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS"), "business profile persistence remains template-scoped"],
  [ledgerHeader.includes("businessProfile.name") && ledgerHeader.includes("businessProfile.phone") && ledgerHeader.includes("businessProfile.email"), "Classic Ledger business identity is directly editable"],
  [receiptHeader.includes("businessProfile.name") && receiptHeader.includes("businessProfile.address") && receiptRenderer.includes('data-orientation="landscape"'), "Classic Receipt has editable business identity and landscape browser identity"],
  [receiptCss.includes("width: 1123px") && receiptCss.includes("min-height: 794px") && receiptCss.includes('width:1056px') && receiptCss.includes('width:794px'), "Classic Receipt browser uses A4/Letter/A5 landscape geometry"],
  [receiptProfile.includes('A4: createProfile("A4", mm(297), mm(210)') && receiptProfile.includes('A5: createProfile("A5", mm(210), mm(148)') && receiptProfile.includes('LETTER: createProfile("LETTER", 792, 612'), "Classic Receipt native PDF uses true landscape paper geometry"],
  [exportAdapter.includes('orientation?: "portrait" | "landscape"') && generator.includes('orientation: "landscape"'), "PNG capture understands receipt landscape orientation"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Template isolation Phase 5.1 verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

const freeze = JSON.parse(read("docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json"));
const expected = Object.fromEntries(Object.entries(freeze.files ?? {}).map(([key, value]) => [key.replaceAll("\\", "/"), value]));
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
const sha256 = (relative) => createHash("sha256").update(readFileSync(resolve(root, relative))).digest("hex").toUpperCase();
const drift = octalveFiles.filter((relative) => sha256(relative) !== String(expected[relative] ?? "").toUpperCase());
if (drift.length) {
  console.error("Frozen Octalve visual regression detected:\n" + drift.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log("Template isolation Phase 5.1 structural verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
