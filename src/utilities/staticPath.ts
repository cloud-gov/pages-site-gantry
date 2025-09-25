import { getCollection, type DataEntryMap} from "astro:content";
import payloadFetch from "./payload-fetch";

export function createGetStaticPath(collectionName: keyof DataEntryMap) {
  return async function () {
    const collection = await getCollection(collectionName);

    return collection.map((doc) => {
        return {
        params: { slug: doc.id },
        props: doc,
        };
    });
  }
 }

export function createPagingStaticPath(pageSize: number, collectionName: string) {
  return async function getStaticPaths() {
    const preview = import.meta.env.PREVIEW_MODE;
    const response = await payloadFetch(`${collectionName}?draft=${preview}&limit=0`);
    const data = await response.json();
    const totalItems = data.totalDocs || data.docs?.length || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paths = Array.from({ length: totalPages }).map((_, i) => ({
      params: { page: String(i + 1) },
    }));

    return paths;
  };
}
