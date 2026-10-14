import { formatAmountInWords } from "../../../lib/amount-in-words";
import { createDefaultTemplateBusinessProfile } from "../../business-profile";
import { parseMoneyInput } from "../../../lib/calculations";
import type { BusinessIdentityProfile } from "../../../types";
import type { ClassicReceiptDraft, ClassicReceiptPresentation } from "../types";

export function buildClassicReceiptPresentation(
  draft: ClassicReceiptDraft,
  companyProfile: BusinessIdentityProfile = createDefaultTemplateBusinessProfile(),
): ClassicReceiptPresentation {
  const amountReceived = parseMoneyInput(draft.amountReceived);
  const balanceRaw = draft.balanceRemaining.trim();
  const balanceRemaining = balanceRaw ? parseMoneyInput(balanceRaw) : null;

  return {
    receiptNo: draft.receiptNo,
    date: [draft.day, draft.month, draft.year].filter(Boolean).join(" "),
    receivedFrom: draft.receivedFrom.trim(),
    paymentPurpose: draft.paymentPurpose.trim(),
    amountReceived,
    balanceRemaining,
    amountInWords: formatAmountInWords(amountReceived, draft.currency),
    paymentMethod: draft.paymentMethod,
    reference: draft.reference.trim(),
    companySignatureDataUrl: draft.companySignatureDataUrl,
    customerSignatureDataUrl: draft.customerSignatureDataUrl,
    currency: draft.currency,
    paperSize: draft.paperSize,
    company: {
      ...companyProfile,
      name: companyProfile.name.trim(),
      phone: companyProfile.phone.trim(),
      email: companyProfile.email.trim(),
      website: companyProfile.website.trim(),
      address: companyProfile.address.trim(),
      tinNo: companyProfile.tinNo.trim(),
      rcNo: companyProfile.rcNo.trim(),
    },
  };
}
