import type { PaperSize } from "../../../types";

const MM_TO_PT = 72 / 25.4;
const PX_TO_PT = 72 / 96;

export function receiptPxToPt(px: number): number {
  return px * PX_TO_PT;
}

function mm(value: number): number {
  return value * MM_TO_PT;
}

export interface ClassicReceiptPdfProfile {
  code: PaperSize;
  widthPt: number;
  heightPt: number;
  paddingX: number;
  paddingTop: number;
  paddingBottom: number;
  frameInset: number;
  brandPanelHeight: number;
  brandPanelRadius: number;
  brandPanelPaddingX: number;
  brandPanelPaddingY: number;
  logoSize: number;
  logoHeight: number;
  identityRailPaddingLeft: number;
  businessNameSize: number;
  companyDetailsSize: number;
  contactIconSize: number;
  contactIconGap: number;
  contactRowMarginTop: number;
  addressRowMarginTop: number;
  titleSize: number;
  metaSize: number;
  fieldLabelSize: number;
  fieldValueSize: number;
  fieldBoxHeight: number;
  sumFirstHeight: number;
  sumSecondHeight: number;
  amountBoxHeight: number;
  methodSize: number;
  checkboxSize: number;
  signatureGap: number;
  signatureImageWidth: number;
  signatureImageHeight: number;
  signatureSize: number;
  customerSignatureSize: number;
  referenceSize: number;
}

function createProfile(
  code: PaperSize,
  widthPt: number,
  heightPt: number,
  scale: number,
): ClassicReceiptPdfProfile {
  return {
    code,
    widthPt,
    heightPt,
    paddingX: receiptPxToPt(26 * scale),
    paddingTop: receiptPxToPt(18 * scale),
    paddingBottom: receiptPxToPt(14 * scale),
    frameInset: receiptPxToPt(11 * scale),
    brandPanelHeight: receiptPxToPt(101 * scale),
    brandPanelRadius: receiptPxToPt(14 * scale),
    brandPanelPaddingX: receiptPxToPt(14 * scale),
    brandPanelPaddingY: receiptPxToPt(7 * scale),
    logoSize: receiptPxToPt(86 * scale),
    logoHeight: receiptPxToPt(78 * scale),
    identityRailPaddingLeft: receiptPxToPt(16 * scale),
    businessNameSize: receiptPxToPt(25 * scale),
    companyDetailsSize: receiptPxToPt(7.8 * scale),
    contactIconSize: receiptPxToPt(17 * scale),
    contactIconGap: receiptPxToPt(5 * scale),
    contactRowMarginTop: receiptPxToPt(5 * scale),
    addressRowMarginTop: receiptPxToPt(4 * scale),
    titleSize: receiptPxToPt(10.5 * scale),
    metaSize: receiptPxToPt(9.5 * scale),
    fieldLabelSize: receiptPxToPt(12 * scale),
    fieldValueSize: receiptPxToPt(10.4 * scale),
    fieldBoxHeight: receiptPxToPt(33 * scale),
    sumFirstHeight: receiptPxToPt(34 * scale),
    sumSecondHeight: receiptPxToPt(32 * scale),
    amountBoxHeight: receiptPxToPt(32 * scale),
    methodSize: receiptPxToPt(9.6 * scale),
    checkboxSize: receiptPxToPt(14 * scale),
    signatureGap: receiptPxToPt(135 * scale),
    signatureImageWidth: receiptPxToPt(116 * scale),
    signatureImageHeight: receiptPxToPt(29 * scale),
    signatureSize: receiptPxToPt(7.8 * scale),
    customerSignatureSize: receiptPxToPt(10 * scale),
    referenceSize: receiptPxToPt(7.8 * scale),
  };
}

export const CLASSIC_RECEIPT_PDF_PROFILES: Record<PaperSize, ClassicReceiptPdfProfile> = {
  A5: createProfile("A5", mm(210), mm(148), 1),
  A4: createProfile("A4", mm(297), mm(210), 1.28),
  LETTER: createProfile("LETTER", 792, 612, 1.25),
};

export function formatReceiptPdfDate(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length === 3 ? parts.join(" / ") : value.trim();
}
