import { payloadFetch, safeJsonParse } from "./payload-fetch";

export function collectionLoader(apiPath: string, slug: boolean = true) {
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
        .filter((doc) => !slug || doc.slug) // we have issues without a slug
        .map((doc) => ({
          ...doc,
          id: slug ? doc.slug : String(doc.id),
          ...(slug ? {} : { description: doc.title }),
        }));
    }
  };
}
