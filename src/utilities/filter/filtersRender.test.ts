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
  renderActiveFilters,
} from "@/utilities/filter/filtersRender";
import * as searchModule from "@/utilities/filter/filtersSearch";
import * as paginationModule from "@/utilities/filter/filtersPagination";
import type { ElementsPair, FiltersData } from "@/env.d";
import * as filtersUtilsModule from "@/utilities/filter/filtersUtils";

/* ------------------------------------------------------------------ */
/* Shared test utilities */
/* ------------------------------------------------------------------ */

function createFilterContainer(name: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "filter-options";
  el.dataset.filterName = name;
  return el;
}

function createElementsPair(): ElementsPair {
  const original = document.createElement("div");
  const filtered = document.createElement("div");
  original.style.display = "something";
  filtered.style.display = "something";
  filtered.appendChild(document.createElement("span"));
  return { original, filtered };
}

function fragmentWithChildren(count = 1): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    frag.appendChild(document.createElement("div"));
  }
  return frag;
}

function createActiveFiltersContainer(): HTMLElement {
  const el = document.createElement("div");
  el.id = "active-filters";
  document.body.appendChild(el);
  return el;
}

function createCheckedCheckbox(name: string, value: string): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = name;
  input.value = value;
  input.checked = true;
  document.body.appendChild(input);
  return input;
}

/* ------------------------------------------------------------------ */
/* renderFilters */
/* ------------------------------------------------------------------ */

describe("Filters Render Utility, renderFilters", () => {
  let filterElementTag: HTMLElement;
  let filterElementYear: HTMLElement;
  let navElementTag: HTMLElement;
  let navElementYear: HTMLElement;

  const filtersMap = new Map([
    [
      "tag",
      {
        filterName: "tag",
        pagefindfilter: "events_tag",
        filterElement: null,
        navElement: null,
      },
    ],
    [
      "year",
      {
        filterName: "year",
        pagefindfilter: "events_year",
        filterElement: null,
        navElement: null,
      },
    ],
  ]);

  const pagefindFilters = {
    events_tag: { GEOGRAPHY: 1 },
    events_year: { "2025": 1, "2023": 1 },
  };

  beforeEach(() => {
    document.body.replaceChildren();
    vi.clearAllMocks();

    filterElementTag = createFilterContainer("tag");
    filterElementYear = createFilterContainer("year");
    document.body.append(filterElementTag, filterElementYear);

    navElementTag = document.createElement("nav");
    navElementYear = document.createElement("nav");
    navElementTag.hidden = true;
    navElementYear.hidden = true;

    vi.spyOn(document, "querySelector").mockImplementation((selector) => {
      if (selector === '.filter-options[data-filter-name="tag"]') {
        return filterElementTag;
      }
      if (selector === '.filter-options[data-filter-name="year"]') {
        return filterElementYear;
      }
      return null;
    });

    vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === getFilterNavId("tag")) return navElementTag;
      if (id === getFilterNavId("year")) return navElementYear;
      return null;
    });
  });

  it("should display filters", () => {
    const result = renderFilters(filtersMap, new Map(), pagefindFilters);
    expect(result).toBe(true);
    expect(navElementTag.hidden).toBe(false);
    expect(navElementYear.hidden).toBe(false);
  });

  it("should not display filters without filtersMap", () => {
    const result = renderFilters(null as any, new Map(), pagefindFilters);
    expect(result).toBe(false);
  });

  it("should not display filters without pagefindFilters", () => {
    const result = renderFilters(filtersMap, new Map(), null as any);
    expect(result).toBe(false);
  });

  it("should render checkbox options", () => {
    renderFilters(filtersMap, new Map(), pagefindFilters);

    const tagCheckboxes = filterElementTag.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(tagCheckboxes.length).toBe(1);
    expect(tagCheckboxes[0].value).toBe("GEOGRAPHY");
    expect(tagCheckboxes[0].checked).toBe(false);
  });

  it("should apply default selections from query params", () => {
    const query = new Map([["tag", "GEOGRAPHY"]]);
    renderFilters(filtersMap, query, pagefindFilters);

    const tagCheckbox =
      filterElementTag.querySelector<HTMLInputElement>("input");

    expect(tagCheckbox?.checked).toBe(true);
  });
});

