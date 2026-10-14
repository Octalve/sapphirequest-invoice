import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".classic-ledger-phase3-test");
const profile = require(resolve(compiledRoot, "templates", "classic-ledger", "pdf", "classic-ledger-pdf-profile.js"));
const registry = require(resolve(compiledRoot, "templates", "registry.js"));
const words = require(resolve(compiledRoot, "lib", "amount-in-words.js"));

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

test("browser pixels translate to PDF points at the physical 96dpi to 72pt ratio", () => {
  assert.equal(profile.pxToPt(56), 42);
  assert.equal(profile.pxToPt(124), 93);
  assert.equal(profile.pxToPt(15), 11.25);
});

test("Classic Ledger PDF profiles preserve real A4, A5 and Letter paper sizes", () => {
  const { A4, A5, LETTER } = profile.CLASSIC_LEDGER_PDF_PROFILES;
  assert.equal(round(A4.widthPt), 595.28);
  assert.equal(round(A4.heightPt), 841.89);
  assert.equal(round(A5.widthPt), 419.53);
  assert.equal(round(A5.heightPt), 595.28);
  assert.equal(LETTER.widthPt, 612);
  assert.equal(LETTER.heightPt, 792);
});

test("A4 and A5 table columns exactly consume the approved browser content width", () => {
  for (const code of ["A4", "A5", "LETTER"]) {
    const p = profile.CLASSIC_LEDGER_PDF_PROFILES[code];
    assert.ok(Math.abs(profile.classicLedgerColumnTotal(p) - profile.classicLedgerPdfContentWidth(p)) < 0.000001);
  }
});

test("approved browser row geometry is preserved in native PDF", () => {
  const { A4, A5, LETTER } = profile.CLASSIC_LEDGER_PDF_PROFILES;
  assert.equal(A4.tableHeaderHeight, 31.5);
  assert.equal(A4.tableRowMinHeight, 43.5);
  assert.equal(A4.tableFillerHeight, 36);
  assert.equal(A5.tableHeaderHeight, 21.75);
  assert.equal(A5.tableRowMinHeight, 30);
  assert.equal(A5.tableFillerHeight, 24);
  assert.equal(LETTER.tableRowMinHeight, 43.5);
});

test("Classic Ledger PDF date display preserves the browser slash-separated treatment", () => {
  assert.equal(profile.formatClassicLedgerPdfDate("13 OCT 2026"), "13 / OCT / 2026");
  assert.equal(profile.formatClassicLedgerPdfDate(""), "");
});

test("Classic Ledger registry enables its independent native PDF in Phase 3", () => {
  const classic = registry.INVOICE_TEMPLATES["classic-ledger"];
  assert.equal(classic.pdfAvailable, true);
  assert.equal(classic.version, "0.3");
  assert.equal(registry.DEFAULT_INVOICE_TEMPLATE_ID, "octalve");
});

test("amount-in-words remains shared and deterministic after PDF integration", () => {
  assert.equal(words.formatAmountInWords(9_000_000, "NGN"), "Nine Million Naira Only");
  assert.equal(words.formatAmountInWords(21.01, "USD"), "Twenty-One Dollars and One Cent Only");
});
