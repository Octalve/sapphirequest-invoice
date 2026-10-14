import type { BusinessIdentityProfile, CurrencyCode, PaperSize } from "../../types";

export const receiptPaymentMethods = ["cash", "transfer", "cheque", "pos", "other"] as const;
export type ReceiptPaymentMethod = (typeof receiptPaymentMethods)[number];

export interface ClassicReceiptDraft {
  receiptNo: string;
  day: string;
  month: string;
  year: string;
  receivedFrom: string;
  paymentPurpose: string;
  amountReceived: string;
  balanceRemaining: string;
  paymentMethod: ReceiptPaymentMethod;
  reference: string;
  companySignatureDataUrl: string;
  customerSignatureDataUrl: string;
  currency: CurrencyCode;
  paperSize: PaperSize;
}

export interface ClassicReceiptPresentation {
  receiptNo: string;
  date: string;
  receivedFrom: string;
  paymentPurpose: string;
  amountReceived: number;
  balanceRemaining: number | null;
  amountInWords: string;
  paymentMethod: ReceiptPaymentMethod;
  reference: string;
  companySignatureDataUrl: string;
  customerSignatureDataUrl: string;
  currency: CurrencyCode;
  paperSize: PaperSize;
  company: BusinessIdentityProfile;
}
