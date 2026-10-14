"use client";

import { useState } from "react";
import {
  RECEIPT_DOCUMENT_PREFIX,
  RECEIPT_DOCUMENT_SUFFIX,
  editableReceiptSequence,
  sanitizeReceiptSequenceInput,
} from "../lib/receipt-numbering";
import type { ClassicReceiptDraft } from "../types";
import styles from "../classic-receipt.module.css";

interface ReceiptDocumentMetaProps {
  draft: ClassicReceiptDraft;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onReceiptSequenceChange: (value: string | number) => void;
}

function ReceiptSequenceEditor({
  receiptNo,
  onCommit,
}: {
  receiptNo: string;
  onCommit: (value: string | number) => void;
}) {
  const [value, setValue] = useState(() => editableReceiptSequence(receiptNo));

  return (
    <span className={styles.receiptNumber}>
      <span>{RECEIPT_DOCUMENT_PREFIX}-</span>
      <input
        aria-label="Classic Receipt sequence number"
        inputMode="numeric"
        maxLength={5}
        value={value}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setValue(sanitizeReceiptSequenceInput(event.target.value))}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        onBlur={() => {
          onCommit(value);
          setValue(
            editableReceiptSequence(
              `${RECEIPT_DOCUMENT_PREFIX}-${String(
                Math.max(1, Number.parseInt(value || "1", 10)),
              ).padStart(5, "0")}-${RECEIPT_DOCUMENT_SUFFIX}`,
            ),
          );
        }}
      />
      <span>-{RECEIPT_DOCUMENT_SUFFIX}</span>
    </span>
  );
}

export function ReceiptDocumentMeta({
  draft,
  onDateChange,
  onReceiptSequenceChange,
}: ReceiptDocumentMetaProps) {
  return (
    <>
      <div className={styles.title}>RECEIPT</div>

      <section className={styles.metaRow}>
        <label className={styles.dateBlock}>
          <span>Date:</span>
          <span className={styles.dateFields}>
            <input
              aria-label="Receipt day"
              value={draft.day}
              maxLength={2}
              inputMode="numeric"
              onChange={(event) =>
                onDateChange("day", event.target.value.replace(/\D/g, "").slice(0, 2))
              }
            />
            <span>/</span>
            <input
              aria-label="Receipt month"
              value={draft.month}
              maxLength={3}
              onChange={(event) =>
                onDateChange(
                  "month",
                  event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase(),
                )
              }
            />
            <span>/</span>
            <input
              aria-label="Receipt year"
              value={draft.year}
              maxLength={4}
              inputMode="numeric"
              onChange={(event) =>
                onDateChange("year", event.target.value.replace(/\D/g, "").slice(0, 4))
              }
            />
          </span>
        </label>

        <div className={styles.numberBlock}>
          <span>No.:</span>
          <ReceiptSequenceEditor
            key={draft.receiptNo}
            receiptNo={draft.receiptNo}
            onCommit={onReceiptSequenceChange}
          />
        </div>
      </section>
    </>
  );
}
