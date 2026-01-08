import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  displayFiltered,
  displayOriginals,
  getFilterNavId,
  getPageResults,
  hideBoth,
  renderFilters,
  renderResults,
  navigateToTheFirstPage,
} from "@/utilities/filter/filtersRender";
import * as searchModule from "@/utilities/filter/filtersSearch";
import * as paginationModule from "@/utilities/filter/filtersPagination";
import type { ElementsPair, FiltersData } from "@/env";
import * as filtersUtilsModule from "@/utilities/filter/filtersUtils";

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

  it("should display filters", () => {
    const result = renderFilters(
      filtersMap,
      filtersFromQueryParams,
      pagefindFilters,
    );
    expect(result).toEqual(true);
    expect(navElementYear.hidden).toEqual(false);
    expect(navElementTag.hidden).toEqual(false);
  });

  it("should not display filters without filtersMap", () => {
    const result = renderFilters(null, filtersFromQueryParams, pagefindFilters);
    expect(result).toEqual(false);
    expect(navElementYear.hidden).toEqual(true);
    expect(navElementTag.hidden).toEqual(true);
  });

  it("should not display filters without pagefindFilters", () => {
    const result = renderFilters(filtersMap, filtersFromQueryParams, null);
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

  it("should display filters with default selections", () => {
    const result = renderFilters(
      filtersMap,
      filtersFromQueryParams,
      pagefindFilters,
    );
    expect(result).toEqual(true);
    expect(navElementYear.hidden).toEqual(false);
    expect(navElementTag.hidden).toEqual(false);

    const tagOptions = filterElementTag.options;
    expect(tagOptions.length).toEqual(2);
    expect(inputElementTag.value).toEqual("GEOGRAPHY (1)");

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
    expect(tagOptions[1].defaultSelected).toEqual(true);

    const yearOptions = filterElementYear.options;
    expect(yearOptions.length).toEqual(3);
    expect(inputElementYear.value).toEqual("2025 (1)");

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
    expect(tagOptions[1].defaultSelected).toEqual(true);

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

  it("does not throw errors", () => {
    expect(displayFiltered(null, null)).toBe(undefined);
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

  it("does not throw errors", () => {
    expect(hideBoth(null)).toBe(undefined);
  });
});

describe("Filters Render Utility, navigateToTheFirstPage", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = { href: "" } as Location;

    vi.clearAllMocks();
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("sets window.location.href when firstPageLinkUrl is provided", () => {
    const firstPageLinkUrl = "https://example.com/page";
    const filtersSelections = new Map();

    const mockedUrl = new URL("https://example.com/page?foo=bar");
    vi.spyOn(filtersUtilsModule, "appendQuery").mockReturnValue(mockedUrl);

    navigateToTheFirstPage(firstPageLinkUrl, filtersSelections);

    expect(filtersUtilsModule.appendQuery).toHaveBeenCalledWith(
      firstPageLinkUrl,
      filtersSelections,
    );
    expect(window.location.href).toBe(mockedUrl.toString());
  });

  it("does nothing when firstPageLinkUrl is empty", () => {
    const filtersSelections = new Map();

    const mockedUrl = new URL("https://example.com/page?foo=bar");
    vi.spyOn(filtersUtilsModule, "appendQuery").mockReturnValue(mockedUrl);

    navigateToTheFirstPage("", filtersSelections);

    expect(filtersUtilsModule.appendQuery).not.toHaveBeenCalled();
    expect(window.location.href).toBe("");
  });
});
