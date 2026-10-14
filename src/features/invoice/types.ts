export const currencyCodes = ["NGN", "USD", "GBP", "EUR"] as const;
export type CurrencyCode = (typeof currencyCodes)[number];

export const paperSizes = ["A4", "A5", "LETTER"] as const;
export type PaperSize = (typeof paperSizes)[number];
export type DocumentDensity = "normal" | "compact";

export const documentTypeCodes = ["INV"] as const;
export type DocumentTypeCode = (typeof documentTypeCodes)[number];

export interface CurrencyDefinition {
  code: CurrencyCode;
  symbol: string;
  locale: string;
  label: string;
}

export interface PaperDefinition {
  code: PaperSize;
  label: string;
  widthMm: number;
  heightMm: number;
  previewWidthPx: number;
  marginMm: number;
}

export interface InvoiceLine {
  id: string;
  serviceName: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discount: string;
}

export interface InvoiceDraft {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderRole: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  invoiceNo: string;
  day: string;
  month: string;
  year: string;
  dueDay: string;
  dueMonth: string;
  dueYear: string;
  tinNo: string;
  rcNo: string;
  rows: InvoiceLine[];
  discount: string;
  tax: string;
  currency: CurrencyCode;
  paperSize: PaperSize;
  notes: string;
  extraDetailsVisible: boolean;
}

export interface InvoiceDraftMetadata {
  dateManuallyEdited: boolean;
  invoiceNumberCommitted: boolean;
}

export interface PersistedInvoiceDraft extends InvoiceDraft, InvoiceDraftMetadata {
  version: 5;
}



export interface InvoiceGeneratorStorageScope {
  draftStorageKey: string;
  paymentSettingsStorageKey: string;
  currencyStorageKey: string;
  paperSizeStorageKey: string;
  legacyDraftStorageKeys: readonly string[];
}

export interface BusinessIdentityProfile {
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tinNo: string;
  rcNo: string;
}

export interface BusinessPaymentSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

export type ExportFormat = "pdf" | "png";
