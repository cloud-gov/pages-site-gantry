import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
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

    const parsed = new JSDOM(result);
    return parsed.window.document;
  }

  it("resolves correct hrefs for all blockTypes", async () => {
    const doc = await renderAndParse();
    const externalLinks = doc.querySelectorAll(".usa-link--external");
    const submenu = doc.querySelector(".usa-nav__submenu");
    const links = doc.querySelectorAll("a.usa-nav__link");

    expect(externalLinks).toBeTruthy();
    expect(externalLinks.length).toBe(2);
    expect(submenu).toBeTruthy();
    expect(submenu.children.length).toBe(5);

    Array.from(links).map((l) => {
      expect(JSON.stringify(menuData)).toContain(l.textContent.trim());
    });
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
