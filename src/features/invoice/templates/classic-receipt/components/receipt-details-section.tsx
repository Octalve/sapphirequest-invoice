"use client";

import {
  receiptFieldDensity,
  receiptWordsDensity,
  splitReceiptAmountWords,
  type ReceiptTextDensity,
} from "../lib/receipt-layout";
import type { ClassicReceiptDraft } from "../types";
import { ReceiptAutoTextarea } from "./receipt-auto-textarea";
import styles from "../classic-receipt.module.css";

interface ReceiptDetailsSectionProps {
  draft: ClassicReceiptDraft;
  amountInWords: string;
  onChange: <K extends keyof ClassicReceiptDraft>(
    key: K,
    value: ClassicReceiptDraft[K],
  ) => void;
}

function densityClass(kind: ReceiptTextDensity) {
  if (kind === "micro") return styles.textMicro;
  if (kind === "tight") return styles.textTight;
  if (kind === "compact") return styles.textCompact;
  return "";
}

export function ReceiptDetailsSection({
  draft,
  amountInWords,
  onChange,
}: ReceiptDetailsSectionProps) {
  const [firstWords, secondWords] = splitReceiptAmountWords(amountInWords.toUpperCase());
  const wordsDensity = densityClass(receiptWordsDensity(amountInWords));
  const receivedDensity = densityClass(receiptFieldDensity(draft.receivedFrom));
  const purposeDensity = densityClass(receiptFieldDensity(draft.paymentPurpose));

  return (
    <section className={styles.detailsSection}>
      <label className={styles.fieldRow}>
        <span>Received From:</span>
        <ReceiptAutoTextarea
          rows={1}
          className={receivedDensity}
          value={draft.receivedFrom}
          onChange={(event) => onChange("receivedFrom", event.target.value)}
          placeholder="Customer or company name"
        />
      </label>

      <div className={styles.sumSection}>
        <div className={styles.sumFirstLine}>
          <span>The Sum of:</span>
          <strong className={wordsDensity}>{firstWords}</strong>
        </div>
        <strong className={`${styles.sumSecondLine} ${wordsDensity}`}>{secondWords || " "}</strong>
      </div>

      <label className={styles.fieldRow}>
        <span>Being Payment for:</span>
        <ReceiptAutoTextarea
          rows={1}
          className={purposeDensity}
          value={draft.paymentPurpose}
          onChange={(event) => onChange("paymentPurpose", event.target.value)}
          placeholder="Purpose of payment"
        />
      </label>
    </section>
  );
}
