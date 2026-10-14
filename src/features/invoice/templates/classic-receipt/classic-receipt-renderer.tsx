"use client";

import { type CSSProperties, type Ref } from "react";
import { CURRENCIES } from "../../constants";
import { formatAmountInWords } from "../../lib/amount-in-words";
import { parseMoneyInput } from "../../lib/calculations";
import { darkenHex, normalizeAccentColor } from "../../lib/template-theme";
import type { BusinessIdentityProfile } from "../../types";
import { ReceiptBrandHeader } from "./components/receipt-brand-header";
import { ReceiptDetailsSection } from "./components/receipt-details-section";
import { ReceiptDocumentMeta } from "./components/receipt-document-meta";
import { ReceiptPaymentSection } from "./components/receipt-payment-section";
import { ReceiptSignatureFooter } from "./components/receipt-signature-footer";
import type { ClassicReceiptDraft, ReceiptPaymentMethod } from "./types";
import styles from "./classic-receipt.module.css";

interface ClassicReceiptRendererProps {
  containerRef?: Ref<HTMLDivElement>;
  accentColor?: string;
  draft: ClassicReceiptDraft;
  businessProfile: BusinessIdentityProfile;
  onBusinessProfileChange: <K extends keyof BusinessIdentityProfile>(
    key: K,
    value: BusinessIdentityProfile[K],
  ) => void;
  onChange: <K extends keyof ClassicReceiptDraft>(
    key: K,
    value: ClassicReceiptDraft[K],
  ) => void;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onReceiptSequenceChange: (value: string | number) => void;
  onPaymentMethodChange: (value: ReceiptPaymentMethod) => void;
  onAmountBlur: (key: "amountReceived" | "balanceRemaining") => void;
  signatureUploadsEnabled?: boolean;
}

export function ClassicReceiptRenderer({
  containerRef,
  accentColor,
  draft,
  businessProfile,
  onBusinessProfileChange,
  onChange,
  onDateChange,
  onReceiptSequenceChange,
  onPaymentMethodChange,
  onAmountBlur,
  signatureUploadsEnabled = true,
}: ClassicReceiptRendererProps) {
  const resolvedAccent = normalizeAccentColor(accentColor);
  const themeStyle = {
    "--template-accent": resolvedAccent,
    "--template-accent-dark": darkenHex(resolvedAccent),
  } as CSSProperties;

  const amount = parseMoneyInput(draft.amountReceived);
  const balance = draft.balanceRemaining.trim()
    ? parseMoneyInput(draft.balanceRemaining)
    : null;
  const currency = CURRENCIES[draft.currency];
  const amountInWords = formatAmountInWords(amount, draft.currency);

  return (
    <div
      ref={containerRef}
      id="invoice-document"
      data-invoice-renderer="classic-receipt-v2"
      data-template-id="classic-receipt"
      data-paper-size={draft.paperSize}
      data-orientation="landscape"
      className={styles.page}
      style={themeStyle}
    >
      <ReceiptBrandHeader
        businessProfile={businessProfile}
        onBusinessProfileChange={onBusinessProfileChange}
      />

      <ReceiptDocumentMeta
        draft={draft}
        onDateChange={onDateChange}
        onReceiptSequenceChange={onReceiptSequenceChange}
      />

      <ReceiptDetailsSection
        draft={draft}
        amountInWords={amountInWords}
        onChange={onChange}
      />

      <ReceiptPaymentSection
        draft={draft}
        currencySymbol={currency.symbol}
        onChange={onChange}
        onPaymentMethodChange={onPaymentMethodChange}
        onAmountBlur={onAmountBlur}
      />

      <ReceiptSignatureFooter
        draft={draft}
        businessProfile={businessProfile}
        balanceRemaining={balance}
        signatureUploadsEnabled={signatureUploadsEnabled}
        onChange={onChange}
      />
    </div>
  );
}
