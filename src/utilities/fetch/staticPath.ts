import { type DataEntryMap, getCollection } from "astro:content";
import { payloadFetch } from "./payload-fetch";

export function createGetStaticPath(collectionName: keyof DataEntryMap) {
  return async function () {
    const collection = await getCollection(collectionName);

    return collection.map((doc) => {
      return {
        params: { slug: doc.id },
        props: doc,
      };
    });
  };
}

export function createPagingStaticPath(
  pageSize: number,
  collectionName: string,
) {
  return async function getStaticPaths() {
    const response = await payloadFetch(`${collectionName}?limit=0`);
    const data = await response.json();
    const totalItems = data.totalDocs || data.docs?.length || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paths = Array.from({ length: totalPages }).map((_, i) => ({
      params: { page: String(i + 1) },
    }));

    return paths;
  };
}

export function processPagesResponse(data) {
  return data?.docs?.map((page) => ({ params: { slug: page?.slug } })) ?? [];
}

export function createGetStaticPathForPages() {
  return async function getStaticPaths() {
    const response = await payloadFetch("pages?limit=0");
    const data = await response.json();
    return processPagesResponse(data);
  };
}

export function processPagesSlugResponse(data) {
  return (
    data?.docs
      ?.filter((p) => p?.slug)
      .map((p) => ({
        params: { slug: p.slug },
        props: { data: p },
      })) ?? []
  );
}

export function createStaticPathsForPagesSlug() {
  return async function getStaticPaths() {
    const res = await payloadFetch(`pages?limit=1000&depth=0`);
    let data = await res.json();
    return processPagesSlugResponse(data);
  };
}
