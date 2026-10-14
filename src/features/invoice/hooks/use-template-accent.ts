"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_TEMPLATE_ACCENT, darkenHex, normalizeAccentColor } from "../lib/template-theme";
import { storageGet, storageSet } from "../lib/storage";
import type { InvoiceTemplateId } from "../templates/types";

const ACCENT_STORAGE_PREFIX = "sq_template_accent_v1:";

function storageKey(templateId: InvoiceTemplateId): string {
  return `${ACCENT_STORAGE_PREFIX}${templateId}`;
}

interface AccentState {
  templateId: InvoiceTemplateId;
  color: string;
}

export function useTemplateAccent(templateId: InvoiceTemplateId, enabled: boolean) {
  const [state, setState] = useState<AccentState>({
    templateId,
    color: DEFAULT_TEMPLATE_ACCENT,
  });

  useEffect(() => {
    const next = enabled ? normalizeAccentColor(storageGet(storageKey(templateId))) : DEFAULT_TEMPLATE_ACCENT;
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) setState({ templateId, color: next });
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, templateId]);

  const changeAccent = useCallback((next: string) => {
    if (!enabled) return;
    const normalized = normalizeAccentColor(next);
    setState({ templateId, color: normalized });
    storageSet(storageKey(templateId), normalized);
  }, [enabled, templateId]);

  const resetAccent = useCallback(() => {
    if (!enabled) return;
    setState({ templateId, color: DEFAULT_TEMPLATE_ACCENT });
    storageSet(storageKey(templateId), DEFAULT_TEMPLATE_ACCENT);
  }, [enabled, templateId]);

  const accentColor = enabled && state.templateId === templateId
    ? state.color
    : DEFAULT_TEMPLATE_ACCENT;

  return {
    accentColor,
    accentDark: darkenHex(accentColor),
    changeAccent,
    resetAccent,
  };
}
