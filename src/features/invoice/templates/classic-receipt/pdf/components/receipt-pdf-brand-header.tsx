import { Font, Image, Text, View } from "@react-pdf/renderer";
import type { BusinessIdentityProfile } from "../../../../types";
import {
  RECEIPT_BRAND_FONT_ENABLED,
  RECEIPT_BRAND_FONT_FAMILY,
  RECEIPT_BRAND_FONT_URL,
} from "../../lib/receipt-brand-font";
import type { ClassicReceiptPdfProfile } from "../classic-receipt-pdf-profile";
import { receiptPdfStyles } from "../classic-receipt-pdf-styles";
import { ReceiptPdfContactIcon } from "./receipt-pdf-contact-icon";

if (RECEIPT_BRAND_FONT_ENABLED) {
  Font.register({
    family: RECEIPT_BRAND_FONT_FAMILY,
    src: RECEIPT_BRAND_FONT_URL,
    fontStyle: "normal",
    fontWeight: 700,
  });
}

interface ReceiptPdfBrandHeaderProps {
  company: BusinessIdentityProfile;
  logoSrc: string;
  headerImageSrc?: string | null;
  accentDark: string;
  profile: ClassicReceiptPdfProfile;
}

function ContactItem({
  icon,
  value,
  profile,
}: {
  icon: "phone" | "mail" | "website";
  value: string;
  profile: ClassicReceiptPdfProfile;
}) {
  if (!value) return <View style={receiptPdfStyles.contactItem} />;

  return (
    <View style={receiptPdfStyles.contactItem}>
      <ReceiptPdfContactIcon name={icon} size={profile.contactIconSize} />
      <Text
        style={[
          receiptPdfStyles.contactText,
          {
            marginLeft: profile.contactIconGap,
            fontSize: profile.companyDetailsSize,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export function ReceiptPdfBrandHeader({
  company,
  logoSrc,
  headerImageSrc,
  accentDark,
  profile,
}: ReceiptPdfBrandHeaderProps) {
  if (headerImageSrc) {
    return (
      <View wrap={false}>
        <View
          style={[
            receiptPdfStyles.brandHeaderImagePanel,
            {
              height: profile.brandPanelHeight,
              minHeight: profile.brandPanelHeight,
              borderRadius: profile.brandPanelRadius,
            },
          ]}
        >
          <Image src={headerImageSrc} style={receiptPdfStyles.brandHeaderImage} />
        </View>

        <View
          style={[
            receiptPdfStyles.divider,
            {
              borderTopColor: accentDark,
              marginHorizontal: profile.paddingX * 0.3,
              marginTop: profile.companyDetailsSize * 0.75,
            },
          ]}
        />
      </View>
    );
  }

  const nameLength = company.name.trim().length;
  const businessNameSize =
    nameLength > 48
      ? profile.businessNameSize * 0.72
      : nameLength > 34
        ? profile.businessNameSize * 0.84
        : profile.businessNameSize;
  const brandFont = RECEIPT_BRAND_FONT_ENABLED
    ? RECEIPT_BRAND_FONT_FAMILY
    : "Helvetica-Bold";

  return (
    <View wrap={false}>
      <View
        style={[
          receiptPdfStyles.brandPanel,
          {
            minHeight: profile.brandPanelHeight,
            borderRadius: profile.brandPanelRadius,
            paddingHorizontal: profile.brandPanelPaddingX,
            paddingVertical: profile.brandPanelPaddingY,
          },
        ]}
      >
        <View style={receiptPdfStyles.logoRail}>
          <Image
            src={logoSrc}
            style={[
              receiptPdfStyles.logo,
              {
                width: profile.logoSize,
                height: profile.logoHeight,
              },
            ]}
          />
        </View>

        <View
          style={[
            receiptPdfStyles.identityRail,
            { paddingLeft: profile.identityRailPaddingLeft },
          ]}
        >
          <Text
            style={[
              receiptPdfStyles.businessName,
              {
                color: "#172033",
                fontFamily: brandFont,
                fontSize: businessNameSize,
              },
            ]}
          >
            {company.name || "Business"}
          </Text>

          <View
            style={[
              receiptPdfStyles.contactGrid,
              { marginTop: profile.contactRowMarginTop },
            ]}
          >
            <ContactItem icon="phone" value={company.phone} profile={profile} />
            <ContactItem icon="mail" value={company.email} profile={profile} />
            <ContactItem icon="website" value={company.website} profile={profile} />
          </View>

          {company.address ? (
            <View
              style={[
                receiptPdfStyles.addressRow,
                { marginTop: profile.addressRowMarginTop },
              ]}
            >
              <ReceiptPdfContactIcon name="address" size={profile.contactIconSize} />
              <Text
                style={[
                  receiptPdfStyles.addressText,
                  {
                    marginLeft: profile.contactIconGap,
                    fontSize: profile.companyDetailsSize,
                  },
                ]}
              >
                {company.address}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={[
          receiptPdfStyles.divider,
          {
            borderTopColor: accentDark,
            marginHorizontal: profile.paddingX * 0.3,
            marginTop: profile.companyDetailsSize * 0.75,
          },
        ]}
      />
    </View>
  );
}
