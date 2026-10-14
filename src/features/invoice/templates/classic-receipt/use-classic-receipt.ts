"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MONTHS_3 } from "../../constants";
import { formatNumber } from "../../lib/currency";
import { parseMoneyInput } from "../../lib/calculations";
import { readJson, storageGet, storageSet } from "../../lib/storage";
import type { CurrencyCode, PaperSize } from "../../types";
import { editableReceiptSequence, formatReceiptNumber, normalizeReceiptSequence } from "./lib/receipt-numbering";
import type { ClassicReceiptDraft, ReceiptPaymentMethod } from "./types";

const RECEIPT_STORAGE_KEY = "sq_classic_receipt_draft_v1";
const RECEIPT_COUNTER_KEY = "sq_classic_receipt_counter_v1";
const RECEIPT_A5_LAYOUT_MIGRATION_KEY = "sq_classic_receipt_a5_layout_v2";

function todayParts(now = new Date()) {
  return {
    day: String(now.getDate()).padStart(2, "0"),
    month: MONTHS_3[now.getMonth()] ?? "JAN",
    year: String(now.getFullYear()),
  };
}

function readCounter(): number {
  return normalizeReceiptSequence(storageGet(RECEIPT_COUNTER_KEY) ?? "1");
}

function writeCounter(value: number): void {
  storageSet(RECEIPT_COUNTER_KEY, String(normalizeReceiptSequence(value)));
}

export function createEmptyClassicReceiptDraft(now = new Date(), sequence = 1): ClassicReceiptDraft {
  const date = todayParts(now);
  return {
    receiptNo: formatReceiptNumber(sequence),
    ...date,
    receivedFrom: "",
    paymentPurpose: "",
    amountReceived: "0",
    balanceRemaining: "",
    paymentMethod: "transfer",
    reference: "",
    companySignatureDataUrl: "",
    customerSignatureDataUrl: "",
    currency: "NGN",
    paperSize: "A5",
  };
}

export function useClassicReceipt() {
  const [draft, setDraft] = useState<ClassicReceiptDraft>(() => createEmptyClassicReceiptDraft());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = readJson<ClassicReceiptDraft>(RECEIPT_STORAGE_KEY);
    const base = stored && stored.receiptNo
      ? stored
      : createEmptyClassicReceiptDraft(new Date(), readCounter());
    const normalizedBase: ClassicReceiptDraft = {
      ...base,
      companySignatureDataUrl:
        typeof base.companySignatureDataUrl === "string" ? base.companySignatureDataUrl : "",
      customerSignatureDataUrl:
        typeof base.customerSignatureDataUrl === "string" ? base.customerSignatureDataUrl : "",
    };
    const needsA5Migration = storageGet(RECEIPT_A5_LAYOUT_MIGRATION_KEY) !== "complete";
    const next = needsA5Migration ? { ...normalizedBase, paperSize: "A5" as const } : normalizedBase;

    if (needsA5Migration) {
      storageSet(RECEIPT_A5_LAYOUT_MIGRATION_KEY, "complete");
    }

    queueMicrotask(() => {
      setDraft(next);
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;
    storageSet(RECEIPT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, initialized]);

  const update = useCallback(<K extends keyof ClassicReceiptDraft>(key: K, value: ClassicReceiptDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const updateDate = useCallback((key: "day" | "month" | "year", value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const updateReceiptSequence = useCallback((value: string | number) => {
    const sequence = normalizeReceiptSequence(value);
    writeCounter(Math.max(readCounter(), sequence));
    setDraft((current) => ({ ...current, receiptNo: formatReceiptNumber(sequence) }));
  }, []);

  const changeCurrency = useCallback((currency: CurrencyCode) => {
    setDraft((current) => ({ ...current, currency }));
  }, []);

  const changePaperSize = useCallback((paperSize: PaperSize) => {
    setDraft((current) => ({ ...current, paperSize }));
  }, []);

  const changePaymentMethod = useCallback((paymentMethod: ReceiptPaymentMethod) => {
    setDraft((current) => ({ ...current, paymentMethod }));
  }, []);

  const normalizeAmountField = useCallback((key: "amountReceived" | "balanceRemaining") => {
    setDraft((current) => {
      if (key === "balanceRemaining" && !current.balanceRemaining.trim()) return current;
      const normalized = parseMoneyInput(current[key]);
      return { ...current, [key]: formatNumber(normalized, current.currency) };
    });
  }, []);

  const newReceipt = useCallback(() => {
    const nextSequence = readCounter() + 1;
    writeCounter(nextSequence);
    setDraft((current) => ({
      ...createEmptyClassicReceiptDraft(new Date(), nextSequence),
      companySignatureDataUrl: current.companySignatureDataUrl,
    }));
  }, []);

  const editableSequence = useMemo(() => editableReceiptSequence(draft.receiptNo), [draft.receiptNo]);

  return {
    draft,
    initialized,
    editableSequence,
    update,
    updateDate,
    updateReceiptSequence,
    changeCurrency,
    changePaperSize,
    changePaymentMethod,
    normalizeAmountField,
    newReceipt,
  };
}
