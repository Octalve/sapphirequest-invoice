import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const outDir = resolve(root, ".template-isolation-phase51-test");
const tscPath = require.resolve("typescript/bin/tsc");

rmSync(outDir, { recursive: true, force: true });

const compile = spawnSync(process.execPath, [
  tscPath,
  "--strict",
  "--target", "ES2022",
  "--module", "commonjs",
  "--moduleResolution", "node",
  "--skipLibCheck",
  "--outDir", outDir,
  "src/features/invoice/types.ts",
  "src/features/invoice/constants.ts",
  "src/features/invoice/templates/business-profile.ts",
  "src/features/invoice/templates/classic-ledger/storage.ts",
  "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts",
], { cwd: root, stdio: "inherit", shell: false });

if (compile.error || compile.status !== 0) {
  console.error("Template isolation Phase 5.1 core compilation failed.", compile.error ?? "");
  rmSync(outDir, { recursive: true, force: true });
  process.exit(compile.status ?? 1);
}

const tests = spawnSync(process.execPath, ["--test", resolve(root, "tests", "template-isolation-phase51.test.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: false,
});

rmSync(outDir, { recursive: true, force: true });
if (tests.error) {
  console.error("Template isolation Phase 5.1 tests failed:", tests.error);
  process.exit(1);
}
process.exit(tests.status ?? 1);
