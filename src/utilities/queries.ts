import type { HomePage, SiteConfig } from "@/env";
import payloadFetch from "@/utilities/payload-fetch";

const siteConfigEndpoint = "globals/site-config";
const homePageEndpoint = "globals/home-page";

const preview = import.meta.env.PREVIEW_MODE;

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const response = await payloadFetch(`${siteConfigEndpoint}?draft=${preview}`);
  return response.json();
}

export async function fetchHomePage(): Promise<HomePage> {
  const response = await payloadFetch(`${homePageEndpoint}?draft=${preview}`);
  return response.json();
}
