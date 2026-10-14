"use client";

import { Package } from "lucide-react";
import { calculateLineAmount } from "../../lib/calculations";
import { formatMoney } from "../../lib/currency";
import type { CurrencyCode, InvoiceLine } from "../../types";
import { AutoResizeTextarea } from "./auto-resize-textarea";

interface InvoiceItemsTableProps {
  rows: InvoiceLine[];
  currency: CurrencyCode;
  currencySymbol: string;
  onLineChange: (id: string, patch: Partial<Omit<InvoiceLine, "id">>) => void;
  onLineUnitPriceBlur: (id: string) => void;
  onLineQuantityBlur: (id: string) => void;
  onLineDiscountBlur: (id: string) => void;
}

export function InvoiceItemsTable({
  rows,
  currency,
  currencySymbol,
  onLineChange,
  onLineUnitPriceBlur,
  onLineQuantityBlur,
  onLineDiscountBlur,
}: InvoiceItemsTableProps) {
  return (
    <section className="sq-v4-items" data-export-items-region>
      <div className="sq-v4-items-header" data-export-table-header>
        <span>Item Name</span>
        <span>Quantity</span>
        <span>Unit Price</span>
        <span>Discount</span>
        <span>Amount</span>
      </div>

      <div className="sq-v4-items-body" data-export-table-body>
        {rows.map((row, index) => {
          const amount = calculateLineAmount(row);
          return (
            <div className="sq-v4-item-row" key={row.id} data-export-row>
              <div className="sq-v4-item-main">
                <span className="sq-v4-item-icon" aria-label={`Invoice row ${index + 1}`}>
                  <Package aria-hidden="true" />
                </span>

                <div className="sq-v4-item-copy">
                  <AutoResizeTextarea
                    value={row.serviceName}
                    onChange={(event) => onLineChange(row.id, { serviceName: event.target.value })}
                    className="sq-v4-item-title"
                    rows={1}
                    placeholder="Item or service"
                  />
                  <AutoResizeTextarea
                    value={row.description}
                    onChange={(event) => onLineChange(row.id, { description: event.target.value })}
                    className="sq-v4-item-description"
                    rows={1}
                    placeholder="Description"
                  />
                </div>
              </div>

              <input
                value={row.quantity}
                onChange={(event) => onLineChange(row.id, { quantity: event.target.value.replace(/[^\d.]/g, "") })}
                onBlur={() => onLineQuantityBlur(row.id)}
                inputMode="decimal"
                className="sq-line-quantity"
                aria-label={`Quantity for invoice row ${index + 1}`}
              />

              <label className="sq-v4-money-input">
                <span className="sq-locked-currency" aria-hidden="true">{currencySymbol}</span>
                <input
                  value={row.unitPrice}
                  onChange={(event) => onLineChange(row.id, { unitPrice: event.target.value })}
                  onBlur={() => onLineUnitPriceBlur(row.id)}
                  inputMode="decimal"
                  className="sq-line-unit-price"
                  aria-label={`Unit price for invoice row ${index + 1}`}
                />
              </label>

              <label className="sq-v4-discount-input">
                <input
                  value={row.discount}
                  onChange={(event) => onLineChange(row.id, { discount: event.target.value.replace(/[^\d.]/g, "") })}
                  onBlur={() => onLineDiscountBlur(row.id)}
                  inputMode="decimal"
                  className="sq-line-discount"
                  aria-label={`Discount for invoice row ${index + 1}`}
                />
                <span aria-hidden="true">%</span>
              </label>

              <span className="sq-v4-line-amount" aria-label={`Amount for invoice row ${index + 1}`}>
                {formatMoney(amount, currency)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
