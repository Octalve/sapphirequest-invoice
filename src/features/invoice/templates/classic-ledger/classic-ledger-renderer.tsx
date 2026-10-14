"use client";

import type { CSSProperties, Ref } from "react";
import { CURRENCIES } from "../../constants";
import { darkenHex, normalizeAccentColor } from "../../lib/template-theme";
import type { BusinessIdentityProfile, BusinessPaymentSettings, InvoiceDraft, InvoiceLine, InvoiceTotals } from "../../types";
import { ClassicLedgerClosing } from "./components/classic-ledger-closing";
import { ClassicLedgerHeader } from "./components/classic-ledger-header";
import { ClassicLedgerItems } from "./components/classic-ledger-items";
import styles from "./classic-ledger.module.css";

interface ClassicLedgerRendererProps {
  containerRef?: Ref<HTMLDivElement>;
  accentColor?: string;
  draft: InvoiceDraft;
  businessProfile: BusinessIdentityProfile;
  paymentSettings: BusinessPaymentSettings;
  totals: InvoiceTotals;
  onBusinessProfileChange: <K extends keyof BusinessIdentityProfile>(key: K, value: BusinessIdentityProfile[K]) => void;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onDueDateChange: (key: "dueDay" | "dueMonth" | "dueYear", value: string) => void;
  onInvoiceSequenceChange: (value: string | number) => void;
  onLineChange: (id: string, patch: Partial<Omit<InvoiceLine, "id">>) => void;
  onLineUnitPriceBlur: (id: string) => void;
  onLineQuantityBlur: (id: string) => void;
  onLineDiscountBlur: (id: string) => void;
  onPercentageBlur: (key: "discount" | "tax") => void;
  onPaymentSettingChange: <K extends keyof BusinessPaymentSettings>(key: K, value: BusinessPaymentSettings[K]) => void;
}

export function ClassicLedgerRenderer({
  containerRef,
  accentColor,
  draft,
  businessProfile,
  paymentSettings,
  totals,
  onBusinessProfileChange,
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
}: ClassicLedgerRendererProps) {
  const currency = CURRENCIES[draft.currency];
  const resolvedAccent = normalizeAccentColor(accentColor);
  const themeStyle = {
    "--template-accent": resolvedAccent,
    "--template-accent-dark": darkenHex(resolvedAccent),
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      id="invoice-document"
      data-invoice-renderer="classic-ledger-v1"
      data-template-id="classic-ledger"
      data-paper-size={draft.paperSize}
      className={styles.page}
      style={themeStyle}
    >
      <ClassicLedgerHeader
        draft={draft}
        businessProfile={businessProfile}
        onBusinessProfileChange={onBusinessProfileChange}
        onDraftChange={onDraftChange}
        onDateChange={onDateChange}
        onDueDateChange={onDueDateChange}
        onInvoiceSequenceChange={onInvoiceSequenceChange}
      />

      <ClassicLedgerItems
        rows={draft.rows}
        currency={draft.currency}
        currencySymbol={currency.symbol}
        onLineChange={onLineChange}
        onLineUnitPriceBlur={onLineUnitPriceBlur}
        onLineQuantityBlur={onLineQuantityBlur}
        onLineDiscountBlur={onLineDiscountBlur}
      />

      <ClassicLedgerClosing
        draft={draft}
        totals={totals}
        paymentSettings={paymentSettings}
        onDraftChange={onDraftChange}
        onPercentageBlur={onPercentageBlur}
        onPaymentSettingChange={onPaymentSettingChange}
      />

    </div>
  );
}
