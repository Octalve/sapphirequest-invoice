import { COMPANY_IDENTITY } from "../constants";
import type { BusinessIdentityProfile } from "../types";

export type EditableBusinessTemplateId = "classic-ledger" | "classic-receipt";

export const TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS: Record<EditableBusinessTemplateId, string> = {
  "classic-ledger": "sq_template_business_profile_v1:classic-ledger",
  "classic-receipt": "sq_template_business_profile_v1:classic-receipt",
};

export function createDefaultTemplateBusinessProfile(): BusinessIdentityProfile {
  return {
    name: COMPANY_IDENTITY.name,
    phone: COMPANY_IDENTITY.phone,
    email: COMPANY_IDENTITY.email,
    website: COMPANY_IDENTITY.website,
    address: "",
    tinNo: "",
    rcNo: "",
  };
}
