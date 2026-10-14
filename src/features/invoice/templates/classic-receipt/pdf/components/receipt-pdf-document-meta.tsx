import { Text, View } from "@react-pdf/renderer";
import type { ClassicReceiptPdfProfile } from "../classic-receipt-pdf-profile";
import { formatReceiptPdfDate } from "../classic-receipt-pdf-profile";
import { receiptPdfStyles } from "../classic-receipt-pdf-styles";

interface ReceiptPdfDocumentMetaProps {
  receiptNo: string;
  date: string;
  accentDark: string;
  profile: ClassicReceiptPdfProfile;
  contentWidth: number;
}

export function ReceiptPdfDocumentMeta({
  receiptNo,
  date,
  accentDark,
  profile,
  contentWidth,
}: ReceiptPdfDocumentMetaProps) {
  const titlePadX = profile.titleSize * 2;
  const blockGap = profile.paddingX * 2.25;
  const blockWidth = (contentWidth - blockGap) / 2;

  return (
    <View wrap={false}>
      <View
        style={[
          receiptPdfStyles.title,
          {
            backgroundColor: accentDark,
            marginTop: profile.metaSize * 0.6,
            marginBottom: profile.metaSize * 0.55,
            paddingHorizontal: titlePadX,
            paddingVertical: profile.titleSize * 0.34,
          },
        ]}
      >
        <Text style={{ fontSize: profile.titleSize }}>RECEIPT</Text>
      </View>

      <View
        style={[
          receiptPdfStyles.metaRow,
          {
            marginHorizontal: profile.paddingX * 0.58,
            marginBottom: profile.metaSize * 0.45,
          },
        ]}
      >
        <View style={[receiptPdfStyles.metaBlock, { width: blockWidth }]}>
          <Text style={{ width: profile.metaSize * 4.4, fontSize: profile.metaSize }}>
            Date:
          </Text>
          <Text
            style={[
              receiptPdfStyles.dateValue,
              {
                minHeight: profile.metaSize * 2.15,
                paddingHorizontal: profile.metaSize * 0.6,
                paddingBottom: profile.metaSize * 0.2,
                fontSize: profile.metaSize,
              },
            ]}
          >
            {formatReceiptPdfDate(date)}
          </Text>
        </View>

        <View style={[receiptPdfStyles.metaBlock, { width: blockWidth }]}>
          <Text style={{ width: profile.metaSize * 3.6, fontSize: profile.metaSize }}>
            No.:
          </Text>
          <View
            style={[
              receiptPdfStyles.numberValue,
              {
                minHeight: profile.metaSize * 2.65,
                paddingHorizontal: profile.metaSize * 0.7,
              },
            ]}
          >
            <Text style={{ fontSize: profile.metaSize * 0.88 }}>{receiptNo}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
