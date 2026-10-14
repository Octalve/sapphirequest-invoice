"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BUSINESS_SETTINGS_STORAGE_KEY,
  CURRENCIES,
  CURRENCY_STORAGE_KEY,
  DEFAULT_PAYMENT_SETTINGS,
  DRAFT_STORAGE_KEY,
  LEGACY_DRAFT_STORAGE_KEYS,
  PAPER_DEFINITIONS,
  PAPER_SIZE_STORAGE_KEY,
  createEmptyInvoiceDraft,
} from "../constants";
import {
  calculateInvoiceTotals,
  clampPercent,
  parseMoneyInput,
  parseQuantityInput,
} from "../lib/calculations";
import { formatNumber } from "../lib/currency";
import { datePartsFromDate } from "../lib/date";
import {
  commitNextInvoiceNumber,
  ensureCounterAtLeast,
  formatDocumentNumber,
  normalizeManualDocumentSequence,
  parseDocumentSequence,
  previewNextInvoiceNumber,
} from "../lib/numbering";
import { readJson, storageGet, storageRemove, storageSet } from "../lib/storage";
import type {
  BusinessPaymentSettings,
  CurrencyCode,
  InvoiceDraft,
  InvoiceDraftMetadata,
  InvoiceLine,
  InvoiceGeneratorStorageScope,
  PaperSize,
  PersistedInvoiceDraft,
} from "../types";

export const OCTALVE_INVOICE_STORAGE_SCOPE: InvoiceGeneratorStorageScope = {
  draftStorageKey: DRAFT_STORAGE_KEY,
  paymentSettingsStorageKey: BUSINESS_SETTINGS_STORAGE_KEY,
  currencyStorageKey: CURRENCY_STORAGE_KEY,
  paperSizeStorageKey: PAPER_SIZE_STORAGE_KEY,
  legacyDraftStorageKeys: LEGACY_DRAFT_STORAGE_KEYS,
};

function makeRowId(index = 0): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `row-${Date.now()}-${index}`;
}

function makeEmptyRow(index = 0): InvoiceLine {
  return {
    id: makeRowId(index),
    serviceName: "",
    description: "",
    quantity: "1",
    unitPrice: "0",
    discount: "0",
  };
}

function normalizeRows(rows: unknown): InvoiceLine[] {
  if (!Array.isArray(rows) || rows.length === 0) return [makeEmptyRow(1)];

  return rows.map((row, index) => {
    const candidate = row as Partial<InvoiceLine> & { total?: string };
    return {
      id: candidate.id || makeRowId(index + 1),
      serviceName: String(candidate.serviceName ?? ""),
      description: String(candidate.description ?? ""),
      quantity: String(candidate.quantity ?? "1"),
      unitPrice: String(candidate.unitPrice ?? candidate.total ?? "0"),
      discount: String(candidate.discount ?? "0"),
    };
  });
}

interface LegacyPersistedDraft extends Partial<InvoiceDraft>, Partial<InvoiceDraftMetadata> {
  version?: number;
  invoiceNoManuallyEdited?: boolean;
}

function readPersistedDraft(scope: InvoiceGeneratorStorageScope): LegacyPersistedDraft | null {
  const current = readJson<LegacyPersistedDraft>(scope.draftStorageKey);
  if (current) return current;

  for (const key of scope.legacyDraftStorageKeys) {
    const legacy = readJson<LegacyPersistedDraft>(key);
    if (legacy) return legacy;
  }

  return null;
}

function restorePersistedDraft(scope: InvoiceGeneratorStorageScope): PersistedInvoiceDraft | null {
  const persisted = readPersistedDraft(scope);
  if (!persisted || typeof persisted !== "object") return null;

  const currency = persisted.currency && persisted.currency in CURRENCIES ? persisted.currency : "NGN";
  const paperSize = persisted.paperSize && persisted.paperSize in PAPER_DEFINITIONS ? persisted.paperSize : "A4";

  const day = String(persisted.day ?? "");
  const month = String(persisted.month ?? "").toUpperCase();
  const year = String(persisted.year ?? "");
  const rawInvoiceNo = String(persisted.invoiceNo ?? "");
  const sequence = parseDocumentSequence(rawInvoiceNo);
  const invoiceNumberCommitted = Boolean(persisted.invoiceNumberCommitted) && sequence !== null;

  if (sequence !== null && invoiceNumberCommitted) ensureCounterAtLeast(sequence);

  return {
    version: 5,
    senderName: String(persisted.senderName ?? ""),
    senderEmail: String(persisted.senderEmail ?? ""),
    senderPhone: String(persisted.senderPhone ?? ""),
    senderRole: String(persisted.senderRole ?? ""),
    clientName: String(persisted.clientName ?? ""),
    clientEmail: String(persisted.clientEmail ?? ""),
    clientPhone: String(persisted.clientPhone ?? ""),
    clientAddress: String(persisted.clientAddress ?? ""),
    invoiceNo: invoiceNumberCommitted ? rawInvoiceNo.toUpperCase() : previewNextInvoiceNumber(),
    day,
    month,
    year,
    dueDay: String(persisted.dueDay ?? day),
    dueMonth: String(persisted.dueMonth ?? month).toUpperCase(),
    dueYear: String(persisted.dueYear ?? year),
    tinNo: String(persisted.tinNo ?? ""),
    rcNo: String(persisted.rcNo ?? ""),
    rows: normalizeRows(persisted.rows),
    discount: String(persisted.discount ?? "0"),
    tax: String(persisted.tax ?? "0"),
    currency: currency as CurrencyCode,
    paperSize: paperSize as PaperSize,
    notes: String(persisted.notes ?? ""),
    extraDetailsVisible: Boolean(persisted.extraDetailsVisible),
    dateManuallyEdited: Boolean(persisted.dateManuallyEdited),
    invoiceNumberCommitted,
  };
}

