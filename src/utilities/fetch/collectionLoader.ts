import { payloadFetch, safeJsonParse } from "./payload-fetch";

export function collectionLoader(apiPath: string) {
  return async () => {
    const response = await payloadFetch(`${apiPath}?limit=0`);
    const data = await safeJsonParse(response);

    if (apiPath.includes("globals")) {
      return [{ ...data, id: "main" }];
    } else {
      if (!data.docs) {
        console.error(`No docs property in response for ${apiPath}:`, data);
        return [];
      }
      return data.docs
        .filter((doc) => doc.slug) // we have issues without a slug
        .map((doc) => {
          return { ...doc, id: doc.slug };
        });
    }
  };
}
