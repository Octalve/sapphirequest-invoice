import {
  Document,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatPdfNumber, type InvoicePresentation } from "../../presentation/invoice-presentation";
import { OCTALVE_THEME, PDF_PAPER_PROFILES, SAPPHIRE_THEME } from "../../presentation/document-profile";
import type { CurrencyCode } from "../../types";

interface SapphirePdfDocumentProps {
  presentation: InvoicePresentation;
  logoSrc: string;
}

type PdfIconKind = "mail" | "phone" | "location" | "role" | "package";

const ICON_PATHS: Record<PdfIconKind, string[]> = {
  mail: ["M3 5h18v14H3Z", "m3 7 9 6 9-6"],
  phone: ["M7 3h3l1.4 4.5-2 1.4a15 15 0 0 0 5.7 5.7l1.4-2L21 14v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7c0-2.2 1.8-4 4-4Z"],
  location: ["M12 22s7-6.2 7-13a7 7 0 1 0-14 0c0 6.8 7 13 7 13Z", "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  role: ["M4 7h16v12H4Z", "M9 7V5h6v2", "M4 12h16"],
  package: ["m12 3 8 4.5v9L12 21l-8-4.5v-9Z", "m4.5 7.8 7.5 4.2 7.5-4.2", "M12 12v9"],
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: SAPPHIRE_THEME.white,
    color: SAPPHIRE_THEME.text,
    fontFamily: "Helvetica",
  },
  continuationHeader: {
    position: "absolute",
    top: 7,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    color: SAPPHIRE_THEME.textMuted,
    fontSize: 6,
  },
  continuationBrand: {
    color: SAPPHIRE_THEME.primary,
    fontFamily: "Helvetica-Bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.75,
    borderBottomColor: SAPPHIRE_THEME.border,
  },
  brandSide: {
    flexGrow: 1.16,
    flexBasis: 0,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  logoDisc: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.75,
    borderColor: "#CFE0F6",
    backgroundColor: "#F7FBFF",
  },
  logo: {
    objectFit: "contain",
  },
  brandCopy: {
    flexGrow: 1,
    minWidth: 0,
  },
  invoiceNo: {
    color: SAPPHIRE_THEME.primaryDark,
    fontFamily: "Helvetica-Bold",
  },
  companyName: {
    color: "#1C2738",
    fontFamily: "Helvetica-Bold",
  },
  companyWebsite: {
    color: SAPPHIRE_THEME.textMuted,
  },
  metaSide: {
    flexGrow: 0.84,
    flexBasis: 0,
    minWidth: 0,
    borderLeftWidth: 0.75,
    borderLeftColor: SAPPHIRE_THEME.border,
  },
  amountLine: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    borderBottomWidth: 0.75,
    borderBottomColor: SAPPHIRE_THEME.border,
  },
  muted: {
    color: SAPPHIRE_THEME.textMuted,
  },
  metaGrid: {
    flexDirection: "column",
  },
  metaRow: {
    flexDirection: "row",
  },
  metaCell: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  metaValue: {
    color: SAPPHIRE_THEME.text,
    fontFamily: "Helvetica-Bold",
  },
  parties: {
    flexDirection: "row",
    backgroundColor: SAPPHIRE_THEME.surface,
  },
  party: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    justifyContent: "center",
  },
  partyDivider: {
    width: 0.75,
    backgroundColor: SAPPHIRE_THEME.border,
  },
  sectionLabel: {
    color: SAPPHIRE_THEME.textMuted,
  },
  partyStrong: {
    color: SAPPHIRE_THEME.text,
    fontFamily: "Helvetica-Bold",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    flexGrow: 1,
    minWidth: 0,
    color: SAPPHIRE_THEME.textMuted,
  },
  itemsCard: {
    backgroundColor: SAPPHIRE_THEME.surface,
    overflow: "hidden",
  },
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.75,
    borderBottomColor: SAPPHIRE_THEME.border,
    color: SAPPHIRE_THEME.textMuted,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.75,
    borderBottomColor: SAPPHIRE_THEME.border,
  },
  colItem: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  colQty: {
    flexShrink: 0,
    textAlign: "center",
  },
  colUnit: {
    flexShrink: 0,
    textAlign: "left",
  },
  colDiscount: {
    flexShrink: 0,
    textAlign: "center",
  },
  colAmount: {
    flexShrink: 0,
    textAlign: "left",
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  itemIconCircle: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SAPPHIRE_THEME.primary,
  },
  itemCopy: {
    flexGrow: 1,
    minWidth: 0,
  },
  itemTitle: {
    color: SAPPHIRE_THEME.text,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
  },
  itemDescription: {
    color: SAPPHIRE_THEME.textMuted,
    lineHeight: 1.2,
  },
  moneyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  moneySymbol: {
    marginRight: 0.75,
  },
  nairaSymbol: {
    position: "relative",
    marginRight: 0.75,
  },
  nairaLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: SAPPHIRE_THEME.text,
  },
  closing: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notesColumn: {
    minWidth: 0,
  },
  closingHeading: {
    color: "#9AA7BB",
    fontFamily: "Helvetica-Bold",
  },
  thankYou: {
    color: SAPPHIRE_THEME.textMuted,
  },
  miniHeading: {
    color: SAPPHIRE_THEME.text,
    fontFamily: "Helvetica-Bold",
  },
  noteText: {
    color: SAPPHIRE_THEME.textMuted,
    lineHeight: 1.3,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLabel: {
    flexShrink: 0,
    color: SAPPHIRE_THEME.textMuted,
  },
  paymentValue: {
    flexGrow: 1,
    minWidth: 0,
    color: SAPPHIRE_THEME.textMuted,
  },
  summary: {
    minWidth: 0,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    flexGrow: 1,
    minWidth: 0,
    color: SAPPHIRE_THEME.textMuted,
  },
  summaryValue: {
    flexShrink: 0,
    alignItems: "flex-start",
    fontFamily: "Helvetica-Bold",
  },
  summaryTotal: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.75,
    borderTopColor: SAPPHIRE_THEME.border,
    borderBottomWidth: 0.75,
    borderBottomColor: SAPPHIRE_THEME.border,
  },
  summaryTotalLabel: {
    flexGrow: 1,
    minWidth: 0,
    fontFamily: "Helvetica-Bold",
  },
  summaryTotalValue: {
    flexShrink: 0,
    alignItems: "flex-start",
    fontFamily: "Helvetica-Bold",
    color: SAPPHIRE_THEME.primaryDark,
  },
  longNotesBlock: {
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: OCTALVE_THEME.primary,
    color: SAPPHIRE_THEME.white,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontFamily: "Helvetica-Bold",
  },
  footerPage: {
    position: "absolute",
    right: 12,
    color: "#EAF3FF",
  },
});

