import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/templates/types.ts",
  "src/features/invoice/templates/registry.ts",
  "src/features/invoice/hooks/use-template-selection.ts",
  "src/features/invoice/lib/amount-in-words.ts",
  "src/features/invoice/templates/classic-ledger/classic-ledger-renderer.tsx",
  "src/features/invoice/templates/classic-ledger/classic-ledger.module.css",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-items.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-closing.tsx",
  "src/features/invoice/templates/classic-ledger/components/classic-auto-textarea.tsx",
  "tests/classic-ledger-phase2.test.mjs",
  "docs/CLASSIC_LEDGER_PHASE_02_MANIFEST.md",
  "docs/CLASSIC_LEDGER_PHASE_03_PROMPT.md",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Classic Ledger Phase 2 required files missing:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const generator = read("src/features/invoice/components/invoice-generator.tsx");
const toolbar = read("src/features/invoice/components/invoice-toolbar.tsx");
const renderer = read("src/features/invoice/templates/classic-ledger/classic-ledger-renderer.tsx");
const css = read("src/features/invoice/templates/classic-ledger/classic-ledger.module.css");
const header = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx");
const items = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-items.tsx");
const closing = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-closing.tsx");
const registry = read("src/features/invoice/templates/registry.ts");
const exportAdapter = read("src/features/invoice/lib/export-adapter.ts");

const checks = [
  [packageJson.scripts?.["verify:classic-ledger:phase2"], "Phase 2 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:classic-ledger:phase2"), "full qualification includes Classic Ledger Phase 2"],
  [registry.includes('DEFAULT_INVOICE_TEMPLATE_ID: InvoiceTemplateId = "octalve"'), "existing users default to Octalve Template"],
  [registry.includes('"classic-ledger"') && registry.includes("pdfAvailable:"), "Classic Ledger remains independently registered"],
  [generator.includes('templates.templateId === "classic-ledger"') && generator.includes("ClassicLedgerRenderer"), "renderer dispatch is isolated at the template boundary"],
  [generator.includes('format === "pdf"') && generator.includes("pdfAvailable"), "template PDF availability remains explicitly surfaced in the UI"],
  [exportAdapter.includes('templateId === "octalve"') && exportAdapter.includes('templateId === "classic-ledger"'), "export adapter retains explicit template-boundary PDF dispatch"],
  [toolbar.includes("onOpenTemplates") && toolbar.includes("Templates ·"), "toolbar retains access to explicit template selection through the Phase 5 gallery"],
  [renderer.includes('data-invoice-renderer="classic-ledger-v1"') && renderer.includes('data-template-id="classic-ledger"'), "Classic Ledger renderer has independent identity"],
  [header.includes("COMPANY_IDENTITY.iconPath") && header.includes("businessProfile.name") && header.includes("onBusinessProfileChange"), "business logo stays separate while Classic Ledger company text is independently editable"],
  [header.includes("businessRegistration") && header.includes("businessProfile.tinNo") && header.includes("businessProfile.rcNo"), "business TIN/RC remain editable with the Classic Ledger business identity"],
  [header.includes("<SequenceEditor key={draft.invoiceNo}") && header.includes("formatEditableDocumentSequence(invoiceNo)"), "sequence editor remounts and resynchronizes after New Invoice or committed-number changes"],
  [header.includes('aria-label="Classic Ledger customer name"') && header.includes('aria-label="Classic Ledger customer address"'), "long customer identity fields use auto-growing text areas"],
  [items.includes("QTY") && items.includes("UNIT PRICE") && items.includes("DISCOUNT") && items.includes("TOTAL"), "ledger table preserves shared financial fields"],
  [items.includes("calculateLineAmount(row)"), "Classic Ledger reuses shared line calculation logic"],
  [closing.includes("formatAmountInWords(totals.total, draft.currency)"), "amount in words is derived from calculated total"],
  [closing.includes("paymentSettings") && closing.includes("Customer Signature"), "payment details and signatures are implemented"],
  [css.includes("--classic-accent: var(--template-accent, #0755db)") && css.includes("--classic-accent-dark: var(--template-accent-dark, #043996)"), "Sapphire blue remains the isolated Classic Ledger default accent while later personalization stays scoped"],
  [css.includes('grid-template-columns: 58px minmax(0, 1fr) 118px 78px 124px'), "A4 ledger table has deliberate fixed/flexible column geometry"],
  [css.includes('.page[data-paper-size="A5"]') && css.includes('.page[data-paper-size="LETTER"]'), "browser renderer has deliberate A5/Letter composition hooks"],
  [css.includes("overflow: visible"), "many-row browser invoices are not clipped by the A4 minimum canvas"],
  [renderer.includes('data-template-id="classic-ledger"'), "Classic Ledger browser identity remains stable after later phases"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Classic Ledger Phase 2 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

// Frozen Octalve visual implementation must remain byte-identical to the recorded freeze.
const freeze = JSON.parse(read("docs/OCTALVE_TEMPLATE_FREEZE_V1_HASHES.json"));
const expected = Object.fromEntries(Object.entries(freeze.files ?? {}).map(([key, value]) => [key.replaceAll("\\", "/"), value]));
const frozenVisualFiles = [
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

const drift = [];
for (const relative of frozenVisualFiles) {
  const wanted = expected[relative];
  const actual = createHash("sha256").update(readFileSync(resolve(root, relative))).digest("hex").toUpperCase();
  if (!wanted || actual !== String(wanted).toUpperCase()) drift.push(`${relative}: ${actual} != ${wanted ?? "missing freeze hash"}`);
}

if (drift.length) {
  console.error("Frozen Octalve visual regression detected:\n" + drift.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log("Classic Ledger Phase 2 structural verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
