import type { ReactNode } from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatAmountInWords } from "../../../lib/amount-in-words";
import { darkenHex, normalizeAccentColor } from "../../../lib/template-theme";
import { formatPdfNumber, type InvoicePresentation, type InvoicePresentationItem } from "../../../presentation/invoice-presentation";
import type { CurrencyCode } from "../../../types";
import {
  CLASSIC_LEDGER_PDF_PROFILES,
  classicLedgerPdfContentWidth,
  formatClassicLedgerPdfDate,
  type ClassicLedgerPdfProfile,
} from "./classic-ledger-pdf-profile";

interface ClassicLedgerPdfDocumentProps {
  presentation: InvoicePresentation;
  logoSrc: string;
  headerImageSrc?: string | null;
  accentColor?: string;
}

const COLORS = {
  accent: "#0755DB",
  accentDark: "#043996",
  ink: "#172033",
  muted: "#667085",
  line: "#1F2937",
  soft: "#EEF5FF",
  subtle: "#F8FAFC",
  rule: "#CBD5E1",
  white: "#FFFFFF",
} as const;

const styles = StyleSheet.create({
  page: {
    position: "relative",
    backgroundColor: COLORS.white,
    color: COLORS.ink,
    fontFamily: "Helvetica",
  },
  frame: {
    position: "absolute",
    borderWidth: 1.1,
    borderColor: COLORS.accentDark,
  },
  continuation: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    color: COLORS.muted,
    fontSize: 6,
  },
  continuationBrand: {
    color: COLORS.accentDark,
    fontFamily: "Helvetica-Bold",
  },
  brandHeaderImageWrap: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.accentDark,
    borderBottomWidth: 1.5,
  },
  brandHeaderImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  brandHeader: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderBottomColor: COLORS.accentDark,
    borderBottomWidth: 1.5,
  },
  logo: {
    objectFit: "contain",
  },
  businessName: {
    maxWidth: "90%",
    color: COLORS.accentDark,
    fontFamily: "Times-Bold",
    lineHeight: 1.08,
    textAlign: "center",
  },
  contactLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    color: COLORS.muted,
    fontFamily: "Helvetica-Bold",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactDot: {
    color: COLORS.accent,
  },
  registration: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    color: COLORS.muted,
    fontFamily: "Helvetica-Bold",
  },
  documentTitleWrap: {
    alignSelf: "center",
    borderColor: COLORS.accentDark,
    borderWidth: 1.1,
  },
  documentTitle: {
    color: COLORS.accentDark,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.3,
  },
  metaPanel: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.rule,
  },
  metaCell: {
    flexGrow: 1,
    flexBasis: 0,
  },
  metaCellWide: {
    flexGrow: 1.25,
    flexBasis: 0,
  },
  eyebrow: {
    color: COLORS.muted,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.7,
  },
  metaValue: {
    color: COLORS.ink,
    fontFamily: "Times-Roman",
    borderBottomWidth: 0.7,
    borderBottomColor: "#94A3B8",
  },
  invoiceNo: {
    color: COLORS.ink,
    fontFamily: "Helvetica-Bold",
  },
  customerSection: {
    backgroundColor: "#F8FBFF",
    borderLeftColor: COLORS.accent,
  },
  customerField: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  customerFieldLabel: {
    color: COLORS.muted,
    fontFamily: "Times-Roman",
  },
  customerFieldValue: {
    flexGrow: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: "#64748B",
    color: COLORS.ink,
    fontFamily: "Times-Roman",
  },
  customerName: {
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
  },
  customerTwoColumns: {
    flexDirection: "row",
  },
  customerHalf: {
    width: "50%",
  },
  table: {
    borderWidth: 1.1,
    borderColor: COLORS.line,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.soft,
    color: COLORS.accentDark,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 0.75,
    borderTopColor: COLORS.line,
    fontFamily: "Times-Roman",
  },
  tableCell: {
    justifyContent: "center",
    borderRightWidth: 0.75,
    borderRightColor: COLORS.line,
  },
  tableCellLast: {
    borderRightWidth: 0,
  },
  center: {
    alignItems: "center",
    textAlign: "center",
  },
  itemTitle: {
    color: COLORS.ink,
    fontFamily: "Times-Bold",
    lineHeight: 1.2,
  },
  itemDescription: {
    color: COLORS.muted,
    fontFamily: "Times-Roman",
    lineHeight: 1.25,
  },
  money: {
    flexDirection: "row",
    alignItems: "center",
  },
  naira: {
    position: "relative",
  },
  nairaLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.ink,
  },
  summaryBand: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  amountWords: {
    flexGrow: 1,
  },
  amountWordsLabel: {
    color: COLORS.muted,
    fontFamily: "Helvetica-Bold",
  },
  amountWordsValue: {
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.line,
    fontFamily: "Times-Roman",
    lineHeight: 1.35,
    textTransform: "uppercase",
  },
  summary: {
    borderTopWidth: 0.75,
    borderTopColor: COLORS.line,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.rule,
  },
  summaryLabel: {
    flexGrow: 1,
    color: COLORS.muted,
  },
  summaryValue: {
    color: COLORS.ink,
    fontFamily: "Helvetica-Bold",
  },
  grandTotal: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.accentDark,
  },
  grandTotalLabel: {
    color: COLORS.accentDark,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalValue: {
    color: COLORS.accentDark,
    fontFamily: "Helvetica-Bold",
  },
  extraDetails: {
    flexDirection: "row",
    backgroundColor: COLORS.subtle,
    borderTopWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: COLORS.rule,
  },
  extraColumn: {
    flexGrow: 1,
    flexBasis: 0,
  },
  extraHeading: {
    color: COLORS.accentDark,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.6,
  },
  paymentRow: {
    flexDirection: "row",
  },
  paymentLabel: {
    width: "35%",
    color: COLORS.muted,
  },
  paymentValue: {
    width: "65%",
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.rule,
    color: COLORS.ink,
  },
  notes: {
    color: COLORS.ink,
    lineHeight: 1.3,
  },
  signatures: {
    flexDirection: "row",
  },
  signatureBlock: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: "center",
    textAlign: "center",
  },
  signatureLine: {
    alignSelf: "stretch",
    borderTopWidth: 0.75,
    borderTopColor: COLORS.line,
  },
  signatureName: {
    color: COLORS.ink,
    fontFamily: "Helvetica-Bold",
  },
  signatureRole: {
    color: COLORS.muted,
  },
  pageNumber: {
    position: "absolute",
    color: "#94A3B8",
    fontSize: 5.5,
  },
});

