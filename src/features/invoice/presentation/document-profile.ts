import type { PaperSize } from "../types";

const MM_TO_PT = 72 / 25.4;
export const CSS_PX_TO_PT = 72 / 96;

export function pxToPt(value: number): number {
  return value * CSS_PX_TO_PT;
}

export const SAPPHIRE_THEME = {
  primary: "#0755DB",
  primaryDark: "#043996",
  primarySoft: "#EEF5FF",
  surface: "#F5F8FC",
  border: "#E3EAF2",
  text: "#102A43",
  textMuted: "#6B8295",
  white: "#FFFFFF",
} as const;

export const OCTALVE_THEME = {
  primary: "#021A34",
  soft: "#EAF3FF",
} as const;

export interface PdfUiMetrics {
  cardRadius: number;
  headerMinHeight: number;
  headerPaddingTop: number;
  headerPaddingX: number;
  headerPaddingBottom: number;
  headerColumnGap: number;
  brandGap: number;
  logoDiscSize: number;
  logoSize: number;
  invoiceNoSize: number;
  invoiceNoMarginBottom: number;
  invoiceNoLetterSpacing: number;
  companyNameSize: number;
  companyNameLineHeight: number;
  companyNameLetterSpacing: number;
  websiteSize: number;
  websiteMarginTop: number;
  metaPaddingLeft: number;
  amountLabelSize: number;
  amountValueSize: number;
  amountValueLetterSpacing: number;
  amountPaddingBottom: number;
  metaMarginTop: number;
  metaRowGap: number;
  metaColumnGap: number;
  metaLabelSize: number;
  metaValueSize: number;
  partyMinHeight: number;
  partyPaddingY: number;
  partyPaddingX: number;
  partyInnerPadding: number;
  partyGap: number;
  partyLabelSize: number;
  partyLabelMarginBottom: number;
  partyNameSize: number;
  partyNameMinHeight: number;
  partyNameMarginBottom: number;
  partyDetailMinHeight: number;
  partyIconColumnWidth: number;
  partyIconSize: number;
  partyIconGap: number;
  partyTextSize: number;
  tableHeaderMinHeight: number;
  tableHeaderPaddingY: number;
  tablePaddingX: number;
  tableColumnGap: number;
  qtyColumnWidth: number;
  unitColumnWidth: number;
  discountColumnWidth: number;
  amountColumnWidth: number;
  itemPaddingY: number;
  itemIconSize: number;
  itemIconGlyphSize: number;
  itemCopyPaddingLeft: number;
  itemTitleMinHeight: number;
  itemDescriptionMinHeight: number;
  quantitySize: number;
  amountSize: number;
  closingGap: number;
  summaryMinWidth: number;
  closingMarginTop: number;
  closingMarginX: number;
  closingMarginBottom: number;
  closingHeadingSize: number;
  closingHeadingLetterSpacing: number;
  thankYouSize: number;
  thankYouMarginTop: number;
  extraDetailsGap: number;
  extraDetailsMarginTop: number;
  miniHeadingSize: number;
  miniHeadingMarginBottom: number;
  paymentLabelWidth: number;
  paymentColumnGap: number;
  paymentTextSize: number;
  summarySize: number;
  summaryValueWidth: number;
  summaryGap: number;
  summaryRowPaddingY: number;
  summaryTotalMarginTop: number;
  summaryTotalPaddingY: number;
  summaryTotalLabelSize: number;
  summaryTotalValueSize: number;
  footerTextSize: number;
}

export interface PdfPaperProfile {
  code: PaperSize;
  widthPt: number;
  heightPt: number;
  pagePaddingX: number;
  pagePaddingTop: number;
  pagePaddingBottom: number;
  headerGap: number;
  sectionGap: number;
  bodyFontSize: number;
  smallFontSize: number;
  itemTitleSize: number;
  itemDescriptionSize: number;
  itemRowMinHeight: number;
  footerHeight: number;
  ui: PdfUiMetrics;
}

function mm(value: number): number {
  return value * MM_TO_PT;
}

