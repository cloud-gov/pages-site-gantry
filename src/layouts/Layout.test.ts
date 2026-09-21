import { beforeEach, describe, expect, it, vi } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(async () => []),
  getEntry: vi.fn(async () => ({
    data: { agencyName: "Agency Homepage" },
  })),
}));

vi.mock("@/utilities/fetch", () => ({
  fetchSiteConfig: vi.fn(async () => ({
    agencyName: "Agency Homepage",
    theme: {
      colorPrimary: "#123456",
      customCss: ".foo { color: red; }",
    },
  })),
  fetchMenu: vi.fn(async () => ({ id: "menu", items: [] })),
  fetchPreFooter: vi.fn(async () => null),
  fetchCollection: vi.fn(async () => ({ docs: [] })),
  fetchCollectionEntry: vi.fn(async () => null),
  fetchFooter: vi.fn(async () => ({})),
  alertsMapper: vi.fn(() => []),
  buildMenuWithCollectionSlugs: vi.fn(async (menu) => menu),
  footerMapper: vi.fn(() => ({})),
}));

vi.mock("@/utilities/fetch/buildMenuWithCollectionSlugs", () => ({
  buildPreFooterWithCollectionSlugs: vi.fn(async () => null),
}));

describe("Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("injects runtime theme and scoped custom css", async () => {
    const { default: Layout } = await import("./Layout.astro");
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: "Test page" },
    });

    expect(result).toContain('style id="site-theme"');
    expect(result).toContain("--color-primary: #123456;");
    expect(result).toContain('style id="site-custom-css"');
    expect(result).toContain("body.has-custom-css .foo");
    expect(result).toContain("has-custom-css");
  });
});
