import type { ElementsPair, FiltersData, PageFindResults } from "@/env";

import {
  COLLECTION_ITEM_LIST_FILTERED_ID,
  COLLECTION_ITEM_LIST_ID,
} from "@/utilities/filter/filtersConfig";
import {
  cloneElementWithId,
  createDocumentFragment,
} from "@/utilities/filter/filtersUtils";
import {
  displayOriginals,
  renderResults,
} from "@/utilities/filter/filtersRender";
import { sortCollectionBySortField } from "@/utilities/collectionSort";

export async function search(
  pagefind: any,
  searchOptions: { filters: {} },
  collectionList: ElementsPair,
  pagination: ElementsPair,
  filtersData: FiltersData,
): Promise<void> {
  let results: any[] = [];
  if (searchOptions?.filters && Object.keys(searchOptions.filters).length > 0) {
    const searchResults = await pagefind.search(null, searchOptions);
    results = await Promise.all(
      searchResults.results.map(async (r: any) => {
        const data = await r.data();
        return {
          ...data,
          sortField: data.meta?.sortField,
        };
      }),
    );
    await renderResults(
      results.sort(sortCollectionBySortField),
      collectionList,
      pagination,
      filtersData,
    );
  } else {
    displayOriginals(collectionList, pagination);
  }
}

export async function getFilteredResultFragment(
  results: PageFindResults[],
): Promise<DocumentFragment> {
  const parser = new DOMParser();

  const clones = await Promise.all(
    results.map(async (r: PageFindResults) => {
      try {
        if (!r?.url) return null;

        const res = await fetch(r.url);
        if (!res.ok) return null;

        const el = parser
          .parseFromString(await res.text(), "text/html")
          .getElementById(r?.meta?.collectionItemId);

        return el instanceof HTMLTemplateElement
          ? el.content.cloneNode(true)
          : null;
      } catch (e) {
        console.error("Failed to load template:", r?.url, e);
        return null;
      }
    }),
  );
  return createDocumentFragment(clones);
}

export function createFilteredCollectionItemList(): ElementsPair {
  return cloneElementWithId(
    COLLECTION_ITEM_LIST_ID,
    COLLECTION_ITEM_LIST_FILTERED_ID,
  );
}
