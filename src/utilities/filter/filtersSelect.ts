import type {
  FilterConfig,
  FilterMapEntry,
  FilterOption,
  FilterSelection,
} from "@/env";
import {
  FILTERS_CONFIG,
  UNSPECIFIED_FILTER_VALUE,
} from "@/utilities/filter/filtersConfig";

export function getCollectionFilters(
  pagefindFilters: Map<string, any> | {},
  pagefindFilter: string,
): FilterOption[] {
  const options: FilterOption[] = [];

  if (pagefindFilters) {
    for (const filterKey in pagefindFilters) {
      if (filterKey.startsWith(pagefindFilter)) {
        for (const option in pagefindFilters[filterKey]) {
          options.push({
            value: option,
            textContent: `${option} (${pagefindFilters[filterKey][option]})`,
          });
        }
      }
    }
  }

  if (options.length == 1 && options[0].value === UNSPECIFIED_FILTER_VALUE) {
    options.length = 0;
  }

  sortFilterOptions(options);
  return options;
}

export function getFiltersFromQueryParams(window: any) {
  return window?.location?.search
    ? new Map(new URLSearchParams(window.location.search).entries())
    : new Map();
}

export function sortFilterOptions(options: { value: string }[]) {
  options.sort((a, b) => {
    const nA = Number(a.value);
    const nB = Number(b.value);

    if (!isNaN(nA) && !isNaN(nB)) return nB - nA;
    if (!isNaN(nA)) return -1;
    if (!isNaN(nB)) return 1;

    return a.value.localeCompare(b.value);
  });
}

export function getSearchOptionsFromQuery(
  collectionName: string,
  filtersMap: Map<string, FilterMapEntry>,
) {
  if (!filtersMap || filtersMap.size === 0) return null;

  const searchOptions = {};
  for (const [key, value] of filtersMap.entries()) {
    searchOptions[`${collectionName}_${key}`] = value;
  }

  return { filters: searchOptions };
}

export function getFiltersSelections(
  filtersMap: Map<string, FilterMapEntry>,
  e?: CustomEvent,
): Map<string, FilterSelection> {
  const filters: Map<string, FilterSelection> = new Map();

  filtersMap.forEach(({ filterElement, filterName }) => {
    if (!filterElement) return;

    if (e && e.target.name === filterName) {
      e.target.value &&
        filters.set(filterName, { filterName, selectedValue: e.target.value });
    } else {
      const selectedValue = (
        filterElement as HTMLInputElement | HTMLSelectElement
      ).value;

      const input: HTMLInputElement = document.getElementById(
        filterName,
      ) as HTMLInputElement;

      if (
        selectedValue &&
        selectedValue.trim() !== "" &&
        input?.value?.trim() !== ""
      ) {
        filters.set(filterName, { filterName, selectedValue });
      }
    }
  });

  return filters.size == 0 ? null : filters;
}

export function getSearchOptionsFromSelectedFilters(
  filtersMap: Map<string, FilterMapEntry>,
  filtersSelections: Map<string, FilterSelection>,
) {
  const filters = {};

  filtersMap.forEach((filter) => {
    const filterSelection = filtersSelections.get(filter.filterName);
    if (filterSelection) {
      filters[filter.pagefindfilter] = filterSelection.selectedValue;
    }
  });

  return { filters };
}

export function addFiltersEventListeners(filtersMap, handleFilterChange: any) {
  filtersMap.forEach((filter) => {
    filter?.filterElement?.addEventListener("change", handleFilterChange);
  });
}

export function updateHistoryState(filters: Map<string, FilterSelection>) {
  updateHistoryStateForWindow(filters, window);
}

export function updateHistoryStateForWindow(
  filters: Map<string, FilterSelection>,
  win,
) {
  const url = new URL(win.location.href);

  FILTERS_CONFIG.forEach((filterConfig: FilterConfig) => {
    const filterSelection: FilterSelection = filters?.get(
      filterConfig.filterName,
    );
    if (filterSelection?.selectedValue?.trim().length > 0) {
      url.searchParams.set(
        filterConfig.filterName,
        filterSelection?.selectedValue,
      );
    } else {
      url.searchParams.delete(filterConfig.filterName);
    }
  });

  win.history.replaceState(filters, "", url);
}
