import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCollectionFilters,
  getFiltersFromQueryParams,
  getFiltersSelections,
  getSearchOptionsFromQuery,
  getSearchOptionsFromSelectedFilters,
  sortFilterOptions,
  updateHistoryStateForWindow,
} from "@/utilities/filter/filtersSelect";
import type { FilterSelection } from "@/env";

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

    const filtersSelections: Map<string, FilterSelection> = new Map();
    filtersSelections.set("tag", {
      filterName: "tag",
      selectedValue: "TRANSPORT",
    });
    const searchOptions = getSearchOptionsFromSelectedFilters(
      filtersMap,
      filtersSelections,
    );
    expect(searchOptions).toEqual({
      filters: {
        events_tag: "TRANSPORT",
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

describe("Filters Select Utility, getFiltersSelections", () => {
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

  it("should get selected values from all filters", () => {
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

    expect(
      JSON.stringify(Object.fromEntries(getFiltersSelections(filtersMap))),
    ).toEqual(
      '{"tag":{"filterName":"tag","selectedValue":"GEOGRAPHY"},"year":{"filterName":"year","selectedValue":"2025"}}',
    );
  });

  it("should get the selected value from event when present", () => {
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

    const e: CustomEvent<any> = { target: { name: "year", value: "" } };
    expect(
      JSON.stringify(Object.fromEntries(getFiltersSelections(filtersMap, e))),
    ).toEqual('{"tag":{"filterName":"tag","selectedValue":"GEOGRAPHY"}}');
  });

  it("should return null when there are no selections", () => {
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
            value: "",
          },
          navElement: {},
        },
      ],
    ]);

    const e: CustomEvent<any> = { target: { name: "tag", value: "" } };
    expect(getFiltersSelections(filtersMap, e)).toEqual(null);
  });
});

describe("Filters Select Utility, updateHistoryState", () => {
  let mockWindow;
  let mockReplaceState;

  beforeEach(() => {
    mockReplaceState = vi.fn();
    mockWindow = {
      location: {
        href: "http://localhost:3000/news?tag=GEOGRAPHY&year=2024",
      },
      history: {
        replaceState: mockReplaceState,
      },
    } as unknown as Window;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates URL search params and calls replaceState", () => {
    const filters = new Map<string, FilterSelection>([
      ["tag", { filterName: "tag", selectedValue: "HISTORY" }],
      ["year", { filterName: "year", selectedValue: "2025" }],
    ]);

    updateHistoryStateForWindow(filters, mockWindow);

    expect((mockReplaceState.mock.calls[0][2] as URL).toString()).toBe(
      "http://localhost:3000/news?tag=HISTORY&year=2025",
    );
  });

  it("removes params when filter has no selectedValue", () => {
    updateHistoryStateForWindow(
      new Map<string, FilterSelection>([
        ["tag", { filterName: "tag", selectedValue: "" }],
        ["year", { filterName: "year", selectedValue: "2026" }],
      ]),
      mockWindow,
    );
    expect((mockReplaceState.mock.calls[0][2] as URL).toString()).toBe(
      "http://localhost:3000/news?year=2026",
    );
  });

  it("removes params when there is no filters entry in the map", () => {
    updateHistoryStateForWindow(
      new Map<string, FilterSelection>([
        ["year", { filterName: "year", selectedValue: "2026" }],
      ]),
      mockWindow,
    );
    expect((mockReplaceState.mock.calls[0][2] as URL).toString()).toBe(
      "http://localhost:3000/news?year=2026",
    );
  });

  it("handles empty filters map", () => {
    updateHistoryStateForWindow(new Map<string, FilterSelection>(), mockWindow);
    expect((mockReplaceState.mock.calls[0][2] as URL).toString()).toBe(
      "http://localhost:3000/news",
    );
  });

  it("handles null filters map", () => {
    updateHistoryStateForWindow(null, mockWindow);
    expect((mockReplaceState.mock.calls[0][2] as URL).toString()).toBe(
      "http://localhost:3000/news",
    );
  });
});
