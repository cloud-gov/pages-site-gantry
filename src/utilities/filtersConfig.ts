import type { FilterConfig } from "@/env";

export const FILTER_NAME_TAG = "tag";
export const FILTER_NAME_YEAR = "year";

export const FILTERS_CONFIG: FilterConfig[] = [
  { filterName: FILTER_NAME_TAG, filterLabel: "Filter by document type" },
  { filterName: FILTER_NAME_YEAR, filterLabel: "Filter by year" },
];

export const FILTERS_DATA_ID = "pagefind-data";
export const FILTER_NAV_ID_PREFIX = "nav-";
export const COLLECTION_ITEM_LIST_ID = "collection-item-list";
export const COLLECTION_ITEM_LIST_FILTERED_ID = "collection-item-list-filtered";
export const PAGINATION_LIST_ID = "pagination-list";
export const PAGINATION_LIST_FILTERED_ID = "pagination-list-filtered";
export const PAGEFIND_FILTER_PREFIX = "pagefindfilter";
export const FILTER_PREFIX = "filter";
export const UNSPECIFIED_FILTER_VALUE = "Unspecified";
export const PAGINATION_ITEM_ID_PREFIX = "filtered-pagination-item-";
export const PAGINATION_LINK_ID_FIST_PAGE = `${PAGINATION_ITEM_ID_PREFIX}-link-1`;
export const USA_COMBO_BOX_CLEAR_INPUT = "usa-combo-box__clear-input";

export const DATASET_KEYS = {
  BASE_URL: "baseurl",
  PAGE_SIZE: "pagesize",
  CURRENT_PAGE_NUM: "currentpagenum",
  COLLECTION_NAME: "collectionname",
} as const;
