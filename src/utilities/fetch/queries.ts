import type { SiteConfig } from "@/env";
import type { CollectionEntry } from "astro:content";
import { payloadFetch } from "./payload-fetch";


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

export async function fetchPage(collectionName, slug) {
  const pageQuery = `${collectionName}?where[slug][equals]=${slug}&depth=1`;
  const res = await payloadFetch(pageQuery);
  const { docs: pageDocs } = await res.json();
  const page = pageDocs[0];
}

export async function fetchPageWithRedirect(collectionName, slug)
  {
const preview = import.meta.env.PREVIEW_MODE;
const response = await payloadFetch(
  `${collectionName}?where[slug][equals]=${slug}&draft=${preview}`,
);
const n = await response.json();
if (n.docs.length === 0) return null;
return n.docs[0];
}

export async function fetchPage2(slug)
{
  const preview = import.meta.env.PREVIEW_MODE;
  const res = await payloadFetch(
    `pages?where[slug][equals]=${slug}&draft=${preview}`,
  );
  const { docs } = await res.json();
  if (!docs?.length) return null;
  return docs[0];
}

export async function fetchPage3(slug) {
  const res = await payloadFetch(`pages?where[slug][equals]=${slug}`);
  const { docs } = await res.json();
  if (!docs?.length) return null;
  return  docs[0];
}