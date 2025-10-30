import { payloadFetch } from "./payload-fetch";

export function collectionLoader(apiPath: string) {
  return async () => {
    const response = await payloadFetch(`${apiPath}?limit=0`);

    if (!response.ok) {
      console.error(
        `API call failed for ${apiPath}:`,
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();

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
