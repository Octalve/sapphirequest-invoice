import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const root = process.cwd();
const compiledRoot = resolve(root, ".phase24-test");
const { PDF_PAPER_PROFILES } = require(resolve(compiledRoot, "presentation", "document-profile.js"));
const { buildInvoicePresentation, formatPdfNumber } = require(resolve(compiledRoot, "presentation", "invoice-presentation.js"));

function closeTo(actual, expected, tolerance = 0.02) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);
}

const draft = {
  senderName: "Aminat",
  senderEmail: "aminat@sapphirequesttravel.com",
  senderPhone: "08000000001",
  senderRole: "Travel Consultant",
  clientName: "Acme Client",
  clientEmail: "client@example.com",
  clientPhone: "08000000000",
  clientAddress: "Abuja",
  invoiceNo: "SQ-00001-INV",
  day: "12",
  month: "OCT",
  year: "2026",
  dueDay: "19",
  dueMonth: "OCT",
  dueYear: "2026",
  tinNo: "TIN-123",
  rcNo: "RC-456",
  rows: [
    {
      id: "row-1",
      serviceName: "Visa Processing",
      description: "UK visitor visa assistance",
      quantity: "2",
      unitPrice: "125,000",
      discount: "10",
    },
  ],
  discount: "5",
  tax: "7.5",
  currency: "NGN",
  paperSize: "A4",
  notes: "Valid for 7 days.",
  extraDetailsVisible: true,
};

const totals = {
  subtotal: 225000,
  discountPercent: 5,
  discountAmount: 11250,
  taxPercent: 7.5,
  taxAmount: 16031.25,
  total: 229781.25,
};

const paymentSettings = {
  bankName: "Example Bank",
  accountName: "Sapphire Quest",
  accountNumber: "1234567890",
};

test("A4 profile uses true ISO A4 physical dimensions", () => {
  closeTo(PDF_PAPER_PROFILES.A4.widthPt, 595.2756);
  closeTo(PDF_PAPER_PROFILES.A4.heightPt, 841.8898);
});

test("A5 profile uses true ISO A5 physical dimensions", () => {
  closeTo(PDF_PAPER_PROFILES.A5.widthPt, 419.5276);
  closeTo(PDF_PAPER_PROFILES.A5.heightPt, 595.2756);
});

test("Letter profile is 612 by 792 PDF points", () => {
  assert.equal(PDF_PAPER_PROFILES.LETTER.widthPt, 612);
  assert.equal(PDF_PAPER_PROFILES.LETTER.heightPt, 792);
});

test("description stays attached beneath its item title and amount is computed", () => {
  const presentation = buildInvoicePresentation({ draft, paymentSettings, totals });
  assert.equal(presentation.items.length, 1);
  assert.equal(presentation.items[0].title, "Visa Processing");
  assert.equal(presentation.items[0].description, "UK visitor visa assistance");
  assert.equal(presentation.items[0].quantity, 2);
  assert.equal(presentation.items[0].unitPrice, 125000);
  assert.equal(presentation.items[0].discountPercent, 10);
  assert.equal(presentation.items[0].amount, 225000);
});

test("committed invoice number can override the draft snapshot without mutating the draft", () => {
  const presentation = buildInvoicePresentation({
    draft,
    paymentSettings,
    totals,
    invoiceNo: "SQ-00002-INV",
  });
  assert.equal(presentation.invoiceNo, "SQ-00002-INV");
  assert.equal(draft.invoiceNo, "SQ-00001-INV");
});

test("native PDF number formatting excludes editable currency text", () => {
  assert.equal(formatPdfNumber(250000, "NGN"), "250,000");
});
