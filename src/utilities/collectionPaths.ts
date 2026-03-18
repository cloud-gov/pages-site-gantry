import { fetchCollection, fetchCollectionEntries } from "@/utilities/fetch";

export const PAGE_SIZE = import.meta.env.PAGE_SIZE
  ? Number(import.meta.env.PAGE_SIZE)
  : 10;

/* ---------------------------------------------
 * Helpers
 * -------------------------------------------*/

export async function getAllCollections() {
  const data = await fetchCollection("collection-types");
  return data?.docs || [];
}

export async function getAllEntriesForCollection(collectionId: string) {
  const data = await fetchCollectionEntries(collectionId);
  return data?.docs || [];
}

export function getTagsFromEntries(entries: any[]) {
  const tagSet = new Set<string>();
  entries?.forEach((entry) => {
    entry?.tags?.forEach((t: any) => tagSet.add(t.slug));
  });
  return Array.from(tagSet);
}

/* ---------------------------------------------
 * - All collection types
 * - EXCLUDING slugs that match "pages"
 * -------------------------------------------*/

export async function buildCollectionIndexPaths() {
  const collections = await getAllCollections();

  // Fetch CMS pages to exclude them from collectionSlug values
  const { fetchCollection: fetchPages } = await import("@/utilities/fetch");
  const pagesData = await fetchPages("pages");
  const pageSlugs = new Set((pagesData?.docs || []).map((p: any) => p.slug));

  return collections
    .filter((config: any) => !pageSlugs.has(config.slug))
    .map((config: any) => ({
      params: { collectionSlug: config.slug },
    }));
}

/* ---------------------------------------------
 * - For each collection type, count entries
 * - Generate pagination paths
 * -------------------------------------------*/

export async function buildCollectionPaginationPaths() {
  const collections = await getAllCollections();
  const paths: any[] = [];

  for (const config of collections) {
    const entries = await getAllEntriesForCollection(config.id);
    const totalPages = Math.ceil(entries.length / PAGE_SIZE);

    for (let p = 1; p <= totalPages; p++) {
      paths.push({
        params: {
          collectionSlug: config.slug,
          page: String(p),
        },
      });
    }
  }

  return paths;
}

/* ---------------------------------------------
 * - For each collection, gather all tags
 * -------------------------------------------*/

export async function buildTagIndexPaths() {
  const collections = await getAllCollections();
  const paths: any[] = [];

  for (const config of collections) {
    const entries = await getAllEntriesForCollection(config.id);
    const tags = getTagsFromEntries(entries);

    for (const tag of tags) {
      paths.push({
        params: {
          collectionSlug: config.slug,
          tag,
        },
      });
    }
  }

  return paths;
}

/* ---------------------------------------------
 * - For each collection, for each tag
 * - Filter entries by tag
 * - Generate pagination paths
 * -------------------------------------------*/

export async function buildTagPaginationPaths() {
  const collections = await getAllCollections();
  const paths: any[] = [];

  for (const config of collections) {
    const entries = await getAllEntriesForCollection(config.id);
    const tags = getTagsFromEntries(entries);

    for (const tag of tags) {
      // Filter entries by tag
      const tagged = entries.filter((entry: any) =>
        entry.tags?.some((t: any) => t.slug === tag),
      );

      const pages = Math.ceil(tagged.length / PAGE_SIZE);

      for (let p = 1; p <= pages; p++) {
        paths.push({
          params: {
            collectionSlug: config.slug,
            tag,
            page: String(p),
          },
        });
      }
    }
  }

  return paths;
}
