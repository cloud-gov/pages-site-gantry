import type { SiteConfig } from "@/env";
import payloadFetch from "@/utilities/payload-fetch";

const siteConfigEndpoint = "globals/site-config";

const preview = import.meta.env.PREVIEW_MODE;

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const response = await payloadFetch(`${siteConfigEndpoint}?draft=${preview}`);
  const data = await response.json();
  return data as SiteConfig;
}
