import { Text, View } from "@react-pdf/renderer";
import { formatPdfNumber } from "../../../../presentation/invoice-presentation";
import type { CurrencyCode } from "../../../../types";
import { receiptMoneyDensity, type ReceiptTextDensity } from "../../lib/receipt-layout";
import type { ReceiptPaymentMethod } from "../../types";
import type { ClassicReceiptPdfProfile } from "../classic-receipt-pdf-profile";
import {
  RECEIPT_PDF_COLORS,
  receiptPdfStyles,
} from "../classic-receipt-pdf-styles";

const METHOD_LABELS: Record<ReceiptPaymentMethod, string> = {
  cash: "Cash",
  transfer: "Transfer",
  cheque: "Cheque",
  pos: "POS",
  other: "Other",
};

function moneyFont(base: number, density: ReceiptTextDensity): number {
  if (density === "micro") return base * 0.68;
  if (density === "tight") return base * 0.78;
  if (density === "compact") return base * 0.88;
  return base;
}

function PdfCurrencySymbol({
  currency,
  fontSize,
}: {
  currency: CurrencyCode;
  fontSize: number;
}) {
  if (currency === "NGN") {
    return (
      <View
        style={[
          receiptPdfStyles.naira,
          {
            width: fontSize * 0.72,
            height: fontSize * 1.12,
            marginRight: fontSize * 0.12,
          },
        ]}
      >
        <Text style={{ fontSize, lineHeight: 1 }}>N</Text>
        <View
          style={[
            receiptPdfStyles.nairaLine,
            { top: fontSize * 0.4 },
          ]}
        />
        <View
          style={[
            receiptPdfStyles.nairaLine,
            { top: fontSize * 0.66 },
          ]}
        />
      </View>
    );
  }

  const symbols: Record<Exclude<CurrencyCode, "NGN">, string> = {
    USD: "$",
    GBP: "£",
    EUR: "€",
  };

  return (
    <Text style={{ fontSize, marginRight: fontSize * 0.12 }}>
      {symbols[currency]}
    </Text>
  );
}

function PdfMoney({
  amount,
  currency,
  fontSize,
}: {
  amount: number;
  currency: CurrencyCode;
  fontSize: number;
}) {
  return (
    <View style={receiptPdfStyles.money}>
      <PdfCurrencySymbol currency={currency} fontSize={fontSize} />
      <Text style={{ fontSize, fontFamily: "Helvetica-Bold" }}>
        {formatPdfNumber(amount, currency)}
      </Text>
    </View>
  );
}

interface ReceiptPdfPaymentProps {
  amountReceived: number;
  balanceRemaining: number | null;
  currency: CurrencyCode;
  paymentMethod: ReceiptPaymentMethod;
  accent: string;
  profile: ClassicReceiptPdfProfile;
}

export function ReceiptPdfPayment({
  amountReceived,
  balanceRemaining,
  currency,
  paymentMethod,
  accent,
  profile,
}: ReceiptPdfPaymentProps) {
  const amountFormatted = formatPdfNumber(amountReceived, currency);
  const balanceFormatted =
    balanceRemaining === null ? "" : formatPdfNumber(balanceRemaining, currency);
  const amountFont = moneyFont(
    profile.fieldValueSize,
    receiptMoneyDensity(amountFormatted),
  );
  const balanceFont = moneyFont(
    profile.fieldValueSize,
    receiptMoneyDensity(balanceFormatted),
  );
  const horizontalMargin = profile.paddingX * 0.58;

  return (
    <View wrap={false}>
      <View
        style={[
          receiptPdfStyles.amountRow,
          {
            marginHorizontal: horizontalMargin,
            marginTop: profile.methodSize * 0.65,
          },
        ]}
      >
        <View
          style={[
            receiptPdfStyles.amountField,
            { flexGrow: 1.45, marginRight: profile.methodSize * 2.5 },
          ]}
        >
          <Text
            style={[
              receiptPdfStyles.amountLabel,
              {
                fontSize: profile.methodSize,
                marginRight: profile.methodSize * 0.85,
              },
            ]}
          >
            Amount in Figure:
          </Text>
          <View
            style={[
              receiptPdfStyles.moneyBox,
              {
                minHeight: profile.amountBoxHeight,
                paddingHorizontal: profile.fieldValueSize * 0.75,
              },
            ]}
          >
            <PdfMoney
              amount={amountReceived}
              currency={currency}
              fontSize={amountFont}
            />
          </View>
        </View>

        <View style={[receiptPdfStyles.amountField, { flexGrow: 0.8 }]}>
          <Text
            style={[
              receiptPdfStyles.amountLabel,
              {
                fontSize: profile.methodSize,
                marginRight: profile.methodSize * 0.85,
              },
            ]}
          >
            Balance:
          </Text>
          <View
            style={[
              receiptPdfStyles.moneyBox,
              {
                minHeight: profile.amountBoxHeight,
                paddingHorizontal: profile.fieldValueSize * 0.75,
              },
            ]}
          >
            {balanceRemaining === null ? (
              <Text style={{ fontSize: balanceFont, color: RECEIPT_PDF_COLORS.muted }}>
                —
              </Text>
            ) : (
              <PdfMoney
                amount={balanceRemaining}
                currency={currency}
                fontSize={balanceFont}
              />
            )}
          </View>
        </View>
      </View>

      <View
        style={[
          receiptPdfStyles.methods,
          {
            marginHorizontal: horizontalMargin,
            marginTop: profile.methodSize * 0.75,
          },
        ]}
      >
        <Text
          style={[
            receiptPdfStyles.amountLabel,
            {
              fontSize: profile.methodSize,
              marginRight: profile.methodSize * 1.4,
            },
          ]}
        >
          Payment Method:
        </Text>

        {(["cash", "transfer", "cheque", "pos", "other"] as ReceiptPaymentMethod[]).map(
          (method) => {
            const selected = paymentMethod === method;

            return (
              <View
                key={method}
                style={[
                  receiptPdfStyles.method,
                  { marginRight: profile.methodSize * 2.2 },
                ]}
              >
                <View
                  style={[
                    receiptPdfStyles.checkbox,
                    {
                      width: profile.checkboxSize,
                      height: profile.checkboxSize,
                      marginRight: profile.methodSize * 0.55,
                      borderColor: selected ? accent : RECEIPT_PDF_COLORS.line,
                      backgroundColor: selected ? accent : RECEIPT_PDF_COLORS.white,
                    },
                  ]}
                />
                <Text style={{ fontSize: profile.methodSize }}>
                  {METHOD_LABELS[method]}
                </Text>
              </View>
            );
          },
        )}
      </View>
    </View>
  );
}
