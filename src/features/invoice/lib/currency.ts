import { CURRENCIES } from "../constants";
import type { CurrencyCode } from "../types";

export function formatNumber(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(CURRENCIES[currency].locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  return `${CURRENCIES[currency].symbol}${formatNumber(amount, currency)}`;
}
