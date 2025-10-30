import type { HomePage, SiteConfig } from "@/env";
import { payloadFetch } from "./payload-fetch";

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

// collections

export async function fetchCollection(collectionName: string) {
  const response = await payloadFetch(`${collectionName}?limit=0`);
  return await response.json();
}

// slugs

export function processFetchResponse(data) {
  return data?.docs?.[0] || null;
}

export async function fetchSlug(collectionName: string, slug: string) {
  const response = await payloadFetch(
    `${collectionName}?where[slug][equals]=${slug}`,
  );
  return processFetchResponse(await response.json());
}

export async function fetchPageSlug(collectionName: string, slug: string) {
  const response = await payloadFetch(
    `${collectionName}?where[slug][equals]=${slug}&depth=1`,
  );
  return processFetchResponse(await response.json());
}
