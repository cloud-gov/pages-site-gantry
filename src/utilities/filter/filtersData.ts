import type {
  FilterAttribute,
  FilterConfig,
  FilteredPageConfig,
  FilterMapEntry,
  FiltersData,
  FiltersSlugMetaDataModel,
  Tag,
} from "@/env";
import {
  DATASET_KEYS,
  FILTER_NAME_TAG,
  FILTER_NAME_YEAR,
  FILTERS_DATA_ID,
  PAGEFIND_FILTER_PREFIX,
  UNSPECIFIED_FILTER_VALUE,
} from "@/utilities/filter/filtersConfig";

export function getFiltersSlugMetaData(
  collectionName: string,
  collectionItem: any,
  slug: string,
): FiltersSlugMetaDataModel {
  if (!collectionName || !collectionItem || !slug) return null;

  const tags: FilterAttribute[] = collectionItem?.tags
    ?.filter((tag: Tag) => tag?.title)
    ?.map((tag: Tag) => {
      const filterName = tag?.tagTypes?.slug
        ? tag.tagTypes.slug.toLowerCase()
        : FILTER_NAME_TAG;

      return {
        attributeValue: `${getPagefindFilterName(collectionName, filterName)}[content]`,
        content: tag?.title?.toUpperCase(),
      };
    });

  const year: FilterAttribute = {
    attributeValue: `${getPagefindFilterName(collectionName, FILTER_NAME_YEAR)}[content]`,
    content: collectionItem?.yearTag
      ? collectionItem?.yearTag
      : UNSPECIFIED_FILTER_VALUE,
  };

  return {
    collectionItemId: `${collectionName}-${slug}`,
    sortField: `${collectionItem?.sortField}`,
    filters: [...(tags ?? []), ...(year ? [year] : [])],
  };
}

export function getFiltersDataAttributes(
  filtersConfig: FilterConfig[],
  filteredPageConfig: FilteredPageConfig,
  baseUrl: string,
) {
  if (!filtersConfig || !filteredPageConfig) return null;

  const dataAttributes: any = {};

  filtersConfig?.forEach((filter) => {
    dataAttributes[`data-${PAGEFIND_FILTER_PREFIX}${filter.filterName}`] =
      getPagefindFilterName(
        filteredPageConfig?.collectionName,
        filter.filterName,
      );
  });

  dataAttributes[`data-${DATASET_KEYS.PAGE_SIZE}`] = String(
    filteredPageConfig?.pageSize ?? getPageSize(),
  );

  dataAttributes[`data-${DATASET_KEYS.CURRENT_PAGE}`] = String(
    filteredPageConfig?.currentPage ?? 1,
  );

  dataAttributes[`data-${DATASET_KEYS.BASE_URL}`] = baseUrl;

  if (filteredPageConfig?.collectionName) {
    dataAttributes[`data-${DATASET_KEYS.COLLECTION_NAME}`] =
      filteredPageConfig.collectionName;
  }

  dataAttributes[`data-${DATASET_KEYS.TOTAL_ITEMS}`] = Number(
    filteredPageConfig?.totalItems ?? 0,
  );

  return dataAttributes;
}

export function getFiltersData() {
  return getElementFiltersData(
    document.getElementById(FILTERS_DATA_ID)?.dataset,
  );
}

export function getElementFiltersData(dataset: DOMStringMap): FiltersData {
  if (!dataset) return null;

  const filtersMap: Map<string, FilterMapEntry> = new Map();

  Object.entries(dataset)
    .filter(([key]) => key.startsWith(PAGEFIND_FILTER_PREFIX))
    .forEach(([key, value]) => {
      const filterName = key.replace(PAGEFIND_FILTER_PREFIX, "");

      filtersMap.set(filterName, {
        filterName,
        pagefindfilter: value,
      });
    });

  return {
    filtersMap,
    baseUrl: dataset[DATASET_KEYS.BASE_URL],
    pageSize: dataset[DATASET_KEYS.PAGE_SIZE],
    currentPage: dataset[DATASET_KEYS.CURRENT_PAGE],
    collectionName: dataset[DATASET_KEYS.COLLECTION_NAME],
    totalItems: Number(dataset[DATASET_KEYS.TOTAL_ITEMS]),
  };
}

function getPagefindFilterName(
  collectionName: string,
  filterName: string,
): string {
  return `${collectionName}_${filterName}`;
}

function getPageSize() {
  return import.meta.env.PAGE_SIZE || 10;
}
