export interface FiltersConfig {
  filterName: string;
  filterLabel: string;
}

export const filtersConfig: FiltersConfig[] = [
  { filterName: "tag", filterLabel: "Filter by document type" },
  { filterName: "year", filterLabel: "Filter by year" },
];
