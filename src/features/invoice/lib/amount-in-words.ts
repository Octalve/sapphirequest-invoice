import type { CurrencyCode } from "../types";

const SMALL = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
] as const;

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"] as const;

const SCALES = [
  { value: 1_000_000_000_000, label: "Trillion" },
  { value: 1_000_000_000, label: "Billion" },
  { value: 1_000_000, label: "Million" },
  { value: 1_000, label: "Thousand" },
] as const;

const CURRENCY_WORDS: Record<CurrencyCode, { majorSingular: string; majorPlural: string; minorSingular: string; minorPlural: string }> = {
  NGN: { majorSingular: "Naira", majorPlural: "Naira", minorSingular: "Kobo", minorPlural: "Kobo" },
  USD: { majorSingular: "Dollar", majorPlural: "Dollars", minorSingular: "Cent", minorPlural: "Cents" },
  GBP: { majorSingular: "Pound", majorPlural: "Pounds", minorSingular: "Penny", minorPlural: "Pence" },
  EUR: { majorSingular: "Euro", majorPlural: "Euros", minorSingular: "Cent", minorPlural: "Cents" },
};

function underOneThousand(value: number): string {
  const parts: string[] = [];
  let remaining = value;

  if (remaining >= 100) {
    parts.push(`${SMALL[Math.floor(remaining / 100)]} Hundred`);
    remaining %= 100;
    if (remaining > 0) parts.push("and");
  }

  if (remaining >= 20) {
    const tens = TENS[Math.floor(remaining / 10)];
    const ones = remaining % 10;
    parts.push(ones ? `${tens}-${SMALL[ones]}` : tens);
  } else if (remaining > 0 || parts.length === 0) {
    parts.push(SMALL[remaining]);
  }

  return parts.join(" ");
}

export function integerToWords(value: number): string {
  const safe = Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0));
  if (safe === 0) return "Zero";
  if (safe < 1000) return underOneThousand(safe);

  const parts: string[] = [];
  let remaining = safe;

  for (const scale of SCALES) {
    if (remaining >= scale.value) {
      const chunk = Math.floor(remaining / scale.value);
      parts.push(`${integerToWords(chunk)} ${scale.label}`);
      remaining %= scale.value;
    }
  }

  if (remaining > 0) {
    if (remaining < 100 && parts.length > 0) parts.push("and");
    parts.push(underOneThousand(remaining));
  }

  return parts.join(" ");
}

function currencyNoun(value: number, singular: string, plural: string): string {
  return Math.abs(value) === 1 ? singular : plural;
}

export function formatAmountInWords(amount: number, currency: CurrencyCode): string {
  const safe = Math.max(0, Number.isFinite(amount) ? amount : 0);
  const roundedMinor = Math.round((safe + Number.EPSILON) * 100);
  const major = Math.floor(roundedMinor / 100);
  const minor = roundedMinor % 100;
  const words = CURRENCY_WORDS[currency];

  const majorPhrase = `${integerToWords(major)} ${currencyNoun(major, words.majorSingular, words.majorPlural)}`;
  if (minor === 0) return `${majorPhrase} Only`;

  const minorPhrase = `${integerToWords(minor)} ${currencyNoun(minor, words.minorSingular, words.minorPlural)}`;
  return `${majorPhrase} and ${minorPhrase} Only`;
}