describe("Filters Render Utility, renderActiveFilters", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  it("clears pills when filtersSelections is null", () => {
    const container = createActiveFiltersContainer();
    container.appendChild(document.createElement("button"));

    renderActiveFilters(null as any);

    expect(container.children.length).toBe(0);
  });

  it("renders pills for each selected filter value", () => {
    const container = createActiveFiltersContainer();

    const selections = new Map([
      ["tag", { filterName: "tag", selectedValue: "HISTORY,SCIENCE" }],
      ["year", { filterName: "year", selectedValue: "2025" }],
    ]);

    renderActiveFilters(selections);

    const pills = container.querySelectorAll("button.filter-pill");
    expect(pills.length).toBe(3);

    expect(pills[0].textContent).toContain("HISTORY");
    expect(pills[1].textContent).toContain("SCIENCE");
    expect(pills[2].textContent).toContain("2025");
  });

  it("clears pills when selections map is empty", () => {
    const container = createActiveFiltersContainer();

    renderActiveFilters(new Map());

    expect(container.children.length).toBe(0);
  });

  it("unchecks checkbox and dispatches change event when pill is clicked", () => {
    const container = createActiveFiltersContainer();
    const checkbox = createCheckedCheckbox("tag", "HISTORY");

    const changeSpy = vi.fn();
    checkbox.addEventListener("change", changeSpy);

    const selections = new Map([
      ["tag", { filterName: "tag", selectedValue: "HISTORY" }],
    ]);

    renderActiveFilters(selections);

    const pill = container.querySelector("button") as HTMLButtonElement;
    pill.click();

    expect(checkbox.checked).toBe(false);
    expect(changeSpy).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/* getPageResults */
/* ------------------------------------------------------------------ */

describe("Filters Render Utility, getPageResults", () => {
  it("returns items for the current page", () => {
    const results = [1, 2, 3, 4, 5];
    const filtersData = {
      currentPage: "2",
      pageSize: "2",
    } as FiltersData;

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

/* ------------------------------------------------------------------ */
/* renderResults */
/* ------------------------------------------------------------------ */

describe("Filters Render Utility, renderResults", () => {
  beforeEach(() => {
    document.body.innerHTML = '<p id="pagination-status"></p>';
    vi.clearAllMocks();
  });

  it("hides collection and pagination when results are empty", () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();

    renderResults([], collection, pagination, {} as any);

    expect(collection.original.style.display).toBe("none");
    expect(collection.filtered.style.display).toBe("none");
    expect(pagination.original.style.display).toBe("none");
  });

  it("renders filtered collection and pagination when results exist", async () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();
    const results = [{ id: 1 }];
    const filtersData = { currentPage: 1, pageSize: 10 } as any;

    vi.spyOn(searchModule, "getFilteredResultFragment").mockResolvedValue(
      fragmentWithChildren(2),
    );
    vi.spyOn(paginationModule, "getFilteredPaginationFragment").mockReturnValue(
      fragmentWithChildren(3),
    );

    await renderResults(results, collection, pagination, filtersData);

    expect(collection.filtered.childNodes.length).toBe(2);
    expect(pagination.filtered.childNodes.length).toBe(3);
  });
});

/* ------------------------------------------------------------------ */
/* display utilities */
/* ------------------------------------------------------------------ */

describe("Filters Render Utility, displayOriginals", () => {
  it("restores original list and hides filtered", () => {
    const collection = createElementsPair();
    const pagination = createElementsPair();

    displayOriginals(collection, pagination);

    expect(collection.original.style.display).toBe("");
    expect(collection.filtered.style.display).toBe("none");
  });
});

describe("Filters Render Utility, displayFiltered", () => {
  it("displays filtered and hides original", () => {
    const collection = createElementsPair();
    const fragment = fragmentWithChildren(5);

    displayFiltered(collection, fragment);

    expect(collection.original.style.display).toBe("none");
    expect(collection.filtered.childNodes.length).toBe(5);
  });
});

describe("Filters Render Utility, hideBoth", () => {
  it("hides original and filtered", () => {
    const collection = createElementsPair();

    hideBoth(collection);

    expect(collection.original?.style.display).toBe("none");
    expect(collection.filtered?.style.display).toBe("none");
  });
});

/* ------------------------------------------------------------------ */
/* navigateToTheFirstPage */
/* ------------------------------------------------------------------ */

describe("Filters Render Utility, navigateToTheFirstPage", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
    (window as any).location = { href: "" };
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("sets window.location.href when url is provided", () => {
    const url = "https://example.com/page";
    const selections = new Map();

    vi.spyOn(filtersUtilsModule, "appendQuery").mockReturnValue(
      new URL("https://example.com/page?foo=bar"),
    );

    navigateToTheFirstPage(url, selections);

    expect(window.location.href).toBe("https://example.com/page?foo=bar");
  });

  it("does nothing when url is empty", () => {
    navigateToTheFirstPage("", new Map());
    expect(window.location.href).toBe("");
  });
});
