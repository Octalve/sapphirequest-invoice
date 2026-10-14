import type { InvoiceGeneratorStorageScope } from "../../types";

export const CLASSIC_LEDGER_INVOICE_STORAGE_SCOPE: InvoiceGeneratorStorageScope = {
  draftStorageKey: "sq_classic_ledger_invoice_draft_v1",
  paymentSettingsStorageKey: "sq_classic_ledger_payment_settings_v1",
  currencyStorageKey: "sq_classic_ledger_currency_v1",
  paperSizeStorageKey: "sq_classic_ledger_paper_size_v1",
  legacyDraftStorageKeys: [],
};
