import { StyleSheet } from "@react-pdf/renderer";

export const RECEIPT_PDF_COLORS = {
  ink: "#172033",
  muted: "#667085",
  line: "#253047",
  white: "#FFFFFF",
  panel: "#F5F4F7",
} as const;

export const receiptPdfStyles = StyleSheet.create({
  page: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    backgroundColor: RECEIPT_PDF_COLORS.white,
    color: RECEIPT_PDF_COLORS.ink,
    fontFamily: "Helvetica",
  },
  frame: {
    position: "absolute",
    borderWidth: 1,
  },
  brandHeaderImagePanel: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: RECEIPT_PDF_COLORS.white,
  },
  brandHeaderImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  brandPanel: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: RECEIPT_PDF_COLORS.panel,
  },
  logoRail: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  identityRail: {
    width: "80%",
    minWidth: 0,
    justifyContent: "center",
  },
  logo: {
    objectFit: "contain",
  },
  businessName: {
    lineHeight: 0.98,
    letterSpacing: -0.35,
    textAlign: "left",
  },
  contactGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactItem: {
    width: "33.333%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    flexGrow: 1,
    color: RECEIPT_PDF_COLORS.ink,
    fontFamily: "Helvetica-Bold",
  },
  addressRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    flexGrow: 1,
    color: RECEIPT_PDF_COLORS.ink,
    fontFamily: "Helvetica-Bold",
  },
  divider: {
    borderTopWidth: 1.2,
  },
  title: {
    alignSelf: "center",
    color: RECEIPT_PDF_COLORS.white,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Times-Roman",
  },
  metaBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateValue: {
    flexGrow: 1,
    borderBottomWidth: 0.75,
    borderBottomColor: RECEIPT_PDF_COLORS.line,
  },
  numberValue: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.75,
    borderColor: RECEIPT_PDF_COLORS.line,
    fontFamily: "Helvetica-Bold",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldLabel: {
    fontFamily: "Times-Roman",
  },
  fieldBox: {
    flexGrow: 1,
    justifyContent: "center",
    borderWidth: 0.75,
    borderColor: RECEIPT_PDF_COLORS.line,
    fontFamily: "Times-Roman",
  },
  sumSecond: {
    justifyContent: "center",
    borderWidth: 0.75,
    borderColor: RECEIPT_PDF_COLORS.line,
    fontFamily: "Times-Roman",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountField: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountLabel: {
    fontFamily: "Helvetica-Bold",
  },
  moneyBox: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0.75,
    borderColor: RECEIPT_PDF_COLORS.line,
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
    borderTopColor: RECEIPT_PDF_COLORS.ink,
  },
  methods: {
    flexDirection: "row",
    alignItems: "center",
  },
  method: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    borderWidth: 0.75,
    borderColor: RECEIPT_PDF_COLORS.line,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 1,
  },
  signatures: {
    flexDirection: "row",
  },
  signature: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: "center",
    textAlign: "center",
  },
  signatureImageSlot: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  signatureImage: {
    objectFit: "contain",
  },
  signatureLine: {
    alignSelf: "stretch",
    borderTopWidth: 0.75,
    borderTopColor: RECEIPT_PDF_COLORS.line,
  },
  signatureName: {
    fontFamily: "Helvetica-Bold",
  },
  customerSignature: {
    fontFamily: "Times-Roman",
  },
  referenceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  referenceBlock: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  referenceValue: {
    flexGrow: 1,
    borderBottomWidth: 0.75,
    borderBottomColor: RECEIPT_PDF_COLORS.line,
  },
  confirmation: {
    color: RECEIPT_PDF_COLORS.muted,
    textAlign: "right",
  },
});
