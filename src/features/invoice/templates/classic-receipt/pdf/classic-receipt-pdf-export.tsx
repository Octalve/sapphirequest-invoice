"use client";

import { COMPANY_IDENTITY } from "../../../constants";
import { RECEIPT_HEADER_IMAGE_PATH } from "../lib/receipt-header-asset";
import type { ClassicReceiptPresentation } from "../types";

let logoDataUrlPromise: Promise<string> | null = null;
let headerDataUrlPromise: Promise<string | null> | null = null;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read Classic Receipt logo asset."));
    reader.readAsDataURL(blob);
  });
}

async function loadAssetDataUrl(path: string): Promise<string> {
  const response = await fetch(path, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Unable to load receipt asset ${path} (${response.status}).`);
  return blobToDataUrl(await response.blob());
}

async function loadLogoDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = loadAssetDataUrl(COMPANY_IDENTITY.iconPath)
      .catch((error) => {
        logoDataUrlPromise = null;
        throw error;
      });
  }
  return logoDataUrlPromise;
}

async function loadReceiptHeaderDataUrl(): Promise<string | null> {
  if (!headerDataUrlPromise) {
    headerDataUrlPromise = loadAssetDataUrl(RECEIPT_HEADER_IMAGE_PATH).catch(() => null);
  }
  return headerDataUrlPromise;
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

export async function exportClassicReceiptPdf(presentation: ClassicReceiptPresentation, filename: string, accentColor?: string): Promise<void> {
  const [{ pdf }, { ClassicReceiptPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./classic-receipt-pdf-document"),
  ]);
  const [logoSrc, headerImageSrc] = await Promise.all([
    loadLogoDataUrl(),
    loadReceiptHeaderDataUrl(),
  ]);
  const instance = pdf(
    <ClassicReceiptPdfDocument
      presentation={presentation}
      logoSrc={logoSrc}
      headerImageSrc={headerImageSrc}
      accentColor={accentColor}
    />,
  );
  const blob = await instance.toBlob();
  downloadBlob(blob, filename);
}
