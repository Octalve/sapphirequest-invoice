import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".classic-ledger-phase2-test");
const words = require(resolve(compiledRoot, "lib", "amount-in-words.js"));
const registry = require(resolve(compiledRoot, "templates", "registry.js"));

test("Classic Ledger amount-in-words handles NGN whole values", () => {
  assert.equal(words.formatAmountInWords(9_000_000, "NGN"), "Nine Million Naira Only");
});

test("amount-in-words preserves minor units across supported currencies", () => {
  assert.equal(words.formatAmountInWords(1_250.75, "NGN"), "One Thousand Two Hundred and Fifty Naira and Seventy-Five Kobo Only");
  assert.equal(words.formatAmountInWords(21.01, "USD"), "Twenty-One Dollars and One Cent Only");
  assert.equal(words.formatAmountInWords(1.02, "GBP"), "One Pound and Two Pence Only");
  assert.equal(words.formatAmountInWords(2.5, "EUR"), "Two Euros and Fifty Cents Only");
});

test("large values remain deterministic and do not use locale-dependent words", () => {
  assert.equal(words.integerToWords(12_345_678), "Twelve Million Three Hundred and Forty-Five Thousand Six Hundred and Seventy-Eight");
});

test("template registry defaults existing users to the frozen Octalve Template", () => {
  assert.equal(registry.DEFAULT_INVOICE_TEMPLATE_ID, "octalve");
  assert.equal(registry.INVOICE_TEMPLATES.octalve.name, "Octalve Template");
  assert.equal(registry.INVOICE_TEMPLATES.octalve.pdfAvailable, true);
});

test("Classic Ledger remains registered independently as the platform evolves", () => {
  const classic = registry.INVOICE_TEMPLATES["classic-ledger"];
  assert.equal(classic.name, "Classic Ledger");
  assert.equal(classic.category, "Classic");
  assert.equal(typeof classic.pdfAvailable, "boolean");
  assert.equal(registry.isInvoiceTemplateId("classic-ledger"), true);
  assert.equal(registry.isInvoiceTemplateId("unknown"), false);
});
