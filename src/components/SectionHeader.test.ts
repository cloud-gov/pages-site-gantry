import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SectionHeader from "./SectionHeader.astro";

describe("SectionHeader", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  const renderHTML = async (
    props: Record<string, any> = {},
    slots: Record<string, any> = { default: "Default Heading" },
  ) => {
    const res = (await container.renderToString(SectionHeader, {
      props,
      slots,
    })) as unknown;

    if (typeof res === "string") return res;

    if (res && typeof res === "object" && "html in res") {
      return (res as { html: string }).html;
    }

    throw new Error("Unexpected renderToString result");
  };

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders an h2 by default", async () => {
    const html = await renderHTML({}, { default: "Default Heading" });

    expect(html).toContain("Default Heading");
    expect(html).toMatch(/<h2\b[^>]*>/);
  });

  it("renders the correct heading level when provided", async () => {
    const html = await renderHTML(
      { headingLevel: "h4" },
      { default: "Level 4" },
    );

    expect(html).toContain("Level 4");
    expect(html).toMatch(/<h4\b[^>]*>/);
  });

  it("applies a custom class", async () => {
    const html = await renderHTML(
      { headingLevel: "h3", class: "usa-heading margin-top-2" },
      { default: "Styled" },
    );

    expect(html).toContain("Styled");
    expect(html).toMatch(/<h3\b[^>]*class="[^"]*\busa-heading\b[^"]*"/);
  });

  it("falls back to h2 for an invalid headingLevel", async () => {
    const html = await renderHTML(
      { headingLevel: "banana" as any },
      { default: "Fallback" },
    );

    expect(html).toContain("Fallback");
    expect(html).toMatch(/<h2\b[^>]*>/);
  });

  it("renders without requiring a class when none is provided", async () => {
    const html = await renderHTML(
      { headingLevel: "h5" },
      { default: "No Class" },
    );

    expect(html).toContain("No Class");
    expect(html).toMatch(/<h5\b[^>]*>/);
  });
});
