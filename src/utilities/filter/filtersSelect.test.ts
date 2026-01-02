import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCollectionFilters,
  getFiltersFromQueryParams,
  getFiltersSelection,
  getSearchOptionsFromQuery,
  getSearchOptionsFromSelectFilters,
  sortFilterOptions,
} from "@/utilities/filter/filtersSelect.ts";

describe("Filters Select Utility, getCollectionFilters", () => {
  it("should get collection specific filters", () => {
    const pagefindFilters: Map<string, any> | {} = {
      events_tag: {
        GEOGRAPHY: 1,
      },
      events_year: {
        "2023": 1,
        "2025": 1,
      },
      leadership_year: {
        Unspecified: 3,
      },
      news_year: {
        "2024": 2,
        "2025": 6,
        Unspecified: 1,
      },
      reports_tag: {
        GEOGRAPHY: 8,
        HISTORY: 4,
        INTERNATIONAL: 4,
        SCIENCE: 5,
        SPORTS: 6,
      },
      reports_year: {
        Unspecified: 11,
      },
      resources_tag: {
        HISTORY: 3,
        INTERNATIONAL: 1,
        SCIENCE: 1,
        GEOGRAPHY: 1,
        SPORTS: 3,
      },
      resources_year: {
        Unspecified: 5,
      },
    };

    expect(getCollectionFilters(pagefindFilters, "events_tag")).toEqual([
      {
        textContent: "GEOGRAPHY (1)",
        value: "GEOGRAPHY",
      },
    ]);
    expect(getCollectionFilters(pagefindFilters, "events_year")).toEqual([
      {
        textContent: "2025 (1)",
        value: "2025",
      },
      {
        textContent: "2023 (1)",
        value: "2023",
      },
    ]);
    expect(getCollectionFilters(pagefindFilters, "leadership_year")).toEqual(
      [],
    );
    expect(getCollectionFilters(pagefindFilters, "news_year")).toEqual([
      {
        textContent: "2025 (6)",
        value: "2025",
      },
      {
        textContent: "2024 (2)",
        value: "2024",
      },
      {
        textContent: "Unspecified (1)",
        value: "Unspecified",
      },
    ]);
    expect(getCollectionFilters(pagefindFilters, "reports_tag")).toEqual([
      {
        textContent: "GEOGRAPHY (8)",
        value: "GEOGRAPHY",
      },
      {
        textContent: "HISTORY (4)",
        value: "HISTORY",
      },
      {
        textContent: "INTERNATIONAL (4)",
        value: "INTERNATIONAL",
      },
      {
        textContent: "SCIENCE (5)",
        value: "SCIENCE",
      },
      {
        textContent: "SPORTS (6)",
        value: "SPORTS",
      },
    ]);
    expect(getCollectionFilters(pagefindFilters, "resources_tag")).toEqual([
      {
        textContent: "GEOGRAPHY (1)",
        value: "GEOGRAPHY",
      },
      {
        textContent: "HISTORY (3)",
        value: "HISTORY",
      },
      {
        textContent: "INTERNATIONAL (1)",
        value: "INTERNATIONAL",
      },
      {
        textContent: "SCIENCE (1)",
        value: "SCIENCE",
      },
      {
        textContent: "SPORTS (3)",
        value: "SPORTS",
      },
    ]);
    expect(getCollectionFilters(pagefindFilters, "resources_year")).toEqual([]);
  });
});

describe("Filters Select Utility, getFiltersFromQueryParams", () => {
  it("should extract filters from the url", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        search: "?tag=GEOGRAPHY&year=2025",
      },
    });

    const selectedFilters = getFiltersFromQueryParams(window);
    expect(selectedFilters.size).toEqual(2);
    expect(selectedFilters.get("tag")).toEqual("GEOGRAPHY");
    expect(selectedFilters.get("year")).toEqual("2025");
  });

  it("should not extract filters from the url when there is none", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        search: "",
      },
    });

    const selectedFilters = getFiltersFromQueryParams(window);
    expect(selectedFilters.size).toEqual(0);
  });
});

describe("Filters Select Utility, sortFilterOptions", () => {
  it("should sort filter options alphabetically and numerically", () => {
    const dataset = null;
    const options = [{ value: "Option 1" }, { value: "2025" }, { value: "1" }];
    sortFilterOptions(options);
    expect(options).toEqual([
      {
        value: "2025",
      },
      {
        value: "1",
      },
      {
        value: "Option 1",
      },
    ]);
  });
});

describe("Filters Select Utility, getSearchOptionsFromSelectFilters", () => {
  it("should get search options from filters values", () => {
    const filtersMap = new Map([
      [
        "tag",
        {
          filterName: "tag",
          pagefindfilter: "events_tag",
          filterElement: {
            value: "GEOGRAPHY",
          },
          navElement: {},
        },
      ],
      [
        "year",
        {
          filterName: "year",
          pagefindfilter: "events_year",
          filterElement: {
            value: "2025",
          },
          navElement: {},
        },
      ],
    ]);

    const searchOptions = getSearchOptionsFromSelectFilters(filtersMap);
    expect(searchOptions).toEqual({
      filters: {
        events_tag: "GEOGRAPHY",
        events_year: "2025",
      },
    });
  });
});

describe("Filters Select Utility, getSearchOptionsFromQuery", () => {
  it("should build search options from query parameters", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        search: "?tag=GEOGRAPHY&year=2025",
      },
    });

    const searchOptions = getSearchOptionsFromQuery(
      "events",
      getFiltersFromQueryParams(window),
    );
    expect(searchOptions).toEqual({
      filters: {
        events_tag: "GEOGRAPHY",
        events_year: "2025",
      },
    });
  });
});

describe("Filters Select Utility, getFiltersSelection", () => {
  let inputElementTag;
  let inputElementYear;

  beforeEach(async () => {
    document.body.replaceChildren();
    document.body.innerHTML = "";
    vi.clearAllMocks();

    inputElementTag = document.createElement("input");
    inputElementTag.value = "GEOGRAPHY";
    inputElementYear = document.createElement("input");
    inputElementYear = "2025";

    vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === "tag") {
        return inputElementTag;
      }
      if (id === "year") {
        return inputElementYear;
      }
      return null;
    });
  });

  it("should get selected vales from all filters", () => {
    const filtersMap = new Map([
      [
        "tag",
        {
          filterName: "tag",
          pagefindfilter: "events_tag",
          filterElement: {
            value: "GEOGRAPHY",
          },
          navElement: {},
        },
      ],
      [
        "year",
        {
          filterName: "year",
          pagefindfilter: "events_year",
          filterElement: {
            value: "2025",
          },
          navElement: {},
        },
      ],
    ]);

    expect(getFiltersSelection(filtersMap)).toEqual([
      {
        filterName: "tag",
        selectedValue: "GEOGRAPHY",
      },
      {
        filterName: "year",
        selectedValue: "2025",
      },
    ]);
  });
});
