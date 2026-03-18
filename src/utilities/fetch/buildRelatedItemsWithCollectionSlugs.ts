import type { FetchResult } from "@/env";

export interface RelatedItem {
  id: string;
  label: string;
  collectionEntry: {
    id: number | string;
    slug: string;
    title: string;
    collectionSlug?: string;
    publishedAt?: string;
  };
  blockType: string;
  [key: string]: any;
}

export async function buildRelatedItemsWithCollectionSlugs(
  relatedItems: RelatedItem[],
  fetchCollectionEntry: (id: string | number) => Promise<FetchResult>,
): Promise<RelatedItem[]> {
  const cache = new Map<
    string | number,
    Promise<{ slug: string | null; publishedAt: string | null }>
  >();

  const getCollectionEnriched = (
    id: string | number,
  ): Promise<{
    slug: string | null;
    publishedAt: string | null;
  }> => {
    if (!cache.has(id)) {
      const p = (async () => {
        try {
          const res = await fetchCollectionEntry(id);
          const doc = res?.docs?.[0];

          const publishedAt = doc?.publishedAt ?? null;

          const publishedAtFormatted =
            publishedAt !== null
              ? new Date(publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : null;

          return {
            slug: doc?.collectionType?.slug ?? null,
            publishedAt: publishedAtFormatted,
          };
        } catch (err) {
          console.error(`Failed to fetch collectionEntry for id=${id}`, err);
          return { slug: null, publishedAt: null };
        }
      })();

      cache.set(id, p);
    }

    return cache.get(id)!;
  };

  return Promise.all(
    relatedItems.map(async (item) => {
      if (
        item.blockType === "collectionEntryLink" &&
        item.collectionEntry?.id != null
      ) {
        const enriched = await getCollectionEnriched(item.collectionEntry.id);

        return {
          ...item,
          collectionEntry: {
            ...item.collectionEntry,
            collectionSlug: enriched.slug ?? undefined,
            publishedAt: enriched.publishedAt ?? undefined,
          },
        };
      }
      return item;
    }),
  );
}
