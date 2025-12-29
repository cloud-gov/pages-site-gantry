import type {
  ElementsPair,
  FilterAttribute,
  FilterConfig,
  FilteredPageConfig,
  FilterMapEntry,
  FilterOption,
  FiltersData,
  FiltersSlugMetaData,
  PageFindResults,
  Tag,
} from "@/env";
import { getPageNavItems, getPaginationItemId } from "@/utilities/pagination";
import {
  COLLECTION_ITEM_LIST_FILTERED_ID,
  COLLECTION_ITEM_LIST_ID,
  DATASET_KEYS,
  FILTER_NAME_TAG,
  FILTER_NAME_YEAR,
  FILTER_NAV_ID_PREFIX,
  FILTERS_DATA_ID,
  PAGEFIND_FILTER_PREFIX,
  PAGINATION_ITEM_ID_PREFIX,
  PAGINATION_LIST_FILTERED_ID,
  PAGINATION_LIST_ID,
  UNSPECIFIED_FILTER_VALUE,
} from "@/utilities/filtersConfig";
import { sortCollection } from "@/utilities/fetch/collectionDataFetch.ts";
import { value } from "happy-dom/lib/PropertySymbol";

export function getFilteredPageConfig(
  collectionName: string,
  PAGE_SIZE: number,
  currentPageNum: number,
): FilteredPageConfig {
  return {
    collectionName,
    pageSize: PAGE_SIZE,
    currentPageNum: currentPageNum,
  };
}

function getPageSize() {
  return import.meta.env.PAGE_SIZE || 10;
}

export function getFiltersSlugMetaData(
  collectionName: string,
  collectionItem: any,
  slug: string,
): FiltersSlugMetaData {
  if (!collectionName || !collectionItem || !slug) return null;

  const tags: FilterAttribute[] = collectionItem?.tags
    ?.filter((tag: Tag) => isValid(tag?.label))
    .map((tag: Tag) => {
      return {
        attributeValue: `${getPagefindFilterName(collectionName, FILTER_NAME_TAG)}[content]`,
        content: tag?.label?.toUpperCase(),
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
    publishedAt: `${collectionItem?.publishedAt}`,
    filters: [...(tags ?? []), ...(year ? [year] : [])],
  };
}

function getPagefindFilterName(
  collectionName: string,
  filterName: string,
): string {
  return `${collectionName}_${filterName}`;
}

export function getFiltersDataAttributes(
  filtersConfig: FilterConfig[],
  filteredPageConfig: FilteredPageConfig,
  baseUrl: string,
) {
  if (!filtersConfig || !filteredPageConfig) return null;

  const dataAttributes: any = {};

  filtersConfig?.forEach((filter) => {
    const pageFindFilter = `data-${PAGEFIND_FILTER_PREFIX}${filter.filterName}`;

    dataAttributes[pageFindFilter] = getPagefindFilterName(
      filteredPageConfig?.collectionName,
      filter.filterName,
    );
   });

  dataAttributes[`data-${DATASET_KEYS.PAGE_SIZE}`] = String(
    filteredPageConfig?.pageSize ?? getPageSize(),
  );
  dataAttributes[`data-${DATASET_KEYS.CURRENT_PAGE_NUM}`] = String(
    filteredPageConfig?.currentPageNum ?? 1,
  );
  dataAttributes[`data-${DATASET_KEYS.BASE_URL}`] = baseUrl;
  dataAttributes[`data-${DATASET_KEYS.COLLECTION_NAME}`] =
    filteredPageConfig.collectionName;

  return dataAttributes;
}

export function getElementFiltersData(dataset: DOMStringMap): FiltersData {
  if (!dataset) return null;

  const filtersMap: Map<string, FilterMapEntry> = new Map();

  Object.entries(dataset)
    .filter(([key]) => key.startsWith(PAGEFIND_FILTER_PREFIX))
    .forEach(([key, value]) => {
      let filterName: string = key.replace(PAGEFIND_FILTER_PREFIX, "");

      filtersMap.set(filterName, {
        filterName,
        pagefindfilter: value,
      });
    });

  return {
    filtersMap,
    baseUrl: dataset[DATASET_KEYS.BASE_URL],
    pageSize: dataset[DATASET_KEYS.PAGE_SIZE],
    currentPageNum: dataset[DATASET_KEYS.CURRENT_PAGE_NUM],
    collectionName: dataset[DATASET_KEYS.COLLECTION_NAME],
  };
}

export function getFiltersData() {
  const el: HTMLElement = document.getElementById(FILTERS_DATA_ID);
  return getElementFiltersData(el?.dataset);
}

export function getFiltersFromQueryParams(window: any) {
  return window?.location?.search
    ? new Map(new URLSearchParams(window.location.search).entries())
    : new Map();
}

export function getCollectionFilters(
  pagefindFilters: Map<string, {}>,
  pagefindFilter: string,
): FilterOption[] {
  const options: FilterOption[] = [];

  for (const filterKey in pagefindFilters) {
    if (filterKey.startsWith(pagefindFilter)) {
      const pagefindFilterOptions = pagefindFilters[filterKey];
      for (const option in pagefindFilterOptions) {
        const count = pagefindFilterOptions[option];
        options.push({ value: option, textContent: `${option} (${count})` });
      }
    }
  }

  if (options.length == 1 && options[0].value === UNSPECIFIED_FILTER_VALUE) {
    options.length = 0;
  }

  sortFilterOptions(options);
  return options;
}

function isValid(v: string | number): boolean {
  return (
    v !== undefined &&
    v !== null &&
    !Number.isNaN(v) &&
    (typeof v !== "string" || v.trim() !== "")
  );
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

export function displayFilters(
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

      displayedFilters = addFilters(
        filterName,
        getCollectionFilters(pagefindFilters, pagefindfilter),
        el,
        navEl,
        filtersFromQueryParams?.get(filterName),
      );
    }
  });

  return displayedFilters;
}

