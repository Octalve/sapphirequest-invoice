export const RECEIPT_DOCUMENT_PREFIX = "SQ";
export const RECEIPT_DOCUMENT_SUFFIX = "RCT";
export const RECEIPT_SEQUENCE_WIDTH = 5;

export function sanitizeReceiptSequenceInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, RECEIPT_SEQUENCE_WIDTH);
}

export function normalizeReceiptSequence(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(sanitizeReceiptSequenceInput(value), 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(99_999, Math.max(1, Math.trunc(parsed)));
}

export function formatReceiptNumber(sequence: number): string {
  return `${RECEIPT_DOCUMENT_PREFIX}-${String(normalizeReceiptSequence(sequence)).padStart(RECEIPT_SEQUENCE_WIDTH, "0")}-${RECEIPT_DOCUMENT_SUFFIX}`;
}

export function parseReceiptSequence(receiptNo: string): number | null {
  const match = /^SQ-(\d{5})-RCT$/.exec(receiptNo.trim());
  return match ? normalizeReceiptSequence(match[1]) : null;
}

export function editableReceiptSequence(receiptNo: string): string {
  const parsed = parseReceiptSequence(receiptNo) ?? 1;
  return String(parsed).padStart(RECEIPT_SEQUENCE_WIDTH, "0");
}