export function useInvoiceGenerator(scope: InvoiceGeneratorStorageScope = OCTALVE_INVOICE_STORAGE_SCOPE) {
  const [draft, setDraft] = useState<InvoiceDraft>(() => createEmptyInvoiceDraft());
  const [metadata, setMetadata] = useState<InvoiceDraftMetadata>({
    dateManuallyEdited: false,
    invoiceNumberCommitted: false,
  });
  const [paymentSettings, setPaymentSettings] = useState<BusinessPaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [initialized, setInitialized] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const restored = restorePersistedDraft(scope);
    const storedPayment = readJson<Partial<BusinessPaymentSettings>>(scope.paymentSettingsStorageKey);
    const storedCurrency = storageGet(scope.currencyStorageKey);
    const storedPaperSize = storageGet(scope.paperSizeStorageKey);

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      if (storedPayment) {
        setPaymentSettings({
          bankName: String(storedPayment.bankName ?? ""),
          accountName: String(storedPayment.accountName ?? ""),
          accountNumber: String(storedPayment.accountNumber ?? ""),
        });
      }

      if (restored) {
        setDraft(restored);
        setMetadata({
          dateManuallyEdited: restored.dateManuallyEdited,
          invoiceNumberCommitted: restored.invoiceNumberCommitted,
        });
        storageSet(scope.currencyStorageKey, restored.currency);
        storageSet(scope.paperSizeStorageKey, restored.paperSize);
        scope.legacyDraftStorageKeys.forEach(storageRemove);
      } else {
        const today = new Date();
        const currency: CurrencyCode = storedCurrency && storedCurrency in CURRENCIES ? (storedCurrency as CurrencyCode) : "NGN";
        const paperSize: PaperSize = storedPaperSize && storedPaperSize in PAPER_DEFINITIONS
          ? (storedPaperSize as PaperSize)
          : "A4";

        setDraft({
          ...createEmptyInvoiceDraft(today),
          currency,
          paperSize,
          invoiceNo: previewNextInvoiceNumber(),
        });
      }

      setInitialized(true);
    });

    return () => {
      cancelled = true;
    };
  }, [scope]);

  useEffect(() => {
    if (!initialized) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const persisted: PersistedInvoiceDraft = {
        ...draft,
        ...metadata,
        version: 5,
      };
      storageSet(scope.draftStorageKey, JSON.stringify(persisted));
      storageSet(scope.currencyStorageKey, draft.currency);
      storageSet(scope.paperSizeStorageKey, draft.paperSize);
    }, 250);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [draft, metadata, initialized, scope]);

  useEffect(() => {
    if (!initialized) return;
    storageSet(scope.paymentSettingsStorageKey, JSON.stringify(paymentSettings));
  }, [paymentSettings, initialized, scope]);

  const totals = useMemo(
    () => calculateInvoiceTotals(draft.rows, draft.discount, draft.tax),
    [draft.rows, draft.discount, draft.tax],
  );

  const updateDraft = useCallback(<K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  const updateDateField = useCallback((key: "day" | "month" | "year", value: string) => {
    setDraft((current) => ({
      ...current,
      [key]: key === "month" ? value.toUpperCase() : value,
    }));
    setMetadata((current) => ({ ...current, dateManuallyEdited: true }));
  }, []);

  const updateDueDateField = useCallback((key: "dueDay" | "dueMonth" | "dueYear", value: string) => {
    setDraft((current) => ({
      ...current,
      [key]: key === "dueMonth" ? value.toUpperCase() : value,
    }));
  }, []);

  const updateInvoiceSequence = useCallback((value: string | number) => {
    const sequence = normalizeManualDocumentSequence(value);
    const invoiceNo = formatDocumentNumber(sequence);
    ensureCounterAtLeast(sequence);
    setDraft((current) => ({ ...current, invoiceNo }));
    // Manual numbering reserves the selected sequence immediately so a future invoice
    // cannot silently reuse it. Repeated exports therefore preserve this identifier.
    setMetadata((current) => ({ ...current, invoiceNumberCommitted: true }));
  }, []);

  const updateLine = useCallback((id: string, patch: Partial<Omit<InvoiceLine, "id">>) => {
    setDraft((current) => ({
      ...current,
      rows: current.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }));
  }, []);

  const addRow = useCallback(() => {
    setDraft((current) => ({
      ...current,
      rows: [...current.rows, makeEmptyRow(current.rows.length + 1)],
    }));
  }, []);

  const removeRow = useCallback(() => {
    setDraft((current) => {
      if (current.rows.length <= 1) return current;
      return { ...current, rows: current.rows.slice(0, -1) };
    });
  }, []);

  const formatLineUnitPrice = useCallback(
    (id: string) => {
      const row = draft.rows.find((candidate) => candidate.id === id);
      if (!row) return;
      updateLine(id, { unitPrice: formatNumber(parseMoneyInput(row.unitPrice), draft.currency) });
    },
    [draft.currency, draft.rows, updateLine],
  );

  const normalizeLineQuantity = useCallback((id: string) => {
    const row = draft.rows.find((candidate) => candidate.id === id);
    if (!row) return;
    const quantity = parseQuantityInput(row.quantity);
    updateLine(id, { quantity: quantity > 0 ? String(quantity) : "1" });
  }, [draft.rows, updateLine]);

  const normalizeLineDiscount = useCallback((id: string) => {
    const row = draft.rows.find((candidate) => candidate.id === id);
    if (!row) return;
    updateLine(id, { discount: String(clampPercent(row.discount)) });
  }, [draft.rows, updateLine]);

  const normalizePercentage = useCallback((key: "discount" | "tax") => {
    setDraft((current) => ({ ...current, [key]: String(clampPercent(current[key])) }));
  }, []);

  const changeCurrency = useCallback((currency: CurrencyCode) => {
    setDraft((current) => ({ ...current, currency }));
    storageSet(scope.currencyStorageKey, currency);
  }, [scope]);

  const changePaperSize = useCallback((paperSize: PaperSize) => {
    setDraft((current) => ({ ...current, paperSize }));
    storageSet(scope.paperSizeStorageKey, paperSize);
  }, [scope]);

  const toggleExtraDetails = useCallback(() => {
    setDraft((current) => ({ ...current, extraDetailsVisible: !current.extraDetailsVisible }));
  }, []);

  const updatePaymentSetting = useCallback(<K extends keyof BusinessPaymentSettings>(
    key: K,
    value: BusinessPaymentSettings[K],
  ) => {
    setPaymentSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const startNewInvoice = useCallback(() => {
    const now = new Date();
    setDraft((current) => ({
      ...createEmptyInvoiceDraft(now),
      senderName: current.senderName,
      senderEmail: current.senderEmail,
      senderPhone: current.senderPhone,
      senderRole: current.senderRole,
      tinNo: current.tinNo,
      rcNo: current.rcNo,
      currency: current.currency,
      paperSize: current.paperSize,
      invoiceNo: previewNextInvoiceNumber(),
    }));
    setMetadata({
      dateManuallyEdited: false,
      invoiceNumberCommitted: false,
    });
  }, []);

  const commitInvoiceNumberIfNeeded = useCallback((): string => {
    if (metadata.invoiceNumberCommitted) return draft.invoiceNo;

    const invoiceNo = commitNextInvoiceNumber();
    setDraft((current) => ({ ...current, invoiceNo }));
    setMetadata((current) => ({ ...current, invoiceNumberCommitted: true }));
    return invoiceNo;
  }, [draft.invoiceNo, metadata.invoiceNumberCommitted]);

  const resetDateToToday = useCallback(() => {
    const now = new Date();
    const parts = datePartsFromDate(now);
    setDraft((current) => ({
      ...current,
      ...parts,
      dueDay: parts.day,
      dueMonth: parts.month,
      dueYear: parts.year,
    }));
    setMetadata((current) => ({ ...current, dateManuallyEdited: false }));
  }, []);

  return {
    initialized,
    draft,
    metadata,
    paymentSettings,
    totals,
    updateDraft,
    updateDateField,
    updateDueDateField,
    updateInvoiceSequence,
    updateLine,
    addRow,
    removeRow,
    formatLineUnitPrice,
    normalizeLineQuantity,
    normalizeLineDiscount,
    normalizePercentage,
    changeCurrency,
    changePaperSize,
    toggleExtraDetails,
    updatePaymentSetting,
    startNewInvoice,
    commitInvoiceNumberIfNeeded,
    resetDateToToday,
  };
}
