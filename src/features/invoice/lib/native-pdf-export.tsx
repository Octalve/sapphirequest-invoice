"use client";

import { COMPANY_IDENTITY } from "../constants";
import type { InvoicePresentation } from "../presentation/invoice-presentation";

let logoDataUrlPromise: Promise<string> | null = null;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read logo asset."));
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

export async function exportNativeInvoicePdf(
  presentation: InvoicePresentation,
  filename: string,
): Promise<void> {
  const [{ pdf }, { SapphirePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("../renderers/pdf/sapphire-pdf-document"),
  ]);

  const logoSrc = await loadLogoDataUrl();
  const instance = pdf(
    <SapphirePdfDocument
      presentation={presentation}
      logoSrc={logoSrc}
    />,
  );
  const blob = await instance.toBlob();
  downloadBlob(blob, filename);
}
