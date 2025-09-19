import { getCollection, type DataEntryMap} from "astro:content";

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

 export function createPagingStaticPath(pageSize: number, pagedCollection: keyof DataEntryMap) {
  return async function getStaticPaths() {
    const collection = await getCollection(pagedCollection);
    const totalPages = Math.ceil(collection.length / pageSize);

    return Array.from({ length: totalPages }).map((_, i) => ({
        params: { page: String(i + 1) },
    }));
  }
 }
