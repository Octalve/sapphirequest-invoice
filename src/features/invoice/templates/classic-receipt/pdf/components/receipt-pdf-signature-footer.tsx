/* eslint-disable jsx-a11y/alt-text */
import { Image, Text, View } from "@react-pdf/renderer";
import type { BusinessIdentityProfile, CurrencyCode } from "../../../../types";
import { formatPdfNumber } from "../../../../presentation/invoice-presentation";
import type { ClassicReceiptPdfProfile } from "../classic-receipt-pdf-profile";
import { receiptPdfStyles } from "../classic-receipt-pdf-styles";

interface ReceiptPdfSignatureFooterProps {
  company: BusinessIdentityProfile;
  reference: string;
  balanceRemaining: number | null;
  currency: CurrencyCode;
  companySignatureDataUrl: string;
  customerSignatureDataUrl: string;
  profile: ClassicReceiptPdfProfile;
}

function PdfSignatureBlock({
  signatureDataUrl,
  label,
  customer,
  profile,
}: {
  signatureDataUrl: string;
  label: string;
  customer?: boolean;
  profile: ClassicReceiptPdfProfile;
}) {
  return (
    <>
      <View
        style={[
          receiptPdfStyles.signatureImageSlot,
          { height: profile.signatureImageHeight },
        ]}
      >
        {signatureDataUrl ? (
          <Image
            src={signatureDataUrl}
            style={[
              receiptPdfStyles.signatureImage,
              {
                width: profile.signatureImageWidth,
                height: profile.signatureImageHeight,
              },
            ]}
          />
        ) : null}
      </View>
      <View
        style={[
          receiptPdfStyles.signatureLine,
          { marginBottom: profile.signatureSize * 0.58 },
        ]}
      />
      <Text
        style={[
          customer ? receiptPdfStyles.customerSignature : receiptPdfStyles.signatureName,
          { fontSize: customer ? profile.customerSignatureSize : profile.signatureSize },
        ]}
      >
        {label}
      </Text>
    </>
  );
}

export function ReceiptPdfSignatureFooter({
  company,
  reference,
  balanceRemaining,
  currency,
  companySignatureDataUrl,
  customerSignatureDataUrl,
  profile,
}: ReceiptPdfSignatureFooterProps) {
  return (
    <View wrap={false}>
      <View
        style={[
          receiptPdfStyles.signatures,
          {
            marginHorizontal: profile.paddingX * 1.05,
          },
        ]}
      >
        <View
          style={[
            receiptPdfStyles.signature,
            { marginRight: profile.signatureGap / 2 },
          ]}
        >
          <PdfSignatureBlock
            signatureDataUrl={companySignatureDataUrl}
            label={`For: ${company.name || "Business"} / Authorised Signatory`}
            profile={profile}
          />
        </View>

        <View
          style={[
            receiptPdfStyles.signature,
            { marginLeft: profile.signatureGap / 2 },
          ]}
        >
          <PdfSignatureBlock
            signatureDataUrl={customerSignatureDataUrl}
            label="Customer's Signature"
            customer
            profile={profile}
          />
        </View>
      </View>

      <View
        style={[
          receiptPdfStyles.referenceRow,
          {
            marginHorizontal: profile.paddingX * 0.58,
            marginTop: profile.referenceSize * 1.65,
          },
        ]}
      >
        <View
          style={[
            receiptPdfStyles.referenceBlock,
            {
              width: "64%",
              marginRight: profile.referenceSize * 3.5,
            },
          ]}
        >
          <Text
            style={{
              fontSize: profile.referenceSize,
              marginRight: profile.referenceSize * 0.75,
            }}
          >
            Reference:
          </Text>
          <Text
            style={[
              receiptPdfStyles.referenceValue,
              {
                fontSize: profile.referenceSize,
                paddingBottom: profile.referenceSize * 0.2,
              },
            ]}
          >
            {reference || " "}
          </Text>
        </View>

        <Text
          style={[
            receiptPdfStyles.confirmation,
            { width: "36%", fontSize: profile.referenceSize * 0.9 },
          ]}
        >
          {balanceRemaining === null
            ? "Receipt valid upon payment confirmation."
            : `Balance outstanding: ${
                currency === "NGN" ? "NGN " : ""
              }${formatPdfNumber(balanceRemaining, currency)}.`}
        </Text>
      </View>
    </View>
  );
}
