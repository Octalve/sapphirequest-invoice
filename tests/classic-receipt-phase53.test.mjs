import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".classic-receipt-phase53-test");
const signatures = require(
  resolve(compiledRoot, "templates", "classic-receipt", "lib", "signature-image.js"),
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

test("signature uploads accept only the supported browser image formats", () => {
  assert.equal(signatures.isReceiptSignatureMimeType("image/png"), true);
  assert.equal(signatures.isReceiptSignatureMimeType("image/jpeg"), true);
  assert.equal(signatures.isReceiptSignatureMimeType("image/webp"), true);
  assert.equal(signatures.isReceiptSignatureMimeType("image/svg+xml"), false);
  assert.equal(signatures.isReceiptSignatureMimeType("application/pdf"), false);
});

test("signature source files are capped before local persistence", () => {
  assert.equal(signatures.RECEIPT_SIGNATURE_MAX_FILE_BYTES, 5 * 1024 * 1024);
  assert.equal(
    signatures.RECEIPT_SIGNATURE_ACCEPT,
    "image/png,image/jpeg,image/webp",
  );
});

test("A5 native PDF reserves a bounded signature image slot", () => {
  const { A5 } = profile.CLASSIC_RECEIPT_PDF_PROFILES;
  assert.ok(A5.signatureImageWidth > 70);
  assert.ok(A5.signatureImageHeight > 15);
  assert.ok(A5.signatureImageHeight < 30);
  assert.ok(A5.signatureImageWidth < A5.widthPt / 2);
});

test("larger receipt profiles scale signature image geometry deliberately", () => {
  const { A5, A4, LETTER } = profile.CLASSIC_RECEIPT_PDF_PROFILES;
  assert.ok(A4.signatureImageWidth > A5.signatureImageWidth);
  assert.ok(A4.signatureImageHeight > A5.signatureImageHeight);
  assert.ok(LETTER.signatureImageWidth > A5.signatureImageWidth);
  assert.ok(LETTER.signatureImageHeight > A5.signatureImageHeight);
});
