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
import { renderActiveFilters } from "./filtersRender";
import { buildAnyFilters } from "./buildAnyFilters";

type SearchOptionsValue = string | { any: string[] };

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

export function handleFiltersChanged(filtersMap: Map<string, any>) {
  const filtersSelections = getFiltersSelections(filtersMap);

  // update url
  updateHistoryState(filtersSelections);

  // update active filter pills
  renderActiveFilters(filtersSelections);
}

export function getSearchOptionsFromQuery(
  collectionName: string,
  filtersMap: Map<string, string>,
) {
  if (!filtersMap || filtersMap.size === 0) return null;

  const entries: Array<[string, string]> = [];

  for (const [key, value] of filtersMap.entries()) {
    entries.push([`${collectionName}_${key}`, value]);
  }

  return buildAnyFilters(entries);
}

export function getFiltersSelections(
  filtersMap: Map<string, FilterMapEntry>,
): Map<string, FilterSelection> | null {
  const filters: Map<string, FilterSelection> = new Map();

  filtersMap.forEach(({ filterElement, filterName }) => {
    if (!filterElement) return;

    // Checkbox-based filters (multi-select)
    const checkboxes = document.querySelectorAll(
      `input[type="checkbox"][name="${filterName}"]:checked`,
    ) as NodeListOf<HTMLInputElement>;

    if (checkboxes.length > 0) {
      const selectedValues = Array.from(checkboxes).map((cb) => cb.value);

      filters.set(filterName, {
        filterName,
        selectedValue: selectedValues.join(","), // URL-safe format
      });

      return;
    }

    // Fallback for select / single-input filters
    const input = filterElement as HTMLInputElement | HTMLSelectElement;
    const value = input.value?.trim();

    if (value) {
      filters.set(filterName, {
        filterName,
        selectedValue: value,
      });
    }
  });

  return filters.size === 0 ? null : filters;
}

export function getSearchOptionsFromSelectedFilters(
  filtersMap: Map<string, FilterMapEntry>,
  filtersSelections: Map<string, FilterSelection>,
) {
  if (!filtersMap || !filtersSelections || filtersSelections.size === 0) {
    return null;
  }

  const entries: Array<[string, string]> = [];

  filtersMap.forEach((filter) => {
    const selection = filtersSelections.get(filter.filterName);
    if (!selection?.selectedValue) return;

    entries.push([filter.pagefindfilter, selection.selectedValue]);
  });

  return buildAnyFilters(entries);
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

  if (!filters || filters.size === 0) {
    win.history.replaceState(filters, "", url);
    return;
  }

  filters.forEach((filterSelection, filterName) => {
    if (filterSelection?.selectedValue?.trim().length > 0) {
      url.searchParams.set(filterName, filterSelection.selectedValue);
    } else {
      url.searchParams.delete(filterName);
    }
  });

  win.history.replaceState(filters, "", url);
}
