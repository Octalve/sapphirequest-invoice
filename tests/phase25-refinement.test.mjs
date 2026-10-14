import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".phase25-test");
const calculations = require(resolve(compiledRoot, "lib", "calculations.js"));
const numbering = require(resolve(compiledRoot, "lib", "numbering.js"));
const { OCTALVE_THEME, PDF_PAPER_PROFILES } = require(resolve(compiledRoot, "presentation", "document-profile.js"));

const row = {
  id: "row-1",
  serviceName: "Company Branding",
  description: "Advance Package",
  quantity: "2",
  unitPrice: "150,000",
  discount: "10",
};

test("line amount is quantity × unit price after the line discount", () => {
  assert.equal(calculations.calculateLineAmount(row), 270000);
});

test("invoice subtotal consumes computed row amounts", () => {
  const totals = calculations.calculateInvoiceTotals([row], "0", "0");
  assert.equal(totals.subtotal, 270000);
  assert.equal(totals.total, 270000);
});

test("document numbering uses company-sequence-document format", () => {
  assert.equal(numbering.formatDocumentNumber(144), "SQ-00144-INV");
  assert.equal(numbering.parseDocumentSequence("SQ-00144-INV"), 144);
  assert.equal(numbering.parseDocumentSequence("2026/10/0144"), null);
});

test("Octalve attribution retains an explicit brand token", () => {
  assert.match(OCTALVE_THEME.primary, /^#[0-9A-F]{6}$/i);
});

test("A4 and A5 row profiles are compact enough for the 10-row target", () => {
  assert.ok(PDF_PAPER_PROFILES.A4.itemRowMinHeight <= 42);
  assert.ok(PDF_PAPER_PROFILES.A5.itemRowMinHeight <= 32);
});