function PdfCurrencySymbol({ currency, fontSize, color = COLORS.ink }: { currency: CurrencyCode; fontSize: number; color?: string }) {
  if (currency === "NGN") {
    return (
      <View style={[styles.naira, { width: fontSize * 0.72, height: fontSize * 1.12, marginRight: fontSize * 0.12 }]}> 
        <Text style={{ fontSize, lineHeight: 1, color }}>N</Text>
        <View style={[styles.nairaLine, { top: fontSize * 0.40, borderTopColor: color }]} />
        <View style={[styles.nairaLine, { top: fontSize * 0.66, borderTopColor: color }]} />
      </View>
    );
  }

  const symbols: Record<Exclude<CurrencyCode, "NGN">, string> = { USD: "$", GBP: "£", EUR: "€" };
  return <Text style={{ fontSize, color, marginRight: fontSize * 0.12 }}>{symbols[currency]}</Text>;
}

function PdfMoney({
  amount,
  currency,
  fontSize,
  bold = false,
  color = COLORS.ink,
}: {
  amount: number;
  currency: CurrencyCode;
  fontSize: number;
  bold?: boolean;
  color?: string;
}) {
  return (
    <View style={styles.money}>
      <PdfCurrencySymbol currency={currency} fontSize={fontSize} color={color} />
      <Text style={{ fontSize, color, fontFamily: bold ? "Helvetica-Bold" : "Times-Roman" }}>
        {formatPdfNumber(amount, currency)}
      </Text>
    </View>
  );
}

