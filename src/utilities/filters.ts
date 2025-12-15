import type { CollectionFiltersConfig } from "@/env";
import type { FiltersConfig } from "@/utilities/filtersConfig.ts";

export const UNSPECIFIED_FILTER = "Unspecified";

export type FilterMapEntry = {
  filterName: string;
  pagefindfilter: string;
  filterElement: any;
  navElement: any;
};

export function getPagefindFilterName(
  collectionName: string,
  filterName: string,
): string {
  return `${collectionName}_${filterName}`;
}

function getYear(collectionItem: any) {
  return collectionItem?.yearTag ? collectionItem.yearTag : "Unspecified";
}

const isValid = (v) =>
  v !== undefined &&
  v !== null &&
  !Number.isNaN(v) &&
  (typeof v !== "string" || v.trim() !== "");

export function getCollectionFiltersConfig(
  collectionName: string,
  collectionItem: any,
): CollectionFiltersConfig | any {
  const tags = collectionItem?.tags
    ?.filter((tag) => isValid(tag))
    .map((tag) => {
      return {
        atrributeValue: `${getPagefindFilterName(collectionName, "tag")}[content]`,
        content: tag?.label?.toUpperCase(),
      };
    });
  const year = {
    atrributeValue: `${getPagefindFilterName(collectionName, "year")}[content]`,
    content: getYear(collectionItem),
  };

  const filters = [...(tags ?? []), ...(year ? [year] : [])];

  const result = {
    collectionName: collectionName,
    filters,
  };
  return result;
}

export function extractCollectionFilters(filters, filterName) {
  const options = [];
  Object.entries(filters)
    .filter(([key, value]) => {
      return key.match(filterName);
    })
    .forEach(([key, value]) => {
      Object.entries(value)
        .filter(([k, v]) => isValid(k) && isValid(v))
        .forEach(([key, value]) => {
          options.push({ value: key, textContent: `${key} (${value})` });
        });
    });
  if (options.length == 1 && options[0].value === UNSPECIFIED_FILTER) {
    options.length = 0
  }
  sortOptions(options);
  return options;
}

export function getElement(filter): any {
  const targetElement = document.getElementsByName(filter);
  const el =
    targetElement instanceof Element ? targetElement : targetElement?.[0];
  return el;
}

export function addFilters(options, targetElement, navElement) {
  if (targetElement instanceof HTMLSelectElement) {
    // now el is HTMLUListElement
    options.forEach((value, key) => {
      const option = document.createElement("option");
      option.value = value.value;
      option.textContent = value.textContent;
      targetElement.appendChild(option);
    });
  }

  if (options.length == 0) {
    navElement.style.display = "none";
  }
}

export function sortOptions(options: { value: string }[]) {
  options.sort((a, b) => {
    const valA = a.value;
    const valB = b.value;

    const numA = Number(valA);
    const numB = Number(valB);

    const isNumA = !isNaN(numA);
    const isNumB = !isNaN(numB);

    // If both are numbers, sort descending
    if (isNumA && isNumB) return numB - numA;

    // If one is number and one is not, numbers come first
    if (isNumA) return -1;
    if (isNumB) return 1;

    // Both are non-numeric: sort alphabetically
    return valA.localeCompare(valB);
  });
}

export function getSearchOptions(filtersMap: Record<string, FilterMapEntry>) {
  const filters: Record<string, string> = {};

  Object.values(filtersMap).forEach(({ filterElement, pagefindfilter }) => {
    if (!filterElement) return;

    // For HTMLSelectElement or HTMLInputElement
    const value = (filterElement as HTMLInputElement | HTMLSelectElement).value;

    if (value && value !== "all") {
      filters[pagefindfilter] = value;
    }
  });

  return Object.keys(filters).length ? { filters } : null;
}

export function getFiltersDataAttributes(
  filtersConfig: FiltersConfig[],
  collectionName: string,
) {
  const dataAttributes: Record<string, string> = {};

  filtersConfig?.forEach((filter) => {
    const pageFindFilter = `data-pagefindfilter${filter.filterName}`;
    const valueKey = `data-filter${filter.filterName}`;

    dataAttributes[pageFindFilter] = getPagefindFilterName(
      collectionName,
      filter.filterName,
    );
    dataAttributes[valueKey] = filter.filterName || ""; // or some other value
  });

  return dataAttributes;
}

export function getFiltersFromElementData(el: HTMLElement) {
  if (!el) return {};

  const dataset = el.dataset;

  // Reduce dataset entries into a map
  return Object.entries(dataset)
    .filter(([key]) => key.startsWith("pagefindfilter"))
    .reduce<
      Record<
        string,
        {
          filterName: string;
          pagefindfilter: string;
          filterElement: HTMLElement | null;
          navElement: HTMLElement | null;
        }
      >
    >((acc, [key, pagefindValue]) => {
      const filterNameKey = key.replace("pagefindfilter", "filter");
      const filterName = dataset[filterNameKey];

      if (filterName) {
        acc[filterName] = {
          filterName,
          pagefindfilter: pagefindValue,
          filterElement: null, // initialize empty
          navElement: null,
        };
      }

      return acc;
    }, {});
}
