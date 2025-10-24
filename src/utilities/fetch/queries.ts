import type { SiteConfig } from "@/env";
import { payloadFetch } from "@/utilities/fetch";
import type { CollectionEntry } from "astro:content";

const siteConfigEndpoint = "globals/site-config";
const menuEndpoint = "globals/menu";
export const menuCollectionName = "menu";

const preview = import.meta.env.PREVIEW_MODE;

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const response = await payloadFetch(`${siteConfigEndpoint}?draft=${preview}`);
  const data = await response.json();
  return data as SiteConfig;
}

export async function fetchMenu(): Promise<
  CollectionEntry<typeof menuCollectionName>["data"]
> {
  const menuResponse = await payloadFetch(`${menuEndpoint}`);
  const menuResponseData = await menuResponse.json();
  const menu = menuResponseData;

  return menu;
}

export async function fetchPage(collectionName, slug)
{
const pageQuery = `${collectionName}?where[slug][equals]=${slug}&depth=1`;
const res = await payloadFetch(pageQuery);
const { docs: pageDocs } = await res.json();
const page = pageDocs[0];
}

