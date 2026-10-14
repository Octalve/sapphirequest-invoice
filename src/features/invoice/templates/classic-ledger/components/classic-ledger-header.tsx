"use client";

import Image from "next/image";
import { useState } from "react";
import { COMPANY_DOCUMENT_PREFIX, COMPANY_IDENTITY, DOCUMENT_TYPE_CODE } from "../../../constants";
import { formatEditableDocumentSequence, sanitizeDocumentSequenceInput } from "../../../lib/numbering";
import type { BusinessIdentityProfile, InvoiceDraft } from "../../../types";
import { CLASSIC_LEDGER_HEADER_IMAGE_PATH } from "../lib/ledger-header-asset";
import { ClassicAutoTextarea } from "./classic-auto-textarea";
import styles from "../classic-ledger.module.css";

interface ClassicLedgerHeaderProps {
  draft: InvoiceDraft;
  businessProfile: BusinessIdentityProfile;
  onBusinessProfileChange: <K extends keyof BusinessIdentityProfile>(key: K, value: BusinessIdentityProfile[K]) => void;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
  onDateChange: (key: "day" | "month" | "year", value: string) => void;
  onDueDateChange: (key: "dueDay" | "dueMonth" | "dueYear", value: string) => void;
  onInvoiceSequenceChange: (value: string | number) => void;
}

function SequenceEditor({ invoiceNo, onCommit }: { invoiceNo: string; onCommit: (value: string | number) => void }) {
  const [value, setValue] = useState(() => formatEditableDocumentSequence(invoiceNo));

  return (
    <span className={styles.sequenceEditor}>
      <span>{COMPANY_DOCUMENT_PREFIX}-</span>
      <input
        aria-label="Classic Ledger invoice sequence number"
        inputMode="numeric"
        maxLength={5}
        value={value}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setValue(sanitizeDocumentSequenceInput(event.target.value))}
        onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
        onBlur={() => {
          onCommit(value);
          setValue(String(Math.max(1, Number.parseInt(value || "1", 10))).padStart(5, "0"));
        }}
      />
      <span>-{DOCUMENT_TYPE_CODE}</span>
    </span>
  );
}

function DateFields({
  label,
  day,
  month,
  year,
  onChange,
}: {
  label: string;
  day: string;
  month: string;
  year: string;
  onChange: (key: "day" | "month" | "year", value: string) => void;
}) {
  return (
    <label className={styles.metaField}>
      <span>{label}</span>
      <span className={styles.dateFields}>
        <input aria-label={`${label} day`} value={day} maxLength={2} inputMode="numeric" onChange={(event) => onChange("day", event.target.value.replace(/\D/g, "").slice(0, 2))} />
        <span>/</span>
        <input aria-label={`${label} month`} value={month} maxLength={3} onChange={(event) => onChange("month", event.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase())} />
        <span>/</span>
        <input aria-label={`${label} year`} value={year} maxLength={4} inputMode="numeric" onChange={(event) => onChange("year", event.target.value.replace(/\D/g, "").slice(0, 4))} />
      </span>
    </label>
  );
}

