import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  displayFiltered,
  displayOriginals,
  getFilterNavId,
  getPageResults,
  hideBoth,
  renderFilters,
  renderResults,
  resetFilteredPage,
} from "@/utilities/filter/filtersRender.ts";
import * as searchModule from "@/utilities/filter/filtersSearch";
import * as paginationModule from "@/utilities/filter/filtersPagination";
import type { ElementsPair, FiltersData } from "@/env";
import { PAGINATION_LINK_ID_FIST_PAGE } from "@/utilities/filter/filtersConfig.ts";

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
describe("Filters Render Utility, renderFilters", () => {
  let filterElementTag;
  let navElementTag;
  let inputElementTag;
  let filterElementYear;
  let navElementYear;
  let inputElementYear;

  beforeEach(async () => {
    document.body.replaceChildren();
    document.body.innerHTML = "";
    vi.clearAllMocks();

    filterElementTag = document.createElement("select");
    filterElementTag.selectedIndex = -1;
    filterElementTag.id = "tag";
    navElementTag = document.createElement("nav");
    navElementTag.hidden = true;
    inputElementTag = document.createElement("input");

    filterElementYear = document.createElement("select");
    filterElementYear.selectedIndex = -1;
    filterElementYear.id = "year";
    navElementYear = document.createElement("nav");
    navElementYear.hidden = true;
    inputElementYear = document.createElement("input");

    vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === getFilterNavId("tag")) {
        return navElementTag;
      }
      if (id === getFilterNavId("year")) {
        return navElementYear;
      }
      if (id === "tag") {
        return inputElementTag;
      }
      if (id === "year") {
        return inputElementYear;
      }
      return null;
    });

    vi.spyOn(document, "getElementsByName").mockImplementation((name) => {
      if (name === "tag") {
        return [filterElementTag] as unknown as NodeListOf<HTMLElement>;
      }
      if (name === "year") {
        return [filterElementYear] as unknown as NodeListOf<HTMLElement>;
      }
      return null;
    });
  });

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

  it("should display filters with selections from the query", () => {
    let result = renderFilters(filtersMap, filtersFromQueryParams, null);
    expect(result).toEqual(false);
    expect(navElementYear.hidden).toEqual(true);
    expect(navElementTag.hidden).toEqual(true);

    result = renderFilters(null, filtersFromQueryParams, pagefindFilters);
    expect(result).toEqual(false);
    expect(navElementYear.hidden).toEqual(true);
    expect(navElementTag.hidden).toEqual(true);
  });

  it("should display filters without default selections", () => {
    const result = renderFilters(filtersMap, null, pagefindFilters);
    expect(result).toEqual(true);
    expect(navElementYear.hidden).toEqual(false);
    expect(navElementTag.hidden).toEqual(false);

    const tagOptions = filterElementTag.options;
    expect(tagOptions.length).toEqual(2);
    expect(inputElementTag.value).toEqual("");

    expect(tagOptions[0].disabled).toEqual(true);
    expect(tagOptions[0].hidden).toEqual(true);
    expect(tagOptions[0].value).toEqual("");
    expect(tagOptions[0].text).toEqual("Select ...");
    expect(tagOptions[0].textContent).toEqual("Select ...");
    expect(tagOptions[0].defaultSelected).not.toEqual(true);

    expect(tagOptions[1].disabled).toEqual(false);
    expect(tagOptions[1].hidden).toEqual(false);
    expect(tagOptions[1].value).toEqual("GEOGRAPHY");
    expect(tagOptions[1].text).toEqual("GEOGRAPHY (1)");
    expect(tagOptions[1].textContent).toEqual("GEOGRAPHY (1)");
    expect(tagOptions[1].defaultSelected).not.toEqual(true);

    const yearOptions = filterElementYear.options;
    expect(yearOptions.length).toEqual(3);
    expect(inputElementYear.value).toEqual("");

    expect(yearOptions[0].disabled).toEqual(true);
    expect(yearOptions[0].hidden).toEqual(true);
    expect(yearOptions[0].value).toEqual("");
    expect(yearOptions[0].text).toEqual("Select ...");
    expect(yearOptions[0].textContent).toEqual("Select ...");
    expect(yearOptions[0].defaultSelected).not.toEqual(true);

    expect(yearOptions[1].disabled).toEqual(false);
    expect(yearOptions[1].hidden).toEqual(false);
    expect(yearOptions[1].value).toEqual("2025");
    expect(yearOptions[1].text).toEqual("2025 (1)");
    expect(yearOptions[1].textContent).toEqual("2025 (1)");
    expect(tagOptions[1].defaultSelected).not.toEqual(true);

    expect(yearOptions[2].disabled).toEqual(false);
    expect(yearOptions[2].hidden).toEqual(false);
    expect(yearOptions[2].value).toEqual("2023");
    expect(yearOptions[2].text).toEqual("2023 (1)");
    expect(yearOptions[2].textContent).toEqual("2023 (1)");
    expect(yearOptions[2].defaultSelected).not.toEqual(true);
  });

  it("should not display filter without options", () => {
    const result = renderFilters(filtersMap, null, pagefindFilters);
    expect(result).toEqual(true);
    expect(navElementYear.hidden).toEqual(false);
    expect(navElementTag.hidden).toEqual(false);

    const tagOptions = filterElementTag.options;
    expect(tagOptions.length).toEqual(2);
    expect(inputElementTag.value).toEqual("");

    expect(tagOptions[0].disabled).toEqual(true);
    expect(tagOptions[0].hidden).toEqual(true);
    expect(tagOptions[0].value).toEqual("");
    expect(tagOptions[0].text).toEqual("Select ...");
    expect(tagOptions[0].textContent).toEqual("Select ...");
    expect(tagOptions[0].defaultSelected).not.toEqual(true);

    expect(tagOptions[1].disabled).toEqual(false);
    expect(tagOptions[1].hidden).toEqual(false);
    expect(tagOptions[1].value).toEqual("GEOGRAPHY");
    expect(tagOptions[1].text).toEqual("GEOGRAPHY (1)");
    expect(tagOptions[1].textContent).toEqual("GEOGRAPHY (1)");
    expect(tagOptions[1].defaultSelected).not.toEqual(true);

    const yearOptions = filterElementYear.options;
    expect(yearOptions.length).toEqual(3);
    expect(inputElementYear.value).toEqual("");

    expect(yearOptions[0].disabled).toEqual(true);
    expect(yearOptions[0].hidden).toEqual(true);
    expect(yearOptions[0].value).toEqual("");
    expect(yearOptions[0].text).toEqual("Select ...");
    expect(yearOptions[0].textContent).toEqual("Select ...");
    expect(yearOptions[0].defaultSelected).not.toEqual(true);

    expect(yearOptions[1].disabled).toEqual(false);
    expect(yearOptions[1].hidden).toEqual(false);
    expect(yearOptions[1].value).toEqual("2025");
    expect(yearOptions[1].text).toEqual("2025 (1)");
    expect(yearOptions[1].textContent).toEqual("2025 (1)");
    expect(tagOptions[1].defaultSelected).not.toEqual(true);

    expect(yearOptions[2].disabled).toEqual(false);
    expect(yearOptions[2].hidden).toEqual(false);
    expect(yearOptions[2].value).toEqual("2023");
    expect(yearOptions[2].text).toEqual("2023 (1)");
    expect(yearOptions[2].textContent).toEqual("2023 (1)");
    expect(yearOptions[2].defaultSelected).not.toEqual(true);
  });
});

