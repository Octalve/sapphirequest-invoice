import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "package.json",
  "src/app/page.tsx",
  "src/features/invoice/components/invoice-generator.tsx",
  "src/features/invoice/renderers/sapphire-invoice-renderer.tsx",
  "src/features/invoice/lib/export-adapter.ts",
  "public/SapphireQuest.png",
  "public/SapphireQuestIcon.png",
  "docs/reference/sapphire-legacy-index.html",
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error("Missing required Phase 1 files:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const sourceFiles = [
  "src/app/page.tsx",
  "src/features/invoice/components/invoice-generator.tsx",
  "src/features/invoice/renderers/sapphire-invoice-renderer.tsx",
  "src/features/invoice/lib/export-adapter.ts",
].map((path) => readFileSync(resolve(root, path), "utf8")).join("\n");

const forbidden = [
  "cdn.tailwindcss.com",
  "cdnjs.cloudflare.com",
  "fonts.googleapis.com",
  "onclick=",
  "document.getElementById(\"invoice-rows\")",
];

const found = forbidden.filter((needle) => sourceFiles.includes(needle));
if (found.length) {
  console.error("Phase 1 verification found legacy/CDN patterns:\n" + found.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log("Phase 1 structural verification passed.");
