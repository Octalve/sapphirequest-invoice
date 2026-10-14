import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "src/features/invoice/presentation/document-profile.ts",
  "src/features/invoice/presentation/invoice-presentation.ts",
  "src/features/invoice/lib/native-pdf-export.tsx",
  "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx",
  "src/features/invoice/renderers/html/invoice-header.tsx",
  "src/features/invoice/renderers/html/invoice-parties.tsx",
  "src/features/invoice/renderers/html/invoice-items-table.tsx",
  "src/features/invoice/renderers/html/invoice-closing.tsx",
  "src/features/invoice/renderers/html/invoice-footer.tsx",
  "tests/phase24-presentation.test.mjs",
  "docs/PHASE_02_4_MANIFEST.md",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Missing required Phase 2.4 files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const exportSource = readFileSync(resolve(root, "src/features/invoice/lib/export-adapter.ts"), "utf8");
const nativePdfSource = readFileSync(resolve(root, "src/features/invoice/lib/native-pdf-export.tsx"), "utf8");
const pdfSource = readFileSync(resolve(root, "src/features/invoice/renderers/pdf/sapphire-pdf-document.tsx"), "utf8");
const itemsSource = readFileSync(resolve(root, "src/features/invoice/renderers/html/invoice-items-table.tsx"), "utf8");
const rendererSource = readFileSync(resolve(root, "src/features/invoice/renderers/sapphire-invoice-renderer.tsx"), "utf8");
const layoutSource = readFileSync(resolve(root, "src/app/layout.tsx"), "utf8");

const checks = [
  [packageJson.dependencies?.["@react-pdf/renderer"] === "4.9.0", "@react-pdf/renderer 4.9.0 is pinned"],
  [packageJson.dependencies?.["html2canvas-pro"] === "2.5.2", "html2canvas-pro 2.5.2 is pinned"],
  [!packageJson.dependencies?.jspdf, "jsPDF has been removed from the active dependency graph"],
  [!packageJson.dependencies?.html2canvas, "legacy html2canvas has been removed"],
  [exportSource.includes('format === "pdf"'), "PDF and PNG export paths are separated"],
  [exportSource.includes('import("./native-pdf-export")'), "PDF uses the native renderer adapter"],
  [nativePdfSource.includes('import("@react-pdf/renderer")'), "native PDF engine is dynamically loaded"],
  [pdfSource.includes("<Document"), "PDF document is composed from native PDF primitives"],
  [pdfSource.includes("wrap={!keepTogether}"), "normal item rows are kept together with long-row safety fallback"],
  [pdfSource.includes("fixed"), "native PDF contains fixed continuation/footer context"],
  [itemsSource.indexOf("row.description") > itemsSource.indexOf("row.serviceName"), "description is rendered directly beneath service name"],
  [!itemsSource.includes("Price Description"), "legacy standalone description column is removed"],
  [rendererSource.includes("data-invoice-renderer=\"sapphire-v6\"") || rendererSource.includes("data-invoice-renderer=\"sapphire-v4\""), "componentized preview renderer is active"],
  [layoutSource.includes("suppressHydrationWarning"), "known extension body hydration noise is contained"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Phase 2.4 structural verification failed:\n" + failed.map(([, label]) => `- ${label}`).join("\n"));
  process.exit(1);
}

console.log("Phase 2.4 structural verification passed.");
