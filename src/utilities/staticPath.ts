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
