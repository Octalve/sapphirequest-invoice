import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), "utf8");

test("Classic Ledger image header uses dedicated branding asset", () => {
  const asset = read("src/features/invoice/templates/classic-ledger/lib/ledger-header-asset.ts");
  assert.match(asset, /classic-ledger\/ledger-header\.png/);
  assert.match(asset, /width:\s*2400/);
  assert.match(asset, /height:\s*520/);
});

test("browser prefers the designed header while keeping coded fallback", () => {
  const header = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx");
  const css = read("src/features/invoice/templates/classic-ledger/classic-ledger.module.css");
  assert.match(header, /headerImageFailed/);
  assert.match(header, /CLASSIC_LEDGER_HEADER_IMAGE_PATH/);
  assert.match(header, /styles\.brandImageHeader/);
  assert.match(header, /styles\.brandHeader/);
  assert.match(css, /\.brandImageHeader[\s\S]*height:\s*150px/);
  assert.match(css, /data-paper-size="A5"[\s\S]*\.brandImageHeader[\s\S]*105px/);
});

test("native PDF uses the same header image and retains coded fallback", () => {
  const exporter = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export.tsx");
  const pdf = read("src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-document.tsx");
  assert.match(exporter, /CLASSIC_LEDGER_HEADER_IMAGE_PATH/);
  assert.match(exporter, /loadHeaderImageDataUrl/);
  assert.match(pdf, /headerImageSrc/);
  assert.match(pdf, /styles\.brandHeaderImage/);
  assert.match(pdf, /styles\.brandHeader/);
});

test("image-first header does not bake invoice transaction fields into the asset", () => {
  const header = read("src/features/invoice/templates/classic-ledger/components/classic-ledger-header.tsx");
  assert.match(header, /documentTitle/);
  assert.match(header, /metaPanel/);
  assert.match(header, /customerSection/);
  assert.ok(header.indexOf("brandImageHeader") < header.indexOf("documentTitle"));
});
