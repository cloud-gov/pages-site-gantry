import { describe, expect, it, vi } from "vitest";

import {
  getCollectionFilters,
  getElementFiltersData,
  getFiltersDataAttributes,
  getFiltersSlugMetaData,
  getSearchOptions,
  getFiltersFromQueryParams,
  sortFilterOptions,
  buildSearchOptions,
  displayFilters,
  getFilterNavId,
  getFiltersSelection,
} from "@/utilities/filters";
import type { FilterConfig, FilteredPageConfig, FilterMapEntry } from "@/env";
import {
  FILTERS_CONFIG,
  UNSPECIFIED_FILTER_VALUE,
} from "@/utilities/filtersConfig";

describe("Filters Utility, getFiltersSlugMetaData", () => {
  it("creates filters metadata for a slug", () => {
    let collectionName: string;
    let collectionItem: { tags: { label: string }[]; yearTag: string | number };
    let slug: string;

    collectionName = "events";
    collectionItem = { tags: [], yearTag: null };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      filters: [
        {
          attributeValue: "events_year[content]",
          content: UNSPECIFIED_FILTER_VALUE,
        },
      ],
    });

    collectionName = "events";
    collectionItem = { tags: [], yearTag: "2025" };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      filters: [
        {
          attributeValue: "events_year[content]",
          content: "2025",
        },
      ],
    });

    collectionName = "events";
    collectionItem = { tags: [{ label: "GEOGRAPHY" }], yearTag: "2025" };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      filters: [
        {
          attributeValue: "events_tag[content]",
          content: "GEOGRAPHY",
        },
        {
          attributeValue: "events_year[content]",
          content: "2025",
        },
      ],
    });

    collectionName = "events";
    collectionItem = {
      tags: [{ label: "GEOGRAPHY" }, { label: "HISTORY" }],
      yearTag: "2025",
    };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      filters: [
        {
          attributeValue: "events_tag[content]",
          content: "GEOGRAPHY",
        },
        {
          attributeValue: "events_tag[content]",
          content: "HISTORY",
        },
        {
          attributeValue: "events_year[content]",
          content: "2025",
        },
      ],
    });
  });

  it("does not throw an error when creates filters metadata for a slug", () => {
    let collectionName: string;
    let collectionItem: { tags: { label: string }[]; yearTag: string | number };
    let slug: string;

    collectionName = null;
    collectionItem = null;
    slug = null;
    expect(getFiltersSlugMetaData(collectionName, collectionItem, slug)).toBe(
      null,
    );
  });
});

describe("Filters Utility, getFiltersDataAttributes", () => {
  it("creates filters metadata for a page with filters", () => {
    let filtersConfig: FilterConfig[];
    let filteredPageConfig: FilteredPageConfig;
    let baseUrl;

    filtersConfig = [];
    filteredPageConfig = {};
    baseUrl = null;
    expect(
      getFiltersDataAttributes(filtersConfig, filteredPageConfig, baseUrl),
    ).toEqual({
      "data-baseurl": null,
      "data-currentpagenum": "1",
      "data-pagesize": "10",
    });

    filtersConfig = FILTERS_CONFIG;
    filteredPageConfig = {
      collectionName: "events",
      pageSize: 10,
      currentPageNum: 2,
    };
    baseUrl = "/";
    expect(
      getFiltersDataAttributes(filtersConfig, filteredPageConfig, baseUrl),
    ).toEqual({
      "data-collectionname": "events",
      "data-baseurl": "/",
      "data-currentpagenum": "2",
      // "data-filtertag": "tag",
      // "data-filteryear": "year",
      "data-pagefindfiltertag": "events_tag",
      "data-pagefindfilteryear": "events_year",
      "data-pagesize": "10",
    });
  });

  it("does not throw an error when creates filters metadata for a page with filters", () => {
    let filtersConfig: FilterConfig[] = null;
    let filteredPageConfig: FilteredPageConfig = null;
    let baseUrl = null;
    expect(
      getFiltersDataAttributes(filtersConfig, filteredPageConfig, baseUrl),
    ).toEqual(null);
  });
});

describe("Filters Utility, getElementFiltersData", () => {
  it("doesnt throw an error when there is no dataset", () => {
    const dataset = null;
    expect(getElementFiltersData(dataset)).toBe(null);
  });

  it("creates filters metadata for a page with filters", () => {
    const dataset = {
      collectionname: "events",
      pagefindfiltertag: "news_tag",
      filtertag: "tag",
      pagefindfilteryear: "news_year",
      filteryear: "year",
      pagesize: "2",
      currentpagenum: "1",
      baseurl: "/",
    };

    expect(getElementFiltersData(dataset)).toEqual({
      baseUrl: "/",
      collectionName: "events",
      currentPageNum: "1",
      filtersMap: new Map([
        [
          "tag",
          {
            filterName: "tag",
            pagefindfilter: "news_tag",
          },
        ],
        [
          "year",
          {
            filterName: "year",
            pagefindfilter: "news_year",
          },
        ],
      ]),
      pageSize: "2",
    });
  });
});

