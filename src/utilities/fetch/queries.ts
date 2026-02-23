import type { HomePage, SiteConfig } from "@/env";
import type { CollectionEntry } from "astro:content";
import { payloadFetch, safeJsonParse } from "./payload-fetch";
import {
  buildMenuWithCollectionSlugs,
  buildPreFooterWithCollectionSlugs,
} from "./buildMenuWithCollectionSlugs";

type FooterData = CollectionEntry<"footer">["data"];

// globals

export async function fetchSiteConfig(): Promise<SiteConfig> {
  return fetchCollection("globals/site-config");
}

export async function fetchHomePage(): Promise<HomePage> {
  return fetchCollection("globals/home-page");
}

export async function fetchMenu() {
  const menu = fetchCollection("globals/menu");
  return menu;
}

export async function fetchPreFooter() {
  const preFooterCollection = await fetchCollection("globals/pre-footer");

  const enrichedPreFooter = await buildPreFooterWithCollectionSlugs(
    preFooterCollection,
    fetchCollectionEntry,
  );

  return enrichedPreFooter;
}

export async function fetchFooter(): Promise<FooterData> {
  const footerCollection = (await fetchCollection(
    "globals/footer",
  )) as FooterData;
  const footerLinksCollectionEntry =
    await buildMenuWithCollectionSlugs<FooterData>(
      footerCollection,
      fetchCollectionEntry,
    );
  return footerLinksCollectionEntry;
}

// collections

export async function fetchCollection(collectionName: string) {
  const response = await payloadFetch(`${collectionName}?limit=0`);
  return await safeJsonParse(response);
}

// slugs

export function processFetchResponse(data) {
  return data?.docs?.[0] || null;
}

export async function fetchSlug(collectionName: string, slug: string) {
  const response = await payloadFetch(
    `${collectionName}?where[slug][equals]=${slug}&depth=2`,
  );
  return processFetchResponse(await safeJsonParse(response));
}

export async function fetchPageSlug(collectionName: string, slug: string) {
  const response = await payloadFetch(
    `${collectionName}?where[slug][equals]=${slug}&depth=2`,
  );
  return processFetchResponse(await safeJsonParse(response));
}

// Custom Collections
export async function fetchCollectionEntries(
  collectionTypeId: string | number,
) {
  const response = await payloadFetch(
    `collection-entries?where[collectionType][equals]=${collectionTypeId}&limit=0`,
  );
  return await safeJsonParse(response);
}

export async function fetchCollectionEntry(collectionEntryId: string | number) {
  const response = await payloadFetch(
    `collection-entries?where[id][equals]=${collectionEntryId}&limit=0`,
  );
  return await safeJsonParse(response);
}

export async function fetchCustomCollectionEntryBySlug(
  collectionTypeId: string | number,
  pageSlug: string,
) {
  const response = await payloadFetch(
    `collection-entries?where[and][0][collectionType][equals]=${collectionTypeId}&where[and][1][slug][equals]=${pageSlug}&limit=1`,
  );
  return processFetchResponse(await safeJsonParse(response));
}

export async function fetchNotFoundPage() {
  return fetchCollection("globals/not-found-page");
}
