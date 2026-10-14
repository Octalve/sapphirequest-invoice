import { PAPER_DEFINITIONS } from "../constants";
import type { InvoicePresentation } from "../presentation/invoice-presentation";
import type { CurrencyCode, ExportFormat, PaperSize } from "../types";
import type { InvoiceTemplateId } from "../templates/types";
import { clampPercent, parseMoneyInput, parseQuantityInput } from "./calculations";
import { formatNumber } from "./currency";
import { getPaperPreviewHeightPx } from "./paper";

export interface InvoiceExportOptions {
  element: HTMLElement;
  format: ExportFormat;
  filenameBase: string;
  presentation: InvoicePresentation;
  templateId: InvoiceTemplateId;
  accentColor?: string;
}

const PNG_CAPTURE_SCALE = 2;
interface RenderedDocumentDescriptor {
  paperSize: PaperSize;
  currency: CurrencyCode;
  orientation?: "portrait" | "landscape";
}

function getPreviewGeometry(paperSize: PaperSize, orientation: "portrait" | "landscape" = "portrait") {
  const paper = PAPER_DEFINITIONS[paperSize];
  const portraitWidth = paper.previewWidthPx;
  const portraitHeight = getPaperPreviewHeightPx(paperSize);
  return orientation === "landscape"
    ? { width: portraitHeight, height: portraitWidth }
    : { width: portraitWidth, height: portraitHeight };
}


async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      });
    }),
  );
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function formatControlValue(control: HTMLInputElement | HTMLTextAreaElement, currency: CurrencyCode): string {
  const value = control.value || "";

  if (control.classList.contains("sq-percent-input") || control.classList.contains("sq-line-discount")) {
    return String(clampPercent(value));
  }

  if (control.classList.contains("sq-line-unit-price")) {
    return formatNumber(parseMoneyInput(value), currency);
  }

  if (control.classList.contains("sq-line-quantity")) {
    const quantity = parseQuantityInput(value);
    return Number.isInteger(quantity) ? String(quantity) : String(Number(quantity.toFixed(2)));
  }

  return value;
}

function replaceCloneFields(
  source: HTMLElement,
  clone: HTMLElement,
  currency: CurrencyCode,
): void {
  const sourceControls = Array.from(
    source.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"),
  ).filter((control) => !control.closest('[data-export-ignore="true"]'));
  const cloneControls = Array.from(
    clone.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"),
  ).filter((control) => !control.closest('[data-export-ignore="true"]'));

  cloneControls.forEach((cloneControl, index) => {
    const sourceControl = sourceControls[index];
    if (!sourceControl) return;

    const computed = window.getComputedStyle(sourceControl);
    const span = document.createElement("span");
    span.textContent = formatControlValue(sourceControl, currency);
    span.className = `${sourceControl.className} sq-export-value`;
    span.setAttribute("aria-hidden", "true");

    const copiedProperties = [
      "boxSizing",
      "display",
      "width",
      "minWidth",
      "maxWidth",
      "height",
      "minHeight",
      "maxHeight",
      "flex",
      "flexGrow",
      "flexShrink",
      "flexBasis",
      "alignSelf",
      "justifySelf",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "lineHeight",
      "letterSpacing",
      "textAlign",
      "textTransform",
      "color",
      "backgroundColor",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
      "borderTopStyle",
      "borderRightStyle",
      "borderBottomStyle",
      "borderLeftStyle",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
    ] as const;

    copiedProperties.forEach((property) => {
      span.style[property] = computed[property];
    });

    const sourceRect = sourceControl.getBoundingClientRect();
    span.style.width = `${sourceRect.width}px`;
    span.style.minWidth = `${sourceRect.width}px`;
    if (sourceControl instanceof HTMLTextAreaElement) {
      span.style.height = `${sourceRect.height}px`;
      span.style.minHeight = `${sourceRect.height}px`;
    }

    span.style.display = sourceControl instanceof HTMLTextAreaElement ? "block" : "inline-block";
    span.style.whiteSpace = sourceControl instanceof HTMLTextAreaElement ? "pre-wrap" : "nowrap";
    span.style.overflowWrap = "anywhere";
    span.style.verticalAlign = "middle";

    cloneControl.replaceWith(span);
  });
}

