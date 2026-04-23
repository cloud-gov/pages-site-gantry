import { describe, it, expect, beforeEach, vi } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

// --- Mocks for test runs ---
const payloadFetchMock = vi.fn();
const buildMenuWithCollectionSlugsMock = vi.fn();
const convertMenuToSideNavMock = vi.fn();

vi.mock("@/utilities/fetch/payload-fetch", () => ({
  payloadFetch: (...args: any[]) => payloadFetchMock(...args),
}));

vi.mock("@/utilities/fetch", () => ({
  buildMenuWithCollectionSlugs: (...args: any[]) =>
    buildMenuWithCollectionSlugsMock(...args),
  fetchCollectionEntry: vi.fn(),
}));

vi.mock("@/utilities/navigation", () => ({
  convertMenuToSideNav: (...args: any[]) => convertMenuToSideNavMock(...args),
  createNavFromPages: vi.fn(() => []),
  organizeNavItems: vi.fn(() => []),
}));

type AstroRender = string | { html: string };

const mockResponse = (jsonData: any, ok = true) => ({
  ok,
  json: async () => jsonData,
});

describe("PageWithSideNav", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  // Import fresh each test to honor per-test mock implementations
  const importComponent = async () => {
    const mod = await import("./PageWithSideNav.astro");
    return mod.default;
  };

  const renderHTML = async (
    Component: any,
    props: Record<string, any> = {},
  ) => {
    const res = (await container.renderToString(Component, {
      props,
    })) as AstroRender;
    return typeof res === "string" ? res : res.html;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    container = await AstroContainer.create();

    buildMenuWithCollectionSlugsMock.mockImplementation(
      async (items: any[]) => items,
    );
    convertMenuToSideNavMock.mockImplementation((items: any[]) => items);

    // Default: if fetch is called unexpectedly, fail loudly
    payloadFetchMock.mockImplementation(() => {
      throw new Error(
        "payloadFetch was called but not configured in this test",
      );
    });
  });

  it("renders SideNav wrapper when showSideNav is true and sideNavItems are provided", async () => {
    const Component = await importComponent();

    const html = await renderHTML(Component, {
      heading: "Heading",
      description: "Desc",
      currentPath: "/test",
      showSideNav: true,
      sideNavItems: [{ id: "1", label: "One", href: "/one" }],
    });

    expect(html).toMatch(/<aside[^>]*class="sidenav-container"[^>]*>/);
    expect(html).toMatch(
      /<aside[^>]*class="sidenav-container"[^>]*>[\s\S]*<\/aside>/,
    );
  });

  it("renders hero image wrapper markup when heroImage prop is provided", async () => {
    const Component = await importComponent();

    const html = await renderHTML(Component, {
      heading: "Heading",
      description: "Desc",
      currentPath: "/test",
      showSideNav: false, // focus on hero area
      heroImage: {
        url: "/img.png",
        filename: "img.png",
        site: { bucket: "bucket" },
      },
    });

    // This wrapper is only present in the heroImage branch in component markup
    expect(html).toMatch(
      /<div[^>]*class="council-hero__logo-container[^"]*"[^>]*>[\s\S]*<\/div>/,
    );
    expect(html).toContain("page-hero");
  });

  it("renders description even when heroImage is not present (description provided)", async () => {
    const Component = await importComponent();

    const html = await renderHTML(Component, {
      heading: "Heading",
      description: "This should show",
      currentPath: "/test",
      showSideNav: false,
      heroImage: null,
    });

    // Allow for Astro's injected data-astro-* attributes
    expect(html).toMatch(
      /<p[^>]*class="council-hero__brow"[^>]*>\s*This should show\s*<\/p>/,
    );
  });

  it("does not render hero image or description markup when neither is present", async () => {
    const Component = await importComponent();

    const html = await renderHTML(Component, {
      heading: "Heading Only",
      description: "",
      currentPath: "/test",
      showSideNav: false,
      heroImage: null,
    });

    expect(html).not.toContain("council-hero__brow");
    expect(html).not.toContain("page-hero");
    expect(html).toMatch(/<h1[^>]*>\s*Heading Only\s*<\/h1>/);
  });

  it("does not render sidenav markup when showSideNav is false (even if items exist)", async () => {
    const Component = await importComponent();

    const html = await renderHTML(Component, {
      heading: "Heading",
      currentPath: "/test",
      showSideNav: false,
      sideNavItems: [{ id: "1", label: "One", href: "/one" }],
    });

    expect(html).not.toContain('<aside class="sidenav-container">');
  });

  it("fetches side nav config when showSideNav=true and sideNavItems empty, and renders sidenav when enabled+items exist", async () => {
    const Component = await importComponent();

    payloadFetchMock.mockImplementation(async (path: string) => {
      if (path === "side-navigation/abc") {
        return mockResponse({
          enabled: true,
          title: "Page Navigation",
          items: [{ id: "1", label: "One", href: "/one" }],
          fallbackToAllPages: false,
        });
      }
      throw new Error(`Unexpected payloadFetch path: ${path}`);
    });

    const html = await renderHTML(Component, {
      heading: "Heading",
      currentPath: "/test",
      showSideNav: true,
      sideNavId: "abc",
      sideNavItems: [], // triggers fetch path
    });

    expect(payloadFetchMock).toHaveBeenCalledWith("side-navigation/abc");
    expect(html).toMatch(/<aside[^>]*class="sidenav-container"[^>]*>/);
  });

  it("does not render sidenav markup when fetched config disables it", async () => {
    const Component = await importComponent();

    payloadFetchMock.mockResolvedValue(
      mockResponse({
        enabled: false,
        title: "Page Navigation",
        items: [{ id: "1", label: "One", href: "/one" }],
      }),
    );

    const html = await renderHTML(Component, {
      heading: "Heading",
      currentPath: "/test",
      showSideNav: true,
      sideNavItems: [], // triggers fetch (global)
      sideNavId: null,
    });

    expect(payloadFetchMock).toHaveBeenCalledWith("globals/side-navigation");
    expect(html).not.toContain('<aside class="sidenav-container">');
  });
});
