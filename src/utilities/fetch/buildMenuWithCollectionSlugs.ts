/**
 * Enriches any structure containing menu-like items:
 * - Adds `collectionSlug` to `collectionEntryLink` items by fetching by id.
 * - Recurses through `dropdown.links`, `items[]`, and `link[]`.
 *
 * Returns the SAME SHAPE it receives (shape-preserving & generic).
 */

import type {
  CollectionEntryLink,
  Dropdown,
  FetchResult,
  MenuItem,
} from "@/env";

export async function buildMenuWithCollectionSlugs<T>(
  data: T,
  fetchCollectionEntry: (id: string | number) => Promise<FetchResult>,
): Promise<T> {
  // cache collectionSlug lookups by id
  const cache = new Map<string | number, Promise<string | null>>();
  const getCollectionSlug = (id: string | number): Promise<string | null> => {
    if (!cache.has(id)) {
      const p = (async () => {
        try {
          const res = await fetchCollectionEntry(id);
          return res?.docs?.[0]?.collectionType?.slug ?? null;
        } catch (e) {
          console.error(`fetchCollectionEntry failed for id=${id}`, e);
          return null;
        }
      })();
      cache.set(id, p);
    }
    return cache.get(id)!;
  };

  // Generic deep-enrichment with special cases for known item shapes
  async function enrichNode<
    U extends MenuItem | Record<string, unknown> | unknown,
  >(node: U): Promise<U> {
    // 0) null/primitive → return as-is
    if (node == null || typeof node !== "object") return node;

    // 1) Arrays → enrich each element
    if (Array.isArray(node)) {
      const next = await Promise.all(node.map((child) => enrichNode(child)));
      return next as unknown as U;
    }

    // From here on, it's a plain object
    const obj = node as Record<string, any>;

    // 2) Leaves: collectionEntryLink → add collectionSlug
    if (obj?.blockType === "collectionEntryLink") {
      const link = obj as unknown as CollectionEntryLink;
      const id = link?.collectionEntry?.id;
      if (id != null) {
        const collectionSlug = await getCollectionSlug(id);
        if (collectionSlug) {
          return {
            ...(obj as any),
            collectionEntry: { ...link.collectionEntry, collectionSlug },
          } as U;
        }
      }
      return node;
    }

    // 3) Dropdowns: recurse into dropdown.links (if array)
    if (obj?.blockType === "dropdown") {
      const dropdown = obj as unknown as Dropdown;
      const newLinks = Array.isArray(dropdown.links)
        ? await Promise.all(dropdown.links.map((l) => enrichNode(l)))
        : dropdown.links;
      return { ...(obj as any), links: newLinks } as U;
    }

    // 4) Generic containers: recurse into known array keys (items[], link[])
    const clone: Record<string, any> = { ...obj };

    if (Array.isArray(obj.items)) {
      clone.items = await Promise.all(
        obj.items.map((child: unknown) => enrichNode(child)),
      );
    }

    if (Array.isArray(obj.link)) {
      clone.link = await Promise.all(
        obj.link.map((child: unknown) => enrichNode(child)),
      );
    }

    return clone as U;
  }
  // Return the same shape that came in
  return (await enrichNode(data)) as T;
}

export async function buildPreFooterWithCollectionSlugs<
  T extends {
    slimLink?: any;
    linkGroup?: Array<{ link?: unknown[] }>;
  },
>(
  preFooter: T,
  fetchCollectionEntry: (id: string | number) => Promise<FetchResult>,
): Promise<T> {
  const linkGroup = Array.isArray(preFooter?.linkGroup)
    ? preFooter.linkGroup
    : [];

  const slimLinks = Array.isArray(preFooter?.slimLink)
    ? preFooter.slimLink
    : [];

  const enrichedLinkGroup = await Promise.all(
    linkGroup.map(async (group) => {
      const itemsArray = Array.isArray(group?.link) ? group.link : [];
      // normalize → enrich → map back
      const normalizedRoot = { items: itemsArray };
      const enriched = await buildMenuWithCollectionSlugs(
        normalizedRoot,
        fetchCollectionEntry,
      );
      return {
        ...group,
        link: Array.isArray(enriched?.items) ? enriched.items : itemsArray,
      };
    }),
  );

  const slimArray = Array.isArray(slimLinks) ? slimLinks : [];

  const slimEnriched = await buildMenuWithCollectionSlugs(
    slimArray,
    fetchCollectionEntry,
  );

  return {
    ...preFooter,
    linkGroup: enrichedLinkGroup,
    slimLink: slimEnriched,
  };
}