function PdfIcon({ kind, size, color = SAPPHIRE_THEME.primary }: { kind: PdfIconKind; size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {ICON_PATHS[kind].map((path, index) => (
        <Path
          key={`${kind}-${index}`}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

function PdfCurrencySymbol({ currency, fontSize }: { currency: CurrencyCode; fontSize: number }) {
  if (currency === "NGN") {
    return (
      <View style={[styles.nairaSymbol, { width: fontSize * 0.7, height: fontSize * 1.15 }]}> 
        <Text style={{ fontSize, lineHeight: 1 }}>N</Text>
        <View style={[styles.nairaLine, { top: fontSize * 0.42 }]} />
        <View style={[styles.nairaLine, { top: fontSize * 0.68 }]} />
      </View>
    );
  }

  const symbols: Record<Exclude<CurrencyCode, "NGN">, string> = {
    USD: "$",
    GBP: "£",
    EUR: "€",
  };

  return <Text style={[styles.moneySymbol, { fontSize }]}>{symbols[currency]}</Text>;
}

function PdfMoney({
  amount,
  currency,
  fontSize,
  bold = false,
  align = "right",
  color = SAPPHIRE_THEME.text,
  letterSpacing = 0,
}: {
  amount: number;
  currency: CurrencyCode;
  fontSize: number;
  bold?: boolean;
  align?: "left" | "center" | "right";
  color?: string;
  letterSpacing?: number;
}) {
  const justifyContent = align === "left" ? "flex-start" : align === "center" ? "center" : "flex-end";

  return (
    <View style={[styles.moneyRow, { justifyContent }]}> 
      <PdfCurrencySymbol currency={currency} fontSize={fontSize} />
      <Text style={{ fontSize, color, letterSpacing, fontFamily: bold ? "Helvetica-Bold" : "Helvetica" }}>
        {formatPdfNumber(amount, currency)}
      </Text>
    </View>
  );
}

function PdfPartyDetail({
  icon,
  value,
  minHeight,
  iconColumnWidth,
  iconSize,
  iconGap,
  fontSize,
}: {
  icon: Exclude<PdfIconKind, "package">;
  value: string;
  minHeight: number;
  iconColumnWidth: number;
  iconSize: number;
  iconGap: number;
  fontSize: number;
}) {
  if (!value) return null;

  return (
    <View style={[styles.detailRow, { minHeight }]}> 
      <View style={[styles.detailIconWrap, { width: iconColumnWidth, marginRight: iconGap }]}> 
        <PdfIcon kind={icon} size={iconSize} />
      </View>
      <Text style={[styles.detailText, { fontSize, lineHeight: 1.15 }]}>{value}</Text>
    </View>
  );
}

function PdfSummary({ presentation }: { presentation: InvoicePresentation }) {
  const ui = PDF_PAPER_PROFILES[presentation.paperSize].ui;

  return (
    <View style={styles.summary} wrap={false}>
      <View style={[styles.summaryRow, { paddingVertical: ui.summaryRowPaddingY, columnGap: ui.summaryGap }]}> 
        <Text style={[styles.summaryLabel, { fontSize: ui.summarySize }]}>Subtotal</Text>
        <View style={[styles.summaryValue, { width: ui.summaryValueWidth }]}>
          <PdfMoney amount={presentation.totals.subtotal} currency={presentation.currency} fontSize={ui.summarySize} bold align="left" />
        </View>
      </View>
      <View style={[styles.summaryRow, { paddingVertical: ui.summaryRowPaddingY, columnGap: ui.summaryGap }]}> 
        <Text style={[styles.summaryLabel, { fontSize: ui.summarySize }]}>Discount ({presentation.totals.discountPercent}%)</Text>
        <View style={[styles.summaryValue, { width: ui.summaryValueWidth, flexDirection: "row" }]}>
          <Text style={{ fontSize: ui.summarySize }}>- </Text>
          <PdfMoney amount={presentation.totals.discountAmount} currency={presentation.currency} fontSize={ui.summarySize} bold align="left" />
        </View>
      </View>
      <View style={[styles.summaryRow, { paddingVertical: ui.summaryRowPaddingY, columnGap: ui.summaryGap }]}> 
        <Text style={[styles.summaryLabel, { fontSize: ui.summarySize }]}>Tax ({presentation.totals.taxPercent}%)</Text>
        <View style={[styles.summaryValue, { width: ui.summaryValueWidth, flexDirection: "row" }]}>
          <Text style={{ fontSize: ui.summarySize }}>+ </Text>
          <PdfMoney amount={presentation.totals.taxAmount} currency={presentation.currency} fontSize={ui.summarySize} bold align="left" />
        </View>
      </View>
      <View style={[styles.summaryTotal, { marginTop: ui.summaryTotalMarginTop, paddingVertical: ui.summaryTotalPaddingY, columnGap: ui.summaryGap }]}> 
        <Text style={[styles.summaryTotalLabel, { fontSize: ui.summaryTotalLabelSize }]}>Total</Text>
        <View style={[styles.summaryTotalValue, { width: ui.summaryValueWidth }]}>
          <PdfMoney
            amount={presentation.totals.total}
            currency={presentation.currency}
            fontSize={ui.summaryTotalValueSize}
            bold
            align="left"
            color={SAPPHIRE_THEME.primaryDark}
          />
        </View>
      </View>
    </View>
  );
}

function PdfNotes({ presentation }: { presentation: InvoicePresentation }) {
  const ui = PDF_PAPER_PROFILES[presentation.paperSize].ui;

  return (
    <View style={styles.notesColumn}>
      <Text style={[styles.closingHeading, { fontSize: ui.closingHeadingSize, letterSpacing: ui.closingHeadingLetterSpacing }]}>Notes</Text>
      <Text style={[styles.thankYou, { fontSize: ui.thankYouSize, marginTop: ui.thankYouMarginTop }]}>Thank you for choosing us.</Text>

      {presentation.extraDetailsVisible ? (
        <View style={{ marginTop: ui.extraDetailsMarginTop, rowGap: ui.extraDetailsGap }}>
          {(presentation.payment.bankName || presentation.payment.accountName || presentation.payment.accountNumber) ? (
            <View>
              <Text style={[styles.miniHeading, { fontSize: ui.miniHeadingSize, marginBottom: ui.miniHeadingMarginBottom }]}>Payment Details</Text>
              {presentation.payment.bankName ? (
                <View style={[styles.paymentRow, { columnGap: ui.paymentColumnGap, paddingVertical: 0.75 }]}> 
                  <Text style={[styles.paymentLabel, { width: ui.paymentLabelWidth, fontSize: ui.paymentTextSize }]}>Bank</Text>
                  <Text style={[styles.paymentValue, { fontSize: ui.paymentTextSize }]}>{presentation.payment.bankName}</Text>
                </View>
              ) : null}
              {presentation.payment.accountName ? (
                <View style={[styles.paymentRow, { columnGap: ui.paymentColumnGap, paddingVertical: 0.75 }]}> 
                  <Text style={[styles.paymentLabel, { width: ui.paymentLabelWidth, fontSize: ui.paymentTextSize }]}>Account Name</Text>
                  <Text style={[styles.paymentValue, { fontSize: ui.paymentTextSize }]}>{presentation.payment.accountName}</Text>
                </View>
              ) : null}
              {presentation.payment.accountNumber ? (
                <View style={[styles.paymentRow, { columnGap: ui.paymentColumnGap, paddingVertical: 0.75 }]}> 
                  <Text style={[styles.paymentLabel, { width: ui.paymentLabelWidth, fontSize: ui.paymentTextSize }]}>Account No.</Text>
                  <Text style={[styles.paymentValue, { fontSize: ui.paymentTextSize }]}>{presentation.payment.accountNumber}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {presentation.notes ? (
            <View>
              <Text style={[styles.miniHeading, { fontSize: ui.miniHeadingSize, marginBottom: ui.miniHeadingMarginBottom }]}>Terms &amp; Conditions</Text>
              <Text style={[styles.noteText, { fontSize: ui.paymentTextSize }]}>{presentation.notes}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function PdfMetaCell({ label, value, labelSize, valueSize }: { label: string; value: string; labelSize: number; valueSize: number }) {
  return (
    <View style={styles.metaCell}>
      <Text style={[styles.muted, { fontSize: labelSize }]}>{label}</Text>
      <Text style={[styles.metaValue, { fontSize: valueSize, marginTop: 3 }]}>{value || "—"}</Text>
    </View>
  );
}

export function SapphirePdfDocument({ presentation, logoSrc }: SapphirePdfDocumentProps) {
  const profile = PDF_PAPER_PROFILES[presentation.paperSize];
  const ui = profile.ui;
  const compact = presentation.paperSize === "A5";
  const longNotes = presentation.notes.length > (compact ? 210 : 360);

  return (
    <Document
      title={`Sapphire Quest Invoice ${presentation.invoiceNo}`}
      author={presentation.company.name}
      subject="Invoice"
    >
      <Page
        size={{ width: profile.widthPt, height: profile.heightPt }}
        style={[
          styles.page,
          {
            paddingHorizontal: profile.pagePaddingX,
            paddingTop: profile.pagePaddingTop,
            paddingBottom: profile.pagePaddingBottom + profile.footerHeight,
            fontSize: profile.bodyFontSize,
          },
        ]}
        wrap
      >
        <View style={styles.continuationHeader} fixed render={({ pageNumber }) => (
          pageNumber > 1 ? (
            <>
              <Text style={styles.continuationBrand}>SAPPHIRE QUEST</Text>
              <Text>{presentation.invoiceNo} · Continued</Text>
            </>
          ) : <Text />
        )} />

        <View
          style={[
            styles.header,
            {
              minHeight: ui.headerMinHeight,
              paddingTop: ui.headerPaddingTop,
              paddingHorizontal: ui.headerPaddingX,
              paddingBottom: ui.headerPaddingBottom,
              columnGap: ui.headerColumnGap,
              marginBottom: profile.sectionGap,
            },
          ]}
          wrap={false}
        >
          <View style={[styles.brandSide, { columnGap: ui.brandGap }]}> 
            <View
              style={[
                styles.logoDisc,
                {
                  width: ui.logoDiscSize,
                  height: ui.logoDiscSize,
                  borderRadius: ui.logoDiscSize / 2,
                },
              ]}
            >
              <Image src={logoSrc} style={{ width: ui.logoSize, height: ui.logoSize }} />
            </View>

            <View style={styles.brandCopy}>
              <Text style={[styles.invoiceNo, { fontSize: ui.invoiceNoSize, marginBottom: ui.invoiceNoMarginBottom, letterSpacing: ui.invoiceNoLetterSpacing }]}>
                {presentation.invoiceNo}
              </Text>
              <Text
                style={[
                  styles.companyName,
                  {
                    fontSize: ui.companyNameSize,
                    lineHeight: ui.companyNameLineHeight,
                    letterSpacing: ui.companyNameLetterSpacing,
                  },
                ]}
                hyphenationPenalty={Infinity}
              >
                {presentation.company.name.replace("Sapphire Quest Travel & Tours Ltd", "Sapphire Quest\nTravel & Tours Ltd")}
              </Text>
              <Text style={[styles.companyWebsite, { fontSize: ui.websiteSize, marginTop: ui.websiteMarginTop }]}>
                {presentation.company.website}
              </Text>
            </View>
          </View>

          <View style={[styles.metaSide, { paddingLeft: ui.metaPaddingLeft }]}> 
            <View style={[styles.amountLine, { paddingBottom: ui.amountPaddingBottom, columnGap: 12 }]}> 
              <Text style={[styles.muted, { fontSize: ui.amountLabelSize }]}>Amount Due</Text>
              <PdfMoney
                amount={presentation.totals.total}
                currency={presentation.currency}
                fontSize={ui.amountValueSize}
                bold
                letterSpacing={ui.amountValueLetterSpacing}
              />
            </View>

            <View style={[styles.metaGrid, { marginTop: ui.metaMarginTop, rowGap: ui.metaRowGap }]}> 
              <View style={[styles.metaRow, { columnGap: ui.metaColumnGap }]}> 
                <PdfMetaCell label="Date Issued" value={presentation.issueDate} labelSize={ui.metaLabelSize} valueSize={ui.metaValueSize} />
                <PdfMetaCell label="Due Date" value={presentation.dueDate} labelSize={ui.metaLabelSize} valueSize={ui.metaValueSize} />
              </View>
              <View style={[styles.metaRow, { columnGap: ui.metaColumnGap }]}> 
                <PdfMetaCell label="TIN No." value={presentation.company.tinNo} labelSize={ui.metaLabelSize} valueSize={ui.metaValueSize} />
                <PdfMetaCell label="RC No." value={presentation.company.rcNo} labelSize={ui.metaLabelSize} valueSize={ui.metaValueSize} />
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.parties,
            {
              minHeight: ui.partyMinHeight,
              paddingVertical: ui.partyPaddingY,
              paddingHorizontal: ui.partyPaddingX,
              borderRadius: ui.cardRadius,
              marginBottom: profile.sectionGap,
            },
          ]}
          wrap={false}
        >
          <View style={[styles.party, { paddingRight: ui.partyInnerPadding, rowGap: ui.partyGap }]}> 
            <Text style={[styles.sectionLabel, { fontSize: ui.partyLabelSize, marginBottom: ui.partyLabelMarginBottom }]}>Invoice from</Text>
            <Text
              style={[
                styles.partyStrong,
                {
                  minHeight: ui.partyNameMinHeight,
                  fontSize: ui.partyNameSize,
                  marginBottom: ui.partyNameMarginBottom,
                },
              ]}
              hyphenationPenalty={Infinity}
            >
              {presentation.sender.name || "Sender"}
            </Text>
            <PdfPartyDetail icon="mail" value={presentation.sender.email} minHeight={ui.partyDetailMinHeight} iconColumnWidth={ui.partyIconColumnWidth} iconSize={ui.partyIconSize} iconGap={ui.partyIconGap} fontSize={ui.partyTextSize} />
            <PdfPartyDetail icon="phone" value={presentation.sender.phone} minHeight={ui.partyDetailMinHeight} iconColumnWidth={ui.partyIconColumnWidth} iconSize={ui.partyIconSize} iconGap={ui.partyIconGap} fontSize={ui.partyTextSize} />
            <PdfPartyDetail icon="role" value={presentation.sender.role} minHeight={ui.partyDetailMinHeight} iconColumnWidth={ui.partyIconColumnWidth} iconSize={ui.partyIconSize} iconGap={ui.partyIconGap} fontSize={ui.partyTextSize} />
          </View>

          <View style={styles.partyDivider} />

          <View style={[styles.party, { paddingLeft: ui.partyInnerPadding, rowGap: ui.partyGap }]}> 
            <Text style={[styles.sectionLabel, { fontSize: ui.partyLabelSize, marginBottom: ui.partyLabelMarginBottom }]}>To Customer</Text>
            <Text
              style={[
                styles.partyStrong,
                {
                  minHeight: ui.partyNameMinHeight,
                  fontSize: ui.partyNameSize,
                  marginBottom: ui.partyNameMarginBottom,
                },
              ]}
              hyphenationPenalty={Infinity}
            >
              {presentation.client.name || "Customer"}
            </Text>
            <PdfPartyDetail icon="mail" value={presentation.client.email} minHeight={ui.partyDetailMinHeight} iconColumnWidth={ui.partyIconColumnWidth} iconSize={ui.partyIconSize} iconGap={ui.partyIconGap} fontSize={ui.partyTextSize} />
            <PdfPartyDetail icon="phone" value={presentation.client.phone} minHeight={ui.partyDetailMinHeight} iconColumnWidth={ui.partyIconColumnWidth} iconSize={ui.partyIconSize} iconGap={ui.partyIconGap} fontSize={ui.partyTextSize} />
            <PdfPartyDetail icon="location" value={presentation.client.address} minHeight={ui.partyDetailMinHeight} iconColumnWidth={ui.partyIconColumnWidth} iconSize={ui.partyIconSize} iconGap={ui.partyIconGap} fontSize={ui.partyTextSize} />
          </View>
        </View>

        <View style={[styles.itemsCard, { borderRadius: ui.cardRadius, marginBottom: profile.sectionGap }]}> 
          <View
            style={[
              styles.itemsHeader,
              {
                minHeight: ui.tableHeaderMinHeight,
                paddingHorizontal: ui.tablePaddingX,
                paddingVertical: ui.tableHeaderPaddingY,
                columnGap: ui.tableColumnGap,
              },
            ]}
            minPresenceAhead={profile.itemRowMinHeight}
          >
            <Text style={[styles.colItem, { fontSize: profile.smallFontSize }]}>Item Name</Text>
            <Text style={[styles.colQty, { width: ui.qtyColumnWidth, fontSize: profile.smallFontSize }]}>Quantity</Text>
            <Text style={[styles.colUnit, { width: ui.unitColumnWidth, fontSize: profile.smallFontSize }]}>Unit Price</Text>
            <Text style={[styles.colDiscount, { width: ui.discountColumnWidth, fontSize: profile.smallFontSize }]}>Discount</Text>
            <Text style={[styles.colAmount, { width: ui.amountColumnWidth, fontSize: profile.smallFontSize }]}>Amount</Text>
          </View>

          {presentation.items.map((item, index) => {
            const keepTogether = item.description.length <= (compact ? 190 : 320) && item.title.length <= 110;
            const isLast = index === presentation.items.length - 1;
            return (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  {
                    minHeight: profile.itemRowMinHeight,
                    paddingHorizontal: ui.tablePaddingX,
                    paddingVertical: ui.itemPaddingY,
                    columnGap: ui.tableColumnGap,
                    borderBottomWidth: isLast ? 0 : 0.75,
                  },
                ]}
                wrap={!keepTogether}
              >
                <View style={[styles.colItem, styles.itemMain]}>
                  <View
                    style={[
                      styles.itemIconCircle,
                      {
                        width: ui.itemIconSize,
                        height: ui.itemIconSize,
                        borderRadius: ui.itemIconSize / 2,
                      },
                    ]}
                  >
                    <PdfIcon kind="package" size={ui.itemIconGlyphSize} color={SAPPHIRE_THEME.white} />
                  </View>
                  <View style={[styles.itemCopy, { paddingLeft: ui.itemCopyPaddingLeft }]}> 
                    <Text
                      style={[
                        styles.itemTitle,
                        {
                          minHeight: ui.itemTitleMinHeight,
                          fontSize: profile.itemTitleSize,
                        },
                      ]}
                      hyphenationPenalty={Infinity}
                    >
                      {item.title || "Item or service"}
                    </Text>
                    {item.description ? (
                      <Text
                        style={[
                          styles.itemDescription,
                          {
                            minHeight: ui.itemDescriptionMinHeight,
                            fontSize: profile.itemDescriptionSize,
                          },
                        ]}
                      >
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <Text style={[styles.colQty, { width: ui.qtyColumnWidth, fontSize: ui.quantitySize }]}>{item.quantityDisplay}</Text>
                <View style={[styles.colUnit, { width: ui.unitColumnWidth }]}> 
                  <PdfMoney amount={item.unitPrice} currency={presentation.currency} fontSize={ui.quantitySize} align="left" />
                </View>
                <Text style={[styles.colDiscount, { width: ui.discountColumnWidth, fontSize: ui.quantitySize }]}>{item.discountPercent}%</Text>
                <View style={[styles.colAmount, { width: ui.amountColumnWidth }]}> 
                  <PdfMoney amount={item.amount} currency={presentation.currency} fontSize={ui.amountSize} bold align="left" />
                </View>
              </View>
            );
          })}
        </View>

        {longNotes ? (
          <>
            <View style={[styles.longNotesBlock, { marginBottom: profile.sectionGap, marginHorizontal: ui.closingMarginX }]} minPresenceAhead={34}>
              <PdfNotes presentation={presentation} />
            </View>
            <View style={{ alignItems: "flex-end", marginHorizontal: ui.closingMarginX, marginBottom: ui.closingMarginBottom }}>
              <View style={{ width: ui.summaryMinWidth }}>
                <PdfSummary presentation={presentation} />
              </View>
            </View>
          </>
        ) : (
          <View
            style={[
              styles.closing,
              {
                columnGap: ui.closingGap,
                marginTop: ui.closingMarginTop,
                marginHorizontal: ui.closingMarginX,
                marginBottom: ui.closingMarginBottom,
              },
            ]}
            wrap={false}
          >
            <View style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
              <PdfNotes presentation={presentation} />
            </View>
            <View style={{ flexGrow: 0.82, flexBasis: 0, minWidth: ui.summaryMinWidth }}>
              <PdfSummary presentation={presentation} />
            </View>
          </View>
        )}

        <View style={[styles.footer, { height: profile.footerHeight }]} fixed>
          <Text style={[styles.footerText, { fontSize: ui.footerTextSize }]}>Powered by Octalve</Text>
          <Text
            style={[styles.footerPage, { fontSize: compact ? 5.1 : 6.2 }]}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
