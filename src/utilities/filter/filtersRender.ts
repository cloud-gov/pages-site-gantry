import type {
  ElementsPair,
  FilterMapEntry,
  FilterOption,
  FiltersData,
  FilterSelection,
} from "@/env";
import { getCollectionFilters } from "@/utilities/filter/filtersSelect";
import { FILTER_NAV_ID_PREFIX } from "@/utilities/filter/filtersConfig";
import { getFilteredResultFragment } from "@/utilities/filter/filtersSearch";
import { getFilteredPaginationFragment } from "@/utilities/filter/filtersPagination";
import { getPaginationItemId } from "@/utilities/pagination";
import { appendQuery } from "@/utilities/filter/filtersUtils";

const ACTIVE_FILTERS_ID = "active-filters";
export function getFilterNavId(filterName: string) {
  return `${FILTER_NAV_ID_PREFIX}${filterName}`;
}

function getFilterContainer(filterName: string): HTMLElement | null {
  return document.querySelector(
    `.filter-options[data-filter-name="${filterName}"]`,
  );
}

export function renderFilters(
  filtersMap: Map<string, FilterMapEntry>,
  filtersFromQueryParams: Map<string, string>,
  pagefindFilters: Map<string, {}>,
): boolean {
  let displayedFilters = false;

  filtersMap?.forEach((filterMapEntry) => {
    const { filterName, pagefindfilter } = filterMapEntry;

    const el = getFilterContainer(filterName);
    const navEl = document.getElementById(getFilterNavId(filterName));

    if (!el || !navEl) return;

    filterMapEntry.filterElement = el;
    filterMapEntry.navElement = navEl;

    const displayedFilter = renderFilter(
      filterName,
      getCollectionFilters(pagefindFilters, pagefindfilter),
      el,
      navEl,
      filtersFromQueryParams?.get(filterName),
    );

    displayedFilters ||= displayedFilter;
  });

  return displayedFilters;
}

function renderFilter(
  filterName: string,
  filterOptions: FilterOption[],
  targetElement: HTMLElement,
  navElement: HTMLElement,
  selectedValue: string,
): boolean {
  if (!filterOptions || filterOptions.length === 0) {
    return false;
  }

  const selectedValues = selectedValue ? selectedValue.split(",") : [];

  // Reset checkbox container
  targetElement.replaceChildren();

  filterOptions.forEach((filterOption) => {
    const optionId = `filter-${filterName}-${filterOption.value.toLowerCase()}`;

    const wrapper = document.createElement("div");
    wrapper.className = "usa-checkbox";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "usa-checkbox__input";
    input.id = optionId;
    input.name = filterName;
    input.value = filterOption.value;

    if (selectedValues.includes(filterOption.value)) {
      input.checked = true;
    }

    const label = document.createElement("label");
    label.className = "usa-checkbox__label";
    label.htmlFor = optionId;
    label.textContent = filterOption.textContent;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    targetElement.appendChild(wrapper);
  });

  navElement.hidden = false;
  return true;
}

export function getPageResults(results: any[], filtersData: FiltersData) {
  const page = Number(filtersData.currentPage);
  const size = Number(filtersData.pageSize);

  const start = (page - 1) * size;
  const end = start + size;

  return results.slice(start, end);
}

export async function renderResults(
  results: any[],
  collectionList: ElementsPair,
  pagination: ElementsPair,
  filtersData: FiltersData,
) {
  // Handle zero results explicitly
  if (!results || results.length === 0) {
    hideBoth(collectionList);
    hideBoth(pagination);

    updatePaginationStatus(0, 0, filtersData.pageSize);

    return;
  }

  hideNoResultsMessage();

  const filteredResultsFragment = await getFilteredResultFragment(
    getPageResults(results, filtersData),
  );

  if (filteredResultsFragment) {
    displayFiltered(collectionList, filteredResultsFragment);

    updatePaginationStatus(
      results.length,
      filtersData.currentPage,
      filtersData.pageSize,
    );
  }

  const paginationFragment = getFilteredPaginationFragment(
    results.length,
    filtersData.currentPage,
    filtersData.pageSize,
  );

  if (paginationFragment && paginationFragment.children?.length > 0) {
    displayFiltered(pagination, paginationFragment);
  } else {
    hideBoth(pagination);
  }
}

