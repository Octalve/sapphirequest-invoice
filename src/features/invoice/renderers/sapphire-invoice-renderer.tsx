"use client";

import type { Ref } from "react";
import { CURRENCIES } from "../constants";
import { getDefaultDocumentDensity } from "../lib/paper";
import type { BusinessPaymentSettings, InvoiceDraft, InvoiceLine, InvoiceTotals } from "../types";
import { InvoiceClosing } from "./html/invoice-closing";
import { InvoiceFooter } from "./html/invoice-footer";
import { InvoiceHeader } from "./html/invoice-header";
import { InvoiceItemsTable } from "./html/invoice-items-table";
import { InvoiceParties } from "./html/invoice-parties";

interface SapphireInvoiceRendererProps {
  containerRef?: Ref<HTMLDivElement>;
  draft: InvoiceDraft;
  paymentSettings: BusinessPaymentSettings;
  totals: InvoiceTotals;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onDueDateChange: (key: "dueDay" | "dueMonth" | "dueYear", value: string) => void;
  onInvoiceSequenceChange: (value: string | number) => void;
  onLineChange: (id: string, patch: Partial<Omit<InvoiceLine, "id">>) => void;
  onLineUnitPriceBlur: (id: string) => void;
  onLineQuantityBlur: (id: string) => void;
  onLineDiscountBlur: (id: string) => void;
  onPercentageBlur: (key: "discount" | "tax") => void;
  onPaymentSettingChange: <K extends keyof BusinessPaymentSettings>(
    key: K,
    value: BusinessPaymentSettings[K],
  ) => void;
}

export function SapphireInvoiceRenderer({
  containerRef,
  draft,
  paymentSettings,
  totals,
  onDraftChange,
  onDateChange,
  onDueDateChange,
  onInvoiceSequenceChange,
  onLineChange,
  onLineUnitPriceBlur,
  onLineQuantityBlur,
  onLineDiscountBlur,
  onPercentageBlur,
  onPaymentSettingChange,
}: SapphireInvoiceRendererProps) {
  const currency = CURRENCIES[draft.currency];
  const density = getDefaultDocumentDensity(draft.paperSize);

  return (
    <div
      ref={containerRef}
      id="invoice-document"
      data-invoice-renderer="sapphire-v6"
      data-paper-size={draft.paperSize}
      data-document-density={density}
      className="sq-invoice-wrapper sq-v4-document shadow-2xl"
    >
      <InvoiceHeader
        draft={draft}
        totals={totals}
        onDateChange={onDateChange}
        onDueDateChange={onDueDateChange}
        onInvoiceSequenceChange={onInvoiceSequenceChange}
        onDraftChange={onDraftChange}
      />

      <InvoiceParties draft={draft} onDraftChange={onDraftChange} />

      <InvoiceItemsTable
        rows={draft.rows}
        currency={draft.currency}
        currencySymbol={currency.symbol}
        onLineChange={onLineChange}
        onLineUnitPriceBlur={onLineUnitPriceBlur}
        onLineQuantityBlur={onLineQuantityBlur}
        onLineDiscountBlur={onLineDiscountBlur}
      />

      <InvoiceClosing
        draft={draft}
        totals={totals}
        paymentSettings={paymentSettings}
        onDraftChange={onDraftChange}
        onPercentageBlur={onPercentageBlur}
        onPaymentSettingChange={onPaymentSettingChange}
      />

      <InvoiceFooter />
    </div>
  );
}
