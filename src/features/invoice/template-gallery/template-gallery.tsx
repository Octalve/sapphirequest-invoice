"use client";

import { useMemo, useState } from "react";
import { LockKeyhole, X } from "lucide-react";
import { DEFAULT_PAYMENT_SETTINGS, createEmptyInvoiceDraft } from "../constants";
import { calculateInvoiceTotals } from "../lib/calculations";
import { SapphireInvoiceRenderer } from "../renderers/sapphire-invoice-renderer";
import { ClassicLedgerRenderer } from "../templates/classic-ledger/classic-ledger-renderer";
import { createDefaultTemplateBusinessProfile } from "../templates/business-profile";
import { ClassicReceiptRenderer } from "../templates/classic-receipt/classic-receipt-renderer";
import { createEmptyClassicReceiptDraft } from "../templates/classic-receipt/use-classic-receipt";
import { INVOICE_TEMPLATES } from "../templates/registry";
import type { InvoiceTemplateId } from "../templates/types";
import type { BusinessIdentityProfile, InvoiceDraft, InvoiceLine } from "../types";
import styles from "./template-gallery.module.css";

interface TemplateGalleryProps {
  activeTemplateId: InvoiceTemplateId;
  onUseTemplate: (templateId: InvoiceTemplateId) => void;
  onLock: () => void;
}

const noop = () => undefined;
const noopDraft = () => undefined;
const noopLine = () => undefined;
const noopPayment = () => undefined;
function noopBusiness<K extends keyof BusinessIdentityProfile>(_key: K, _value: BusinessIdentityProfile[K]) { return undefined; }

function sampleInvoiceDraft(): InvoiceDraft {
  const base = createEmptyInvoiceDraft(new Date(2026, 9, 13));
  const rows: InvoiceLine[] = [
    {
      id: "preview-row-1",
      serviceName: "Executive Travel Package",
      description: "Flight coordination, airport transfer and itinerary support",
      quantity: "1",
      unitPrice: "450000",
      discount: "0",
    },
    {
      id: "preview-row-2",
      serviceName: "Hotel Reservation",
      description: "Premium accommodation booking",
      quantity: "2",
      unitPrice: "175000",
      discount: "5",
    },
    {
      id: "preview-row-3",
      serviceName: "Visa Support Service",
      description: "Documentation and submission assistance",
      quantity: "1",
      unitPrice: "120000",
      discount: "0",
    },
  ];

  return {
    ...base,
    senderName: "Maryam Omotoyosi",
    senderEmail: "maryam@sapphirequesttravel.com",
    senderPhone: "+234 807 349 0900",
    senderRole: "Travel Consultant",
    clientName: "Apex Meridian Limited",
    clientEmail: "accounts@apexmeridian.com",
    clientPhone: "+234 803 555 0194",
    clientAddress: "Central Business District, Abuja, Nigeria",
    invoiceNo: "SQ-00128-INV",
    day: "13",
    month: "OCT",
    year: "2026",
    dueDay: "20",
    dueMonth: "OCT",
    dueYear: "2026",
    tinNo: "286899678-9999",
    rcNo: "RC-8079797",
    rows,
    discount: "2",
    tax: "0",
    currency: "NGN",
    paperSize: "A4",
    notes: "Payment confirms acceptance of the travel services described above.",
    extraDetailsVisible: true,
  };
}

