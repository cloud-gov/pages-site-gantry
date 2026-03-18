import {
  fetchSlug,
  fetchCollectionEntries,
  createCustomCollectionEntryMapper,
} from "@/utilities/fetch";
import { paginate } from "@/utilities/pagination";

export async function loadCollectionConfig(collectionSlug: string) {
  const config = await fetchSlug("collection-types", collectionSlug);
  if (!config) return null;
  return config;
}

export async function loadCollectionEntries(collectionConfig: any) {
  const data = await fetchCollectionEntries(collectionConfig.id);
  const entries = data?.docs ?? [];
  return entries.sort(
    (a: any, b: any) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function filterEntriesByTag(entries: any[], tag?: string) {
  if (!tag) return entries;
  return entries.filter((entry) =>
    entry.tags?.some((t: any) => t.slug === tag),
  );
}

export function paginateEntries(
  entries: any[],
  page: number,
  PAGE_SIZE: number,
) {
  return paginate(entries, page, PAGE_SIZE);
}

export function mapEntries(entries: any[], collectionSlug: string) {
  const mapper = createCustomCollectionEntryMapper(collectionSlug);
  return entries.map(mapper);
}

export function extractTagsFromEntries(entries: any[]) {
  const tagMap = new Map();
  entries.forEach((entry) => {
    entry.tags?.forEach((t: any) => tagMap.set(t.slug, t));
  });
  return [...tagMap.values()];
}
