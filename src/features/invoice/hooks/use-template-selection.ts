"use client";

import { useCallback, useEffect, useState } from "react";
import { storageGet, storageSet } from "../lib/storage";
import {
  DEFAULT_INVOICE_TEMPLATE_ID,
  TEMPLATE_SELECTION_STORAGE_KEY,
  isInvoiceTemplateId,
} from "../templates/registry";
import type { InvoiceTemplateId } from "../templates/types";

export function useTemplateSelection() {
  const [templateId, setTemplateId] = useState<InvoiceTemplateId>(DEFAULT_INVOICE_TEMPLATE_ID);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = storageGet(TEMPLATE_SELECTION_STORAGE_KEY);
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const resolved = isInvoiceTemplateId(stored) ? stored : DEFAULT_INVOICE_TEMPLATE_ID;
      setTemplateId(resolved);
      if (stored !== resolved) storageSet(TEMPLATE_SELECTION_STORAGE_KEY, resolved);
      setInitialized(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const changeTemplate = useCallback((next: InvoiceTemplateId) => {
    setTemplateId(next);
    storageSet(TEMPLATE_SELECTION_STORAGE_KEY, next);
  }, []);

  return { templateId, initialized, changeTemplate };
}
