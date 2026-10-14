import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const outDir = resolve(root, ".phase25-test");
const tscPath = require.resolve("typescript/bin/tsc");

rmSync(outDir, { recursive: true, force: true });

const compile = spawnSync(
  process.execPath,
  [
    tscPath,
    "--strict",
    "--target", "ES2022",
    "--module", "commonjs",
    "--moduleResolution", "node",
    "--skipLibCheck",
    "--outDir", outDir,
    "src/features/invoice/lib/calculations.ts",
    "src/features/invoice/lib/numbering.ts",
    "src/features/invoice/presentation/document-profile.ts",
  ],
  { cwd: root, stdio: "inherit", shell: false },
);

if (compile.error) {
  console.error("Phase 2.5 core compilation failed:", compile.error);
  rmSync(outDir, { recursive: true, force: true });
  process.exit(1);
}

if (compile.status !== 0) {
  rmSync(outDir, { recursive: true, force: true });
  process.exit(compile.status ?? 1);
}

const tests = spawnSync(
  process.execPath,
  ["--test", resolve(root, "tests", "phase25-refinement.test.mjs")],
  { cwd: root, stdio: "inherit", shell: false },
);

rmSync(outDir, { recursive: true, force: true });

if (tests.error) {
  console.error("Phase 2.5 tests failed:", tests.error);
  process.exit(1);
}

process.exit(tests.status ?? 1);
