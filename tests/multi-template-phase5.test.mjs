import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".multi-template-phase5-test");
const registry = require(resolve(compiledRoot, "templates", "registry.js"));
const theme = require(resolve(compiledRoot, "lib", "template-theme.js"));

test("the platform exposes exactly the three approved document templates", () => {
  assert.deepEqual(Object.keys(registry.INVOICE_TEMPLATES), ["octalve", "classic-ledger", "classic-receipt"]);
  assert.equal(registry.DEFAULT_INVOICE_TEMPLATE_ID, "octalve");
});

test("legacy or unknown template selections resolve safely to Octalve through the id guard", () => {
  assert.equal(registry.isInvoiceTemplateId("octalve"), true);
  assert.equal(registry.isInvoiceTemplateId("classic-ledger"), true);
  assert.equal(registry.isInvoiceTemplateId("classic-receipt"), true);
  assert.equal(registry.isInvoiceTemplateId("unknown-template"), false);
  assert.equal(registry.isInvoiceTemplateId(null), false);
});

test("only Classic Ledger and Classic Receipt allow accent personalization", () => {
  assert.equal(registry.INVOICE_TEMPLATES.octalve.customizableAccent, false);
  assert.equal(registry.INVOICE_TEMPLATES["classic-ledger"].customizableAccent, true);
  assert.equal(registry.INVOICE_TEMPLATES["classic-receipt"].customizableAccent, true);
});

test("Sapphire blue remains the canonical default accent and approved dark companion", () => {
  assert.equal(theme.DEFAULT_TEMPLATE_ACCENT, "#0755DB");
  assert.equal(theme.DEFAULT_TEMPLATE_ACCENT_DARK, "#043996");
  assert.equal(theme.normalizeAccentColor(undefined), "#0755DB");
  assert.equal(theme.darkenHex("#0755DB"), "#043996");
});

test("custom colors are normalized and receive a deterministic darker companion", () => {
  assert.equal(theme.normalizeAccentColor(" #aa44cc "), "#AA44CC");
  assert.equal(theme.normalizeAccentColor("red"), "#0755DB");
  assert.equal(theme.darkenHex("#AA44CC"), "#7A3193");
});

test("template kinds keep invoice and receipt semantics distinct", () => {
  assert.equal(registry.INVOICE_TEMPLATES.octalve.documentKind, "invoice");
  assert.equal(registry.INVOICE_TEMPLATES["classic-ledger"].documentKind, "invoice");
  assert.equal(registry.INVOICE_TEMPLATES["classic-receipt"].documentKind, "receipt");
});