const A4_UI: PdfUiMetrics = {
  cardRadius: pxToPt(14),
  headerMinHeight: pxToPt(154),
  headerPaddingTop: pxToPt(8),
  headerPaddingX: pxToPt(8),
  headerPaddingBottom: pxToPt(20),
  headerColumnGap: pxToPt(30),
  brandGap: pxToPt(20),
  logoDiscSize: pxToPt(112),
  logoSize: pxToPt(84),
  invoiceNoSize: pxToPt(18),
  invoiceNoMarginBottom: pxToPt(8),
  invoiceNoLetterSpacing: pxToPt(-0.36),
  companyNameSize: pxToPt(28),
  companyNameLineHeight: 1.1,
  companyNameLetterSpacing: pxToPt(-0.98),
  websiteSize: pxToPt(12.5),
  websiteMarginTop: pxToPt(9),
  metaPaddingLeft: pxToPt(28),
  amountLabelSize: pxToPt(10.5),
  amountValueSize: pxToPt(19),
  amountValueLetterSpacing: pxToPt(-0.57),
  amountPaddingBottom: pxToPt(12),
  metaMarginTop: pxToPt(12),
  metaRowGap: pxToPt(11),
  metaColumnGap: pxToPt(20),
  metaLabelSize: pxToPt(10.5),
  metaValueSize: pxToPt(10.5),
  partyMinHeight: pxToPt(124),
  partyPaddingY: pxToPt(18),
  partyPaddingX: pxToPt(24),
  partyInnerPadding: pxToPt(28),
  partyGap: pxToPt(4),
  partyLabelSize: pxToPt(10.5),
  partyLabelMarginBottom: pxToPt(1),
  partyNameSize: pxToPt(13),
  partyNameMinHeight: pxToPt(20),
  partyNameMarginBottom: pxToPt(2),
  partyDetailMinHeight: pxToPt(20),
  partyIconColumnWidth: pxToPt(18),
  partyIconSize: pxToPt(15),
  partyIconGap: pxToPt(8),
  partyTextSize: pxToPt(10.8),
  tableHeaderMinHeight: pxToPt(42),
  tableHeaderPaddingY: pxToPt(11),
  tablePaddingX: pxToPt(14),
  tableColumnGap: pxToPt(13),
  qtyColumnWidth: pxToPt(64),
  unitColumnWidth: pxToPt(118),
  discountColumnWidth: pxToPt(74),
  amountColumnWidth: pxToPt(118),
  itemPaddingY: pxToPt(9),
  itemIconSize: pxToPt(28),
  itemIconGlyphSize: pxToPt(15),
  itemCopyPaddingLeft: pxToPt(12),
  itemTitleMinHeight: pxToPt(18),
  itemDescriptionMinHeight: pxToPt(14),
  quantitySize: pxToPt(10.8),
  amountSize: pxToPt(10.9),
  closingGap: pxToPt(44),
  summaryMinWidth: pxToPt(270),
  closingMarginTop: pxToPt(1),
  closingMarginX: pxToPt(12),
  closingMarginBottom: pxToPt(20),
  closingHeadingSize: pxToPt(19),
  closingHeadingLetterSpacing: pxToPt(-0.38),
  thankYouSize: pxToPt(12.5),
  thankYouMarginTop: pxToPt(4),
  extraDetailsGap: pxToPt(11),
  extraDetailsMarginTop: pxToPt(12),
  miniHeadingSize: pxToPt(8.8),
  miniHeadingMarginBottom: pxToPt(3),
  paymentLabelWidth: pxToPt(82),
  paymentColumnGap: pxToPt(7),
  paymentTextSize: pxToPt(8.8),
  summarySize: pxToPt(10.5),
  summaryValueWidth: pxToPt(150),
  summaryGap: pxToPt(14),
  summaryRowPaddingY: pxToPt(7),
  summaryTotalMarginTop: pxToPt(2),
  summaryTotalPaddingY: pxToPt(9),
  summaryTotalLabelSize: pxToPt(11.8),
  summaryTotalValueSize: pxToPt(14),
  footerTextSize: pxToPt(9.5),
};

