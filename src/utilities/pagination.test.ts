import { describe, expect, it } from "vitest";
import { getPreFooterBig } from "@/components/PreFooterBig.testData";
import { cleanPreFooterBig } from "@/utilities/preFooterBig";
import {
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_NONE,
  PRE_FOOTER_TYPE_SLIM,
  type PreFooterModel,
  type PreFooterBigModel,
  type PageNavItemModel,
} from "@/env";
import { cleanPreFooter } from "@/utilities/preFooter";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData";
import { getPageNumbers, getPageNavItems } from "@/utilities/pagination.ts";

describe("Pagination Utility", () => {
  it("provides pages numbers list", () => {
    const pageNumbersFunction = getPageNumbers;
    expect(pageNumbersFunction(1, 10)).toEqual([1, 2, "...", 10]);
    expect(pageNumbersFunction(2, 10)).toEqual([1, 2, 3, "...", 10]);
    expect(pageNumbersFunction(3, 10)).toEqual([1, 2, 3, 4, "...", 10]);
    expect(pageNumbersFunction(4, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
    expect(pageNumbersFunction(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
    expect(pageNumbersFunction(6, 10)).toEqual([1, "...", 5, 6, 7, "...", 10]);
    expect(pageNumbersFunction(7, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
    expect(pageNumbersFunction(8, 10)).toEqual([1, "...", 7, 8, 9, 10]);
    expect(pageNumbersFunction(9, 10)).toEqual([1, "...", 8, 9, 10]);
    expect(pageNumbersFunction(10, 10)).toEqual([1, "...", 9, 10]);
    expect(pageNumbersFunction(1, 1)).toEqual([]);
  });

  it("provides pagination items list", () => {
    const pageNumbersFunction = getPageNavItems;
    const formatPagination = (items: PageNavItemModel[]): string =>
      `${items.map((i) => (i.itemType == "overflow" ? "..." : `${i.itemType}:${i.pageNumber}${i.isCurrentPage ? "*" : ""}`)).join(" ")}`;

    expect(formatPagination(pageNumbersFunction(1, 10))).toEqual(
      "page:1* page:2 ... page:10 next:2",
    );
    expect(formatPagination(pageNumbersFunction(2, 10))).toEqual(
      "prev:1 page:1 page:2* page:3 ... page:10 next:3",
    );
    expect(formatPagination(pageNumbersFunction(3, 10))).toEqual(
      "prev:2 page:1 page:2 page:3* page:4 ... page:10 next:4",
    );
    expect(formatPagination(pageNumbersFunction(4, 10))).toEqual(
      "prev:3 page:1 page:2 page:3 page:4* page:5 ... page:10 next:5",
    );
    expect(formatPagination(pageNumbersFunction(5, 10))).toEqual(
      "prev:4 page:1 ... page:4 page:5* page:6 ... page:10 next:6",
    );
    expect(formatPagination(pageNumbersFunction(6, 10))).toEqual(
      "prev:5 page:1 ... page:5 page:6* page:7 ... page:10 next:7",
    );
    expect(formatPagination(pageNumbersFunction(7, 10))).toEqual(
      "prev:6 page:1 ... page:6 page:7* page:8 page:9 page:10 next:8",
    );
    expect(formatPagination(pageNumbersFunction(8, 10))).toEqual(
      "prev:7 page:1 ... page:7 page:8* page:9 page:10 next:9",
    );
    expect(formatPagination(pageNumbersFunction(9, 10))).toEqual(
      "prev:8 page:1 ... page:8 page:9* page:10 next:10",
    );
    expect(formatPagination(pageNumbersFunction(10, 10))).toEqual(
      "prev:9 page:1 ... page:9 page:10*",
    );

    expect(formatPagination(pageNumbersFunction(1, 3))).toEqual(
      "page:1* page:2 page:3 next:2",
    );
    expect(formatPagination(pageNumbersFunction("1", 3))).toEqual(
      "page:1* page:2 page:3 next:2",
    );
  });
});
