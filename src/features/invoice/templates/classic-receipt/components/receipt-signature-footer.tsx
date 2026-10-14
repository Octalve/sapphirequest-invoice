"use client";

import type { BusinessIdentityProfile } from "../../../types";
import type { ClassicReceiptDraft } from "../types";
import { ReceiptSignatureSlot } from "./receipt-signature-slot";
import styles from "../classic-receipt.module.css";

interface ReceiptSignatureFooterProps {
  draft: ClassicReceiptDraft;
  businessProfile: BusinessIdentityProfile;
  balanceRemaining: number | null;
  signatureUploadsEnabled?: boolean;
  onChange: <K extends keyof ClassicReceiptDraft>(
    key: K,
    value: ClassicReceiptDraft[K],
  ) => void;
}

export function ReceiptSignatureFooter({
  draft,
  businessProfile,
  balanceRemaining,
  signatureUploadsEnabled = true,
  onChange,
}: ReceiptSignatureFooterProps) {
  return (
    <footer className={styles.signatureFooter}>
      <section className={styles.signatureArea}>
        <ReceiptSignatureSlot
          signatureDataUrl={draft.companySignatureDataUrl}
          label={`For: ${businessProfile.name || "Business"} / Authorised Signatory`}
          uploadLabel="Upload company authorised signature"
          uploadsEnabled={signatureUploadsEnabled}
          onChange={(dataUrl) => onChange("companySignatureDataUrl", dataUrl)}
        />
        <ReceiptSignatureSlot
          signatureDataUrl={draft.customerSignatureDataUrl}
          label="Customer's Signature"
          labelClassName={styles.customerSignature}
          uploadLabel="Upload customer signature"
          uploadsEnabled={signatureUploadsEnabled}
          onChange={(dataUrl) => onChange("customerSignatureDataUrl", dataUrl)}
        />
      </section>

      <section className={styles.referenceRow}>
        <label>
          <span>Reference:</span>
          <input
            value={draft.reference}
            onChange={(event) => onChange("reference", event.target.value)}
            placeholder="Optional booking, order or transaction reference"
          />
        </label>
        <p>
          {balanceRemaining === null
            ? "Receipt valid upon payment confirmation."
            : "Balance shown above remains outstanding."}
        </p>
      </section>
    </footer>
  );
}
