import type { FilterMapEntry, FilterOption } from "@/env";
import { UNSPECIFIED_FILTER_VALUE } from "@/utilities/filter/filtersConfig.ts";

export function getCollectionFilters(
  pagefindFilters: Map<string, any> | {},
  pagefindFilter: string,
): FilterOption[] {
  const options: FilterOption[] = [];

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

export function getSearchOptionsFromSelectFilters(
  filtersMap: Map<string, FilterMapEntry>,
) {
  const filters = {};

  filtersMap.forEach((filter) => {
    if (filter.filterElement?.value && filter.filterElement.value !== "all") {
      filters[filter.pagefindfilter] = filter.filterElement.value;
    }
  });

  return { filters };
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

export function getFiltersSelection(
  filtersMap: Map<string, FilterMapEntry>,
  e?: CustomEvent,
) {
  const filters: { filterName: string; selectedValue: string }[] = [];

  filtersMap.forEach(({ filterElement, filterName }) => {
    if (!filterElement) return;

    if (e && e.target.name === filterName) {
      e.target.value && filters.push({ filterName, selectedValue: e.target.value });
    } else {
      const selectedValue = (
        filterElement as HTMLInputElement | HTMLSelectElement
      ).value;

      const input: HTMLInputElement = document.getElementById(
        filterName,
      ) as HTMLInputElement;

      if (
        selectedValue &&
        selectedValue !== "all" &&
        selectedValue.trim() !== "" &&
        input?.value?.trim() !== ""
      ) {
        filters.push({ filterName, selectedValue });
      }
    }
  });

  return filters;
}

export function addFiltersEventListeners(filtersMap, handleFilterChange: any) {
  filtersMap.forEach((filter) => {
    filter?.filterElement?.addEventListener("change", handleFilterChange);
  });
}
