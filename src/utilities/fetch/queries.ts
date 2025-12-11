import type { HomePage, SiteConfig } from "@/env";
import { payloadFetch, safeJsonParse } from "./payload-fetch";

// globals

export async function fetchSiteConfig(): Promise<SiteConfig> {
  return fetchCollection("globals/site-config");
}

export async function fetchHomePage(): Promise<HomePage> {
  return fetchCollection("globals/home-page");
}

export async function fetchMenu() {
  return fetchCollection("globals/menu");
}

export async function fetchPreFooter() {
  return fetchCollection("globals/pre-footer");
}

export async function fetchFooter() {
  return fetchCollection("globals/footer");
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
    `${collectionName}?where[slug][equals]=${slug}&depth=1`,
  );
  return processFetchResponse(await safeJsonParse(response));
}

// Custom Collections
export async function fetchCustomCollectionPages(
  collectionConfigId: string | number,
) {
  const response = await payloadFetch(
    `custom-collection-pages?where[collectionConfig][equals]=${collectionConfigId}&limit=0`,
  );
  return await safeJsonParse(response);
}

export async function fetchCustomCollectionPageBySlug(
  collectionConfigId: string | number,
  pageSlug: string,
) {
  const response = await payloadFetch(
    `custom-collection-pages?where[and][0][collectionConfig][equals]=${collectionConfigId}&where[and][1][slug][equals]=${pageSlug}&limit=1`,
  );
  return processFetchResponse(await safeJsonParse(response));
}
