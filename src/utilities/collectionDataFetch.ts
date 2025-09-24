import payloadFetch from "./payload-fetch";
import { paginate } from "./pagination";

export async function getPaginatedCollectionData<T> (
  collectionName: string,
  currentPage: number,
  pageSize: number,
  mapper: (item: any) => T
): Promise<{
  items: T[];
  totalPages: number;
  rawItems: any[];
  hasPaginationNav: boolean;
}> {
  const preview = import.meta.env.PREVIEW_MODE;
  const response = await payloadFetch(`${collectionName}?draft=${preview}&limit=0`);
  const data = await response.json();
  const sorted = data.docs.sort((a: any, b: any) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  const hasPaginationNav = sorted.length >= pageSize;
  const { totalPages, paginatedItems } = paginate(sorted, currentPage, pageSize);
  const items = paginatedItems.map(mapper);

  return { items, totalPages, hasPaginationNav, rawItems: sorted };
}
