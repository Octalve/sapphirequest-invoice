"use client";

import { calculateLineAmount } from "../../../lib/calculations";
import { formatMoney } from "../../../lib/currency";
import type { CurrencyCode, InvoiceLine } from "../../../types";
import { ClassicAutoTextarea } from "./classic-auto-textarea";
import styles from "../classic-ledger.module.css";

interface ClassicLedgerItemsProps {
  rows: InvoiceLine[];
  currency: CurrencyCode;
  currencySymbol: string;
  onLineChange: (id: string, patch: Partial<Omit<InvoiceLine, "id">>) => void;
  onLineUnitPriceBlur: (id: string) => void;
  onLineQuantityBlur: (id: string) => void;
  onLineDiscountBlur: (id: string) => void;
}

const MIN_LEDGER_ROWS = 7;

export function ClassicLedgerItems({
  rows,
  currency,
  currencySymbol,
  onLineChange,
  onLineUnitPriceBlur,
  onLineQuantityBlur,
  onLineDiscountBlur,
}: ClassicLedgerItemsProps) {
  const fillerCount = Math.max(0, MIN_LEDGER_ROWS - rows.length);

  return (
    <section className={styles.ledgerTable} data-export-items-region>
      <div className={styles.tableHeader} data-export-table-header>
        <span>QTY</span>
        <span>DESCRIPTION</span>
        <span>UNIT PRICE</span>
        <span>DISCOUNT</span>
        <span>TOTAL</span>
      </div>

      <div data-export-table-body>
        {rows.map((row, index) => {
          const amount = calculateLineAmount(row);
          return (
            <div className={styles.itemRow} key={row.id} data-export-row>
              <input
                value={row.quantity}
                aria-label={`Classic Ledger quantity row ${index + 1}`}
                inputMode="decimal"
                onChange={(event) => onLineChange(row.id, { quantity: event.target.value.replace(/[^\d.]/g, "") })}
                onBlur={() => onLineQuantityBlur(row.id)}
              />

              <div className={styles.descriptionCell}>
                <ClassicAutoTextarea
                  value={row.serviceName}
                  rows={1}
                  className={styles.itemTitle}
                  placeholder="Item or service"
                  onChange={(event) => onLineChange(row.id, { serviceName: event.target.value })}
                />
                <ClassicAutoTextarea
                  value={row.description}
                  rows={1}
                  className={styles.itemDescription}
                  placeholder="Description"
                  onChange={(event) => onLineChange(row.id, { description: event.target.value })}
                />
              </div>

              <label className={styles.moneyEditor}>
                <span aria-hidden="true">{currencySymbol}</span>
                <input
                  value={row.unitPrice}
                  aria-label={`Classic Ledger unit price row ${index + 1}`}
                  inputMode="decimal"
                  onChange={(event) => onLineChange(row.id, { unitPrice: event.target.value })}
                  onBlur={() => onLineUnitPriceBlur(row.id)}
                />
              </label>

              <label className={styles.discountEditor}>
                <input
                  value={row.discount}
                  aria-label={`Classic Ledger discount row ${index + 1}`}
                  inputMode="decimal"
                  onChange={(event) => onLineChange(row.id, { discount: event.target.value.replace(/[^\d.]/g, "") })}
                  onBlur={() => onLineDiscountBlur(row.id)}
                />
                <span>%</span>
              </label>

              <strong>{formatMoney(amount, currency)}</strong>
            </div>
          );
        })}

        {Array.from({ length: fillerCount }, (_, index) => (
          <div className={`${styles.itemRow} ${styles.fillerRow}`} key={`classic-filler-${index}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </section>
  );
}
