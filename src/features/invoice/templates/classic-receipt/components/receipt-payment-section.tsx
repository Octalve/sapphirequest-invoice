"use client";

import { receiptMoneyDensity, type ReceiptTextDensity } from "../lib/receipt-layout";
import type { ClassicReceiptDraft, ReceiptPaymentMethod } from "../types";
import styles from "../classic-receipt.module.css";

const METHOD_LABELS: Record<ReceiptPaymentMethod, string> = {
  cash: "Cash",
  transfer: "Transfer",
  cheque: "Cheque",
  pos: "POS",
  other: "Other",
};

interface ReceiptPaymentSectionProps {
  draft: ClassicReceiptDraft;
  currencySymbol: string;
  onChange: <K extends keyof ClassicReceiptDraft>(
    key: K,
    value: ClassicReceiptDraft[K],
  ) => void;
  onPaymentMethodChange: (value: ReceiptPaymentMethod) => void;
  onAmountBlur: (key: "amountReceived" | "balanceRemaining") => void;
}

function moneyDensityClass(value: string) {
  const density: ReceiptTextDensity = receiptMoneyDensity(value);
  if (density === "micro") return styles.moneyMicro;
  if (density === "tight") return styles.moneyTight;
  if (density === "compact") return styles.moneyCompact;
  return "";
}

export function ReceiptPaymentSection({
  draft,
  currencySymbol,
  onChange,
  onPaymentMethodChange,
  onAmountBlur,
}: ReceiptPaymentSectionProps) {
  return (
    <section className={styles.paymentSection}>
      <div className={styles.amountRow}>
        <label className={styles.amountField}>
          <span>Amount in Figure:</span>
          <span className={styles.moneyInput}>
            <b>{currencySymbol}</b>
            <input
              className={moneyDensityClass(draft.amountReceived)}
              value={draft.amountReceived}
              inputMode="decimal"
              onChange={(event) => onChange("amountReceived", event.target.value)}
              onBlur={() => onAmountBlur("amountReceived")}
            />
          </span>
        </label>

        <label className={styles.amountField}>
          <span>Balance:</span>
          <span className={styles.moneyInput}>
            <b>{currencySymbol}</b>
            <input
              className={moneyDensityClass(draft.balanceRemaining)}
              value={draft.balanceRemaining}
              inputMode="decimal"
              placeholder="Optional"
              onChange={(event) => onChange("balanceRemaining", event.target.value)}
              onBlur={() => onAmountBlur("balanceRemaining")}
            />
          </span>
        </label>
      </div>

      <div className={styles.paymentMethods}>
        <strong>Payment Method:</strong>
        {Object.entries(METHOD_LABELS).map(([method, label]) => {
          const value = method as ReceiptPaymentMethod;
          const selected = draft.paymentMethod === value;

          return (
            <button
              type="button"
              key={method}
              className={styles.method}
              onClick={() => onPaymentMethodChange(value)}
              aria-pressed={selected}
            >
              <span className={selected ? styles.boxChecked : styles.box} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
