"use client";

import { useId, useState } from "react";
import {
  optimizeReceiptSignatureImage,
  RECEIPT_SIGNATURE_ACCEPT,
} from "../lib/signature-image";
import styles from "../classic-receipt.module.css";

interface ReceiptSignatureSlotProps {
  signatureDataUrl: string;
  label: string;
  labelClassName?: string;
  uploadLabel: string;
  uploadsEnabled: boolean;
  onChange: (dataUrl: string) => void;
}

export function ReceiptSignatureSlot({
  signatureDataUrl,
  label,
  labelClassName,
  uploadLabel,
  uploadsEnabled,
  onChange,
}: ReceiptSignatureSlotProps) {
  const inputId = useId();
  const [processing, setProcessing] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setProcessing(true);
    try {
      const dataUrl = await optimizeReceiptSignatureImage(file);
      onChange(dataUrl);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "The signature image could not be prepared.",
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className={styles.signatureCell}>
      {uploadsEnabled ? (
        <div className={styles.signatureControls} data-export-ignore="true">
          <label className={styles.signatureUploadButton} htmlFor={inputId}>
            {processing ? "Preparing..." : signatureDataUrl ? "Replace" : "Upload"}
          </label>
          <input
            id={inputId}
            className={styles.signatureFileInput}
            type="file"
            accept={RECEIPT_SIGNATURE_ACCEPT}
            disabled={processing}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.currentTarget.value = "";
              void handleFile(file);
            }}
            aria-label={uploadLabel}
          />
          {signatureDataUrl ? (
            <button
              className={styles.signatureRemoveButton}
              type="button"
              onClick={() => onChange("")}
            >
              Remove
            </button>
          ) : null}
        </div>
      ) : null}

      <div className={styles.signatureImageSlot}>
        {signatureDataUrl ? (
          <img
            className={styles.signatureImage}
            src={signatureDataUrl}
            alt=""
            draggable={false}
          />
        ) : null}
      </div>
      <span className={styles.signatureLine} />
      <span className={labelClassName}>{label}</span>
    </div>
  );
}