function hideNoResultsMessage() {
  const el = document.getElementById("no-results-message");
  if (el) {
    el.style.display = "none";
  }
}

export function displayOriginals(
  collectionList: ElementsPair,
  pagination: ElementsPair,
) {
  displayOriginal(collectionList);
  displayOriginal(pagination);
}

function displayOriginal(elementsPair: ElementsPair) {
  elementsPair?.original && (elementsPair.original.style.display = "");
  if (elementsPair?.filtered) {
    elementsPair.filtered.style.display = "none";
    elementsPair.filtered.replaceChildren();
  }
}

export function displayFiltered(elementsPair: ElementsPair, fragment) {
  elementsPair?.original && (elementsPair.original.style.display = "none");
  if (elementsPair?.filtered) {
    elementsPair.filtered.style.display = "";
    elementsPair.filtered.replaceChildren(fragment);
  }
}

export function hideBoth(elementsPair: ElementsPair) {
  elementsPair?.original && (elementsPair.original.style.display = "none");
  if (elementsPair?.filtered) {
    elementsPair.filtered.style.display = "none";
    elementsPair.filtered.replaceChildren();
  }
}

export function updatePaginationStatus(
  resultSize: number,
  currentPage: number | string,
  pageSize: number | string,
) {
  // get element by id: pagination-status
  // assemble updated status text
  const statusEl = document.getElementById("pagination-status");
  if (!statusEl) return;

  const page = Number(currentPage);
  const size = Number(pageSize);
  const total = Number(resultSize);

  if (!total || total <= 0) {
    statusEl.innerHTML = `
      <span aria-hidden="true">No results found</span>
      <span class="usa-sr-only">No results found</span>
    `;
    return;
  }
  const resultsRangeStart = (page - 1) * size + 1;
  const resultsRangeEnd = Math.min(page * size, total);

  const resultsCountText = `Showing ${resultsRangeStart}-${resultsRangeEnd} of ${total} results`;
  const resultsCountTextSr = `Showing ${resultsRangeStart} to ${resultsRangeEnd} of ${total} results`;

  statusEl.innerHTML = `
    <span aria-hidden="true">${resultsCountText}</span>
    <span class="usa-sr-only">${resultsCountTextSr}</span>
  `;
}

export function renderActiveFilters(
  filtersSelections: Map<string, FilterSelection>,
) {
  const container = document.getElementById(ACTIVE_FILTERS_ID);
  if (!container) return;

  container.replaceChildren();

  if (!filtersSelections || filtersSelections.size === 0) {
    return;
  }

  filtersSelections.forEach(({ filterName, selectedValue }) => {
    if (!selectedValue) return;

    const values = selectedValue.split(",");

    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "usa-tag filter-pill";
      button.setAttribute("aria-label", `Remove ${value}`);

      button.innerHTML = `
        <span class="filter-pill__label">${value}</span>
        <span class="filter-pill__icon" aria-hidden="true"></span>
      `;

      button.addEventListener("click", () => {
        removeFilterValue(filterName, value);
      });

      container.appendChild(button);
    });
  });
}

function removeFilterValue(filterName: string, valueToRemove: string) {
  const checkbox = document.querySelector(
    `input[type="checkbox"][name="${filterName}"][value="${valueToRemove}"]`,
  ) as HTMLInputElement;

  if (!checkbox) return;

  checkbox.checked = false;

  // Trigger the same change event Pagefind listens to
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
}

function getElementByName(filter: string): HTMLElement {
  const targetElement: NodeListOf<HTMLElement> =
    document.getElementsByName(filter);
  let el: HTMLElement;
  if (targetElement instanceof HTMLElement) {
    el = targetElement;
  } else {
    el = targetElement?.[0];
  }
  return el;
}

export function getFirstPageLinkUrl() {
  const firstPageLinkId = getPaginationItemId({
    itemType: "page",
    pageId: 1,
    idType: "link",
  });
  const link = document.getElementById(firstPageLinkId);
  if (!link || link.tagName !== "A") {
    return null;
  }
  const linkHref = (link as HTMLAnchorElement).href;
  return linkHref;
}

export function navigateToTheFirstPage(
  firstPageLinkUrl: string,
  filtersSelections: Map<string, FilterSelection>,
) {
  if (!firstPageLinkUrl) {
    return;
  }
  const url = appendQuery(firstPageLinkUrl, filtersSelections);
  window.location.href = url.toString();
}