describe("Filters Utility, getFiltersFromQueryParams", () => {
  it("extracts filters from url", () => {
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

  it("does not extracts filters from url when there is none", () => {
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

describe("Filters Utility, extractCollectionFilters", () => {
  it("extracts filters from url", () => {
    const pagefindFilters = {
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

describe("Filters Utility, sortFilterOptions", () => {
  it("sorts filter options alphabetically and numerically", () => {
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

describe("Filters Utility, getSearchOptions", () => {
  it("gets search options from filters values", () => {
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

    const searchOptions = getSearchOptions(filtersMap);
    expect(searchOptions).toEqual({
      filters: {
        events_tag: "GEOGRAPHY",
        events_year: "2025",
      },
    });
  });
});

describe("Filters Utility, buildSearchOptions", () => {
  it("builds search options for filters from query parameters", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        search: "?tag=GEOGRAPHY&year=2025",
      },
    });

    const searchOptions = buildSearchOptions(
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

describe("Filters Utility, buildSearchOptions", () => {
  it("builds search options for filters from query parameters", () => {
    const filterElementTag = document.createElement("select");
    filterElementTag.id = "tag";
    const navElementTag = document.createElement("span");
    navElementTag.hidden = true;
    const filterElementYear = document.createElement("select");
    filterElementYear.id = "year";
    const navElementYear = document.createElement("span");
    navElementYear.hidden = true;

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

    const filtersFromQueryParams = new Map([
      ["tag", "GEOGRAPHY"],
      ["year", "2025"],
    ]);

    const pagefindFilters = {
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
        GEOGRAPHY: 1,
        HISTORY: 3,
        INTERNATIONAL: 1,
        SCIENCE: 1,
        SPORTS: 3,
      },
      resources_year: {
        Unspecified: 5,
      },
    };

    vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === getFilterNavId("tag")) {
        return navElementTag;
      }
      if (id === getFilterNavId("year")) {
        return navElementYear;
      }
      return null;
    });

    vi.spyOn(document, "getElementsByName").mockImplementation((name) => {
      if (name === "tag") {
        return [filterElementTag];
      }
      if (name === "year") {
        return [filterElementYear];
      }
      return null;
    });

    const result = displayFilters(
      filtersMap,
      filtersFromQueryParams,
      pagefindFilters,
    );
    expect(result).toEqual(true);
    expect(navElementYear.hidden).toEqual(false);
    expect(navElementTag.hidden).toEqual(false);

    const tagOptions = filterElementTag.options;
    expect(tagOptions.length).toEqual(2);
    expect(tagOptions[0].disabled).toEqual(true);
    expect(tagOptions[0].hidden).toEqual(true);
    expect(tagOptions[0].value).toEqual("");
    expect(tagOptions[0].text).toEqual("Select ...");
    expect(tagOptions[0].textContent).toEqual("Select ...");

    expect(tagOptions[1].disabled).toEqual(false);
    expect(tagOptions[1].hidden).toEqual(false);
    expect(tagOptions[1].value).toEqual("GEOGRAPHY");
    expect(tagOptions[1].text).toEqual("GEOGRAPHY (1)");
    expect(tagOptions[1].textContent).toEqual("GEOGRAPHY (1)");

    const yearOptions = filterElementYear.options;
    expect(yearOptions.length).toEqual(3);
    expect(yearOptions[0].disabled).toEqual(true);
    expect(yearOptions[0].hidden).toEqual(true);
    expect(yearOptions[0].value).toEqual("");
    expect(yearOptions[0].text).toEqual("Select ...");
    expect(yearOptions[0].textContent).toEqual("Select ...");

    expect(yearOptions[1].disabled).toEqual(false);
    expect(yearOptions[1].hidden).toEqual(false);
    expect(yearOptions[1].value).toEqual("2025");
    expect(yearOptions[1].text).toEqual("2025 (1)");
    expect(yearOptions[1].textContent).toEqual("2025 (1)");

    expect(yearOptions[2].disabled).toEqual(false);
    expect(yearOptions[2].hidden).toEqual(false);
    expect(yearOptions[2].value).toEqual("2023");
    expect(yearOptions[2].text).toEqual("2023 (1)");
    expect(yearOptions[2].textContent).toEqual("2023 (1)");
  });
});

describe("Filters Utility, getFiltersSelection", () => {
  it("gets current selection in all filters", () => {
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

    expect(getFiltersSelection(filtersMap)).toEqual([]);
  });
});
