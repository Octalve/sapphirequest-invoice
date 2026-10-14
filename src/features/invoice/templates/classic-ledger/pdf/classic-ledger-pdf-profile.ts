import type { PaperSize } from "../../../types";

const MM_TO_PT = 72 / 25.4;
export const CSS_PX_TO_PDF_PT = 72 / 96;

export function pxToPt(px: number): number {
  return px * CSS_PX_TO_PDF_PT;
}

function mm(value: number): number {
  return value * MM_TO_PT;
}

export interface ClassicLedgerPdfColumns {
  quantity: number;
  description: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface ClassicLedgerPdfProfile {
  code: PaperSize;
  widthPt: number;
  heightPt: number;
  paddingX: number;
  paddingTop: number;
  paddingBottom: number;
  frameInset: number;

  headerMinHeight: number;
  headerPaddingTop: number;
  headerPaddingX: number;
  headerPaddingBottom: number;
  logoSize: number;
  logoMarginBottom: number;
  businessNameSize: number;
  contactSize: number;
  registrationSize: number;

  titleMarginTop: number;
  titleMarginBottom: number;
  titlePaddingX: number;
  titlePaddingY: number;
  titleFontSize: number;
  titleRadius: number;

  metaGap: number;
  metaMarginBottom: number;
  metaPaddingX: number;
  metaPaddingY: number;
  metaLabelSize: number;
  metaValueSize: number;

  customerMarginBottom: number;
  customerPaddingX: number;
  customerPaddingTop: number;
  customerPaddingBottom: number;
  customerAccentWidth: number;
  sectionLabelSize: number;
  fieldLabelSize: number;
  customerTextSize: number;
  customerNameSize: number;
  customerFieldGap: number;

  tableHeaderHeight: number;
  tableRowMinHeight: number;
  tableFillerHeight: number;
  tableCellPaddingX: number;
  tableCellPaddingY: number;
  tableHeaderFontSize: number;
  tableBodyFontSize: number;
  itemTitleSize: number;
  itemTitleMinHeight: number;
  itemDescriptionSize: number;
  itemDescriptionMinHeight: number;
  itemDescriptionGap: number;
  columns: ClassicLedgerPdfColumns;

  summaryGap: number;
  summaryWidth: number;
  summaryRowHeight: number;
  grandTotalHeight: number;
  summaryValueWidth: number;
  summaryLabelSize: number;
  summaryValueSize: number;
  grandTotalLabelSize: number;
  grandTotalValueSize: number;
  amountWordsLabelSize: number;
  amountWordsSize: number;
  amountWordsMinHeight: number;

  extraDetailsGap: number;
  extraDetailsMarginTop: number;
  extraDetailsPaddingX: number;
  extraDetailsPaddingY: number;
  extraDetailsHeadingSize: number;
  extraDetailsTextSize: number;

  signaturesGap: number;
  signaturesMarginTop: number;
  signaturesMarginX: number;
  signatureNameSize: number;
  signatureRoleSize: number;
}

function buildWideProfile(code: "A4" | "LETTER"): ClassicLedgerPdfProfile {
  const widthPt = code === "A4" ? mm(210) : 612;
  const paddingX = pxToPt(52);
  const contentWidth = widthPt - (paddingX * 2);
  const quantity = pxToPt(58);
  const unitPrice = pxToPt(118);
  const discount = pxToPt(78);
  const total = pxToPt(124);
  const description = contentWidth - quantity - unitPrice - discount - total;

  return {
    code,
    widthPt,
    heightPt: code === "A4" ? mm(297) : 792,
    paddingX,
    paddingTop: pxToPt(36),
    paddingBottom: pxToPt(32),
    frameInset: pxToPt(18),

    headerMinHeight: pxToPt(150),
    headerPaddingTop: pxToPt(10),
    headerPaddingX: pxToPt(24),
    headerPaddingBottom: pxToPt(20),
    logoSize: pxToPt(72),
    logoMarginBottom: pxToPt(8),
    businessNameSize: pxToPt(30),
    contactSize: pxToPt(10),
    registrationSize: pxToPt(8),

    titleMarginTop: pxToPt(14),
    titleMarginBottom: pxToPt(15),
    titlePaddingX: pxToPt(35),
    titlePaddingY: pxToPt(7.5),
    titleFontSize: pxToPt(16),
    titleRadius: pxToPt(7),

    metaGap: pxToPt(18),
    metaMarginBottom: pxToPt(18),
    metaPaddingX: pxToPt(14),
    metaPaddingY: pxToPt(10),
    metaLabelSize: pxToPt(8),
    metaValueSize: pxToPt(11.5),

    customerMarginBottom: pxToPt(20),
    customerPaddingX: pxToPt(14),
    customerPaddingTop: pxToPt(13),
    customerPaddingBottom: pxToPt(10),
    customerAccentWidth: pxToPt(3),
    sectionLabelSize: pxToPt(8),
    fieldLabelSize: pxToPt(10),
    customerTextSize: pxToPt(12.5),
    customerNameSize: pxToPt(14),
    customerFieldGap: pxToPt(7),

    tableHeaderHeight: pxToPt(42),
    tableRowMinHeight: pxToPt(58),
    tableFillerHeight: pxToPt(48),
    tableCellPaddingX: pxToPt(8),
    tableCellPaddingY: pxToPt(7),
    tableHeaderFontSize: pxToPt(9),
    tableBodyFontSize: pxToPt(10.5),
    itemTitleSize: pxToPt(11.5),
    itemTitleMinHeight: pxToPt(18),
    itemDescriptionSize: pxToPt(9),
    itemDescriptionMinHeight: pxToPt(15),
    itemDescriptionGap: pxToPt(2),
    columns: { quantity, description, unitPrice, discount, total },

    summaryGap: pxToPt(36),
    summaryWidth: pxToPt(285),
    summaryRowHeight: pxToPt(32),
    grandTotalHeight: pxToPt(42),
    summaryValueWidth: pxToPt(128),
    summaryLabelSize: pxToPt(9.5),
    summaryValueSize: pxToPt(10.5),
    grandTotalLabelSize: pxToPt(11),
    grandTotalValueSize: pxToPt(13),
    amountWordsLabelSize: pxToPt(9),
    amountWordsSize: pxToPt(13),
    amountWordsMinHeight: pxToPt(32),

    extraDetailsGap: pxToPt(34),
    extraDetailsMarginTop: pxToPt(21),
    extraDetailsPaddingX: pxToPt(14),
    extraDetailsPaddingY: pxToPt(13),
    extraDetailsHeadingSize: pxToPt(10),
    extraDetailsTextSize: pxToPt(8.8),

    signaturesGap: pxToPt(120),
    signaturesMarginTop: pxToPt(56),
    signaturesMarginX: pxToPt(28),
    signatureNameSize: pxToPt(9),
    signatureRoleSize: pxToPt(7.5),
  };
}

function buildA5Profile(): ClassicLedgerPdfProfile {
  const widthPt = mm(148);
  const paddingX = pxToPt(32);
  const contentWidth = widthPt - (paddingX * 2);
  const quantity = pxToPt(38);
  const unitPrice = pxToPt(74);
  const discount = pxToPt(52);
  const total = pxToPt(80);
  const description = contentWidth - quantity - unitPrice - discount - total;

  return {
    code: "A5",
    widthPt,
    heightPt: mm(210),
    paddingX,
    paddingTop: pxToPt(26),
    paddingBottom: pxToPt(24),
    frameInset: pxToPt(12),

    headerMinHeight: pxToPt(105),
    headerPaddingTop: pxToPt(7),
    headerPaddingX: pxToPt(16),
    headerPaddingBottom: pxToPt(12),
    logoSize: pxToPt(48),
    logoMarginBottom: pxToPt(4),
    businessNameSize: pxToPt(19),
    contactSize: pxToPt(6.5),
    registrationSize: pxToPt(5.3),

    titleMarginTop: pxToPt(9),
    titleMarginBottom: pxToPt(10),
    titlePaddingX: pxToPt(23),
    titlePaddingY: pxToPt(5),
    titleFontSize: pxToPt(10),
    titleRadius: pxToPt(5),

    metaGap: pxToPt(10),
    metaMarginBottom: pxToPt(11),
    metaPaddingX: pxToPt(9),
    metaPaddingY: pxToPt(7),
    metaLabelSize: pxToPt(5.6),
    metaValueSize: pxToPt(7),

    customerMarginBottom: pxToPt(12),
    customerPaddingX: pxToPt(9),
    customerPaddingTop: pxToPt(8),
    customerPaddingBottom: pxToPt(7),
    customerAccentWidth: pxToPt(3),
    sectionLabelSize: pxToPt(5.6),
    fieldLabelSize: pxToPt(6.5),
    customerTextSize: pxToPt(7.8),
    customerNameSize: pxToPt(9),
    customerFieldGap: pxToPt(4),

    tableHeaderHeight: pxToPt(29),
    tableRowMinHeight: pxToPt(40),
    tableFillerHeight: pxToPt(32),
    tableCellPaddingX: pxToPt(5),
    tableCellPaddingY: pxToPt(4),
    tableHeaderFontSize: pxToPt(6),
    tableBodyFontSize: pxToPt(7),
    itemTitleSize: pxToPt(7.6),
    itemTitleMinHeight: pxToPt(11),
    itemDescriptionSize: pxToPt(6),
    itemDescriptionMinHeight: pxToPt(9),
    itemDescriptionGap: pxToPt(1.5),
    columns: { quantity, description, unitPrice, discount, total },

    summaryGap: pxToPt(20),
    summaryWidth: pxToPt(186),
    summaryRowHeight: pxToPt(23),
    grandTotalHeight: pxToPt(27),
    summaryValueWidth: pxToPt(82),
    summaryLabelSize: pxToPt(6),
    summaryValueSize: pxToPt(6.5),
    grandTotalLabelSize: pxToPt(6.8),
    grandTotalValueSize: pxToPt(8),
    amountWordsLabelSize: pxToPt(5.8),
    amountWordsSize: pxToPt(8),
    amountWordsMinHeight: pxToPt(23),

    extraDetailsGap: pxToPt(18),
    extraDetailsMarginTop: pxToPt(12),
    extraDetailsPaddingX: pxToPt(9),
    extraDetailsPaddingY: pxToPt(8),
    extraDetailsHeadingSize: pxToPt(6.5),
    extraDetailsTextSize: pxToPt(5.8),

    signaturesGap: pxToPt(72),
    signaturesMarginTop: pxToPt(34),
    signaturesMarginX: pxToPt(18),
    signatureNameSize: pxToPt(6),
    signatureRoleSize: pxToPt(5),
  };
}

export const CLASSIC_LEDGER_PDF_PROFILES: Record<PaperSize, ClassicLedgerPdfProfile> = {
  A4: buildWideProfile("A4"),
  A5: buildA5Profile(),
  LETTER: buildWideProfile("LETTER"),
};

export function classicLedgerPdfContentWidth(profile: ClassicLedgerPdfProfile): number {
  return profile.widthPt - (profile.paddingX * 2);
}

export function classicLedgerColumnTotal(profile: ClassicLedgerPdfProfile): number {
  return Object.values(profile.columns).reduce((sum, value) => sum + value, 0);
}

export function formatClassicLedgerPdfDate(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length === 3 ? parts.join(" / ") : value.trim();
}
