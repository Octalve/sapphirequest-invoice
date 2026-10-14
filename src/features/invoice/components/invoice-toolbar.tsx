"use client";

import {
  Eraser,
  FileDown,
  FileText,
  LayoutTemplate,
  LockKeyhole,
  Minus,
  Palette,
  Plus,
  ReceiptText,
  RotateCcw,
  Ruler,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRENCIES, PAPER_DEFINITIONS } from "../constants";
import { INVOICE_TEMPLATES } from "../templates/registry";
import type { CurrencyCode, PaperSize } from "../types";
import type { InvoiceTemplateId } from "../templates/types";

interface InvoiceToolbarProps {
  currency: CurrencyCode;
  paperSize: PaperSize;
  paperOptions?: PaperSize[];
  templateId: InvoiceTemplateId;
  documentKind: "invoice" | "receipt";
  extraDetailsVisible: boolean;
  exporting: boolean;
  accentColor: string;
  customizableAccent: boolean;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onNewInvoice: () => void;
  onToggleExtraDetails: () => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onPaperSizeChange: (paperSize: PaperSize) => void;
  onOpenTemplates: () => void;
  onAccentChange: (color: string) => void;
  onAccentReset: () => void;
  onLock: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  pdfAvailable: boolean;
}

export function InvoiceToolbar({
  currency,
  paperSize,
  paperOptions,
  templateId,
  documentKind,
  extraDetailsVisible,
  exporting,
  accentColor,
  customizableAccent,
  onAddRow,
  onRemoveRow,
  onNewInvoice,
  onToggleExtraDetails,
  onCurrencyChange,
  onPaperSizeChange,
  onOpenTemplates,
  onAccentChange,
  onAccentReset,
  onLock,
  onExportPdf,
  onExportPng,
  pdfAvailable,
}: InvoiceToolbarProps) {
  const activeTemplate = INVOICE_TEMPLATES[templateId];
  const availablePapers = Object.values(PAPER_DEFINITIONS).filter(
    (paper) => !paperOptions || paperOptions.includes(paper.code),
  );

  return (
    <div className="mx-auto mb-6 flex max-w-[1120px] flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {documentKind === "invoice" ? (
          <>
            <Button tone="soft-blue" icon={<Plus className="h-4 w-4" />} onClick={onAddRow}>
              Add Row
            </Button>
            <Button tone="danger" icon={<Minus className="h-4 w-4" />} onClick={onRemoveRow}>
              Remove
            </Button>
          </>
        ) : null}
        <Button icon={<Eraser className="h-4 w-4" />} onClick={onNewInvoice}>
          {documentKind === "receipt" ? "New Receipt" : "New Invoice"}
        </Button>
        {documentKind === "invoice" ? (
          <Button
            tone={extraDetailsVisible ? "primary" : "neutral"}
            icon={<ReceiptText className="h-4 w-4" />}
            onClick={onToggleExtraDetails}
          >
            Extra Details
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          tone="neutral"
          icon={<LayoutTemplate className="h-4 w-4" />}
          onClick={onOpenTemplates}
          title="Choose another template"
        >
          Templates · {activeTemplate.name}
        </Button>

        {customizableAccent ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Palette className="sq-text-brand-blue h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-black uppercase text-slate-500">Color</span>
            <input
              type="color"
              value={accentColor}
              onChange={(event) => onAccentChange(event.target.value)}
              className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label={`${activeTemplate.name} accent color`}
              title="Choose template accent color"
            />
            <button
              type="button"
              onClick={onAccentReset}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900"
              aria-label="Reset template color to Sapphire blue"
              title="Reset to Sapphire blue"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <WalletCards className="sq-text-brand-blue h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-black uppercase text-slate-500">Currency</span>
          <select
            value={currency}
            onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
            className="cursor-pointer bg-transparent font-bold text-slate-800 outline-none"
            aria-label="Document currency"
          >
            {Object.values(CURRENCIES).map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Ruler className="sq-text-brand-blue h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-black uppercase text-slate-500">Paper</span>
          <select
            value={paperSize}
            onChange={(event) => onPaperSizeChange(event.target.value as PaperSize)}
            className="cursor-pointer bg-transparent font-bold text-slate-800 outline-none"
            aria-label="Document paper size"
          >
            {availablePapers.map((paper) => (
              <option key={paper.code} value={paper.code}>
                {paper.label}
              </option>
            ))}
          </select>
        </label>

        <Button icon={<LockKeyhole className="h-4 w-4" />} onClick={onLock}>
          Lock
        </Button>
        <Button
          tone="primary"
          icon={<FileText className="h-4 w-4" />}
          onClick={onExportPdf}
          disabled={exporting || !pdfAvailable}
          title={pdfAvailable ? "Generate native PDF" : "Native PDF is not available for this template"}
        >
          {pdfAvailable ? "Generate PDF" : "PDF unavailable"}
        </Button>
        <Button
          tone="dark"
          icon={<FileDown className="h-4 w-4" />}
          onClick={onExportPng}
          disabled={exporting}
        >
          PNG
        </Button>
      </div>
    </div>
  );
}
