"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Globe2, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY_IDENTITY } from "../../../constants";
import type { BusinessIdentityProfile } from "../../../types";
import { RECEIPT_HEADER_IMAGE_PATH } from "../lib/receipt-header-asset";
import { ReceiptAutoTextarea } from "./receipt-auto-textarea";
import styles from "../classic-receipt.module.css";

interface ReceiptBrandHeaderProps {
  businessProfile: BusinessIdentityProfile;
  onBusinessProfileChange: <K extends keyof BusinessIdentityProfile>(
    key: K,
    value: BusinessIdentityProfile[K],
  ) => void;
}

function CompanyDetailField({
  icon,
  iconClassName,
  ariaLabel,
  value,
  placeholder,
  onChange,
}: {
  icon: ReactNode;
  iconClassName: string;
  ariaLabel: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.detailField}>
      <span className={`${styles.detailIcon} ${iconClassName}`} aria-hidden="true">
        {icon}
      </span>
      <input
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function ReceiptBrandHeader({
  businessProfile,
  onBusinessProfileChange,
}: ReceiptBrandHeaderProps) {
  const [headerImageFailed, setHeaderImageFailed] = useState(false);
  const nameLength = businessProfile.name.trim().length;
  const compactName = nameLength > 34;
  const tightName = nameLength > 48;

  if (!headerImageFailed) {
    return (
      <header className={styles.brandSection}>
        <div className={styles.brandImagePanel}>
          <Image
            className={styles.brandHeaderImage}
            src={RECEIPT_HEADER_IMAGE_PATH}
            alt={`${businessProfile.name || "Business"} receipt header`}
            width={2400}
            height={360}
            unoptimized
            priority
            onError={() => setHeaderImageFailed(true)}
          />
        </div>
        <div className={styles.brandDivider} aria-hidden="true" />
      </header>
    );
  }

  return (
    <header className={styles.brandSection}>
      <div className={styles.brandPanel}>
        <div className={styles.logoRail}>
          <Image
            className={styles.logo}
            src={COMPANY_IDENTITY.iconPath}
            alt=""
            width={96}
            height={78}
            unoptimized
            priority
          />
        </div>

        <div className={styles.identityRail}>
          <ReceiptAutoTextarea
            className={`${styles.businessNameInput} ${compactName ? styles.businessNameCompact : ""} ${tightName ? styles.businessNameTight : ""}`}
            rows={1}
            value={businessProfile.name}
            aria-label="Classic Receipt business name"
            onChange={(event) => onBusinessProfileChange("name", event.target.value)}
            placeholder="Business name"
          />

          <div className={styles.contactGrid}>
            <CompanyDetailField
              icon={<Phone size={12} strokeWidth={2.35} />}
              iconClassName={styles.phoneIcon}
              ariaLabel="Classic Receipt business phone"
              value={businessProfile.phone}
              onChange={(value) => onBusinessProfileChange("phone", value)}
              placeholder="Phone"
            />
            <CompanyDetailField
              icon={<Mail size={12} strokeWidth={2.35} />}
              iconClassName={styles.emailIcon}
              ariaLabel="Classic Receipt business email"
              value={businessProfile.email}
              onChange={(value) => onBusinessProfileChange("email", value)}
              placeholder="Email"
            />
            <CompanyDetailField
              icon={<Globe2 size={12} strokeWidth={2.35} />}
              iconClassName={styles.websiteIcon}
              ariaLabel="Classic Receipt business website"
              value={businessProfile.website}
              onChange={(value) => onBusinessProfileChange("website", value)}
              placeholder="Website"
            />
          </div>

          <label className={`${styles.detailField} ${styles.addressField}`}>
            <span className={`${styles.detailIcon} ${styles.addressIcon}`} aria-hidden="true">
              <MapPin size={12} strokeWidth={2.35} />
            </span>
            <ReceiptAutoTextarea
              className={styles.businessAddressInput}
              rows={1}
              value={businessProfile.address}
              aria-label="Classic Receipt business address"
              onChange={(event) => onBusinessProfileChange("address", event.target.value)}
              placeholder="Business address"
            />
          </label>
        </div>
      </div>
      <div className={styles.brandDivider} aria-hidden="true" />
    </header>
  );
}