describe("Filters Render Utility, getPageResults", () => {
  it("returns items for the current page", () => {
    const results = [1, 2, 3, 4, 5];
    const filtersData: FiltersData = {
      currentPage: "2",
      pageSize: "2",
      filtersMap: filtersMap,
      baseUrl: "/",
      collectionName: "news",
    };

    expect(
      getPageResults(results, { ...filtersData, currentPage: "1" }),
    ).toEqual([1, 2]);
    expect(
      getPageResults(results, { ...filtersData, currentPage: "2" }),
    ).toEqual([3, 4]);
    expect(
      getPageResults(results, { ...filtersData, currentPage: "3" }),
    ).toEqual([5]);
    expect(
      getPageResults(results, { ...filtersData, currentPage: "4" }),
    ).toEqual([]);
  });
});

function createElementsPair() {
  const original = document.createElement("div");
  const filtered = document.createElement("div");

  original.style.display = "something";
  filtered.style.display = "something";
  filtered.appendChild(document.createElement("span"));

  return { original, filtered };
}

function fragmentWithChildren(count = 1) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    frag.appendChild(document.createElement("div"));
  }
  return frag;
}

describe("Filters Render Utility, renderResults", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("hides collection and pagination when results are empty", () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();

    renderResults([], collection, pagination, {} as any);

    expect(collection.original.style.display).toBe("none");
    expect(collection.filtered.style.display).toBe("none");
    expect(collection.filtered.childNodes.length).toBe(0);

    expect(pagination.original.style.display).toBe("none");
    expect(pagination.filtered.style.display).toBe("none");
    expect(pagination.filtered.childNodes.length).toBe(0);
  });

  it("renders filtered collection and pagination when there are result and pagination fragments", async () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();

    const results = [{ id: 1 }];
    const filtersData = { currentPage: 1, pageSize: 10 } as any;

    vi.spyOn(searchModule, "getFilteredResultFragment").mockImplementation(
      () => {
        return Promise.resolve(fragmentWithChildren(2));
      },
    );
    vi.spyOn(
      paginationModule,
      "getFilteredPaginationFragment",
    ).mockImplementation(() => {
      return fragmentWithChildren(3);
    });

    renderResults(results, collection, pagination, filtersData);
    await Promise.resolve();

    expect(collection.original.style.display).toBe("none");
    expect(collection.filtered.style.display).toBe("");
    expect(collection.filtered.childNodes.length).toBe(2);

    expect(pagination.original.style.display).toBe("none");
    expect(pagination.filtered.style.display).toBe("");
    expect(pagination.filtered.childNodes.length).toBe(3);
  });

  it("hides pagination when pagination fragment is empty", async () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();

    const results = [{ id: 1 }];
    const filtersData = { currentPage: 1, pageSize: 10 } as any;

    vi.spyOn(searchModule, "getFilteredResultFragment").mockImplementation(
      () => {
        return Promise.resolve(fragmentWithChildren(1));
      },
    );
    vi.spyOn(
      paginationModule,
      "getFilteredPaginationFragment",
    ).mockResolvedValue(document.createDocumentFragment());

    renderResults(results, collection, pagination, filtersData);
    await Promise.resolve();

    expect(collection.original.style.display).toBe("none");
    expect(collection.filtered.style.display).toBe("");
    expect(collection.filtered.childNodes.length).toBe(1);

    expect(pagination.original.style.display).toBe("none");
    expect(pagination.filtered.style.display).toBe("none");
    expect(pagination.filtered.childNodes.length).toBe(0);
  });

  it("crashes when result fragment promise rejects", async () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();

    const results = [{ id: 1 }];
    const filtersData = { currentPage: 1, pageSize: 10 } as any;

    vi.spyOn(searchModule, "getFilteredResultFragment").mockRejectedValue(
      new Error("result fragment failed"),
    );
    vi.spyOn(
      paginationModule,
      "getFilteredPaginationFragment",
    ).mockResolvedValue(fragmentWithChildren(1));

    await expect(
      renderResults(results, collection, pagination, filtersData),
    ).rejects.toThrow("result fragment failed");
  });
});

