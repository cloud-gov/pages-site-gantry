import { describe, it, expect, vi } from "vitest";
import {
  buildMenuWithCollectionSlugs,
  buildPreFooterWithCollectionSlugs,
} from "./buildMenuWithCollectionSlugs";

import type { FetchResult } from "@/env";
export const makeFetchMock = (map: Record<string | number, string | null>) => {
  // map: { entryId: collectionTypeSlugOrNull }
  return vi.fn(async (id: string | number): Promise<FetchResult> => {
    const collectionSlug = map[id];
    if (collectionSlug === undefined) {
      // Simulate fetch returning empty docs array (not found)
      return { docs: [] };
    }
    if (collectionSlug === null) {
      // Simulate error path by throwing
      throw new Error(`Network error for id=${id}`);
    }
    return {
      docs: [
        {
          id,
          slug: `some-entry-slug-${id}`,
          collectionType: { id: 4, title: "Projects", slug: collectionSlug },
          title: `Some Title ${id}`,
        },
      ],
    };
  });
};

export const singleLink = {
  id: "69a1c5b1b6f2ab349b2d1f4d",
  label: "A Collection Entry",
  collectionEntry: {
    id: 315,
    slug: "eternal-summit-6998",
    title: "Eternal Summit 6998",
  },
  blockName: null,
  blockType: "collectionEntryLink",
};

export const nestedDropdown = {
  blockType: "dropdown",
  label: "Dropdown",
  links: [
    {
      blockType: "collectionEntryLink",
      collectionEntry: {
        id: 2,
        slug: "daring-summit-9331",
        title: "Daring Summit 9331",
      },
    },
    {
      blockType: "dropdown",
      label: "Nested",
      links: [
        {
          blockType: "collectionEntryLink",
          collectionEntry: { id: 999, slug: "inner-page", title: "Inner Page" },
        },
      ],
    },
  ],
};

export const containers = {
  items: [
    {
      blockType: "collectionEntryLink",
      collectionEntry: {
        id: 777,
        slug: "projects-alpha",
        title: "Projects Alpha",
      },
    },
  ],
  link: [
    {
      blockType: "collectionEntryLink",
      collectionEntry: { id: 888, slug: "labs-beta", title: "Labs Beta" },
    },
  ],
};

describe("buildMenuWithCollectionSlugs", () => {
  it("adds collectionSlug to a single collectionEntryLink", async () => {
    const input = structuredClone(singleLink);
    const fetchMock = makeFetchMock({ 315: "projects" });

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    // input not mutated
    expect(input.collectionEntry.collectionSlug).toBeUndefined();

    // expected enrichment
    expect(result).toMatchObject({
      blockType: "collectionEntryLink",
      collectionEntry: {
        id: 315,
        slug: "eternal-summit-6998",
        title: "Eternal Summit 6998",
        collectionSlug: "projects",
      },
    });

    // fetch called once with provided id
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(315);
  });

  it("recurses and enriches nested dropdowns and links", async () => {
    const input = structuredClone(nestedDropdown);
    const fetchMock = makeFetchMock({ 2: "projects", 999: "projects" });

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    // original not mutated
    expect(input.links?.[0]?.collectionEntry?.collectionSlug).toBeUndefined();

    // enriched shape maintained
    expect(result).toMatchObject({
      blockType: "dropdown",
      links: [
        {
          blockType: "collectionEntryLink",
          collectionEntry: {
            id: 2,
            slug: "daring-summit-9331",
            collectionSlug: "projects",
          },
        },
        {
          blockType: "dropdown",
          links: [
            {
              blockType: "collectionEntryLink",
              collectionEntry: {
                id: 999,
                slug: "inner-page",
                collectionSlug: "projects",
              },
            },
          ],
        },
      ],
    });

    // called for both IDs
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("enriches generic containers with items[] and link[]", async () => {
    const input = structuredClone(containers);
    const fetchMock = makeFetchMock({ 777: "projects", 888: "projects" });

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    // same top-level keys
    expect(Object.keys(result)).toEqual(["items", "link"]);

    // enriched nested links
    expect(result.items?.[0]).toMatchObject({
      blockType: "collectionEntryLink",
      collectionEntry: { id: 777, collectionSlug: "projects" },
    });
    expect(result.link?.[0]).toMatchObject({
      blockType: "collectionEntryLink",
      collectionEntry: { id: 888, collectionSlug: "projects" },
    });
  });

  it("handles missing docs (no collectionSlug added) and leaves node untouched", async () => {
    const input = structuredClone(singleLink);
    // undefined mapping => returns empty docs []
    const fetchMock = makeFetchMock({});

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    // unchanged because no collectionType.slug found
    expect(result).toEqual(input);
  });

  it("handles fetch errors gracefully (logs + no enrichment)", async () => {
    const input = structuredClone(singleLink);
    const fetchMock = makeFetchMock({ 315: null }); // null => throw

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    expect(result).toEqual(input);
  });

  it("caches repeated lookups by id within a single run", async () => {
    const input = {
      blockType: "dropdown",
      links: [
        {
          blockType: "collectionEntryLink",
          collectionEntry: { id: 42, slug: "alpha", title: "Alpha" },
        },
        {
          blockType: "collectionEntryLink",
          collectionEntry: { id: 42, slug: "alpha-dup", title: "Alpha Dup" },
        },
      ],
    };

    const fetchMock = makeFetchMock({ 42: "projects" });

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    // both links enriched
    expect(result.links?.[0]?.collectionEntry?.collectionSlug).toBe("projects");
    expect(result.links?.[1]?.collectionEntry?.collectionSlug).toBe("projects");

    // only one fetch due to internal cache
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns arrays enriched when root is an array", async () => {
    const input = [
      {
        blockType: "collectionEntryLink",
        collectionEntry: { id: 1, slug: "one", title: "One" },
      },
      {
        blockType: "collectionEntryLink",
        collectionEntry: { id: 2, slug: "two", title: "Two" },
      },
    ];
    const fetchMock = makeFetchMock({ 1: "projects", 2: "projects" });

    const result = await buildMenuWithCollectionSlugs(input, fetchMock);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].collectionEntry.collectionSlug).toBe("projects");
    expect(result[1].collectionEntry.collectionSlug).toBe("projects");
  });
});

describe("buildPreFooterWithCollectionSlugs", () => {
  it("normalizes and enriches preFooter.slimLink and linkGroup[].link[]", async () => {
    const preFooter = {
      slimLink: [
        {
          blockType: "collectionEntryLink",
          collectionEntry: { id: 11, slug: "slim", title: "Slim" },
        },
      ],
      linkGroup: [
        {
          heading: "Group A",
          link: [
            {
              blockType: "collectionEntryLink",
              collectionEntry: { id: 22, slug: "group-a", title: "Group A" },
            },
          ],
        },
      ],
    };

    const fetchMock = makeFetchMock({ 11: "projects", 22: "projects" });

    const result = await buildPreFooterWithCollectionSlugs(
      preFooter,
      fetchMock,
    );

    expect(result.slimLink[0].collectionEntry.collectionSlug).toBe("projects");
    expect(result.linkGroup[0].link[0].collectionEntry.collectionSlug).toBe(
      "projects",
    );
  });

  it("is resilient to non-array slimLink/linkGroup shapes", async () => {
    const preFooter = { slimLink: null, linkGroup: null } as any;
    const fetchMock = makeFetchMock({});

    const result = await buildPreFooterWithCollectionSlugs(
      preFooter,
      fetchMock,
    );

    expect(result.slimLink).toEqual([]);
    expect(result.linkGroup).toEqual([]);
  });
});
