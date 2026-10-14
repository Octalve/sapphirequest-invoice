"use client";

import { useCallback, useEffect, useState } from "react";
import { readJson, storageSet } from "../lib/storage";
import {
  TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS,
  createDefaultTemplateBusinessProfile,
  type EditableBusinessTemplateId,
} from "../templates/business-profile";
import type { BusinessIdentityProfile } from "../types";

function normalizeProfile(value: Partial<BusinessIdentityProfile> | null): BusinessIdentityProfile {
  const fallback = createDefaultTemplateBusinessProfile();
  if (!value) return fallback;

  return {
    name: String(value.name ?? fallback.name),
    phone: String(value.phone ?? fallback.phone),
    email: String(value.email ?? fallback.email),
    website: String(value.website ?? fallback.website),
    address: String(value.address ?? fallback.address),
    tinNo: String(value.tinNo ?? fallback.tinNo),
    rcNo: String(value.rcNo ?? fallback.rcNo),
  };
}

export function useTemplateBusinessProfile(templateId: EditableBusinessTemplateId) {
  const storageKey = TEMPLATE_BUSINESS_PROFILE_STORAGE_KEYS[templateId];
  const [profile, setProfile] = useState<BusinessIdentityProfile>(() => createDefaultTemplateBusinessProfile());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = readJson<Partial<BusinessIdentityProfile>>(storageKey);
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setProfile(normalizeProfile(stored));
      setInitialized(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!initialized) return;
    storageSet(storageKey, JSON.stringify(profile));
  }, [initialized, profile, storageKey]);

  const update = useCallback(<K extends keyof BusinessIdentityProfile>(key: K, value: BusinessIdentityProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setProfile(createDefaultTemplateBusinessProfile());
  }, []);

  return { profile, initialized, update, reset };
}