describe("Filters Render Utility, displayOriginals", () => {
  it("displays original collection list and pagination and hides filtered", () => {
    const collectionList: ElementsPair = createElementsPair();
    const pagination: ElementsPair = createElementsPair();

    expect(collectionList.filtered.childNodes.length).toBe(1);

    displayOriginals(collectionList, pagination);

    expect(collectionList.original.style.display).toBe("");
    expect(collectionList.filtered.style.display).toBe("none");
    expect(collectionList.filtered.childNodes.length).toBe(0);
  });
});

describe("Filters Render Utility, displayOriginals", () => {
  it("displays original collection list and pagination and hides filtered", () => {
    const collectionList: ElementsPair = createElementsPair();
    const pagination: ElementsPair = createElementsPair();

    expect(collectionList.filtered.childNodes.length).toBe(1);

    displayOriginals(collectionList, pagination);

    expect(collectionList.original.style.display).toBe("");
    expect(collectionList.filtered.style.display).toBe("none");
    expect(collectionList.filtered.childNodes.length).toBe(0);
  });

  it("does not throw errors", () => {
    let collectionList: ElementsPair = null;
    let pagination: ElementsPair = null;
    displayOriginals(collectionList, pagination);

    collectionList = createElementsPair();
    collectionList.original = null;
    pagination = createElementsPair();
    pagination.filtered = null;
    displayOriginals(collectionList, pagination);
  });
});

describe("Filters Render Utility, displayFiltered", () => {
  it("displays filtered and hides original", () => {
    const collectionList: ElementsPair = createElementsPair();
    expect(collectionList.filtered.childNodes.length).toBe(1);

    const newFragment = fragmentWithChildren(10);
    displayFiltered(collectionList, newFragment);

    expect(collectionList.original.style.display).toBe("none");
    expect(collectionList.filtered.style.display).toBe("");
    expect(collectionList.filtered.childNodes.length).toBe(10);
  });

  it("can throw errors", () => {
    expect(() => displayFiltered(null, null)).toThrow("Cannot read");
  });
});

describe("Filters Render Utility, displayFiltered", () => {
  it("displays original collection list and pagination and hides filtered", () => {
    const collectionList: ElementsPair = createElementsPair();
    expect(collectionList.filtered.childNodes.length).toBe(1);

    hideBoth(collectionList);

    expect(collectionList.original.style.display).toBe("none");
    expect(collectionList.filtered.style.display).toBe("none");
    expect(collectionList.filtered.childNodes.length).toBe(0);
  });

  it("can throw errors", () => {
    expect(() => hideBoth(null)).toThrow("Cannot read");
  });
});

describe("Filters Render Utility, resetFilteredPage", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("clicks the first pagination link when it exists", () => {
    const el = document.createElement("a");
    el.id = PAGINATION_LINK_ID_FIST_PAGE;

    const clickSpy = vi.spyOn(el, "click");

    document.body.appendChild(el);

    resetFilteredPage();

    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it("does nothing when the element does not exist", () => {
    const getByIdSpy = vi.spyOn(document, "getElementById");

    expect(() => resetFilteredPage()).not.toThrow();
    expect(getByIdSpy).toHaveBeenCalledWith(PAGINATION_LINK_ID_FIST_PAGE);
  });
});
