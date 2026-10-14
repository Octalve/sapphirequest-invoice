import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/template-gallery/template-gallery.tsx",
  "src/features/invoice/template-gallery/template-gallery.module.css",
  "src/features/invoice/hooks/use-template-accent.ts",
  "src/features/invoice/lib/template-theme.ts",
  "tests/multi-template-phase5.test.mjs",
  "scripts/run-multi-template-phase5-tests.mjs",
  "docs/MULTI_TEMPLATE_PHASE_05_MANIFEST.md",
  "docs/MULTI_TEMPLATE_PHASE_05_TEST_RESULTS.md",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Multi-template Phase 5 required files missing:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const registry = read("src/features/invoice/templates/registry.ts");
const selection = read("src/features/invoice/hooks/use-template-selection.ts");
const accentHook = read("src/features/invoice/hooks/use-template-accent.ts");
const theme = read("src/features/invoice/lib/template-theme.ts");
const generator = read("src/features/invoice/components/invoice-generator.tsx");
const toolbar = read("src/features/invoice/components/invoice-toolbar.tsx");
const gallery = read("src/features/invoice/template-gallery/template-gallery.tsx");
const ledgerRenderer = read("src/features/invoice/templates/classic-ledger/classic-ledger-renderer.tsx");
const receiptRenderer = read("src/features/invoice/templates/classic-receipt/classic-receipt-renderer.tsx");
const ledgerCss = read("src/features/invoice/templates/classic-ledger/classic-ledger.module.css");
const receiptCss = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
const ledgerPdf = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx");
const receiptPdf = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx");
const ledgerPdfExport = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export.tsx");
const receiptPdfExport = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-export.tsx");
const exportAdapter = read("src/features/invoice/lib/export-adapter.ts");

const checks = [
  [packageJson.scripts?.["verify:multi-template:phase5"], "Phase 5 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:multi-template:phase5"), "full qualification includes Phase 5"],
  [registry.includes('DEFAULT_INVOICE_TEMPLATE_ID: InvoiceTemplateId = "octalve"') && registry.includes('"classic-receipt"'), "registry contains all three templates and legacy-safe Octalve default"],
  [registry.includes("customizableAccent: false") && registry.match(/customizableAccent: true/g)?.length === 2, "only two non-Octalve templates allow personalization"],
  [selection.includes("const resolved = isInvoiceTemplateId(stored) ? stored : DEFAULT_INVOICE_TEMPLATE_ID") && selection.includes("storageSet(TEMPLATE_SELECTION_STORAGE_KEY, resolved)"), "invalid/missing stored selection safely migrates and persists to Octalve"],
  [generator.includes('workspaceView') && generator.includes('<TemplateGallery') && generator.includes('setWorkspaceView("templates")'), "unlock/editor flow includes a distinct secured gallery screen"],
  [toolbar.includes("onOpenTemplates") && toolbar.includes('type="color"') && !toolbar.includes('aria-label="Invoice template"'), "editor toolbar returns to gallery and does not mix templates in a dropdown"],
  [gallery.includes("SapphireInvoiceRenderer") && gallery.includes("ClassicLedgerRenderer") && gallery.includes("ClassicReceiptRenderer"), "gallery previews use all three genuine renderer components"],
  [gallery.includes("Preview") && gallery.includes("Use Template"), "gallery exposes explicit preview and use actions"],
  [accentHook.includes("sq_template_accent_v1:") && accentHook.includes("storageSet"), "template accent is persisted per template"],
  [theme.includes('DEFAULT_TEMPLATE_ACCENT = "#0755DB"') && theme.includes('DEFAULT_TEMPLATE_ACCENT_DARK = "#043996"'), "Sapphire default palette remains exact"],
  [ledgerRenderer.includes("normalizeAccentColor") && receiptRenderer.includes("normalizeAccentColor"), "browser renderers scope customizable accent through template roots"],
  [ledgerCss.includes("var(--template-accent, #0755db)") && receiptCss.includes("var(--template-accent, #0755db)"), "browser templates retain exact Sapphire fallback colors"],
  [ledgerPdf.includes("accentColor?: string") && receiptPdf.includes("accentColor?: string"), "both customizable native PDF documents accept accent color explicitly"],
  [ledgerPdfExport.includes("accentColor={accentColor}") && receiptPdfExport.includes("accentColor={accentColor}"), "PDF exporters pass personalization through to native renderers"],
  [exportAdapter.includes("accentColor?: string") && exportAdapter.includes("exportClassicLedgerPdf(presentation, `${filenameBase}.pdf`, accentColor)"), "invoice export boundary forwards accent only to Classic Ledger PDF"],
  [exportAdapter.includes('templateId === "classic-receipt"') && exportAdapter.includes("Classic Receipt must use the receipt-specific export path"), "receipt cannot fall through the invoice export dispatcher"],
  [generator.includes("exportClassicReceiptPdf(presentation, `${filenameBase}.pdf`, accent.accentColor)"), "receipt export boundary forwards accent to Classic Receipt PDF"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Multi-template Phase 5 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

// Octalve visual/PDF authority remains absolutely immutable in the final platform.
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

console.log("Multi-template Phase 5 structural verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
