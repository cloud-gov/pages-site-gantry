import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  getCollectionFilters,
  getFiltersFromQueryParams,
  getFiltersSelections,
  getSearchOptionsFromQuery,
  getSearchOptionsFromSelectedFilters,
  sortFilterOptions,
  updateHistoryStateForWindow,
} from "@/utilities/filter/filtersSelect";
import type { FilterSelection } from "@/env.d";
import { setupDom } from "test/utils";

/* ------------------------------------------------------------------ */
/* getCollectionFilters */
/* ------------------------------------------------------------------ */

describe("filtersSelect", () => {
  setupDom();

  describe("Filters Select Utility, getCollectionFilters", () => {
    it("gets collection specific filters and sorts them", () => {
      const pagefindFilters = {
        events_tag: { GEOGRAPHY: 1 },
        events_year: { "2023": 1, "2025": 1 },
        leadership_year: { Unspecified: 3 },
      };

      expect(getCollectionFilters(pagefindFilters, "events_tag")).toEqual([
        { value: "GEOGRAPHY", textContent: "GEOGRAPHY (1)" },
      ]);

      expect(getCollectionFilters(pagefindFilters, "events_year")).toEqual([
        { value: "2025", textContent: "2025 (1)" },
        { value: "2023", textContent: "2023 (1)" },
      ]);

      expect(getCollectionFilters(pagefindFilters, "leadership_year")).toEqual(
        [],
      );
    });
  });

  /* ------------------------------------------------------------------ */
  /* getFiltersFromQueryParams */
  /* ------------------------------------------------------------------ */

  describe("Filters Select Utility, getFiltersFromQueryParams", () => {
    it("extracts filters from url query params", () => {
      const window = Object.defineProperty({}, "location", {
        writable: true,
        value: { search: "?tag=GEOGRAPHY,SCIENCE&year=2025" },
      });
      const result = getFiltersFromQueryParams(window);
      expect(result.get("tag")).toBe("GEOGRAPHY,SCIENCE");
      expect(result.get("year")).toBe("2025");
    });

    it("returns empty map when no params exist", () => {
      global.window.location.search = "";

      expect(getFiltersFromQueryParams(global.window).size).toBe(0);
    });
  });

  /* ------------------------------------------------------------------ */
  /* sortFilterOptions */
  /* ------------------------------------------------------------------ */

  describe("Filters Select Utility, sortFilterOptions", () => {
    it("sorts numerically then alphabetically", () => {
      const options = [
        { value: "Option 1" },
        { value: "2025" },
        { value: "1" },
      ];

      sortFilterOptions(options);

      expect(options).toEqual([
        { value: "2025" },
        { value: "1" },
        { value: "Option 1" },
      ]);
    });
  });

  /* ------------------------------------------------------------------ */
  /* getSearchOptionsFromSelectedFilters */
  /* ------------------------------------------------------------------ */

  describe("Filters Select Utility, getSearchOptionsFromSelectedFilters", () => {
    it("uses scalar value for single selection", () => {
      const filtersMap = new Map([
        [
          "tag",
          {
            filterName: "tag",
            pagefindfilter: "events_tag",
          },
        ],
      ]);

      const selections = new Map<string, FilterSelection>([
        ["tag", { filterName: "tag", selectedValue: "GEOGRAPHY" }],
      ]);

      expect(
        getSearchOptionsFromSelectedFilters(filtersMap as any, selections),
      ).toEqual({
        filters: {
          any: {
            events_tag: "GEOGRAPHY",
          },
        },
      });
    });

    it("uses array value for multi-selection", () => {
      const filtersMap = new Map([
        [
          "tag",
          {
            filterName: "tag",
            pagefindfilter: "events_tag",
          },
        ],
      ]);

      const selections = new Map<string, FilterSelection>([
        [
          "tag",
          {
            filterName: "tag",
            selectedValue: "GEOGRAPHY,SCIENCE",
          },
        ],
      ]);

      expect(
        getSearchOptionsFromSelectedFilters(filtersMap as any, selections),
      ).toEqual({
        filters: {
          any: {
            events_tag: ["GEOGRAPHY", "SCIENCE"],
          },
        },
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* getSearchOptionsFromQuery */
  /* ------------------------------------------------------------------ */

  describe("Filters Select Utility, getSearchOptionsFromQuery", () => {
    it("builds Pagefind filters from query params", () => {
      const window = Object.defineProperty({}, "location", {
        writable: true,
        value: { search: "?tag=HISTORY,SCIENCE&year=2024" },
      });

      const result = getSearchOptionsFromQuery(
        "events",
        getFiltersFromQueryParams(window),
      );

      expect(result).toEqual({
        filters: {
          any: {
            events_tag: ["HISTORY", "SCIENCE"],
            events_year: "2024",
          },
        },
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* getFiltersSelections (checkbox-based) */
  /* ------------------------------------------------------------------ */

  describe("Filters Select Utility, getFiltersSelections", () => {
    beforeEach(() => {
      document.body.replaceChildren();
      vi.restoreAllMocks();
    });

    it("returns selected values from checked checkboxes", () => {
      const tag1 = document.createElement("input");
      tag1.type = "checkbox";
      tag1.name = "tag";
      tag1.value = "GEOGRAPHY";
      tag1.checked = true;

      const tag2 = document.createElement("input");
      tag2.type = "checkbox";
      tag2.name = "tag";
      tag2.value = "SCIENCE";
      tag2.checked = true;

      document.body.append(tag1, tag2);

      const filtersMap = new Map([
        [
          "tag",
          {
            filterName: "tag",
            filterElement: document.createElement("div"),
            navElement: {},
          },
        ],
      ]);

      const result = getFiltersSelections(filtersMap as any);

      expect(Object.fromEntries(result!)).toEqual({
        tag: {
          filterName: "tag",
          selectedValue: "GEOGRAPHY,SCIENCE",
        },
      });
    });

    it("returns null when no checkboxes are selected", () => {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "tag";
      input.value = "GEOGRAPHY";
      input.checked = false;

      document.body.append(input);

      const filtersMap = new Map([
        [
          "tag",
          {
            filterName: "tag",
            filterElement: document.createElement("div"),
            navElement: {},
          },
        ],
      ]);

      expect(getFiltersSelections(filtersMap as any)).toBeNull();
    });
  });

  /* ------------------------------------------------------------------ */
  /* updateHistoryStateForWindow */
  /* ------------------------------------------------------------------ */

  describe("Filters Select Utility, updateHistoryStateForWindow", () => {
    let mockWindow: any;

    beforeEach(() => {
      mockWindow = {
        location: { href: "http://example.com/news" },
        history: { replaceState: vi.fn() },
      };
    });

    it("adds query params for selected filters", () => {
      const filters = new Map<string, FilterSelection>([
        ["tag", { filterName: "tag", selectedValue: "HISTORY,SCIENCE" }],
        ["year", { filterName: "year", selectedValue: "2025" }],
      ]);

      updateHistoryStateForWindow(filters, mockWindow);

      expect(mockWindow.history.replaceState.mock.calls[0][2].toString()).toBe(
        "http://example.com/news?tag=HISTORY%2CSCIENCE&year=2025",
      );
    });

    it("removes params with empty selectedValue", () => {
      updateHistoryStateForWindow(
        new Map([["tag", { filterName: "tag", selectedValue: "" }]]),
        mockWindow,
      );

      expect(mockWindow.history.replaceState.mock.calls[0][2].toString()).toBe(
        "http://example.com/news",
      );
    });

    it("handles null or empty filters safely", () => {
      updateHistoryStateForWindow(null, mockWindow);
      expect(mockWindow.history.replaceState.mock.calls[0][2].toString()).toBe(
        "http://example.com/news",
      );
    });
  });
});
