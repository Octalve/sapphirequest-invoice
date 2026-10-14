import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx",
  "src/features/invoice/templates/classic-receipt/lib/receipt-brand-font.ts",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx",
  "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-contact-icon.tsx",
  "tests/classic-receipt-phase54.test.mjs",
  "scripts/run-classic-receipt-phase54-tests.mjs",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error(
    "Classic Receipt Phase 5.4 required files missing:\n" +
      missing.map((x) => `- ${x}`).join("\n"),
  );
  process.exit(1);
}

const read = (path) => readFileSync(resolve(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const header = read("src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx");
const css = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
const pdfHeader = read("src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx");
const pdfIcon = read("src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-contact-icon.tsx");
const font = read("src/features/invoice/templates/classic-receipt/lib/receipt-brand-font.ts");
const profile = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts");

const checks = [
  [packageJson.scripts?.["verify:classic-receipt:phase5.4"], "Phase 5.4 verification script is registered"],
  [packageJson.scripts?.qualify?.includes("verify:classic-receipt:phase5.4"), "full qualification includes receipt Phase 5.4"],
  [header.includes('from "lucide-react"') && header.includes("Phone") && header.includes("Mail") && header.includes("Globe2") && header.includes("MapPin"), "browser header uses Lucide contact icons"],
  [header.includes("styles.logoRail") && header.includes("styles.identityRail"), "browser header owns explicit logo and identity rails"],
  [css.includes("minmax(0, 20%) minmax(0, 80%)"), "browser header uses the approved 20/80 split"],
  [css.includes('font-family: "Neue Plak Extended"') && css.includes('neue-plak-extended-bold.woff') && css.includes('neue-plak-extended-bold.ttf'), "browser header declares Neue Plak Extended Bold with licensed local asset paths"],
  [font.includes('RECEIPT_BRAND_FONT_FAMILY = "NeuePlakExtended"') && font.includes("RECEIPT_BRAND_FONT_ENABLED"), "font activation is installer-controlled"],
  [pdfHeader.includes("Font.register") && pdfHeader.includes("ReceiptPdfContactIcon"), "native PDF supports the same brand font and contact icon system"],
  [pdfIcon.includes("#16A34A") && pdfIcon.includes("#2563EB") && pdfIcon.includes("#0891B2") && pdfIcon.includes("#DC2626"), "PDF contact icons preserve intentional colors"],
  [profile.includes("brandPanelHeight: receiptPxToPt(101 * scale)") && profile.includes("logoSize: receiptPxToPt(86 * scale)"), "header keeps the approved vertical footprint while logo fills its 20% rail"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error(
    "Classic Receipt Phase 5.4 structural verification failed:\n" +
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

console.log("Classic Receipt Phase 5.4 header verification passed.");
console.log("Frozen Octalve visual hashes: PASS (9/9 unchanged).");
