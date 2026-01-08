import { describe, expect, it } from "vitest";

import {
  getFiltersDataAttributes,
  getFiltersSlugMetaData,
} from "@/utilities/filter";
import type { FilterConfig, FilteredPageConfig } from "@/env";
import {
  FILTERS_CONFIG,
  UNSPECIFIED_FILTER_VALUE,
} from "@/utilities/filter/filtersConfig";
import { getElementFiltersData } from "@/utilities/filter/filtersData";

describe("Filters Utility, getFiltersSlugMetaData", () => {
  it("creates filters metadata for a slug", () => {
    let collectionName: string;
    let collectionItem: {
      tags: { label: string }[];
      yearTag: string | number;
      sortField: string;
    };
    let slug: string;

    collectionName = "events";
    collectionItem = { tags: [], yearTag: null, sortField: "2025" };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      sortField: "2025",
      filters: [
        {
          attributeValue: "events_year[content]",
          content: UNSPECIFIED_FILTER_VALUE,
        },
      ],
    });

    collectionName = "events";
    collectionItem = { tags: [], yearTag: "2025", sortField: "2025" };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      sortField: "2025",
      filters: [
        {
          attributeValue: "events_year[content]",
          content: "2025",
        },
      ],
    });

    collectionName = "events";
    collectionItem = {
      tags: [{ label: "GEOGRAPHY" }],
      yearTag: "2025",
      sortField: "2025",
    };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      sortField: "2025",
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
      sortField: "2025",
    };
    slug = "virtual-qa-session-unlocking-industry-insights";
    expect(
      getFiltersSlugMetaData(collectionName, collectionItem, slug),
    ).toEqual({
      collectionItemId: "events-virtual-qa-session-unlocking-industry-insights",
      sortField: "2025",
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
      "data-currentpage": "1",
      "data-pagesize": "10",
    });

    filtersConfig = FILTERS_CONFIG;
    filteredPageConfig = {
      collectionName: "events",
      pageSize: 10,
      currentPage: 2,
    };
    baseUrl = "/";
    expect(
      getFiltersDataAttributes(filtersConfig, filteredPageConfig, baseUrl),
    ).toEqual({
      "data-collectionname": "events",
      "data-baseurl": "/",
      "data-currentpage": "2",
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
      currentpage: "1",
      baseurl: "/",
    };

    expect(getElementFiltersData(dataset)).toEqual({
      baseUrl: "/",
      collectionName: "events",
      currentPage: "1",
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
