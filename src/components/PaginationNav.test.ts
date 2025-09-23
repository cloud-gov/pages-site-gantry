
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import PaginationNav from "./PaginationNav.astro";

describe("PaginationNav", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderAndParse(props: {
    currentPage: number;
    totalPages: number;
    basePath: string;
  }) {
    const result = await container.renderToString(PaginationNav, { props });
    const parser = new DOMParser();
    return parser.parseFromString(result, "text/html");
  }

  function getPaginationElements(doc: Document) {
    return {
      prevTab: doc.querySelector('.usa-pagination__previous-page'),
      nextTab: doc.querySelector('.usa-pagination__next-page'),
      pageTabs: doc.querySelectorAll('.usa-pagination__page-no'),
      elipsTabs: doc.querySelectorAll('.usa-pagination__overflow'),
      currentTab: doc.querySelector('.usa-current'),
    };
  }

  it("renders a list of page links", async () => {
    const doc = await renderAndParse({
      currentPage: 1,
      totalPages: 3,
      basePath: '/news/page',
    });

    const { prevTab, nextTab, pageTabs, elipsTabs } = getPaginationElements(doc);

    expect(prevTab).toBeNull();
    expect(pageTabs.length).toBe(3);
    expect(elipsTabs.length).toBe(0);
    expect(nextTab).not.toBeNull();
  });

  it("splits the list of page links with one elipses", async () => {
    const doc = await renderAndParse({
      currentPage: 1,
      totalPages: 10,
      basePath: '/news/page',
    });

    const { prevTab, nextTab, pageTabs, elipsTabs } = getPaginationElements(doc);

    expect(prevTab).toBeNull();
    expect(pageTabs.length).toBe(3);
    expect(elipsTabs.length).toBe(1);
    expect(nextTab).not.toBeNull();
  });

  it("splits the list of page links with two elipses", async () => {
    const doc = await renderAndParse({
      currentPage: 5,
      totalPages: 10,
      basePath: '/news/page',
    });

    const { prevTab, nextTab, pageTabs, elipsTabs } = getPaginationElements(doc);

    expect(prevTab).not.toBeNull();
    expect(pageTabs.length).toBe(5);
    expect(elipsTabs.length).toBe(2);
    expect(nextTab).not.toBeNull();
  });

  it("adds active page attribute for the current page", async () => {
    const doc = await renderAndParse({
      currentPage: 5,
      totalPages: 10,
      basePath: '/news/page',
    });

    const { currentTab } = getPaginationElements(doc);

    expect(currentTab?.innerHTML.trim()).toBe('5');
  });
});
