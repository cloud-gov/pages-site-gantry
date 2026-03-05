import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import Menu from "./Menu.astro";

const menuData = [
  {
    id: "69a1c56ab6f2ab349b2d1f45",
    label: "A Page Link",
    blockType: "pageLink",
    page: { id: 33, slug: "golden-harbor-2070", title: "Golden Harbor 2070" },
  },
  {
    id: "69a1c579b6f2ab349b2d1f47",
    label: "An External Link",
    blockType: "externalLink",
    url: "https://gsa.gov",
  },
  {
    id: "69a1c589b6f2ab349b2d1f49",
    label: "A Site Link",
    blockType: "link",
    url: "https://cloud.gov",
  },
  {
    id: "69a1c59eb6f2ab349b2d1f4b",
    label: "A Collection Type",
    blockType: "collectionTypeLink",
    collectionType: { id: 3, title: "Blog Posts", slug: "blog-posts" },
  },
  {
    id: "69a1c5b1b6f2ab349b2d1f4d",
    label: "A Collection Entry",
    blockType: "collectionEntryLink",
    collectionEntry: {
      id: 2,
      slug: "daring-summit-9331",
      title: "Daring Summit 9331",
      collectionSlug: "articles",
    },
  },
  {
    id: "69a1c5c1b6f2ab349b2d1f4f",
    label: "Dropdown",
    blockType: "dropdown",
    links: [
      {
        id: "69a1c5ccb6f2ab349b2d1f51",
        label: "DD Site Link",
        blockType: "link",
        url: "https://login.gov",
      },
      {
        id: "69a1c5dab6f2ab349b2d1f53",
        label: "DD External Link",
        blockType: "externalLink",
        url: "https://senate.gov",
      },
      {
        id: "69a1c5f7b6f2ab349b2d1f55",
        label: "DD Page Link",
        blockType: "pageLink",
        page: {
          id: 32,
          slug: "luminous-atlas-3933",
          title: "Luminous Atlas 3933",
        },
      },
      {
        id: "69a1c607b6f2ab349b2d1f57",
        label: "DD Collection Link",
        blockType: "collectionTypeLink",
        collectionType: { id: 4, title: "Projects", slug: "projects" },
      },
      {
        id: "69a1c617b6f2ab349b2d1f59",
        label: "DD Collection Entry",
        blockType: "collectionEntryLink",
        collectionEntry: {
          id: 45,
          slug: "luminous-meadow-1267",
          title: "Luminous Meadow 1267",
          collectionSlug: "articles",
        },
      },
    ],
  },
];

describe("Menu Component href logic", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderAndParse() {
    const result = await container.renderToString(Menu, {
      props: {
        title: "Menu",
        items: menuData,
        searchAccessKey: "",
        searchAffiliate: "",
      },
    });
    const parser = new DOMParser();
    return parser.parseFromString(result, "text/html");
  }

  it("resolves correct hrefs for all blockTypes", async () => {
    const doc = await renderAndParse();

    const links = Array.from(doc.querySelectorAll("a"));

    const hrefs = links.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("/golden-harbor-2070"); // pageLink
    expect(hrefs).toContain("https://gsa.gov"); // externalLink
    expect(hrefs).toContain("https://cloud.gov"); // link
    expect(hrefs).toContain("/blog-posts"); // collectionTypeLink
    expect(hrefs).toContain("/articles/daring-summit-9331"); // collectionEntryLink

    // Dropdown items
    expect(hrefs).toContain("https://login.gov"); // dropdown: link
    expect(hrefs).toContain("https://senate.gov"); // dropdown: externalLink
    expect(hrefs).toContain("/luminous-atlas-3933"); // dropdown: pageLink
    expect(hrefs).toContain("/projects"); // dropdown: collectionTypeLink
    expect(hrefs).toContain("/articles/luminous-meadow-1267"); // dropdown: collectionEntryLink
  });

  it("collectionEntryLinks must contain their collectionSlug", async () => {
    const doc = await renderAndParse();

    const anchors = Array.from(doc.querySelectorAll("a"));
    const entryLinks = anchors
      .map((a) => a.getAttribute("href"))
      .filter(
        (href) =>
          href?.includes("daring-summit-9331") ||
          href?.includes("luminous-meadow-1267"),
      );

    for (const href of entryLinks) {
      expect(href?.startsWith("/articles/")).toBe(true);
    }
  });
});
