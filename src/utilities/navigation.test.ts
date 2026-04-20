import { describe, it, expect } from "vitest";
import { convertMenuToSideNav } from "./navigation"; // <-- adjust import path
// or: import { convertMenuToSideNav } from "@/utilities/navigation"; (if your vitest config resolves @)

describe("convertMenuToSideNav", () => {
  it("maps top-level blockTypes to expected hrefs", () => {
    const menuData = [
      {
        id: "1",
        label: "A Page Link",
        blockType: "pageLink",
        page: {
          id: 33,
          slug: "golden-harbor-2070",
          title: "Golden Harbor 2070",
        },
        order: 2,
      },
      {
        id: "2",
        label: "An External Link",
        blockType: "externalLink",
        url: "https://gsa.gov",
        order: 1,
      },
      {
        id: "3",
        label: "A Site Link",
        blockType: "link",
        url: "https://cloud.gov",
        order: 3,
      },
      {
        id: "4",
        label: "A Collection Type",
        blockType: "collectionTypeLink",
        collectionType: { id: 3, title: "Blog Posts", slug: "blog-posts" },
        order: 5,
      },
      {
        id: "5",
        label: "A Collection Entry",
        blockType: "collectionEntryLink",
        collectionEntry: {
          id: 2,
          slug: "daring-summit-9331",
          title: "Daring Summit 9331",
          collectionSlug: "articles",
        },
        order: 4,
      },
    ];

    const result = convertMenuToSideNav(menuData);

    // sorting by order happens at the end
    expect(result.map((i) => i.id)).toEqual(["2", "1", "3", "5", "4"]);

    // NOTE: this matches your current implementation:
    // top-level pageLink does NOT start with "/"
    expect(result.find((i) => i.id === "1")?.href).toBe("golden-harbor-2070");

    expect(result.find((i) => i.id === "2")?.href).toBe("https://gsa.gov");
    expect(result.find((i) => i.id === "3")?.href).toBe("https://cloud.gov");
    expect(result.find((i) => i.id === "4")?.href).toBe("/blog-posts");
    expect(result.find((i) => i.id === "5")?.href).toBe(
      "/articles/daring-summit-9331",
    );
  });

  it("maps subitems and sorts children by order", () => {
    const menuData = [
      {
        id: "parent",
        label: "Parent",
        blockType: "collectionTypeLink",
        collectionType: { slug: "resources" },
        order: 1,
        subitems: [
          {
            id: "c",
            label: "Child External",
            blockType: "externalLink",
            url: "https://example.com",
            order: 3,
          },
          {
            id: "a",
            label: "Child Page",
            blockType: "pageLink",
            page: { slug: "child-page" },
            order: 1,
          },
          {
            id: "b",
            label: "Child CollectionLink",
            blockType: "collectionLink",
            page: "projects",
            order: 2,
          },
        ],
      },
    ];

    const result = convertMenuToSideNav(menuData);

    expect(result).toHaveLength(1);
    expect(result[0].href).toBe("/resources");

    // children are sorted by their order
    const children = result[0].children ?? [];
    expect(children.map((c) => c.id)).toEqual(["a", "b", "c"]);

    // child mapping rules (match your current implementation)
    expect(children[0].href).toBe("/child-page"); // pageLink child has leading "/"
    expect(children[1].href).toBe("/projects"); // collectionLink child
    expect(children[2].href).toBe("https://example.com"); // externalLink child
  });

  it("falls back safely when fields are missing", () => {
    const menuData = [
      { label: "No ID", blockType: "externalLink", url: "https://x.test" },
      { id: "has-id", label: "Unknown type", blockType: "weirdType" },
      {
        id: "no-url",
        label: "External missing url",
        blockType: "externalLink",
      },
      { id: "no-page", label: "Page missing page", blockType: "pageLink" },
    ];

    const result = convertMenuToSideNav(menuData);

    // Random IDs are generated for missing id; just assert shape
    expect(result[0].id).toBeTypeOf("string");
    expect(result[0].id.length).toBeGreaterThan(0);

    // Unknown blockType returns default "#"
    expect(result.find((i) => i.id === "has-id")?.href).toBe("#");

    // Missing url returns ""
    expect(result.find((i) => i.id === "no-url")?.href).toBe("");

    // Missing page.slug returns "" (because `${""}`)
    expect(result.find((i) => i.id === "no-page")?.href).toBe("");
  });
});
