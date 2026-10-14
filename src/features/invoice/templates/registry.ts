import type { InvoiceTemplateDefinition, InvoiceTemplateId } from "./types";

export const DEFAULT_INVOICE_TEMPLATE_ID: InvoiceTemplateId = "octalve";
export const TEMPLATE_SELECTION_STORAGE_KEY = "sq_invoice_template_v1";

export const INVOICE_TEMPLATES: Record<InvoiceTemplateId, InvoiceTemplateDefinition> = {
  octalve: {
    id: "octalve",
    name: "Octalve Template",
    category: "Modern",
    description: "The frozen modern Sapphire invoice template.",
    version: "1.0",
    documentKind: "invoice",
    customizableAccent: false,
    pdfAvailable: true,
  },
  "classic-ledger": {
    id: "classic-ledger",
    name: "Classic Ledger",
    category: "Classic",
    description: "A formal ledger-inspired invoice with amount-in-words and signatures.",
    version: "0.3",
    documentKind: "invoice",
    customizableAccent: true,
    pdfAvailable: true,
  },
  "classic-receipt": {
    id: "classic-receipt",
    name: "Classic Receipt",
    category: "Receipt",
    description: "A formal payment receipt with amount-in-words, payment method and signatures.",
    version: "0.4",
    documentKind: "receipt",
    customizableAccent: true,
    pdfAvailable: true,
  },
};

export function isInvoiceTemplateId(value: string | null | undefined): value is InvoiceTemplateId {
  return value === "octalve" || value === "classic-ledger" || value === "classic-receipt";
}
