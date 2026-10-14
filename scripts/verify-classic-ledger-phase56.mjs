import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/templates/classic-ledger/lib/ledger-header-asset.ts",
  "src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx",
  "src/features/invoice/templates/classic-ledger/classic-ledger.module.css",
  "src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export.tsx",
  "src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx",
  "tests/classic-ledger-phase56.test.mjs",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Missing Classic Ledger Phase 5.6 files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const header = readFileSync(resolve(root, required[1]), "utf8");
const css = readFileSync(resolve(root, required[2]), "utf8");
const exporter = readFileSync(resolve(root, required[3]), "utf8");
const pdf = readFileSync(resolve(root, required[4]), "utf8");

const checks = [
  [header.includes("CLASSIC_LEDGER_HEADER_IMAGE_PATH"), "browser header references the dedicated Ledger asset"],
  [header.includes("headerImageFailed") && header.includes("styles.brandHeader"), "browser keeps coded fallback"],
  [css.includes("height: 150px") && css.includes("height: 105px"), "A4/Letter and A5 header heights remain deliberate"],
  [exporter.includes("loadHeaderImageDataUrl") && exporter.includes("headerImageSrc"), "PDF exporter loads the same image"],
  [pdf.includes("headerImageSrc ?") && pdf.includes("styles.brandHeaderImage") && pdf.includes("styles.brandHeader"), "PDF prefers image and keeps fallback"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Classic Ledger Phase 5.6 verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

console.log("Classic Ledger Phase 5.6 structural verification passed.");
