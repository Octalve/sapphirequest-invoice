"use client";

import { formatMoney } from "../../lib/currency";
import type { BusinessPaymentSettings, InvoiceDraft, InvoiceTotals } from "../../types";
import { AutoResizeTextarea } from "./auto-resize-textarea";

interface InvoiceClosingProps {
  draft: InvoiceDraft;
  totals: InvoiceTotals;
  paymentSettings: BusinessPaymentSettings;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
  onPercentageBlur: (key: "discount" | "tax") => void;
  onPaymentSettingChange: <K extends keyof BusinessPaymentSettings>(
    key: K,
    value: BusinessPaymentSettings[K],
  ) => void;
}

export function InvoiceClosing({
  draft,
  totals,
  paymentSettings,
  onDraftChange,
  onPercentageBlur,
  onPaymentSettingChange,
}: InvoiceClosingProps) {
  return (
    <section className="sq-new-closing" data-export-break-before data-export-atomic="closing-block">
      <div className="sq-new-notes-column">
        <span className="sq-new-closing-heading">Notes</span>
        <p className="sq-new-thank-you">Thank you for choosing us.</p>

        {draft.extraDetailsVisible ? (
          <div className="sq-new-extra-details">
            <div className="sq-new-payment-grid">
              <span className="sq-new-mini-heading">Payment Details</span>
              <label>
                <span>Bank</span>
                <input
                  value={paymentSettings.bankName}
                  onChange={(event) => onPaymentSettingChange("bankName", event.target.value)}
                  placeholder="Bank name"
                />
              </label>
              <label>
                <span>Account Name</span>
                <input
                  value={paymentSettings.accountName}
                  onChange={(event) => onPaymentSettingChange("accountName", event.target.value)}
                  placeholder="Account name"
                />
              </label>
              <label>
                <span>Account No.</span>
                <input
                  value={paymentSettings.accountNumber}
                  onChange={(event) => onPaymentSettingChange("accountNumber", event.target.value)}
                  placeholder="Account number"
                  inputMode="numeric"
                />
              </label>
            </div>

            <div className="sq-new-terms">
              <span className="sq-new-mini-heading">Terms &amp; Conditions</span>
              <AutoResizeTextarea
                value={draft.notes}
                onChange={(event) => onDraftChange("notes", event.target.value)}
                rows={2}
                placeholder="Payment terms, validity or other invoice notes..."
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="sq-new-summary" data-export-totals>
        <div className="sq-new-summary-row">
          <span>Subtotal</span>
          <strong>{formatMoney(totals.subtotal, draft.currency)}</strong>
        </div>

        <label className="sq-new-summary-row">
          <span className="sq-new-summary-label-with-input">
            Discount (
            <input
              type="number"
              value={draft.discount}
              min={0}
              max={100}
              step="0.01"
              onChange={(event) => onDraftChange("discount", event.target.value)}
              onBlur={() => onPercentageBlur("discount")}
              className="sq-percent-input"
              aria-label="Discount percentage"
            />
            %)
          </span>
          <strong>- {formatMoney(totals.discountAmount, draft.currency)}</strong>
        </label>

        <label className="sq-new-summary-row">
          <span className="sq-new-summary-label-with-input">
            Tax (
            <input
              type="number"
              value={draft.tax}
              min={0}
              max={100}
              step="0.01"
              onChange={(event) => onDraftChange("tax", event.target.value)}
              onBlur={() => onPercentageBlur("tax")}
              className="sq-percent-input"
              aria-label="Tax percentage"
            />
            %)
          </span>
          <strong>+ {formatMoney(totals.taxAmount, draft.currency)}</strong>
        </label>

        <div className="sq-new-summary-total">
          <span>Total</span>
          <strong>{formatMoney(totals.total, draft.currency)}</strong>
        </div>
      </div>
    </section>
  );
}