export function getFilterNavId(filterName: string) {
  return `${FILTER_NAV_ID_PREFIX}${filterName}`;
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

export function addFilters(
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
        option.selected = true;
        targetElement.selectedIndex = option ? option.index : 0;
        const input = document.getElementById(filterName);
        if (input) {
          (input as HTMLInputElement).value = option
            ? option.textContent
            : null;

          const parentNode = input.parentElement;
          parentNode.classList.add("usa-combo-box--pristine");
        }
      }
    });
  }

  if (filterOptions.length > 0) {
    navElement.hidden = false;
    displayedFilter = true;
  }

  return displayedFilter;
}

export function getSearchOptions(filtersMap: Map<string, FilterMapEntry>) {
  const filters = {};

  filtersMap.forEach((filter) => {
    if (filter.filterElement?.value && filter.filterElement.value !== "all") {
      filters[filter.pagefindfilter] = filter.filterElement.value;
    }
  });

  return { filters };
}

export function buildSearchOptions(
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

export function getFiltersSelection(filtersMap: Map<string, FilterMapEntry>) {
  const filters: { filterName: string; selectedValue: string }[] = [];

  filtersMap.forEach(({ filterElement, filterName }) => {
    if (!filterElement) return;

    // For HTMLSelectElement or HTMLInputElement
    const selectedValue = (
      filterElement as HTMLInputElement | HTMLSelectElement
    ).value;

    const input = document.getElementById(filterName);

    if (
      selectedValue &&
      selectedValue !== "all" &&
      selectedValue.trim() !== "" &&
      input?.value.trim() !== ""
    ) {
      filters.push({ filterName, selectedValue });
    }
  });

  return filters;
}

export async function getFilteredResultFragment(
  results: PageFindResults[],
): Promise<DocumentFragment> {
  const parser = new DOMParser();

  // 1. Load all templates in parallel and collect clones
  const clones = await Promise.all(
    results.map(async (r: PageFindResults) => {
      try {
        const res: Response = await fetch(r?.url);
        if (!res.ok) return null;

        const html: any = await res.text();
        const doc: Document = parser.parseFromString(html, "text/html");

        const template = doc.getElementById(r?.meta?.collectionItemId);
        if (!(template instanceof HTMLTemplateElement)) return null;

        return template.content.cloneNode(true);
      } catch (e) {
        console.error("Failed to load template:", r?.url, e);
        return null;
      }
    }),
  );

  const fragment = document.createDocumentFragment();
  clones.filter(Boolean).forEach((clone) => fragment.appendChild(clone));

  return fragment;
}

export async function getFilteredPaginationFragment(
  resultSize: number,
  currentPage: number | string,
  pageSize: number,
): Promise<DocumentFragment> {
  const filteredTotalPages = Math.ceil(resultSize / pageSize);
  currentPage =
    Number(currentPage) > filteredTotalPages || Number(currentPage) < 1
      ? 1
      : currentPage;
  const pageNavItems = getPageNavItems(currentPage, filteredTotalPages);

  const clones = [];
  pageNavItems.forEach((pageNavItem) => {
    const templateId = getPaginationItemId({
      itemType: pageNavItem.itemType,
      isCurrentPage: currentPage == pageNavItem.pageNumber,
      idType: "template",
    });
    const templateElement = document.getElementById(templateId);
    if (templateElement) {
      if (templateElement instanceof HTMLTemplateElement) {
        const clonedTemplateElement: DocumentFragment =
          templateElement.content.cloneNode(true) as DocumentFragment;
        let paginationNavItem = clonedTemplateElement.querySelector("li");
        document.body.appendChild(clonedTemplateElement);
        if (paginationNavItem) {
          const paginationNavItemCloned: HTMLElement =
            paginationNavItem.cloneNode(true) as HTMLElement;
          paginationNavItemCloned.id = "";
          const link = paginationNavItemCloned.querySelector("a");
          if (link) {
            if (pageNavItem.itemType == "page") {
              link.textContent = pageNavItem.pageNumber;
              link.text = pageNavItem.pageNumber;
            }
            link.href = link.href + pageNavItem.pageNumber;
            link.id = getPaginationItemId({
              itemType: pageNavItem.itemType,
              pageId: pageNavItem.pageNumber,
              idType: "link",
            });
          }
          clones.push(paginationNavItemCloned);
        }
      }
    }
  });

  const fragment = document.createDocumentFragment();
  clones.filter(Boolean).forEach((clone) => fragment.appendChild(clone));

  return fragment;
}

export function cloneElementWithId(originalId, clonedId): Node {
  const original = document.getElementById(originalId);
  if (!original) return null;

  // Deep clone
  const clone = original.cloneNode(true) as HTMLElement;
  clone.id = clonedId;
  clone.style.display = "none";
  clone.replaceChildren();
  return clone;
}

export function createFilteredCollectionItemList(): ElementsPair {
  const original = document.getElementById(COLLECTION_ITEM_LIST_ID);
  const filtered = cloneElementWithId(
    COLLECTION_ITEM_LIST_ID,
    COLLECTION_ITEM_LIST_FILTERED_ID,
  );
  if (filtered) {
    const parentContainer = original.parentElement;
    parentContainer.appendChild(filtered);
  }
  return { original, filtered };
}

export function createFilteredPagination(): ElementsPair {
  const original = document.getElementById(PAGINATION_LIST_ID);
  const filtered = cloneElementWithId(
    PAGINATION_LIST_ID,
    PAGINATION_LIST_FILTERED_ID,
  );
  if (filtered) {
    const parentContainer = original.parentElement;
    parentContainer.appendChild(filtered);
  }
  return { original, filtered };
}

export async function search(
  pageFind: any,
  searchOptions: { filters: {} },
  collectionList: ElementsPair,
  pagination: ElementsPair,
  filtersData: FiltersData,
): Promise<void> {
  let results: any[] = [];
  if (searchOptions?.filters && Object.keys(searchOptions.filters).length > 0) {
    const searchResults = await pageFind.search(null, searchOptions);
    results = await Promise.all(
      searchResults.results.map((r: any) => r.data()),
    );
    const sorted = results.sort(sortCollection);
    renderResults(sorted, collectionList, pagination, filtersData);
  } else {
    resetFilteredPage();
  }
}

function displayOriginal(elementsPair: ElementsPair) {
  elementsPair.original && (elementsPair.original.style.display = "");
  elementsPair.filtered && (elementsPair.filtered.style.display = "none");
}

function displayFiltered(elementsPair: ElementsPair) {
  elementsPair.original && (elementsPair.original.style.display = "none");
  elementsPair.filtered && (elementsPair.filtered.style.display = "");
}

function hideBoth(elementsPair: ElementsPair) {
  elementsPair.original && (elementsPair.original.style.display = "none");
  elementsPair.filtered && (elementsPair.filtered.style.display = "none");
}

function renderResults(
  results: any,
  collectionList: ElementsPair,
  pagination: ElementsPair,
  filtersData: FiltersData,
): void {
  if (!results || results.length === 0) {
    hideBoth(collectionList);
    hideBoth(pagination);
    return;
  }

  const pageResults: [] = results.slice(0, filtersData.pageSize); // !!!

  getFilteredResultFragment(pageResults).then((fragment) => {
    if (fragment) {
      displayFiltered(collectionList);
      collectionList.filtered.replaceChildren(fragment);
    }
  });

  getFilteredPaginationFragment(
    results?.length,
    filtersData.currentPageNum,
    filtersData.pageSize,
  ).then((fragment) => {
    if (fragment) {
      if (fragment.children?.length == 0) {
        hideBoth(pagination);
      } else {
        displayFiltered(pagination);
        pagination.filtered.replaceChildren(fragment);
        pagination.filtered.addEventListener(
          "click",
          getPaginatiionLinkListener(filtersData.filtersMap),
        );
      }
    }
  });
}

export function addFiltersEventListeners(
  filtersMap: Map<string, FilterMapEntry>,
  handleFilterChange: any,
) {
  filtersMap.forEach((filter) => {
    filter?.filterElement?.addEventListener("change", handleFilterChange);
  });
}

export function addPaginationEventListeners(
  pagination: ElementsPair,
  data: FiltersData,
) {
  pagination?.original?.addEventListener(
    "click",
    getPaginatiionLinkListener(data.filtersMap),
  );
}

export function getPaginatiionLinkListener(
  filtersMap: Map<string, FilterMapEntry>,
) {
  return (e: any) => {
    const link = e.target.closest(`[id^=${PAGINATION_ITEM_ID_PREFIX}]`);
    if (!link) return;

    // Ignore clicks with modifier keys or target="_blank"
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      link.target === "_blank"
    )
      return;

    const filterSelections = getFiltersSelection(filtersMap);

    if (filterSelections.length > 0) {
      e.preventDefault();

      const url = new URL(link.href, window.location.href);
      filterSelections.forEach((filterSelection) => {
        url.searchParams.set(
          filterSelection.filterName,
          filterSelection.selectedValue,
        );
      });

      window.location.href = url.toString();
    }
  };
}

export function resetFilteredPage() {
  const el: HTMLElement = document.getElementById(
    "filtered-pagination-item-link-1",
  );
  el.click();
  //PAGINATION_LINK_ID_FIST_PAGE);
}

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement|HTMLSelectElement} el The element to update
 * @param {string} value The new value of the element
 */
const changeElementValue = (el, value = "") => {
  const elementToChange = el;
  elementToChange.value = value;

  const event = new CustomEvent("change", {
    bubbles: true,
    cancelable: true,
    detail: { value },
  });
  elementToChange.dispatchEvent(event);
};
