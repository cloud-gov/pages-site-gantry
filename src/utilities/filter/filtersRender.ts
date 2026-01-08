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

export function getFilterNavId(filterName: string) {
  return `${FILTER_NAV_ID_PREFIX}${filterName}`;
}

export function renderFilters(
  filtersMap: Map<string, FilterMapEntry>,
  filtersFromQueryParams: Map<string, string>,
  pagefindFilters: Map<string, {}>,
): boolean {
  let displayedFilters = false;

  filtersMap?.forEach((filterMapEntry) => {
    const { filterName, pagefindfilter } = filterMapEntry;

    const el: HTMLElement = getElementByName(filterName);
    const navEl: HTMLElement = document.getElementById(
      getFilterNavId(filterName),
    );

    if (el && navEl) {
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
    }
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
  let displayedFilter = false;
  if (targetElement instanceof HTMLSelectElement) {
    filterOptions?.forEach((filterOption) => {
      if (targetElement.options.length == 0) {
        const placeholder: HTMLOptionElement = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select ...";
        placeholder.disabled = true;
        placeholder.hidden = true;
        targetElement.add(placeholder);
      }
      const option: HTMLOptionElement = document.createElement("option");
      option.value = filterOption.value;
      option.textContent = filterOption.textContent;
      option.text = filterOption.textContent;
      option.disabled = false;
      option.hidden = false;
      targetElement.add(option);

      if (selectedValue && filterOption.value === selectedValue) {
        option.defaultSelected = true;
        const input = document.getElementById(filterName);
        if (input) {
          (input as HTMLInputElement).value = option.textContent;
          const parentNode = input.parentElement;
          parentNode?.classList.add("usa-combo-box--pristine");
        }
      }
    });
  }

  if (filterOptions?.length > 0) {
    navElement.hidden = false;
    displayedFilter = true;
  }

  return displayedFilter;
}

export function getPageResults(results: any[], filtersData: FiltersData) {
  const page = Number(filtersData.currentPage);
  const size = Number(filtersData.pageSize);

  const start = (page - 1) * size;
  const end = start + size;

  return results.slice(start, end);
}

export async function renderResults(
  results: any,
  collectionList: ElementsPair,
  pagination: ElementsPair,
  filtersData: FiltersData,
) {
  if (!results || results.length === 0) {
    hideBoth(collectionList);
    hideBoth(pagination);
    return;
  }

  const filteredResultsFragment = await getFilteredResultFragment(
    getPageResults(results, filtersData),
  );
  if (filteredResultsFragment) {
    displayFiltered(collectionList, filteredResultsFragment);
  }

  const paginationFragment = getFilteredPaginationFragment(
    results?.length,
    filtersData.currentPage,
    filtersData.pageSize,
  );
  if (paginationFragment && paginationFragment.children?.length > 0) {
    displayFiltered(pagination, paginationFragment);
  } else {
    hideBoth(pagination);
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
  return link.href;
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
