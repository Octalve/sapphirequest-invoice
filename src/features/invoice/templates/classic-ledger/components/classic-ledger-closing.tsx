"use client";

import { formatAmountInWords } from "../../../lib/amount-in-words";
import { formatMoney } from "../../../lib/currency";
import type { BusinessPaymentSettings, InvoiceDraft, InvoiceTotals } from "../../../types";
import styles from "../classic-ledger.module.css";

interface ClassicLedgerClosingProps {
  draft: InvoiceDraft;
  totals: InvoiceTotals;
  paymentSettings: BusinessPaymentSettings;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
  onPercentageBlur: (key: "discount" | "tax") => void;
  onPaymentSettingChange: <K extends keyof BusinessPaymentSettings>(key: K, value: BusinessPaymentSettings[K]) => void;
}

export function ClassicLedgerClosing({
  draft,
  totals,
  paymentSettings,
  onDraftChange,
  onPercentageBlur,
  onPaymentSettingChange,
}: ClassicLedgerClosingProps) {
  return (
    <>
      <section className={styles.summaryBand}>
        <div className={styles.amountWords}>
          <span>Amount in Words</span>
          <strong>{formatAmountInWords(totals.total, draft.currency)}</strong>
        </div>

        <div className={styles.summary} aria-label="Invoice totals">
          <div><span>Subtotal</span><strong>{formatMoney(totals.subtotal, draft.currency)}</strong></div>
          <div>
            <label>
              Discount
              <input
                value={draft.discount}
                inputMode="decimal"
                aria-label="Classic Ledger invoice discount percent"
                onChange={(event) => onDraftChange("discount", event.target.value.replace(/[^\d.]/g, ""))}
                onBlur={() => onPercentageBlur("discount")}
              />
              %
            </label>
            <strong>-{formatMoney(totals.discountAmount, draft.currency)}</strong>
          </div>
          <div>
            <label>
              Tax
              <input
                value={draft.tax}
                inputMode="decimal"
                aria-label="Classic Ledger invoice tax percent"
                onChange={(event) => onDraftChange("tax", event.target.value.replace(/[^\d.]/g, ""))}
                onBlur={() => onPercentageBlur("tax")}
              />
              %
            </label>
            <strong>{formatMoney(totals.taxAmount, draft.currency)}</strong>
          </div>
          <div className={styles.grandTotal}><span>TOTAL</span><strong>{formatMoney(totals.total, draft.currency)}</strong></div>
        </div>
      </section>

      {draft.extraDetailsVisible ? (
        <section className={styles.extraDetails}>
          <div>
            <h2>Payment Details</h2>
            <label><span>Bank</span><input value={paymentSettings.bankName} onChange={(event) => onPaymentSettingChange("bankName", event.target.value)} placeholder="Bank name" /></label>
            <label><span>Account Name</span><input value={paymentSettings.accountName} onChange={(event) => onPaymentSettingChange("accountName", event.target.value)} placeholder="Account name" /></label>
            <label><span>Account No.</span><input value={paymentSettings.accountNumber} onChange={(event) => onPaymentSettingChange("accountNumber", event.target.value)} placeholder="Account number" /></label>
          </div>
          <div>
            <h2>Terms &amp; Notes</h2>
            <textarea value={draft.notes} rows={4} onChange={(event) => onDraftChange("notes", event.target.value)} placeholder="Payment terms or additional notes" />
          </div>
        </section>
      ) : null}

      <section className={styles.signatures} aria-label="Signatures">
        <div>
          <span className={styles.signatureLine} />
          <strong>Customer Signature</strong>
        </div>
        <div>
          <span className={styles.signatureLine} />
          <strong>{draft.senderName || "Authorised Signatory"}</strong>
          {draft.senderRole ? <small>{draft.senderRole}</small> : null}
        </div>
      </section>
    </>
  );
}
