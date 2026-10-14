import type {
  BusinessPaymentSettings,
  CurrencyCode,
  CurrencyDefinition,
  DocumentTypeCode,
  InvoiceDraft,
  PaperDefinition,
  PaperSize,
} from "./types";

export const DRAFT_STORAGE_KEY = "sq_invoice_draft_v5";
export const LEGACY_DRAFT_STORAGE_KEYS = [
  "sq_invoice_draft_v4",
  "sq_invoice_draft_v3",
  "sq_invoice_draft_v2",
] as const;
export const BUSINESS_SETTINGS_STORAGE_KEY = "sq_business_settings_v1";
export const CURRENCY_STORAGE_KEY = "sq_currency";
export const PAPER_SIZE_STORAGE_KEY = "sq_paper_size";
export const DOCUMENT_COUNTER_STORAGE_KEY = "sq_document_counter_v1";

export const COMPANY_DOCUMENT_PREFIX = "SQ";
export const DOCUMENT_TYPE_CODE: DocumentTypeCode = "INV";

export const COMPANY_IDENTITY = {
  name: "Sapphire Quest Travel & Tours Ltd",
  phone: "09162974349",
  email: "info@sapphirequesttravel.com",
  website: "sapphirequesttravel.com",
  social: "@sapphirequesttravel",
  iconPath: "/SapphireQuestIcon.png",
} as const;

/** Approved Octalve accent blue retained for product/brand contexts. */
export const OCTALVE_PRIMARY = "#0064E0";
/** Footer attribution uses approved Octalve Deep Navy after Phase 2.6 visual review. */
export const OCTALVE_ATTRIBUTION = "#021A34";

export const MONTHS_3 = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

export const CURRENCIES: Record<CurrencyCode, CurrencyDefinition> = {
  NGN: { code: "NGN", symbol: "₦", locale: "en-NG", label: "NGN ₦" },
  USD: { code: "USD", symbol: "$", locale: "en-US", label: "USD $" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", label: "GBP £" },
  EUR: { code: "EUR", symbol: "€", locale: "en-IE", label: "EUR €" },
};

export const PAPER_DEFINITIONS: Record<PaperSize, PaperDefinition> = {
  A4: {
    code: "A4",
    label: "A4",
    widthMm: 210,
    heightMm: 297,
    previewWidthPx: 794,
    marginMm: 10,
  },
  A5: {
    code: "A5",
    label: "A5",
    widthMm: 148,
    heightMm: 210,
    previewWidthPx: 559,
    marginMm: 7,
  },
  LETTER: {
    code: "LETTER",
    label: "Letter",
    widthMm: 215.9,
    heightMm: 279.4,
    previewWidthPx: 816,
    marginMm: 10,
  },
};

export const DEFAULT_PAYMENT_SETTINGS: BusinessPaymentSettings = {
  bankName: "",
  accountName: "",
  accountNumber: "",
};

export function createEmptyInvoiceDraft(now = new Date()): InvoiceDraft {
  const day = String(now.getDate()).padStart(2, "0");
  const month = MONTHS_3[now.getMonth()] ?? "JAN";
  const year = String(now.getFullYear());

  return {
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    senderRole: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    invoiceNo: "",
    day,
    month,
    year,
    dueDay: day,
    dueMonth: month,
    dueYear: year,
    tinNo: "",
    rcNo: "",
    rows: [
      {
        id: "row-1",
        serviceName: "",
        description: "",
        quantity: "1",
        unitPrice: "0",
        discount: "0",
      },
    ],
    discount: "0",
    tax: "0",
    currency: "NGN",
    paperSize: "A4",
    notes: "",
    extraDetailsVisible: false,
  };
}
