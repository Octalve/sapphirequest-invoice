import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".classic-receipt-phase52-test");
const layout = require(
  resolve(compiledRoot, "templates", "classic-receipt", "lib", "receipt-layout.js"),
);
const profile = require(
  resolve(
    compiledRoot,
    "templates",
    "classic-receipt",
    "pdf",
    "classic-receipt-pdf-profile.js",
  ),
);

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

test("A5 landscape is the canonical physical receipt profile", () => {
  const { A5 } = profile.CLASSIC_RECEIPT_PDF_PROFILES;
  assert.equal(round(A5.widthPt), 595.28);
  assert.equal(round(A5.heightPt), 419.53);
  assert.ok(A5.widthPt > A5.heightPt);
  assert.ok(A5.brandPanelHeight > 70);
  assert.ok(A5.fieldBoxHeight > 20);
});

test("amount-in-words is split at word boundaries for the two-line classical field", () => {
  const value =
    "FORTY-FIVE TRILLION FIVE HUNDRED AND SEVENTY-NINE BILLION SEVEN HUNDRED AND SEVENTY-SEVEN MILLION EIGHT HUNDRED AND EIGHTY-EIGHT THOUSAND EIGHT HUNDRED AND EIGHTY-EIGHT NAIRA ONLY";
  const [first, second] = layout.splitReceiptAmountWords(value);
  assert.ok(first.length > 0);
  assert.ok(second.length > 0);
  assert.equal(`${first} ${second}`.replace(/\s+/g, " ").trim(), value);
  assert.ok(!first.endsWith("-"));
  assert.ok(!second.startsWith("-"));
});

test("receipt text density steps down for unusually long legal text", () => {
  assert.equal(layout.receiptWordsDensity("ONE THOUSAND NAIRA ONLY"), "normal");
  assert.equal(layout.receiptWordsDensity("A".repeat(130)), "compact");
  assert.equal(layout.receiptWordsDensity("A".repeat(180)), "tight");
  assert.equal(layout.receiptWordsDensity("A".repeat(220)), "micro");
});

test("large monetary strings get progressively smaller rather than overflow", () => {
  assert.equal(layout.receiptMoneyDensity("9500"), "normal");
  assert.equal(layout.receiptMoneyDensity("45,579,777,888,888"), "compact");
  assert.equal(layout.receiptMoneyDensity("123,456,789,012,345,678"), "tight");
});
