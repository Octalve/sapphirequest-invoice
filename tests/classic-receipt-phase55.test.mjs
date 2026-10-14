import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (relative) => readFileSync(resolve(root, relative), "utf8");

test("receipt header asset path is stable", () => {
  const asset = read("src/features/invoice/templates/classic-receipt/lib/receipt-header-asset.ts");
  assert.match(asset, /\/branding\/classic-receipt\/receipt-header\.png/);
  assert.match(asset, /width:\s*2400/);
  assert.match(asset, /height:\s*360/);
});

test("browser header is image-first with coded fallback", () => {
  const header = read("src/features/invoice/templates/classic-receipt/components/receipt-brand-header.tsx");
  assert.match(header, /headerImageFailed/);
  assert.match(header, /RECEIPT_HEADER_IMAGE_PATH/);
  assert.match(header, /styles\.brandImagePanel/);
  assert.match(header, /styles\.brandPanel/);
  assert.match(header, /styles\.logoRail/);
});

test("browser and PDF use cover-fit header geometry", () => {
  const css = read("src/features/invoice/templates/classic-receipt/classic-receipt.module.css");
  const pdfStyles = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-styles.ts");
  assert.match(css, /\.brandImagePanel[\s\S]*height:\s*101px/);
  assert.match(css, /\.brandHeaderImage[\s\S]*object-fit:\s*cover/);
  assert.match(pdfStyles, /brandHeaderImagePanel/);
  assert.match(pdfStyles, /brandHeaderImage[\s\S]*objectFit:\s*"cover"/);
});

test("PDF export loads the same receipt header asset and preserves fallback logo", () => {
  const exportSource = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-export.tsx");
  const doc = read("src/features/invoice/templates/classic-receipt/pdf/classic-receipt-pdf-document.tsx");
  const header = read("src/features/invoice/templates/classic-receipt/pdf/components/receipt-pdf-brand-header.tsx");
  assert.match(exportSource, /loadReceiptHeaderDataUrl/);
  assert.match(exportSource, /RECEIPT_HEADER_IMAGE_PATH/);
  assert.match(exportSource, /headerImageSrc/);
  assert.match(doc, /headerImageSrc/);
  assert.match(header, /if \(headerImageSrc\)/);
  assert.match(header, /logoSrc/);
});
