export type ReceiptTextDensity = "normal" | "compact" | "tight" | "micro";

function splitAtWordBoundary(value: string, target: number): [string, string] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return ["", ""];

  let first = "";
  let bestIndex = 0;

  for (let index = 0; index < words.length; index += 1) {
    const next = first ? `${first} ${words[index]}` : words[index];
    if (next.length > target && first) break;
    first = next;
    bestIndex = index + 1;
  }

  if (bestIndex === words.length) return [first, ""];

  const second = words.slice(bestIndex).join(" ");
  return [first, second];
}

export function splitReceiptAmountWords(value: string): [string, string] {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) return ["", ""];

  const target = normalized.length > 170 ? 88 : normalized.length > 125 ? 78 : 72;
  const [first, second] = splitAtWordBoundary(normalized, target);

  if (!second || second.length <= 96) return [first, second];

  const words = normalized.split(" ");
  const midpoint = Math.ceil(normalized.length * 0.48);
  let length = 0;
  let breakIndex = 0;

  for (let index = 0; index < words.length; index += 1) {
    length += words[index].length + (index ? 1 : 0);
    breakIndex = index + 1;
    if (length >= midpoint) break;
  }

  return [words.slice(0, breakIndex).join(" "), words.slice(breakIndex).join(" ")];
}

export function receiptWordsDensity(value: string): ReceiptTextDensity {
  const length = value.trim().length;
  if (length > 210) return "micro";
  if (length > 165) return "tight";
  if (length > 115) return "compact";
  return "normal";
}

export function receiptFieldDensity(value: string): ReceiptTextDensity {
  const length = value.trim().length;
  if (length > 150) return "micro";
  if (length > 105) return "tight";
  if (length > 70) return "compact";
  return "normal";
}

export function receiptMoneyDensity(value: string): ReceiptTextDensity {
  const length = value.replace(/\s/g, "").length;
  if (length > 26) return "micro";
  if (length > 20) return "tight";
  if (length > 14) return "compact";
  return "normal";
}
