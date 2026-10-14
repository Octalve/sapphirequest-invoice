import { COMPANY_IDENTITY, CURRENCIES } from "../constants";
import {
  calculateLineAmount,
  clampPercent,
  parseMoneyInput,
  parseQuantityInput,
} from "../lib/calculations";
import { formatMoney, formatNumber } from "../lib/currency";
import type {
  BusinessIdentityProfile,
  BusinessPaymentSettings,
  CurrencyCode,
  InvoiceDraft,
  InvoiceTotals,
  PaperSize,
} from "../types";

export interface InvoicePresentationItem {
  id: string;
  serial: number;
  title: string;
  description: string;
  quantity: number;
  quantityDisplay: string;
  unitPrice: number;
  unitPriceDisplay: string;
  discountPercent: number;
  amount: number;
  amountDisplay: string;
}

export interface InvoicePresentation {
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  paperSize: PaperSize;
  currency: CurrencyCode;
  currencySymbol: string;
  sender: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  company: {
    name: string;
    phone: string;
    email: string;
    website: string;
    social: string;
    address: string;
    tinNo: string;
    rcNo: string;
  };
  items: InvoicePresentationItem[];
  payment: BusinessPaymentSettings;
  notes: string;
  extraDetailsVisible: boolean;
  totals: InvoiceTotals;
}

export interface BuildInvoicePresentationOptions {
  draft: InvoiceDraft;
  paymentSettings: BusinessPaymentSettings;
  totals: InvoiceTotals;
  invoiceNo?: string;
  companyProfile?: BusinessIdentityProfile;
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : String(Number(quantity.toFixed(2)));
}

export function buildInvoicePresentation({
  draft,
  paymentSettings,
  totals,
  invoiceNo,
  companyProfile,
}: BuildInvoicePresentationOptions): InvoicePresentation {
  return {
    invoiceNo: invoiceNo ?? draft.invoiceNo,
    issueDate: [draft.day, draft.month, draft.year].filter(Boolean).join(" "),
    dueDate: [draft.dueDay, draft.dueMonth, draft.dueYear].filter(Boolean).join(" "),
    paperSize: draft.paperSize,
    currency: draft.currency,
    currencySymbol: CURRENCIES[draft.currency].symbol,
    sender: {
      name: draft.senderName.trim(),
      email: draft.senderEmail.trim(),
      phone: draft.senderPhone.trim(),
      role: draft.senderRole.trim(),
    },
    client: {
      name: draft.clientName.trim(),
      email: draft.clientEmail.trim(),
      phone: draft.clientPhone.trim(),
      address: draft.clientAddress.trim(),
    },
    company: {
      ...COMPANY_IDENTITY,
      name: companyProfile ? companyProfile.name.trim() : COMPANY_IDENTITY.name,
      phone: companyProfile?.phone.trim() ?? COMPANY_IDENTITY.phone,
      email: companyProfile?.email.trim() ?? COMPANY_IDENTITY.email,
      website: companyProfile?.website.trim() ?? COMPANY_IDENTITY.website,
      address: companyProfile?.address.trim() ?? "",
      tinNo: companyProfile ? companyProfile.tinNo.trim() : draft.tinNo.trim(),
      rcNo: companyProfile ? companyProfile.rcNo.trim() : draft.rcNo.trim(),
    },
    items: draft.rows.map((row, index) => {
      const quantity = parseQuantityInput(row.quantity);
      const unitPrice = parseMoneyInput(row.unitPrice);
      const discountPercent = clampPercent(row.discount);
      const amount = calculateLineAmount(row);

      return {
        id: row.id,
        serial: index + 1,
        title: row.serviceName.trim(),
        description: row.description.trim(),
        quantity,
        quantityDisplay: formatQuantity(quantity),
        unitPrice,
        unitPriceDisplay: formatMoney(unitPrice, draft.currency),
        discountPercent,
        amount,
        amountDisplay: formatMoney(amount, draft.currency),
      };
    }),
    payment: { ...paymentSettings },
    notes: draft.notes.trim(),
    extraDetailsVisible: draft.extraDetailsVisible,
    totals,
  };
}

/** Native PDF money is composed from a locked currency-symbol element + this number. */
export function formatPdfNumber(amount: number, currency: CurrencyCode): string {
  return formatNumber(amount, currency);
}
