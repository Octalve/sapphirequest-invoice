import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/lib/paper.ts",
  "src/features/invoice/lib/pagination.ts",
  "src/features/invoice/lib/export-adapter.ts",
  "src/features/invoice/renderers/sapphire-invoice-renderer.tsx",
  "src/features/invoice/components/invoice-toolbar.tsx",
  "tests/phase2-pagination.test.mjs",
  "docs/PHASE_02_MANIFEST.md",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Missing required Phase 2 files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const exportSource = readFileSync(resolve(root, "src/features/invoice/lib/export-adapter.ts"), "utf8");
const rendererSource = readFileSync(resolve(root, "src/features/invoice/renderers/sapphire-invoice-renderer.tsx"), "utf8");
const toolbarSource = readFileSync(resolve(root, "src/features/invoice/components/invoice-toolbar.tsx"), "utf8");
const constantsSource = readFileSync(resolve(root, "src/features/invoice/constants.ts"), "utf8");
const cssSource = readFileSync(resolve(root, "src/app/globals.css"), "utf8");

const requiredPatterns = [
  [toolbarSource, "PAPER_DEFINITIONS", "paper selector"],
  [constantsSource, 'code: "A4"', "A4 definition"],
  [constantsSource, 'code: "A5"', "A5 definition"],
  [constantsSource, 'code: "LETTER"', "Letter definition"],
  [rendererSource, 'data-paper-size={draft.paperSize}', "paper-aware renderer"],
  [cssSource, '[data-paper-size="A5"]', "dedicated A5 composition"],
  [exportSource, 'import("html2canvas-pro")', "modern-CSS PNG capture engine"],
  [exportSource, 'const PNG_CAPTURE_SCALE = 2', "controlled PNG capture scale"],
];

const missingPatterns = requiredPatterns.filter(([source, needle]) => !source.includes(needle));
if (missingPatterns.length) {
  console.error(
    "Phase 2 verification is missing expected implementation markers:\n" +
      missingPatterns.map(([, , label]) => `- ${label}`).join("\n"),
  );
  process.exit(1);
}

const forbiddenPatterns = [
  [exportSource, 'import("html2canvas")', "legacy upstream html2canvas import"],
  [exportSource, "scale: 3", "legacy 3x capture"],
  [cssSource, 'transform: scale(.7)', "scaled-A4 A5 implementation"],
];

const foundForbidden = forbiddenPatterns.filter(([source, needle]) => source.includes(needle));
if (foundForbidden.length) {
  console.error(
    "Phase 2 verification found legacy patterns:\n" +
      foundForbidden.map(([, , label]) => `- ${label}`).join("\n"),
  );
  process.exit(1);
}

console.log("Phase 2 structural verification passed.");
