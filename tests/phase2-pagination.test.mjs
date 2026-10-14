import test from "node:test";
import assert from "node:assert/strict";
import pagination from "../.phase2-test/pagination.js";

const {
  hasBlankTrailingPage,
  planPageSlices,
} = pagination;

const fixtures = {
  a4Short: {
    contentHeight: 960,
    firstPageCapacity: 1123,
    continuationPageCapacity: 1055,
    safeBreakpoints: [510, 740, 900],
  },
  a5Short: {
    contentHeight: 748,
    firstPageCapacity: 794,
    continuationPageCapacity: 726,
    safeBreakpoints: [360, 520, 690],
  },
  longDescriptions: {
    contentHeight: 1640,
    firstPageCapacity: 1123,
    continuationPageCapacity: 1055,
    safeBreakpoints: [520, 880, 1080, 1420],
  },
  manyRows: {
    contentHeight: 3360,
    firstPageCapacity: 1123,
    continuationPageCapacity: 1055,
    safeBreakpoints: Array.from({ length: 20 }, (_, index) => 320 + index * 145),
  },
  totalsNearBoundary: {
    contentHeight: 1420,
    firstPageCapacity: 1123,
    continuationPageCapacity: 1055,
    safeBreakpoints: [500, 760, 910, 1040],
  },
};

test("A4 short invoice stays on one page", () => {
  const slices = planPageSlices(fixtures.a4Short);
  assert.deepEqual(slices, [{ startY: 0, endY: 960 }]);
  assert.equal(hasBlankTrailingPage(slices, 960), false);
});

test("A5 short invoice stays on one page", () => {
  const slices = planPageSlices(fixtures.a5Short);
  assert.deepEqual(slices, [{ startY: 0, endY: 748 }]);
});

test("long descriptions use safe semantic breakpoints where available", () => {
  const slices = planPageSlices(fixtures.longDescriptions);
  assert.equal(slices.length, 2);
  assert.equal(slices[0].endY, 1080);
  assert.equal(slices[1].startY, 1080);
  assert.equal(slices[1].endY, 1640);
});

test("many rows produce genuine multi-page output without zero-height pages", () => {
  const slices = planPageSlices(fixtures.manyRows);
  assert.ok(slices.length >= 3);
  assert.ok(slices.every((slice) => slice.endY > slice.startY));
  assert.equal(hasBlankTrailingPage(slices, fixtures.manyRows.contentHeight), false);
});

test("totals/closing block is moved as a unit when its start is near the boundary", () => {
  const slices = planPageSlices(fixtures.totalsNearBoundary);
  assert.equal(slices[0].endY, 1040);
  assert.equal(slices[1].startY, 1040);
  assert.equal(slices[1].endY, 1420);
});

test("fallback hard break still makes progress for a single exceptionally tall item", () => {
  const slices = planPageSlices({
    contentHeight: 2600,
    firstPageCapacity: 1000,
    continuationPageCapacity: 900,
    safeBreakpoints: [],
  });
  assert.deepEqual(slices, [
    { startY: 0, endY: 1000 },
    { startY: 1000, endY: 1900 },
    { startY: 1900, endY: 2600 },
  ]);
});

test("no blank trailing page is created when content ends exactly at a capacity", () => {
  const slices = planPageSlices({
    contentHeight: 2000,
    firstPageCapacity: 1000,
    continuationPageCapacity: 1000,
    safeBreakpoints: [1000],
  });
  assert.deepEqual(slices, [
    { startY: 0, endY: 1000 },
    { startY: 1000, endY: 2000 },
  ]);
  assert.equal(hasBlankTrailingPage(slices, 2000), false);
});
