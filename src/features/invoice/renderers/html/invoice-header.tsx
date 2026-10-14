"use client";

import Image from "next/image";
import { useState } from "react";
import { COMPANY_DOCUMENT_PREFIX, COMPANY_IDENTITY, DOCUMENT_TYPE_CODE } from "../../constants";
import { formatMoney } from "../../lib/currency";
import { formatEditableDocumentSequence, sanitizeDocumentSequenceInput } from "../../lib/numbering";
import type { InvoiceDraft, InvoiceTotals } from "../../types";

interface InvoiceHeaderProps {
  draft: InvoiceDraft;
  totals: InvoiceTotals;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onDueDateChange: (key: "dueDay" | "dueMonth" | "dueYear", value: string) => void;
  onInvoiceSequenceChange: (value: string | number) => void;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
}

interface CompactDateEditorProps {
  label: string;
  day: string;
  month: string;
  year: string;
  prefix: "" | "due";
  onChange: (key: "day" | "month" | "year" | "dueDay" | "dueMonth" | "dueYear", value: string) => void;
}

function CompactDateEditor({ label, day, month, year, prefix, onChange }: CompactDateEditorProps) {
  const dayKey = prefix === "due" ? "dueDay" : "day";
  const monthKey = prefix === "due" ? "dueMonth" : "month";
  const yearKey = prefix === "due" ? "dueYear" : "year";

  return (
    <div className="sq-meta-field sq-date-meta-field">
      <span>{label}</span>
      <div className="sq-meta-date-fields">
        <input value={day} onChange={(event) => onChange(dayKey, event.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" maxLength={2} aria-label={`${label} day`} />
        <span>/</span>
        <input value={month} onChange={(event) => onChange(monthKey, event.target.value.slice(0, 3).toUpperCase())} maxLength={3} aria-label={`${label} month`} />
        <span>/</span>
        <input value={year} onChange={(event) => onChange(yearKey, event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" maxLength={4} aria-label={`${label} year`} />
      </div>
    </div>
  );
}

function InvoiceSequenceEditor({ invoiceNo, onCommit }: { invoiceNo: string; onCommit: (value: string) => void }) {
  const [value, setValue] = useState(() => formatEditableDocumentSequence(invoiceNo));

  const commit = () => {
    const digits = sanitizeDocumentSequenceInput(value);
    const finalValue = digits || "1";
    onCommit(finalValue);
    setValue(String(Number.parseInt(finalValue, 10) || 1).padStart(5, "0"));
  };

  return (
    <div className="sq-v4-invoice-number" aria-label="Invoice number">
      <span aria-hidden="true">{COMPANY_DOCUMENT_PREFIX}-</span>
      <input
        value={value}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setValue(sanitizeDocumentSequenceInput(event.target.value))}
        onBlur={commit}
        onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
        inputMode="numeric"
        maxLength={5}
        aria-label="Invoice sequence number"
      />
      <span aria-hidden="true">-{DOCUMENT_TYPE_CODE}</span>
    </div>
  );
}

export function InvoiceHeader({ draft, totals, onDateChange, onDueDateChange, onInvoiceSequenceChange, onDraftChange }: InvoiceHeaderProps) {
  const handleDateChange = (key: "day" | "month" | "year" | "dueDay" | "dueMonth" | "dueYear", value: string) => {
    if (key.startsWith("due")) {
      onDueDateChange(key as "dueDay" | "dueMonth" | "dueYear", value);
      return;
    }
    onDateChange(key as "day" | "month" | "year", value);
  };

  return (
    <header className="sq-v4-header">
      <div className="sq-v4-brand-side">
        <div className="sq-v4-logo-disc" aria-label="Sapphire Quest logo">
          <Image src={COMPANY_IDENTITY.iconPath} width={634} height={634} alt="Sapphire Quest" className="sq-v4-brand-icon" priority />
        </div>

        <div className="sq-v4-brand-copy">
          <InvoiceSequenceEditor key={draft.invoiceNo} invoiceNo={draft.invoiceNo} onCommit={onInvoiceSequenceChange} />
          <h1>
            <span>Sapphire Quest</span>
            <br />
            <span>Travel &amp; Tours Ltd</span>
          </h1>
          <p>{COMPANY_IDENTITY.website}</p>
        </div>
      </div>

      <div className="sq-v4-meta-side">
        <div className="sq-v4-amount-line">
          <span>Amount Due</span>
          <strong>{formatMoney(totals.total, draft.currency)}</strong>
        </div>

        <div className="sq-v4-meta-grid">
          <CompactDateEditor label="Date Issued" day={draft.day} month={draft.month} year={draft.year} prefix="" onChange={handleDateChange} />
          <CompactDateEditor label="Due Date" day={draft.dueDay} month={draft.dueMonth} year={draft.dueYear} prefix="due" onChange={handleDateChange} />
          <label className="sq-meta-field">
            <span>TIN No.</span>
            <input value={draft.tinNo} onChange={(event) => onDraftChange("tinNo", event.target.value)} placeholder="TIN number" aria-label="TIN number" />
          </label>
          <label className="sq-meta-field">
            <span>RC No.</span>
            <input value={draft.rcNo} onChange={(event) => onDraftChange("rcNo", event.target.value)} placeholder="RC number" aria-label="RC number" />
          </label>
        </div>
      </div>
    </header>
  );
}
