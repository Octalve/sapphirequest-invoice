export interface PaginationPlanInput {
  contentHeight: number;
  firstPageCapacity: number;
  continuationPageCapacity: number;
  safeBreakpoints: readonly number[];
  minimumFillRatio?: number;
}

export interface PageSlice {
  startY: number;
  endY: number;
}

function normalizeBreakpoints(points: readonly number[], contentHeight: number): number[] {
  return Array.from(
    new Set(
      points
        .filter((point) => Number.isFinite(point) && point > 0 && point < contentHeight)
        .map((point) => Math.round(point)),
    ),
  ).sort((a, b) => a - b);
}

/**
 * Plans image slices using semantic DOM boundaries. A fallback hard break is
 * used only when no safe boundary exists in the usable region (for example a
 * single exceptionally tall row), so rows/totals are kept together whenever
 * the document makes that possible.
 */
export function planPageSlices({
  contentHeight,
  firstPageCapacity,
  continuationPageCapacity,
  safeBreakpoints,
  minimumFillRatio = 0.35,
}: PaginationPlanInput): PageSlice[] {
  if (!Number.isFinite(contentHeight) || contentHeight <= 0) return [];
  if (!Number.isFinite(firstPageCapacity) || firstPageCapacity <= 0) {
    throw new Error("firstPageCapacity must be greater than zero");
  }
  if (!Number.isFinite(continuationPageCapacity) || continuationPageCapacity <= 0) {
    throw new Error("continuationPageCapacity must be greater than zero");
  }

  const points = normalizeBreakpoints(safeBreakpoints, contentHeight);
  const slices: PageSlice[] = [];
  let startY = 0;
  let pageIndex = 0;

  while (startY < contentHeight - 0.5) {
    const capacity = pageIndex === 0 ? firstPageCapacity : continuationPageCapacity;
    const remaining = contentHeight - startY;

    if (remaining <= capacity + 0.5) {
      slices.push({ startY, endY: contentHeight });
      break;
    }

    const target = startY + capacity;
    const minimumUsefulBreak = startY + capacity * minimumFillRatio;

    const candidates = points.filter(
      (point) => point > minimumUsefulBreak && point <= target && point > startY + 1,
    );

    let endY = candidates.length > 0 ? candidates[candidates.length - 1]! : target;

    // Defensive progress guarantee for pathological markup/measurements.
    if (endY <= startY + 1) endY = Math.min(contentHeight, startY + capacity);

    slices.push({ startY, endY });
    startY = endY;
    pageIndex += 1;

    if (pageIndex > 500) throw new Error("Pagination aborted: excessive page count.");
  }

  return slices.filter((slice) => slice.endY - slice.startY > 0.5);
}

export function hasBlankTrailingPage(slices: readonly PageSlice[], contentHeight: number): boolean {
  if (slices.length === 0) return contentHeight > 0;
  const last = slices[slices.length - 1]!;
  return last.endY <= last.startY || Math.abs(last.endY - contentHeight) > 1;
}
