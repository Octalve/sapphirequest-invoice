import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".template-isolation-phase51-test");
const business = require(resolve(compiledRoot, "templates", "business-profile.js"));
const ledgerStorage = require(resolve(compiledRoot, "templates", "classic-ledger", "storage.js"));
const receiptProfile = require(resolve(compiledRoot, "templates", "classic-receipt", "pdf", "classic-receipt-pdf-profile.js"));

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

test("Classic Ledger has its own invoice, payment, currency and paper storage namespace", () => {
  const scope = ledgerStorage.CLASSIC_LEDGER_INVOICE_STORAGE_SCOPE;
  assert.equal(scope.draftStorageKey, "sq_classic_ledger_invoice_draft_v1");
  assert.equal(scope.paymentSettingsStorageKey, "sq_classic_ledger_payment_settings_v1");
  assert.equal(scope.currencyStorageKey, "sq_classic_ledger_currency_v1");
  assert.equal(scope.paperSizeStorageKey, "sq_classic_ledger_paper_size_v1");
  assert.deepEqual(scope.legacyDraftStorageKeys, []);
});

test("Classic Ledger and Classic Receipt business profiles persist under different keys", () => {
  assert.equal(business.TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS["classic-ledger"], "sq_template_business_profile_v1:classic-ledger");
  assert.equal(business.TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS["classic-receipt"], "sq_template_business_profile_v1:classic-receipt");
  assert.notEqual(
    business.TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS["classic-ledger"],
    business.TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS["classic-receipt"],
  );
});

test("business profile defaults are complete but template-editable", () => {
  const profile = business.createDefaultTemplateBusinessProfile();
  assert.ok(profile.name.length > 0);
  assert.ok(profile.phone.length > 0);
  assert.ok(profile.email.length > 0);
  assert.ok(profile.website.length > 0);
  assert.equal(profile.address, "");
});

test("Classic Receipt uses true landscape physical pages", () => {
  const { A4, A5, LETTER } = receiptProfile.CLASSIC_RECEIPT_PDF_PROFILES;
  assert.equal(round(A4.widthPt), 841.89);
  assert.equal(round(A4.heightPt), 595.28);
  assert.equal(round(A5.widthPt), 595.28);
  assert.equal(round(A5.heightPt), 419.53);
  assert.equal(LETTER.widthPt, 792);
  assert.equal(LETTER.heightPt, 612);
  assert.ok(A4.widthPt > A4.heightPt);
  assert.ok(A5.widthPt > A5.heightPt);
  assert.ok(LETTER.widthPt > LETTER.heightPt);
});
