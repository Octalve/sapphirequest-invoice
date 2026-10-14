"use client";

import { BriefcaseBusiness, Mail, MapPin, Phone } from "lucide-react";
import type { InvoiceDraft } from "../../types";

interface InvoicePartiesProps {
  draft: InvoiceDraft;
  onDraftChange: <K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) => void;
}

interface DetailInputProps {
  icon: "mail" | "phone" | "location" | "role";
  value: string;
  placeholder: string;
  ariaLabel: string;
  inputMode?: "email" | "tel" | "text";
  onChange: (value: string) => void;
}

const icons = {
  mail: Mail,
  phone: Phone,
  location: MapPin,
  role: BriefcaseBusiness,
} as const;

function DetailInput({ icon, value, placeholder, ariaLabel, inputMode = "text", onChange }: DetailInputProps) {
  const Icon = icons[icon];
  return (
    <label className="sq-party-detail-row">
      <Icon className="sq-party-detail-icon" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        inputMode={inputMode}
        autoComplete="off"
      />
    </label>
  );
}

export function InvoiceParties({ draft, onDraftChange }: InvoicePartiesProps) {
  return (
    <section className="sq-v4-parties" data-export-break-before>
      <div className="sq-v4-party-column">
        <span className="sq-v4-section-label">Invoice from</span>
        <input
          value={draft.senderName}
          onChange={(event) => onDraftChange("senderName", event.target.value)}
          className="sq-party-name-input"
          placeholder="Sender name"
          aria-label="Invoice sender name"
          autoComplete="off"
        />
        <DetailInput
          icon="mail"
          value={draft.senderEmail}
          placeholder="Sender email"
          ariaLabel="Invoice sender email"
          inputMode="email"
          onChange={(value) => onDraftChange("senderEmail", value)}
        />
        <DetailInput
          icon="phone"
          value={draft.senderPhone}
          placeholder="Sender telephone"
          ariaLabel="Invoice sender telephone"
          inputMode="tel"
          onChange={(value) => onDraftChange("senderPhone", value)}
        />
        <DetailInput
          icon="role"
          value={draft.senderRole}
          placeholder="Sender role"
          ariaLabel="Invoice sender role"
          onChange={(value) => onDraftChange("senderRole", value)}
        />
      </div>

      <div className="sq-v4-party-divider" aria-hidden="true" />

      <div className="sq-v4-party-column">
        <span className="sq-v4-section-label">To Customer</span>
        <input
          value={draft.clientName}
          onChange={(event) => onDraftChange("clientName", event.target.value)}
          className="sq-party-name-input"
          placeholder="Customer name"
          aria-label="Customer name"
          autoComplete="off"
        />
        <DetailInput
          icon="mail"
          value={draft.clientEmail}
          placeholder="Customer email"
          ariaLabel="Customer email"
          inputMode="email"
          onChange={(value) => onDraftChange("clientEmail", value)}
        />
        <DetailInput
          icon="phone"
          value={draft.clientPhone}
          placeholder="Customer telephone"
          ariaLabel="Customer telephone"
          inputMode="tel"
          onChange={(value) => onDraftChange("clientPhone", value)}
        />
        <DetailInput
          icon="location"
          value={draft.clientAddress}
          placeholder="Customer location"
          ariaLabel="Customer location"
          onChange={(value) => onDraftChange("clientAddress", value)}
        />
      </div>
    </section>
  );
}
