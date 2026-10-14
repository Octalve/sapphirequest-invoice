import type { InvoiceLine, InvoiceTotals } from "../types";

export function parseMoneyInput(value: string | number | null | undefined): number {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  if (!cleaned) return 0;

  const firstDot = cleaned.indexOf(".");
  const normalized =
    firstDot === -1
      ? cleaned
      : cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");

  return Number.parseFloat(normalized) || 0;
}

export function parseQuantityInput(value: string | number | null | undefined): number {
  const numeric = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
}

export function clampPercent(value: string | number | null | undefined): number {
  const numeric = Number.parseFloat(String(value ?? "")) || 0;
  return Math.min(Math.max(numeric, 0), 100);
}

export function calculateLineAmount(row: InvoiceLine): number {
  const quantity = parseQuantityInput(row.quantity);
  const unitPrice = parseMoneyInput(row.unitPrice);
  const discountPercent = clampPercent(row.discount);
  const gross = quantity * unitPrice;
  return gross - gross * (discountPercent / 100);
}

export function calculateInvoiceTotals(
  rows: InvoiceLine[],
  discount: string,
  tax: string,
): InvoiceTotals {
  const subtotal = rows.reduce((sum, row) => sum + calculateLineAmount(row), 0);
  const discountPercent = clampPercent(discount);
  const taxPercent = clampPercent(tax);
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxPercent / 100);
  const total = afterDiscount + taxAmount;

  return {
    subtotal,
    discountPercent,
    discountAmount,
    taxPercent,
    taxAmount,
    total,
  };
}
