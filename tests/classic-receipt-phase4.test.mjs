import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".classic-receipt-phase4-test");
const numbering = require(resolve(compiledRoot, "templates", "classic-receipt", "lib", "receipt-numbering.js"));
const presentationLib = require(resolve(compiledRoot, "templates", "classic-receipt", "lib", "receipt-presentation.js"));
const profile = require(resolve(compiledRoot, "templates", "classic-receipt", "pdf", "classic-receipt-pdf-profile.js"));
const registry = require(resolve(compiledRoot, "templates", "registry.js"));

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

test("receipt numbering is independent and uses SQ-00001-RCT", () => {
  assert.equal(numbering.formatReceiptNumber(1), "SQ-00001-RCT");
  assert.equal(numbering.formatReceiptNumber(144), "SQ-00144-RCT");
  assert.equal(numbering.parseReceiptSequence("SQ-00144-RCT"), 144);
  assert.equal(numbering.parseReceiptSequence("SQ-00144-INV"), null);
  assert.equal(numbering.sanitizeReceiptSequenceInput("ab144xyz"), "144");
});

test("receipt presentation derives amount-in-words from amount received", () => {
  const draft = {
    receiptNo: "SQ-00007-RCT",
    day: "13",
    month: "OCT",
    year: "2026",
    receivedFrom: "Example Client",
    paymentPurpose: "Professional services",
    amountReceived: "1,250.75",
    balanceRemaining: "",
    paymentMethod: "transfer",
    reference: "REF-77",
    currency: "NGN",
    paperSize: "A4",
  };
  const result = presentationLib.buildClassicReceiptPresentation(draft);
  assert.equal(result.amountReceived, 1250.75);
  assert.equal(result.balanceRemaining, null);
  assert.equal(result.amountInWords, "One Thousand Two Hundred and Fifty Naira and Seventy-Five Kobo Only");
});

test("receipt balance is only populated when real balance data is supplied", () => {
  const draft = {
    receiptNo: "SQ-00008-RCT",
    day: "13",
    month: "OCT",
    year: "2026",
    receivedFrom: "Example Client",
    paymentPurpose: "Deposit",
    amountReceived: "500",
    balanceRemaining: "2,500",
    paymentMethod: "cash",
    reference: "",
    currency: "USD",
    paperSize: "LETTER",
  };
  const result = presentationLib.buildClassicReceiptPresentation(draft);
  assert.equal(result.balanceRemaining, 2500);
});

test("Classic Receipt is a distinct receipt template", () => {
  const receipt = registry.INVOICE_TEMPLATES["classic-receipt"];
  assert.equal(receipt.name, "Classic Receipt");
  assert.equal(receipt.documentKind, "receipt");
  assert.equal(receipt.pdfAvailable, true);
  assert.equal(registry.DEFAULT_INVOICE_TEMPLATE_ID, "octalve");
});

test("Classic Receipt PDF uses true A4, A5 and Letter sizes", () => {
  const { A4, A5, LETTER } = profile.CLASSIC_RECEIPT_PDF_PROFILES;
  assert.equal(round(A4.widthPt), 841.89);
  assert.equal(round(A4.heightPt), 595.28);
  assert.equal(round(A5.widthPt), 595.28);
  assert.equal(round(A5.heightPt), 419.53);
  assert.equal(LETTER.widthPt, 792);
  assert.equal(LETTER.heightPt, 612);
});

test("receipt browser-to-PDF physical conversion remains explicit", () => {
  assert.equal(profile.receiptPxToPt(54), 40.5);
  assert.equal(profile.receiptPxToPt(34), 25.5);
  assert.equal(profile.formatReceiptPdfDate("13 OCT 2026"), "13 / OCT / 2026");
});
