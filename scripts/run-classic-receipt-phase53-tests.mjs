import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const outDir = resolve(root, ".classic-receipt-phase53-test");
const tscPath = require.resolve("typescript/bin/tsc");

rmSync(outDir, { recursive: true, force: true });

const compile = spawnSync(
  process.execPath,
  [
    tscPath,
    "--strict",
    "--target",
    "ES2022",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--skipLibCheck",
    "--outDir",
    outDir,
    "src/features/invoice/types.ts",
    "src/features/invoice/templates/classic-receipt/lib/signature-image.ts",
    "src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-profile.ts",
  ],
  { cwd: root, stdio: "inherit", shell: false },
);

if (compile.error || compile.status !== 0) {
  console.error(
    "Classic Receipt Phase 5.3 core compilation failed.",
    compile.error ?? "",
  );
  rmSync(outDir, { recursive: true, force: true });
  process.exit(compile.status ?? 1);
}

const tests = spawnSync(
  process.execPath,
  ["--test", resolve(root, "tests", "classic-receipt-phase53.test.mjs")],
  { cwd: root, stdio: "inherit", shell: false },
);

rmSync(outDir, { recursive: true, force: true });

if (tests.error) {
  console.error("Classic Receipt Phase 5.3 tests failed:", tests.error);
  process.exit(1);
}

process.exit(tests.status ?? 1);
