import { Document, Page, View } from "@react-pdf/renderer";
import { darkenHex, normalizeAccentColor } from "../../../lib/template-theme";
import type { ClassicReceiptPresentation } from "../types";
import { ReceiptPdfBrandHeader } from "./components/receipt-pdf-brand-header";
import { ReceiptPdfDetails } from "./components/receipt-pdf-details";
import { ReceiptPdfDocumentMeta } from "./components/receipt-pdf-document-meta";
import { ReceiptPdfPayment } from "./components/receipt-pdf-payment";
import { ReceiptPdfSignatureFooter } from "./components/receipt-pdf-signature-footer";
import { CLASSIC_RECEIPT_PDF_PROFILES } from "./classic-receipt-pdf-profile";
import { receiptPdfStyles } from "./classic-receipt-pdf-styles";

interface ClassicReceiptPdfDocumentProps {
  presentation: ClassicReceiptPresentation;
  logoSrc: string;
  headerImageSrc?: string | null;
  accentColor?: string;
}

export function ClassicReceiptPdfDocument({
  presentation,
  logoSrc,
  headerImageSrc,
  accentColor,
}: ClassicReceiptPdfDocumentProps) {
  const accent = normalizeAccentColor(accentColor);
  const accentDark = darkenHex(accent);
  const profile = CLASSIC_RECEIPT_PDF_PROFILES[presentation.paperSize];
  const contentWidth = profile.widthPt - profile.paddingX * 2;

  return (
    <Document
      title={`${presentation.company.name || "Business"} Receipt ${presentation.receiptNo}`}
      author={presentation.company.name || "Business"}
      subject="Receipt"
    >
      <Page
        size={{ width: profile.widthPt, height: profile.heightPt }}
        style={[
          receiptPdfStyles.page,
          {
            paddingHorizontal: profile.paddingX,
            paddingTop: profile.paddingTop,
            paddingBottom: profile.paddingBottom,
          },
        ]}
        wrap={false}
      >
        <View
          fixed
          style={[
            receiptPdfStyles.frame,
            {
              borderColor: accentDark,
              top: profile.frameInset,
              left: profile.frameInset,
              right: profile.frameInset,
              bottom: profile.frameInset,
            },
          ]}
        />

        <ReceiptPdfBrandHeader
          company={presentation.company}
          logoSrc={logoSrc}
          headerImageSrc={headerImageSrc}
          accentDark={accentDark}
          profile={profile}
        />

        <ReceiptPdfDocumentMeta
          receiptNo={presentation.receiptNo}
          date={presentation.date}
          accentDark={accentDark}
          profile={profile}
          contentWidth={contentWidth}
        />

        <ReceiptPdfDetails
          receivedFrom={presentation.receivedFrom}
          amountInWords={presentation.amountInWords}
          paymentPurpose={presentation.paymentPurpose}
          profile={profile}
        />

        <ReceiptPdfPayment
          amountReceived={presentation.amountReceived}
          balanceRemaining={presentation.balanceRemaining}
          currency={presentation.currency}
          paymentMethod={presentation.paymentMethod}
          accent={accent}
          profile={profile}
        />

        <View style={receiptPdfStyles.spacer} />

        <ReceiptPdfSignatureFooter
          company={presentation.company}
          reference={presentation.reference}
          balanceRemaining={presentation.balanceRemaining}
          currency={presentation.currency}
          companySignatureDataUrl={presentation.companySignatureDataUrl}
          customerSignatureDataUrl={presentation.customerSignatureDataUrl}
          profile={profile}
        />
      </Page>
    </Document>
  );
}