const A5_UI: PdfUiMetrics = {
  cardRadius: pxToPt(10),
  headerMinHeight: pxToPt(104),
  headerPaddingTop: pxToPt(4),
  headerPaddingX: pxToPt(5),
  headerPaddingBottom: pxToPt(11),
  headerColumnGap: pxToPt(16),
  brandGap: pxToPt(12),
  logoDiscSize: pxToPt(72),
  logoSize: pxToPt(54),
  invoiceNoSize: pxToPt(12.5),
  invoiceNoMarginBottom: pxToPt(4),
  invoiceNoLetterSpacing: pxToPt(-0.25),
  companyNameSize: pxToPt(17.5),
  companyNameLineHeight: 1.1,
  companyNameLetterSpacing: pxToPt(-0.61),
  websiteSize: pxToPt(6.8),
  websiteMarginTop: pxToPt(5),
  metaPaddingLeft: pxToPt(13),
  amountLabelSize: pxToPt(6.6),
  amountValueSize: pxToPt(10.2),
  amountValueLetterSpacing: pxToPt(-0.31),
  amountPaddingBottom: pxToPt(6),
  metaMarginTop: pxToPt(7),
  metaRowGap: pxToPt(6),
  metaColumnGap: pxToPt(10),
  metaLabelSize: pxToPt(6.6),
  metaValueSize: pxToPt(6.6),
  partyMinHeight: pxToPt(86),
  partyPaddingY: pxToPt(11),
  partyPaddingX: pxToPt(14),
  partyInnerPadding: pxToPt(15),
  partyGap: pxToPt(2),
  partyLabelSize: pxToPt(6.3),
  partyLabelMarginBottom: pxToPt(1),
  partyNameSize: pxToPt(8.2),
  partyNameMinHeight: pxToPt(13),
  partyNameMarginBottom: pxToPt(1),
  partyDetailMinHeight: pxToPt(12),
  partyIconColumnWidth: pxToPt(11),
  partyIconSize: pxToPt(9),
  partyIconGap: pxToPt(4),
  partyTextSize: pxToPt(7),
  tableHeaderMinHeight: pxToPt(29),
  tableHeaderPaddingY: pxToPt(7),
  tablePaddingX: pxToPt(8),
  tableColumnGap: pxToPt(7),
  qtyColumnWidth: pxToPt(43),
  unitColumnWidth: pxToPt(73),
  discountColumnWidth: pxToPt(50),
  amountColumnWidth: pxToPt(84),
  itemPaddingY: pxToPt(6),
  itemIconSize: pxToPt(18),
  itemIconGlyphSize: pxToPt(10),
  itemCopyPaddingLeft: pxToPt(7),
  itemTitleMinHeight: pxToPt(10),
  itemDescriptionMinHeight: pxToPt(9),
  quantitySize: pxToPt(7),
  amountSize: pxToPt(7),
  closingGap: pxToPt(20),
  summaryMinWidth: pxToPt(176),
  closingMarginTop: 0,
  closingMarginX: pxToPt(5),
  closingMarginBottom: pxToPt(9),
  closingHeadingSize: pxToPt(11),
  closingHeadingLetterSpacing: pxToPt(-0.22),
  thankYouSize: pxToPt(7),
  thankYouMarginTop: pxToPt(2),
  extraDetailsGap: pxToPt(5),
  extraDetailsMarginTop: pxToPt(6),
  miniHeadingSize: pxToPt(5.4),
  miniHeadingMarginBottom: pxToPt(3),
  paymentLabelWidth: pxToPt(47),
  paymentColumnGap: pxToPt(4),
  paymentTextSize: pxToPt(5.4),
  summarySize: pxToPt(6.2),
  summaryValueWidth: pxToPt(92),
  summaryGap: pxToPt(7),
  summaryRowPaddingY: pxToPt(4),
  summaryTotalMarginTop: pxToPt(2),
  summaryTotalPaddingY: pxToPt(5),
  summaryTotalLabelSize: pxToPt(6.8),
  summaryTotalValueSize: pxToPt(8.8),
  footerTextSize: pxToPt(6),
};

export const PDF_PAPER_PROFILES: Record<PaperSize, PdfPaperProfile> = {
  A4: {
    code: "A4",
    widthPt: mm(210),
    heightPt: mm(297),
    pagePaddingX: pxToPt(34),
    pagePaddingTop: pxToPt(34),
    pagePaddingBottom: A4_UI.closingMarginBottom,
    headerGap: pxToPt(18),
    sectionGap: pxToPt(18),
    bodyFontSize: A4_UI.quantitySize,
    smallFontSize: pxToPt(10.1),
    itemTitleSize: pxToPt(12.2),
    itemDescriptionSize: pxToPt(10.5),
    itemRowMinHeight: pxToPt(56),
    footerHeight: pxToPt(36),
    ui: A4_UI,
  },
  A5: {
    code: "A5",
    widthPt: mm(148),
    heightPt: mm(210),
    pagePaddingX: pxToPt(22),
    pagePaddingTop: pxToPt(22),
    pagePaddingBottom: A5_UI.closingMarginBottom,
    headerGap: pxToPt(12),
    sectionGap: pxToPt(12),
    bodyFontSize: A5_UI.quantitySize,
    smallFontSize: pxToPt(7),
    itemTitleSize: pxToPt(7.9),
    itemDescriptionSize: pxToPt(7),
    itemRowMinHeight: pxToPt(40),
    footerHeight: pxToPt(23),
    ui: A5_UI,
  },
  LETTER: {
    code: "LETTER",
    widthPt: 612,
    heightPt: 792,
    pagePaddingX: pxToPt(34),
    pagePaddingTop: pxToPt(34),
    pagePaddingBottom: A4_UI.closingMarginBottom,
    headerGap: pxToPt(18),
    sectionGap: pxToPt(18),
    bodyFontSize: A4_UI.quantitySize,
    smallFontSize: pxToPt(10.1),
    itemTitleSize: pxToPt(12.2),
    itemDescriptionSize: pxToPt(10.5),
    itemRowMinHeight: pxToPt(56),
    footerHeight: pxToPt(36),
    ui: A4_UI,
  },
};
