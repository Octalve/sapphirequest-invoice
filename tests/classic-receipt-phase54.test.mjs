import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".classic-receipt-phase54-test");
const profile = require(
  resolve(
    compiledRoot,
    "templates",
    "classic-receipt",
    "pdf",
    "classic-receipt-pdf-profile.js",
  ),
);
const font = require(
  resolve(
    compiledRoot,
    "templates",
    "classic-receipt",
    "lib",
    "receipt-brand-font.js",
  ),
);

const read = (relative) => readFileSync(resolve(root, relative), "utf8");

test("A5 receipt header keeps its approved vertical footprint", () => {
  const { A5 } = profile.CLASSIC_RECEIPT_PDF_PROFILES;
  assert.ok(Math.abs(A5.brandPanelHeight - profile.receiptPxToPt(101)) < 0.0001);
  assert.ok(A5.logoSize > profile.receiptPxToPt(70));
  assert.ok(A5.logoHeight <= A5.brandPanelHeight);
});

test("Neue Plak font configuration is explicit and installer-controlled", () => {
  assert.equal(font.RECEIPT_BRAND_FONT_FAMILY, "NeuePlakExtended");
  assert.match(font.RECEIPT_BRAND_FONT_URL, /^\/fonts\/neue-plak-extended-bold\.(ttf|woff)$/);
  assert.equal(typeof font.RECEIPT_BRAND_FONT_ENABLED, "boolean");
});

test("browser header uses a 20/80 domain split with Lucide contact icons", () => {
  const header = read(
    "src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx",
  );
  const css = read(
    "src/features/invoice/templates/classic-receipt/classic-receipt.module.css",
  );

  assert.match(header, /Globe2, Mail, MapPin, Phone/);
  assert.match(header, /styles\.logoRail/);
  assert.match(header, /styles\.identityRail/);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 20%\) minmax\(0, 80%\)/);
  assert.match(css, /font-family:\s*[\s\S]*"Neue Plak Extended"/);
});

test("native PDF mirrors the split header and colored contact icons", () => {
  const pdfHeader = read(
    "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx",
  );
  const pdfIcon = read(
    "src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-contact-icon.tsx",
  );

  assert.match(pdfHeader, /Font\.register/);
  assert.match(pdfHeader, /ReceiptPdfContactIcon/);
  assert.match(pdfHeader, /receiptPdfStyles\.logoRail/);
  assert.match(pdfHeader, /receiptPdfStyles\.identityRail/);
  assert.match(pdfIcon, /#16A34A/);
  assert.match(pdfIcon, /#2563EB/);
  assert.match(pdfIcon, /#0891B2/);
  assert.match(pdfIcon, /#DC2626/);
});
