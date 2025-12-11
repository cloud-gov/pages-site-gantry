import type { CollectionFiltersConfig } from "@/env";

export function getYearFilterName(collectionName: string): string {
  return `${collectionName}_year`;
}
export function getDocumentTypeFilterName(collectionName: string): string {
  return `${collectionName}_tag`;
}

export function getCollectionFiltersConfig(
  collectionName: string,
  collectionItem: any,
): CollectionFiltersConfig | any {
  const tags = collectionItem?.tags?.map((tag) => {
    return {
      config: `${getDocumentTypeFilterName(collectionName)}[content]`,
      content: tag?.label?.toUpperCase(),
    };
  });
  const year = {
    config: `${getYearFilterName(collectionName)}[content]`,
    content: collectionItem?.yearTag,
  };

  const filters = [...(tags ?? []), ...(year ? [year] : [])];

  const result = {
    collectionName: collectionName,
    filters,
  };
  return result;
}

export function addFilters(filters, filterName, selectElement, navElement) {
  let hasOptions = false;
  const options = [];
  Object.entries(filters)
    .filter(([key, value]) => {
      return key.match(filterName);
    })
    .forEach(([key, value]) => {
      Object.entries(value).filter(([key, value]) => {
        options.push({ value: key, textContent: `${key} (${value})` });
        hasOptions = true;
      });
    });

  sortOptions(options);

  options.forEach((value, key) => {
    const option = document.createElement("option");
    option.value = value.value;
    option.textContent = value.textContent;
    selectElement.appendChild(option);
  });

  if (!hasOptions) {
    selectElement.style.display = "none";
  }

  if (!hasOptions) {
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

export function getSearchOptions(
  selectedYear: string,
  selectedType: string,
  yearFilterName: string,
  typeFilterName: string,
) {
  const filters: Record<string, string> = {};

  if (selectedYear && selectedYear !== "all") {
    filters[yearFilterName] = selectedYear;
  }

  if (selectedType && selectedType !== "all") {
    filters[typeFilterName] = selectedType;
  }

  return Object.keys(filters).length ? { filters } : null;
}
