import { paginate } from "../pagination";
import { fetchCollection } from "./queries";

export async function getPaginatedCollectionData<T>(
  collectionName: string,
  currentPage: number,
  pageSize: number,
  mapper: (item: any) => T,
): Promise<{
  items: T[];
  totalPages: number;
  rawItems: any[];
  hasPaginationNav: boolean;
}> {
  const data = await fetchCollection(collectionName);

  // Handle case where collection doesn't exist or is empty
  if (!data.docs || data.docs.length === 0) {
    return {
      items: [],
      totalPages: 0,
      rawItems: [],
      hasPaginationNav: false,
    };
  }

  const sorted = data.docs.sort((a: any, b: any) => {
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
  const hasPaginationNav = sorted.length >= pageSize;
  const { totalPages, paginatedItems } = paginate(
    sorted,
    currentPage,
    pageSize,
  );
  const items = paginatedItems.map(mapper);

  return { items, totalPages, hasPaginationNav, rawItems: sorted };
}