function TemplatePreview({ templateId }: { templateId: InvoiceTemplateId }) {
  const draft = useMemo(() => sampleInvoiceDraft(), []);
  const businessProfile = useMemo(() => createDefaultTemplateBusinessProfile(), []);
  const totals = useMemo(
    () => calculateInvoiceTotals(draft.rows, draft.discount, draft.tax),
    [draft],
  );

  if (templateId === "classic-receipt") {
    const receiptDraft = {
      ...createEmptyClassicReceiptDraft(new Date(2026, 9, 13), 128),
      receiptNo: "SQ-00128-RCT",
      receivedFrom: "Apex Meridian Limited",
      paymentPurpose: "Executive travel package and accommodation reservation",
      amountReceived: "920000",
      balanceRemaining: "",
      paymentMethod: "transfer" as const,
      reference: "TRV-ABJ-1026",
      paperSize: "A5" as const,
    };

    return (
      <ClassicReceiptRenderer
        draft={receiptDraft}
        businessProfile={businessProfile}
        onBusinessProfileChange={noopBusiness}
        onChange={noopDraft}
        onDateChange={noopDraft}
        onReceiptSequenceChange={noop}
        onPaymentMethodChange={noopDraft}
        onAmountBlur={noopDraft}
        signatureUploadsEnabled={false}
      />
    );
  }

  const shared = {
    draft,
    paymentSettings: {
      ...DEFAULT_PAYMENT_SETTINGS,
      bankName: "Sapphire Quest Bank",
      accountName: "Sapphire Quest Travel & Tours Ltd",
      accountNumber: "0123456789",
    },
    totals,
    onDraftChange: noopDraft,
    onDateChange: noopDraft,
    onDueDateChange: noopDraft,
    onInvoiceSequenceChange: noop,
    onLineChange: noopLine,
    onLineUnitPriceBlur: noop,
    onLineQuantityBlur: noop,
    onLineDiscountBlur: noop,
    onPercentageBlur: noopDraft,
    onPaymentSettingChange: noopPayment,
  };

  return templateId === "classic-ledger"
    ? <ClassicLedgerRenderer {...shared} businessProfile={businessProfile} onBusinessProfileChange={noopBusiness} />
    : <SapphireInvoiceRenderer {...shared} />;
}

export function TemplateGallery({ activeTemplateId, onUseTemplate, onLock }: TemplateGalleryProps) {
  const [previewing, setPreviewing] = useState<InvoiceTemplateId | null>(null);

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Sapphire Quest Invoice System</span>
          <h1>Choose a Template</h1>
          <p>
            Choose a template to get started. Each template keeps its own details, so your invoices and receipts stay organized and easy to manage.
          </p>
        </div>
        <button type="button" className={styles.lockButton} onClick={onLock}>
          <LockKeyhole size={16} aria-hidden="true" />
          Lock System
        </button>
      </header>

      <section className={styles.grid} aria-label="Available document templates">
        {Object.values(INVOICE_TEMPLATES).map((template) => {
          const active = template.id === activeTemplateId;
          return (
            <article key={template.id} className={styles.card}>
              <div className={styles.previewViewport} aria-hidden="true">
                <div className={`${styles.previewScale} ${template.id === "classic-receipt" ? styles.receiptPreviewScale : ""}`}>
                  <TemplatePreview templateId={template.id} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.titleRow}>
                  <div>
                    <h2>{template.name}</h2>
                    <div className={styles.category}>{template.category}</div>
                  </div>
                  {active ? <span className={styles.badge}>Active</span> : null}
                </div>

                <p className={styles.description}>{template.description}</p>

                <div className={styles.actions}>
                  <button type="button" className={styles.previewButton} onClick={() => setPreviewing(template.id)}>
                    Preview
                  </button>
                  <button type="button" className={styles.useButton} onClick={() => onUseTemplate(template.id)}>
                    {active ? "Continue" : "Use Template"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {previewing ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label={`${INVOICE_TEMPLATES[previewing].name} preview`}>
          <div className={styles.modal}>
            <div className={styles.modalTop}>
              <div>
                <strong>{INVOICE_TEMPLATES[previewing].name}</strong>
                <span>{INVOICE_TEMPLATES[previewing].description}</span>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalUse} onClick={() => { onUseTemplate(previewing); setPreviewing(null); }}>
                  Use Template
                </button>
                <button type="button" onClick={() => setPreviewing(null)} aria-label="Close preview">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className={`${styles.modalPreview} ${previewing === "classic-receipt" ? styles.receiptModalPreview : ""}`} aria-hidden="true">
              <TemplatePreview templateId={previewing} />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
