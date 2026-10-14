export const invoiceTemplateIds = ["octalve", "classic-ledger", "classic-receipt"] as const;

export type InvoiceTemplateId = (typeof invoiceTemplateIds)[number];

export interface InvoiceTemplateDefinition {
  id: InvoiceTemplateId;
  name: string;
  category: string;
  description: string;
  version: string;
  documentKind: "invoice" | "receipt";
  customizableAccent: boolean;
  pdfAvailable: boolean;
}
