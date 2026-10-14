import {
  COMPANY_DOCUMENT_PREFIX,
  DOCUMENT_COUNTER_STORAGE_KEY,
  DOCUMENT_TYPE_CODE,
} from "../constants";
import type { DocumentTypeCode } from "../types";
import { storageGet, storageSet } from "./storage";

export const SEQUENCE_WIDTH = 5;
export const MAX_MANUAL_SEQUENCE = 10 ** SEQUENCE_WIDTH - 1;

export function readDocumentCounter(): number {
  const raw = storageGet(DOCUMENT_COUNTER_STORAGE_KEY);
  const number = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function writeDocumentCounter(value: number): void {
  storageSet(DOCUMENT_COUNTER_STORAGE_KEY, String(Math.max(0, Math.trunc(value))));
}

export function formatDocumentNumber(
  sequence: number,
  type: DocumentTypeCode = DOCUMENT_TYPE_CODE,
  companyCode = COMPANY_DOCUMENT_PREFIX,
): string {
  return `${companyCode}-${String(Math.max(0, Math.trunc(sequence))).padStart(SEQUENCE_WIDTH, "0")}-${type}`;
}

export function parseDocumentSequence(value: string): number | null {
  const escapedPrefix = COMPANY_DOCUMENT_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedType = DOCUMENT_TYPE_CODE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = value.trim().match(new RegExp(`^${escapedPrefix}-(\\d{${SEQUENCE_WIDTH},})-${escapedType}$`, "i"));
  if (!match) return null;
  const sequence = Number.parseInt(match[1] ?? "", 10);
  return Number.isFinite(sequence) ? sequence : null;
}

export function sanitizeDocumentSequenceInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, SEQUENCE_WIDTH);
}

export function normalizeManualDocumentSequence(value: string | number): number {
  const raw = typeof value === "number" ? String(Math.trunc(value)) : sanitizeDocumentSequenceInput(value);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, MAX_MANUAL_SEQUENCE);
}

export function formatEditableDocumentSequence(value: string): string {
  const parsed = parseDocumentSequence(value);
  return String(parsed ?? 1).padStart(SEQUENCE_WIDTH, "0");
}

export function ensureCounterAtLeast(sequence: number): void {
  if (sequence > readDocumentCounter()) writeDocumentCounter(sequence);
}

export function previewNextInvoiceNumber(): string {
  return formatDocumentNumber(readDocumentCounter() + 1);
}

export function commitNextInvoiceNumber(): string {
  const next = readDocumentCounter() + 1;
  writeDocumentCounter(next);
  return formatDocumentNumber(next);
}
