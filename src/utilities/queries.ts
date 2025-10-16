import payloadFetch from "@/utilities/payload-fetch";

const siteConfigEndpoint = "globals/site-config";

const preview = import.meta.env.PREVIEW_MODE;

interface SiteConfig {
  searchAccessKey?: string;
  searchAffiliate?: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryFont?: string;
  favicon?: any;
  logo?: any;
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const response = await payloadFetch(`${siteConfigEndpoint}?draft=${preview}`);
  const data = await response.json();
  return data as SiteConfig;
}