function ContactLine({ presentation, profile, accent }: { presentation: InvoicePresentation; profile: ClassicLedgerPdfProfile; accent: string }) {
  const values = [presentation.company.phone, presentation.company.email, presentation.company.website, presentation.company.address].filter(Boolean);
  return (
    <View style={[styles.contactLine, { marginTop: profile.contactSize * 0.8, gap: profile.contactSize * 0.7 }]}> 
      {values.map((value, index) => (
        <View key={`${value}-${index}`} style={styles.contactItem}>
          {index > 0 ? <Text style={[styles.contactDot, { color: accent, fontSize: profile.contactSize, marginRight: profile.contactSize * 0.7 }]}>•</Text> : null}
          <Text style={{ fontSize: profile.contactSize }}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function RegistrationLine({ presentation, profile }: { presentation: InvoicePresentation; profile: ClassicLedgerPdfProfile }) {
  if (!presentation.company.tinNo && !presentation.company.rcNo) return null;
  return (
    <View style={[styles.registration, { marginTop: profile.registrationSize * 0.7, gap: profile.registrationSize * 1.6 }]}> 
      {presentation.company.tinNo ? <Text style={{ fontSize: profile.registrationSize }}>TIN: {presentation.company.tinNo}</Text> : null}
      {presentation.company.rcNo ? <Text style={{ fontSize: profile.registrationSize }}>RC: {presentation.company.rcNo}</Text> : null}
    </View>
  );
}

function CustomerField({
  label,
  value,
  profile,
  strong = false,
}: {
  label: string;
  value: string;
  profile: ClassicLedgerPdfProfile;
  strong?: boolean;
}) {
  return (
    <View style={[styles.customerField, { marginTop: profile.customerFieldGap }]}> 
      <Text style={[styles.customerFieldLabel, { width: profile.code === "A5" ? 30 : 45, fontSize: profile.fieldLabelSize }]}>{label}</Text>
      <Text
        style={[
          styles.customerFieldValue,
          strong ? styles.customerName : {},
          {
            fontSize: strong ? profile.customerNameSize : profile.customerTextSize,
            paddingHorizontal: profile.code === "A5" ? 3 : 4,
            paddingBottom: profile.code === "A5" ? 1.5 : 2.25,
          },
        ]}
      >
        {value || " "}
      </Text>
    </View>
  );
}

function TableCell({
  width,
  children,
  profile,
  last = false,
  center = false,
}: {
  width: number;
  children: ReactNode;
  profile: ClassicLedgerPdfProfile;
  last?: boolean;
  center?: boolean;
}) {
  return (
    <View
      style={[
        styles.tableCell,
        last ? styles.tableCellLast : {},
        center ? styles.center : {},
        {
          width,
          paddingHorizontal: profile.tableCellPaddingX,
          paddingVertical: profile.tableCellPaddingY,
        },
      ]}
    >
      {children}
    </View>
  );
}

function ClassicLedgerTableRow({ item, profile, presentation }: { item: InvoicePresentationItem; profile: ClassicLedgerPdfProfile; presentation: InvoicePresentation }) {
  const allowWrap = item.description.length > (profile.code === "A5" ? 260 : 420) || item.title.length > 140;
  return (
    <View style={[styles.tableRow, { minHeight: profile.tableRowMinHeight }]} wrap={allowWrap}>
      <TableCell width={profile.columns.quantity} profile={profile} center>
        <Text style={{ fontSize: profile.tableBodyFontSize }}>{item.quantityDisplay}</Text>
      </TableCell>
      <TableCell width={profile.columns.description} profile={profile}>
        <Text style={[styles.itemTitle, { fontSize: profile.itemTitleSize, minHeight: profile.itemTitleMinHeight }]}>{item.title || "Item or service"}</Text>
        {item.description ? (
          <Text style={[styles.itemDescription, { fontSize: profile.itemDescriptionSize, minHeight: profile.itemDescriptionMinHeight, marginTop: profile.itemDescriptionGap }]}>{item.description}</Text>
        ) : null}
      </TableCell>
      <TableCell width={profile.columns.unitPrice} profile={profile}>
        <PdfMoney amount={item.unitPrice} currency={presentation.currency} fontSize={profile.tableBodyFontSize} />
      </TableCell>
      <TableCell width={profile.columns.discount} profile={profile} center>
        <Text style={{ fontSize: profile.tableBodyFontSize }}>{item.discountPercent}%</Text>
      </TableCell>
      <TableCell width={profile.columns.total} profile={profile} last>
        <PdfMoney amount={item.amount} currency={presentation.currency} fontSize={profile.tableBodyFontSize * 0.95} bold />
      </TableCell>
    </View>
  );
}

function FillerRow({ profile }: { profile: ClassicLedgerPdfProfile }) {
  return (
    <View style={[styles.tableRow, { minHeight: profile.tableFillerHeight }]} wrap={false}>
      <TableCell width={profile.columns.quantity} profile={profile}><Text> </Text></TableCell>
      <TableCell width={profile.columns.description} profile={profile}><Text> </Text></TableCell>
      <TableCell width={profile.columns.unitPrice} profile={profile}><Text> </Text></TableCell>
      <TableCell width={profile.columns.discount} profile={profile}><Text> </Text></TableCell>
      <TableCell width={profile.columns.total} profile={profile} last><Text> </Text></TableCell>
    </View>
  );
}

function Summary({ presentation, profile, accentDark }: { presentation: InvoicePresentation; profile: ClassicLedgerPdfProfile; accentDark: string }) {
  const amountWordsWidth = classicLedgerPdfContentWidth(profile) - profile.summaryGap - profile.summaryWidth;
  const summaryLabelWidth = profile.summaryWidth - profile.summaryValueWidth;

  const row = (label: string, amount: number, prefix = "") => (
    <View style={[styles.summaryRow, { minHeight: profile.summaryRowHeight }]}> 
      <Text style={[styles.summaryLabel, { width: summaryLabelWidth, fontSize: profile.summaryLabelSize }]}>{label}</Text>
      <View style={{ width: profile.summaryValueWidth, flexDirection: "row", alignItems: "center" }}>
        {prefix ? <Text style={{ fontSize: profile.summaryValueSize, marginRight: 2 }}>{prefix}</Text> : null}
        <PdfMoney amount={amount} currency={presentation.currency} fontSize={profile.summaryValueSize} bold />
      </View>
    </View>
  );

  return (
    <View style={[styles.summaryBand, { gap: profile.summaryGap, marginTop: profile.code === "A5" ? 3.5 : 4.5 }]} wrap={false}>
      <View style={[styles.amountWords, { width: amountWordsWidth, paddingTop: profile.code === "A5" ? 6 : 9.75 }]}> 
        <Text style={[styles.amountWordsLabel, { fontSize: profile.amountWordsLabelSize, marginBottom: profile.code === "A5" ? 3.5 : 5.25 }]}>AMOUNT IN WORDS</Text>
        <Text style={[styles.amountWordsValue, { minHeight: profile.amountWordsMinHeight, fontSize: profile.amountWordsSize, paddingHorizontal: 3, paddingBottom: profile.code === "A5" ? 3 : 4.5 }]}>
          {formatAmountInWords(presentation.totals.total, presentation.currency)}
        </Text>
      </View>

      <View style={[styles.summary, { width: profile.summaryWidth }]}> 
        {row("Subtotal", presentation.totals.subtotal)}
        {row(`Discount (${presentation.totals.discountPercent}%)`, presentation.totals.discountAmount, "-")}
        {row(`Tax (${presentation.totals.taxPercent}%)`, presentation.totals.taxAmount, "+")}
        <View style={[styles.summaryRow, styles.grandTotal, { borderBottomColor: accentDark, minHeight: profile.grandTotalHeight }]}> 
          <Text style={[styles.grandTotalLabel, { color: accentDark, width: summaryLabelWidth, fontSize: profile.grandTotalLabelSize }]}>TOTAL</Text>
          <View style={{ width: profile.summaryValueWidth }}>
            <PdfMoney amount={presentation.totals.total} currency={presentation.currency} fontSize={profile.grandTotalValueSize} bold color={accentDark} />
          </View>
        </View>
      </View>
    </View>
  );
}

function ExtraDetails({ presentation, profile, accentDark }: { presentation: InvoicePresentation; profile: ClassicLedgerPdfProfile; accentDark: string }) {
  if (!presentation.extraDetailsVisible) return null;
  const hasPayment = Boolean(presentation.payment.bankName || presentation.payment.accountName || presentation.payment.accountNumber);
  if (!hasPayment && !presentation.notes) return null;

  return (
    <View
      style={[
        styles.extraDetails,
        {
          gap: profile.extraDetailsGap,
          marginTop: profile.extraDetailsMarginTop,
          paddingHorizontal: profile.extraDetailsPaddingX,
          paddingVertical: profile.extraDetailsPaddingY,
        },
      ]}
    >
      <View style={styles.extraColumn}>
        <Text style={[styles.extraHeading, { color: accentDark, fontSize: profile.extraDetailsHeadingSize, marginBottom: profile.code === "A5" ? 4 : 6 }]}>PAYMENT DETAILS</Text>
        {[
          ["Bank", presentation.payment.bankName],
          ["Account Name", presentation.payment.accountName],
          ["Account No.", presentation.payment.accountNumber],
        ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
          <View key={label} style={[styles.paymentRow, { marginTop: profile.code === "A5" ? 2 : 3 }]}> 
            <Text style={[styles.paymentLabel, { fontSize: profile.extraDetailsTextSize }]}>{label}</Text>
            <Text style={[styles.paymentValue, { fontSize: profile.extraDetailsTextSize, paddingBottom: 1.5 }]}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.extraColumn}>
        <Text style={[styles.extraHeading, { color: accentDark, fontSize: profile.extraDetailsHeadingSize, marginBottom: profile.code === "A5" ? 4 : 6 }]}>TERMS &amp; NOTES</Text>
        <Text style={[styles.notes, { fontSize: profile.extraDetailsTextSize }]}>{presentation.notes || " "}</Text>
      </View>
    </View>
  );
}

function Signatures({ presentation, profile }: { presentation: InvoicePresentation; profile: ClassicLedgerPdfProfile }) {
  return (
    <View
      style={[
        styles.signatures,
        {
          gap: profile.signaturesGap,
          marginTop: profile.signaturesMarginTop,
          marginHorizontal: profile.signaturesMarginX,
        },
      ]}
      wrap={false}
    >
      <View style={styles.signatureBlock}>
        <View style={[styles.signatureLine, { marginBottom: profile.code === "A5" ? 4 : 5.25 }]} />
        <Text style={[styles.signatureName, { fontSize: profile.signatureNameSize }]}>Customer Signature</Text>
      </View>
      <View style={styles.signatureBlock}>
        <View style={[styles.signatureLine, { marginBottom: profile.code === "A5" ? 4 : 5.25 }]} />
        <Text style={[styles.signatureName, { fontSize: profile.signatureNameSize }]}>{presentation.sender.name || "Authorised Signatory"}</Text>
        {presentation.sender.role ? <Text style={[styles.signatureRole, { fontSize: profile.signatureRoleSize, marginTop: 2 }]}>{presentation.sender.role}</Text> : null}
      </View>
    </View>
  );
}

export function ClassicLedgerPdfDocument({ presentation, logoSrc, headerImageSrc, accentColor }: ClassicLedgerPdfDocumentProps) {
  const accent = normalizeAccentColor(accentColor);
  const accentDark = darkenHex(accent);
  const profile = CLASSIC_LEDGER_PDF_PROFILES[presentation.paperSize];
  const fillerCount = Math.max(0, 7 - presentation.items.length);
  const contentWidth = classicLedgerPdfContentWidth(profile);
  const metaCellGap = profile.metaGap;
  const metaUsableWidth = contentWidth - (metaCellGap * 2);
  const metaUnit = metaUsableWidth / 3.25;
  const invoiceWidth = metaUnit * 1.25;
  const dateWidth = metaUnit;

  return (
    <Document
      title={`${presentation.company.name || "Business"} Invoice ${presentation.invoiceNo}`}
      author={presentation.company.name}
      subject="Invoice"
    >
      <Page
        size={{ width: profile.widthPt, height: profile.heightPt }}
        style={[
          styles.page,
          {
            paddingHorizontal: profile.paddingX,
            paddingTop: profile.paddingTop,
            paddingBottom: profile.paddingBottom,
          },
        ]}
        wrap
      >
        <View
          fixed
          style={[
            styles.frame,
            {
              borderColor: accentDark,
              top: profile.frameInset,
              left: profile.frameInset,
              right: profile.frameInset,
              bottom: profile.frameInset,
            },
          ]}
        />

        <View
          fixed
          style={[
            styles.continuation,
            {
              top: profile.frameInset + (profile.code === "A5" ? 4 : 5),
              paddingHorizontal: profile.paddingX,
            },
          ]}
          render={({ pageNumber }: { pageNumber: number }) => pageNumber > 1 ? (
            <>
              <Text style={[styles.continuationBrand, { color: accentDark }]}>SAPPHIRE QUEST · CLASSIC LEDGER</Text>
              <Text>{presentation.invoiceNo} · Continued</Text>
            </>
          ) : null}
        />

        {headerImageSrc ? (
          <View
            style={[
              styles.brandHeaderImageWrap,
              {
                borderBottomColor: accentDark,
                height: profile.headerMinHeight,
                minHeight: profile.headerMinHeight,
              },
            ]}
            wrap={false}
          >
            <Image src={headerImageSrc} style={styles.brandHeaderImage} />
          </View>
        ) : (
          <View
            style={[
              styles.brandHeader,
              {
                borderBottomColor: accentDark,
                minHeight: profile.headerMinHeight,
                paddingTop: profile.headerPaddingTop,
                paddingHorizontal: profile.headerPaddingX,
                paddingBottom: profile.headerPaddingBottom,
              },
            ]}
            wrap={false}
          >
            <Image src={logoSrc} style={[styles.logo, { width: profile.logoSize, height: profile.logoSize, marginBottom: profile.logoMarginBottom }]} />
            <Text style={[styles.businessName, { color: accentDark, fontSize: profile.businessNameSize }]}>{presentation.company.name}</Text>
            <ContactLine presentation={presentation} profile={profile} accent={accent} />
            <RegistrationLine presentation={presentation} profile={profile} />
          </View>
        )}

        <View
          style={[
            styles.documentTitleWrap,
            {
              borderColor: accentDark,
              marginTop: profile.titleMarginTop,
              marginBottom: profile.titleMarginBottom,
              paddingHorizontal: profile.titlePaddingX,
              paddingVertical: profile.titlePaddingY,
              borderRadius: profile.titleRadius,
            },
          ]}
          wrap={false}
        >
          <Text style={[styles.documentTitle, { color: accentDark, fontSize: profile.titleFontSize }]}>INVOICE</Text>
        </View>

        <View
          style={[
            styles.metaPanel,
            {
              gap: profile.metaGap,
              marginBottom: profile.metaMarginBottom,
              paddingHorizontal: profile.metaPaddingX,
              paddingVertical: profile.metaPaddingY,
            },
          ]}
          wrap={false}
        >
          <View style={[styles.metaCellWide, { width: invoiceWidth }]}> 
            <Text style={[styles.eyebrow, { fontSize: profile.metaLabelSize, marginBottom: profile.metaLabelSize * 0.6 }]}>INVOICE NO.</Text>
            <Text style={[styles.invoiceNo, { fontSize: profile.metaValueSize }]}>{presentation.invoiceNo}</Text>
          </View>
          <View style={[styles.metaCell, { width: dateWidth }]}> 
            <Text style={[styles.eyebrow, { fontSize: profile.metaLabelSize, marginBottom: profile.metaLabelSize * 0.6 }]}>DATE</Text>
            <Text style={[styles.metaValue, { fontSize: profile.metaValueSize, paddingBottom: 2 }]}>{formatClassicLedgerPdfDate(presentation.issueDate)}</Text>
          </View>
          <View style={[styles.metaCell, { width: dateWidth }]}> 
            <Text style={[styles.eyebrow, { fontSize: profile.metaLabelSize, marginBottom: profile.metaLabelSize * 0.6 }]}>DUE DATE</Text>
            <Text style={[styles.metaValue, { fontSize: profile.metaValueSize, paddingBottom: 2 }]}>{formatClassicLedgerPdfDate(presentation.dueDate)}</Text>
          </View>
        </View>

        <View
          style={[
            styles.customerSection,
            {
              borderLeftColor: accent,
              marginBottom: profile.customerMarginBottom,
              paddingHorizontal: profile.customerPaddingX,
              paddingTop: profile.customerPaddingTop,
              paddingBottom: profile.customerPaddingBottom,
              borderLeftWidth: profile.customerAccentWidth,
            },
          ]}
          wrap={false}
        >
          <Text style={[styles.eyebrow, { fontSize: profile.sectionLabelSize, marginBottom: profile.customerFieldGap * 0.3 }]}>BILL TO</Text>
          <CustomerField label="Name" value={presentation.client.name} profile={profile} strong />
          <CustomerField label="Address" value={presentation.client.address} profile={profile} />
          <View style={[styles.customerTwoColumns, { gap: profile.code === "A5" ? 10 : 19.5 }]}> 
            <View style={styles.customerHalf}><CustomerField label="Email" value={presentation.client.email} profile={profile} /></View>
            <View style={styles.customerHalf}><CustomerField label="Phone" value={presentation.client.phone} profile={profile} /></View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableHeader, { color: accentDark, minHeight: profile.tableHeaderHeight }]} minPresenceAhead={profile.tableRowMinHeight}>
            <TableCell width={profile.columns.quantity} profile={profile} center><Text style={{ fontSize: profile.tableHeaderFontSize }}>QTY</Text></TableCell>
            <TableCell width={profile.columns.description} profile={profile} center><Text style={{ fontSize: profile.tableHeaderFontSize }}>DESCRIPTION</Text></TableCell>
            <TableCell width={profile.columns.unitPrice} profile={profile} center><Text style={{ fontSize: profile.tableHeaderFontSize }}>UNIT PRICE</Text></TableCell>
            <TableCell width={profile.columns.discount} profile={profile} center><Text style={{ fontSize: profile.tableHeaderFontSize }}>DISCOUNT</Text></TableCell>
            <TableCell width={profile.columns.total} profile={profile} center last><Text style={{ fontSize: profile.tableHeaderFontSize }}>TOTAL</Text></TableCell>
          </View>

          {presentation.items.map((item) => (
            <ClassicLedgerTableRow key={item.id} item={item} profile={profile} presentation={presentation} />
          ))}

          {Array.from({ length: fillerCount }, (_, index) => <FillerRow key={`classic-pdf-filler-${index}`} profile={profile} />)}
        </View>

        <Summary presentation={presentation} profile={profile} accentDark={accentDark} />
        <ExtraDetails presentation={presentation} profile={profile} accentDark={accentDark} />
        <Signatures presentation={presentation} profile={profile} />

        <Text
          fixed
          style={[
            styles.pageNumber,
            {
              bottom: profile.frameInset + 3,
              right: profile.frameInset + 5,
            },
          ]}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => totalPages > 1 ? `${pageNumber} / ${totalPages}` : ""}
        />
      </Page>
    </Document>
  );
}
