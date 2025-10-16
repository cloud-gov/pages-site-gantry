import payloadFetch from "@/utilities/payload-fetch";

const siteConfigEndpoint = "globals/site-config";

const previewMode = import.meta.env.PREVIEW_MODE;

const siteConfigResponse = await payloadFetch(
  `${siteConfigEndpoint}?draft=${previewMode}`,
);

export const siteConfigResponseData = await siteConfigResponse.json();
