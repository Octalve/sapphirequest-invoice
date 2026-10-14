import { Text, View } from "@react-pdf/renderer";
import {
  receiptFieldDensity,
  receiptWordsDensity,
  splitReceiptAmountWords,
  type ReceiptTextDensity,
} from "../../lib/receipt-layout";
import type { ClassicReceiptPdfProfile } from "../classic-receipt-pdf-profile";
import { receiptPdfStyles } from "../classic-receipt-pdf-styles";

interface ReceiptPdfDetailsProps {
  receivedFrom: string;
  amountInWords: string;
  paymentPurpose: string;
  profile: ClassicReceiptPdfProfile;
}

function scaledFont(
  base: number,
  density: ReceiptTextDensity,
  kind: "field" | "words",
): number {
  if (density === "micro") return base * (kind === "words" ? 0.66 : 0.68);
  if (density === "tight") return base * (kind === "words" ? 0.76 : 0.78);
  if (density === "compact") return base * (kind === "words" ? 0.86 : 0.87);
  return base;
}

export function ReceiptPdfDetails({
  receivedFrom,
  amountInWords,
  paymentPurpose,
  profile,
}: ReceiptPdfDetailsProps) {
  const words = amountInWords.toUpperCase();
  const [firstWords, secondWords] = splitReceiptAmountWords(words);
  const wordsFont = scaledFont(
    profile.fieldValueSize,
    receiptWordsDensity(words),
    "words",
  );
  const receivedFont = scaledFont(
    profile.fieldValueSize,
    receiptFieldDensity(receivedFrom),
    "field",
  );
  const purposeFont = scaledFont(
    profile.fieldValueSize,
    receiptFieldDensity(paymentPurpose),
    "field",
  );
  const horizontalMargin = profile.paddingX * 0.58;

  return (
    <View wrap={false}>
      <View
        style={[
          receiptPdfStyles.fieldRow,
          {
            marginHorizontal: horizontalMargin,
            marginTop: profile.fieldLabelSize * 0.45,
          },
        ]}
      >
        <Text
          style={[
            receiptPdfStyles.fieldLabel,
            {
              width: profile.fieldLabelSize * 9.3,
              fontSize: profile.fieldLabelSize,
            },
          ]}
        >
          Received From:
        </Text>
        <View
          style={[
            receiptPdfStyles.fieldBox,
            {
              minHeight: profile.fieldBoxHeight,
              paddingHorizontal: profile.fieldValueSize * 0.85,
            },
          ]}
        >
          <Text style={{ fontSize: receivedFont }}>
            {receivedFrom || " "}
          </Text>
        </View>
      </View>

      <View
        style={[
          receiptPdfStyles.fieldRow,
          {
            marginHorizontal: horizontalMargin,
            marginTop: profile.fieldLabelSize * 0.45,
          },
        ]}
      >
        <Text
          style={[
            receiptPdfStyles.fieldLabel,
            {
              width: profile.fieldLabelSize * 8.25,
              fontSize: profile.fieldLabelSize,
            },
          ]}
        >
          The Sum of:
        </Text>
        <View
          style={[
            receiptPdfStyles.fieldBox,
            {
              minHeight: profile.sumFirstHeight,
              paddingHorizontal: profile.fieldValueSize * 0.85,
            },
          ]}
        >
          <Text style={{ fontSize: wordsFont }}>{firstWords || " "}</Text>
        </View>
      </View>

      <View
        style={[
          receiptPdfStyles.sumSecond,
          {
            minHeight: profile.sumSecondHeight,
            marginHorizontal: horizontalMargin,
            marginTop: profile.fieldLabelSize * 0.28,
            paddingHorizontal: profile.fieldValueSize * 0.85,
          },
        ]}
      >
        <Text style={{ fontSize: wordsFont }}>{secondWords || " "}</Text>
      </View>

      <View
        style={[
          receiptPdfStyles.fieldRow,
          {
            marginHorizontal: horizontalMargin,
            marginTop: profile.fieldLabelSize * 0.45,
          },
        ]}
      >
        <Text
          style={[
            receiptPdfStyles.fieldLabel,
            {
              width: profile.fieldLabelSize * 10.7,
              fontSize: profile.fieldLabelSize,
            },
          ]}
        >
          Being Payment for:
        </Text>
        <View
          style={[
            receiptPdfStyles.fieldBox,
            {
              minHeight: profile.fieldBoxHeight,
              paddingHorizontal: profile.fieldValueSize * 0.85,
            },
          ]}
        >
          <Text style={{ fontSize: purposeFont }}>
            {paymentPurpose || " "}
          </Text>
        </View>
      </View>
    </View>
  );
}
