import type {
  ElementsPair,
  FilterMapEntry,
  FiltersData,
  PageNavItemModel,
} from "@/env";
import { getPageNavItems, getPaginationItemId } from "@/utilities/pagination";
import {
  PAGINATION_ITEM_ID_PREFIX,
  PAGINATION_LIST_FILTERED_ID,
  PAGINATION_LIST_ID,
} from "@/utilities/filter/filtersConfig";
import {
  appendQuery,
  cloneElementWithId,
  createDocumentFragment,
} from "@/utilities/filter/filtersUtils";
import { getFiltersSelections } from "@/utilities/filter/filtersSelect";

export function getFilteredPaginationFragmentForPageNavItems(
  pageNavItems: PageNavItemModel[],
): DocumentFragment {
  const clones = [];
  pageNavItems.forEach((pageNavItem) => {
    const templateElement = document.getElementById(
      getPaginationItemId({
        itemType: pageNavItem.itemType,
        isCurrentPage: pageNavItem.isCurrentPage,
        idType: "template",
      }),
    );
    if (templateElement) {
      if (templateElement instanceof HTMLTemplateElement) {
        const clonedTemplateElement: DocumentFragment =
          templateElement.content.cloneNode(true) as DocumentFragment;
        let paginationNavItem = clonedTemplateElement.querySelector("li");
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
              idType: "link-filtered",
            });
          }
          clones.push(paginationNavItemCloned);
        }
      }
    }
  });

  return createDocumentFragment(clones);
}

export function getFilteredPageNavInfo(
  resultSize: number,
  pageSize: number | string,
  currentPage: number | string,
) {
  const size = Number(pageSize);
  const page = Number(currentPage);

  const filteredTotalPages = Math.ceil(resultSize / size);
  const filteredCurrentPage = page < 1 || page > filteredTotalPages ? 1 : page;

  return { filteredTotalPages, filteredCurrentPage };
}

export function getFilteredPaginationFragment(
  resultSize: number,
  currentPage: number | string,
  pageSize: number | string,
): DocumentFragment {
  const { filteredTotalPages, filteredCurrentPage } = getFilteredPageNavInfo(
    resultSize,
    pageSize,
    currentPage,
  );
  return getFilteredPaginationFragmentForPageNavItems(
    getPageNavItems(filteredCurrentPage, filteredTotalPages),
  );
}

export function addPaginationEventListeners(
  pagination: ElementsPair,
  data: FiltersData,
) {
  pagination?.filtered?.addEventListener(
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

    const filterSelections = getFiltersSelections(filtersMap);
    if (filterSelections) {
      e.preventDefault();
      const url = appendQuery(link.href, filterSelections);
      window.location.href = url.toString();
    }
  };
}

export function createFilteredPagination(): ElementsPair {
  return cloneElementWithId(PAGINATION_LIST_ID, PAGINATION_LIST_FILTERED_ID);
}
