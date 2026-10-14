"use client";

import { COMPANY_IDENTITY } from "../../../constants";
import { CLASSIC_LEDGER_HEADER_IMAGE_PATH } from "../lib/ledger-header-asset";
import type { InvoicePresentation } from "../../../presentation/invoice-presentation";

let logoDataUrlPromise: Promise<string> | null = null;
let headerImageDataUrlPromise: Promise<string | null> | null = null;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read Classic Ledger logo asset."));
    reader.readAsDataURL(blob);
  });
}

async function loadLogoDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(COMPANY_IDENTITY.iconPath, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load Sapphire Quest icon (${response.status}).`);
        return response.blob();
      })
      .then(blobToDataUrl)
      .catch((error) => {
        logoDataUrlPromise = null;
        throw error;
      });
  }

  return logoDataUrlPromise;
}


async function loadHeaderImageDataUrl(): Promise<string | null> {
  if (!headerImageDataUrlPromise) {
    headerImageDataUrlPromise = fetch(CLASSIC_LEDGER_HEADER_IMAGE_PATH, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) return null;
        return response.blob().then(blobToDataUrl);
      })
      .catch(() => null);
  }

  return headerImageDataUrlPromise;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export async function exportClassicLedgerPdf(
  presentation: InvoicePresentation,
  filename: string,
  accentColor?: string,
): Promise<void> {
  const [{ pdf }, { ClassicLedgerPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./classic-ledger-pdf-document"),
  ]);

  const [logoSrc, headerImageSrc] = await Promise.all([
    loadLogoDataUrl(),
    loadHeaderImageDataUrl(),
  ]);
  const instance = pdf(
    <ClassicLedgerPdfDocument
      presentation={presentation}
      logoSrc={logoSrc}
      headerImageSrc={headerImageSrc}
      accentColor={accentColor}
    />,
  );
  const blob = await instance.toBlob();
  downloadBlob(blob, filename);
}
