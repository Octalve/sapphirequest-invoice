import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".phase26-test");
const numbering = require(resolve(compiledRoot, "lib", "numbering.js"));
const calculations = require(resolve(compiledRoot, "lib", "calculations.js"));
const { OCTALVE_THEME, PDF_PAPER_PROFILES, pxToPt } = require(resolve(compiledRoot, "presentation", "document-profile.js"));

function closeTo(actual, expected, tolerance = 0.001) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
}

test("manual sequence input is numeric-only, five digits, and formatted into the locked identifier", () => {
  assert.equal(numbering.sanitizeDocumentSequenceInput("ab144x"), "144");
  assert.equal(numbering.normalizeManualDocumentSequence("144"), 144);
  assert.equal(numbering.formatDocumentNumber(144), "SQ-00144-INV");
  assert.equal(numbering.formatEditableDocumentSequence("SQ-00144-INV"), "00144");
});

test("manual sequence is bounded and never normalizes below one", () => {
  assert.equal(numbering.normalizeManualDocumentSequence("0"), 1);
  assert.equal(numbering.normalizeManualDocumentSequence("999999"), 99999);
});

test("five-column financial model still computes quantity x unit price less line discount", () => {
  const row = { id: "1", serviceName: "Website", description: "Corporate", quantity: "2", unitPrice: "150,000", discount: "10" };
  assert.equal(calculations.calculateLineAmount(row), 270000);
  const free = { ...row, discount: "100" };
  assert.equal(calculations.calculateLineAmount(free), 0);
});

test("Phase 2.6 preserves true A4/A5 paper geometry", () => {
  assert.equal(Math.round(PDF_PAPER_PROFILES.A4.widthPt * 100) / 100, 595.28);
  assert.equal(Math.round(PDF_PAPER_PROFILES.A4.heightPt * 100) / 100, 841.89);
  assert.equal(Math.round(PDF_PAPER_PROFILES.A5.widthPt * 100) / 100, 419.53);
  assert.equal(Math.round(PDF_PAPER_PROFILES.A5.heightPt * 100) / 100, 595.28);
});

test("native PDF A4 geometry is derived directly from the approved browser UI", () => {
  const a4 = PDF_PAPER_PROFILES.A4;
  closeTo(pxToPt(34), 25.5);
  closeTo(a4.pagePaddingX, pxToPt(34));
  closeTo(a4.pagePaddingTop, pxToPt(34));
  closeTo(a4.sectionGap, pxToPt(18));
  closeTo(a4.itemRowMinHeight, pxToPt(56));
  closeTo(a4.footerHeight, pxToPt(36));
  closeTo(a4.ui.partyMinHeight, pxToPt(124));
  closeTo(a4.ui.partyIconSize, pxToPt(15));
  closeTo(a4.ui.partyTextSize, pxToPt(10.8));
  closeTo(a4.ui.tableHeaderMinHeight, pxToPt(42));
  closeTo(a4.ui.itemIconSize, pxToPt(28));
  closeTo(a4.ui.itemTitleMinHeight, pxToPt(18));
  closeTo(a4.ui.itemDescriptionMinHeight, pxToPt(14));
  closeTo(a4.ui.summaryTotalValueSize, pxToPt(14));
});

test("A5 remains a purpose-built compact composition derived from its own browser metrics", () => {
  const a5 = PDF_PAPER_PROFILES.A5;
  closeTo(a5.pagePaddingX, pxToPt(22));
  closeTo(a5.sectionGap, pxToPt(12));
  closeTo(a5.itemRowMinHeight, pxToPt(40));
  closeTo(a5.ui.partyMinHeight, pxToPt(86));
  closeTo(a5.ui.itemIconSize, pxToPt(18));
  closeTo(a5.footerHeight, pxToPt(23));
});

test("Octalve footer treatment uses the approved deep navy token selected for attribution", () => {
  assert.equal(OCTALVE_THEME.primary, "#021A34");
});