async function createStaticCaptureClone(
  element: HTMLElement,
  presentation: RenderedDocumentDescriptor,
): Promise<{ stage: HTMLDivElement; clone: HTMLElement }> {
  const geometry = getPreviewGeometry(presentation.paperSize, presentation.orientation);
  const stage = document.createElement("div");
  stage.className = "sq-png-export-stage";
  stage.setAttribute("aria-hidden", "true");

  const sourceRect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.style.width = `${sourceRect.width || geometry.width}px`;
  clone.style.maxWidth = `${sourceRect.width || geometry.width}px`;
  clone.style.minWidth = `${sourceRect.width || geometry.width}px`;
  clone.style.minHeight = `${Math.max(sourceRect.height, geometry.height)}px`;
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.transform = "none";
  clone.style.transformOrigin = "top left";
  clone.classList.remove("shadow-2xl");
  stage.style.width = clone.style.width;

  replaceCloneFields(element, clone, presentation.currency);
  clone.querySelectorAll('[data-export-ignore="true"]').forEach((node) => node.remove());
  stage.appendChild(clone);
  document.body.appendChild(stage);

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Use already-resolved browser fonts if FontFaceSet readiness is unavailable.
    }
  }
  await waitForImages(clone);
  await nextPaint();
  await nextPaint();

  return { stage, clone };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Unable to encode canvas as ${type}.`));
      },
      type,
      quality,
    );
  });
}

async function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  const blob = await canvasToBlob(canvas, "image/png");
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function safeFilename(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[-_.]+|[-_.]+$/g, "");
}

export function buildExportBaseName(invoiceNo: string, clientName: string, currency: CurrencyCode): string {
  return [
    "Sapphire_Quest_Invoice",
    safeFilename(invoiceNo),
    safeFilename(clientName),
    currency,
  ]
    .filter(Boolean)
    .join("_");
}

export function buildReceiptExportBaseName(receiptNo: string, receivedFrom: string, currency: CurrencyCode): string {
  return [
    "Sapphire_Quest_Receipt",
    safeFilename(receiptNo),
    safeFilename(receivedFrom),
    currency,
  ]
    .filter(Boolean)
    .join("_");
}

export async function exportRenderedDocumentPng(
  element: HTMLElement,
  filenameBase: string,
  presentation: RenderedDocumentDescriptor,
): Promise<void> {
  const { default: html2canvas } = await import("html2canvas-pro");

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Browser-resolved fonts remain usable when FontFaceSet readiness fails.
    }
  }

  const geometry = getPreviewGeometry(presentation.paperSize, presentation.orientation);
  let stage: HTMLDivElement | null = null;

  try {
    document.body.classList.add("sq-exporting");
    const staticCapture = await createStaticCaptureClone(element, presentation);
    stage = staticCapture.stage;

    const captureWidth = Math.ceil(staticCapture.clone.getBoundingClientRect().width || geometry.width);
    const captureHeight = Math.ceil(Math.max(
      staticCapture.clone.scrollHeight,
      staticCapture.clone.getBoundingClientRect().height,
      geometry.height,
    ));

    const canvas = await html2canvas(staticCapture.clone, {
      scale: PNG_CAPTURE_SCALE,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      width: captureWidth,
      height: captureHeight,
      windowWidth: captureWidth,
      windowHeight: captureHeight,
    });

    await downloadCanvasPng(canvas, `${filenameBase}.png`);
  } finally {
    stage?.remove();
    document.body.classList.remove("sq-exporting");
  }
}

export async function exportInvoiceDocument({
  element,
  format,
  filenameBase,
  presentation,
  templateId,
  accentColor,
}: InvoiceExportOptions): Promise<void> {
  if (format === "pdf") {
    if (templateId === "octalve") {
      const { exportNativeInvoicePdf } = await import("./native-pdf-export");
      await exportNativeInvoicePdf(presentation, `${filenameBase}.pdf`);
      return;
    }

    if (templateId === "classic-ledger") {
      const { exportClassicLedgerPdf } = await import("../templates/classic-ledger/pdf/classic-ledger-pdf-export");
      await exportClassicLedgerPdf(presentation, `${filenameBase}.pdf`, accentColor);
      return;
    }

    if (templateId === "classic-receipt") {
      throw new Error("Classic Receipt must use the receipt-specific export path.");
    }

    const exhaustive: never = templateId;
    throw new Error(`Unsupported invoice template: ${String(exhaustive)}`);
  }

  await exportRenderedDocumentPng(element, filenameBase, presentation);
}
