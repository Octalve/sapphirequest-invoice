import { PAPER_DEFINITIONS } from "../constants";
import type { DocumentDensity, PaperDefinition, PaperSize } from "../types";

export function getPaperDefinition(paperSize: PaperSize): PaperDefinition {
  return PAPER_DEFINITIONS[paperSize];
}

export function getPaperPreviewHeightPx(paperSize: PaperSize): number {
  const paper = getPaperDefinition(paperSize);
  return Math.round((paper.previewWidthPx * paper.heightMm) / paper.widthMm);
}

export function getDocumentMarginPx(paperSize: PaperSize): number {
  const paper = getPaperDefinition(paperSize);
  return Math.round((paper.previewWidthPx * paper.marginMm) / paper.widthMm);
}

export function getDefaultDocumentDensity(paperSize: PaperSize): DocumentDensity {
  return paperSize === "A5" ? "compact" : "normal";
}

export function getPageAspectRatio(paperSize: PaperSize): number {
  const paper = getPaperDefinition(paperSize);
  return paper.heightMm / paper.widthMm;
}

export function getPageHeightForCanvasWidth(canvasWidth: number, paperSize: PaperSize): number {
  return canvasWidth * getPageAspectRatio(paperSize);
}