export function ClassicLedgerHeader({
  draft,
  businessProfile,
  onBusinessProfileChange,
  onDraftChange,
  onDateChange,
  onDueDateChange,
  onInvoiceSequenceChange,
}: ClassicLedgerHeaderProps) {
  const [headerImageFailed, setHeaderImageFailed] = useState(false);

  return (
    <>
      {!headerImageFailed ? (
        <header className={styles.brandImageHeader}>
          <Image
            className={styles.brandHeaderImage}
            src={CLASSIC_LEDGER_HEADER_IMAGE_PATH}
            alt={`${businessProfile.name || "Business"} invoice header`}
            fill
            sizes="690px"
            priority
            unoptimized
            onError={() => setHeaderImageFailed(true)}
          />
        </header>
      ) : (
        <header className={styles.brandHeader}>
          <Image className={styles.logo} src={COMPANY_IDENTITY.iconPath} alt="" width={72} height={72} unoptimized priority />
          <div className={styles.brandCopy}>
            <ClassicAutoTextarea
              className={styles.businessNameInput}
              value={businessProfile.name}
              rows={1}
              aria-label="Classic Ledger business name"
              onChange={(event) => onBusinessProfileChange("name", event.target.value)}
              placeholder="Business name"
            />
            <div className={styles.contactLine}>
              <input aria-label="Classic Ledger business phone" value={businessProfile.phone} onChange={(event) => onBusinessProfileChange("phone", event.target.value)} placeholder="Phone" />
              <input aria-label="Classic Ledger business email" value={businessProfile.email} onChange={(event) => onBusinessProfileChange("email", event.target.value)} placeholder="Email" />
              <input aria-label="Classic Ledger business website" value={businessProfile.website} onChange={(event) => onBusinessProfileChange("website", event.target.value)} placeholder="Website" />
            </div>
            <ClassicAutoTextarea
              className={styles.businessAddressInput}
              value={businessProfile.address}
              rows={1}
              aria-label="Classic Ledger business address"
              onChange={(event) => onBusinessProfileChange("address", event.target.value)}
              placeholder="Business address"
            />
            <div className={styles.businessRegistration}>
              <label><span>TIN</span><input aria-label="Classic Ledger TIN" value={businessProfile.tinNo} onChange={(event) => onBusinessProfileChange("tinNo", event.target.value)} placeholder="Optional" /></label>
              <label><span>RC</span><input aria-label="Classic Ledger RC number" value={businessProfile.rcNo} onChange={(event) => onBusinessProfileChange("rcNo", event.target.value)} placeholder="Optional" /></label>
            </div>
          </div>
        </header>
      )}

      <div className={styles.documentTitle}>INVOICE</div>

      <section className={styles.metaPanel} aria-label="Invoice metadata">
        <div className={styles.invoiceNumberBlock}>
          <span className={styles.eyebrow}>Invoice No.</span>
          <SequenceEditor key={draft.invoiceNo} invoiceNo={draft.invoiceNo} onCommit={onInvoiceSequenceChange} />
        </div>

        <DateFields label="Date" day={draft.day} month={draft.month} year={draft.year} onChange={onDateChange} />
        <DateFields
          label="Due Date"
          day={draft.dueDay}
          month={draft.dueMonth}
          year={draft.dueYear}
          onChange={(key, value) => {
            const mapped = key === "day" ? "dueDay" : key === "month" ? "dueMonth" : "dueYear";
            onDueDateChange(mapped, value);
          }}
        />
      </section>

      <section className={styles.customerSection} aria-label="Customer details">
        <div className={styles.sectionKicker}>BILL TO</div>
        <label className={`${styles.lineField} ${styles.customerName}`}>
          <span>Name</span>
          <ClassicAutoTextarea value={draft.clientName} rows={1} aria-label="Classic Ledger customer name" onChange={(event) => onDraftChange("clientName", event.target.value)} placeholder="Customer or company name" />
        </label>
        <label className={styles.lineField}>
          <span>Address</span>
          <ClassicAutoTextarea value={draft.clientAddress} rows={1} aria-label="Classic Ledger customer address" onChange={(event) => onDraftChange("clientAddress", event.target.value)} placeholder="Customer address" />
        </label>
        <div className={styles.customerTwoColumns}>
          <label className={styles.lineField}>
            <span>Email</span>
            <input value={draft.clientEmail} onChange={(event) => onDraftChange("clientEmail", event.target.value)} placeholder="Email address" />
          </label>
          <label className={styles.lineField}>
            <span>Phone</span>
            <input value={draft.clientPhone} onChange={(event) => onDraftChange("clientPhone", event.target.value)} placeholder="Phone number" />
          </label>
        </div>
      </section>
    </>
  );
}
