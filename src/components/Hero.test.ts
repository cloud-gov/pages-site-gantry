import { describe, it, expect, beforeEach } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Hero from "./Hero.astro";

const defaultTitle = "Hero callout: Bring attention to a project priority!";
const defaultCTAButton = {
  text: "Call to action",
  url: "javascript:void(0)",
  style: "primary",
};
const defaultDescription =
  "Support the callout with some short explanatory text. You don&#39;t need more than a couple of sentences.";

describe("Hero", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  type AstroRender = string | { html: string };
  const renderHTML = async (props: Record<string, any> = {}) => {
    const res = (await container.renderToString(Hero, {
      props,
    })) as AstroRender;
    return typeof res === "string" ? res : res.html;
  };

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Default Props Rendering Tests
  it("renders with default props when no props are provided", async () => {
    const html = await renderHTML();

    expect(html).toContain(defaultTitle);
    expect(html).toContain(defaultDescription);
    expect(html).toContain(defaultCTAButton.text);
    expect(html).toContain(`href="${defaultCTAButton.url}"`);
  });

  it("renders default CTA button with correct attributes", async () => {
    const html = await renderHTML();

    expect(html).toContain('class="usa-button"');
    expect(html).toContain(defaultCTAButton.text);
    expect(html).toContain(`href="${defaultCTAButton.url}"`);
  });

  // Custom Props Rendering Tests
  it("renders with custom title", async () => {
    const html = await renderHTML({
      title: "Custom Hero Title",
    });

    expect(html).toContain("Custom Hero Title");
    expect(html).not.toContain(defaultTitle);
  });

  it("renders with custom subtitle", async () => {
    const html = await renderHTML({
      subtitle: "Custom Subtitle",
    });

    expect(html).toContain("Custom Subtitle");
    expect(html).toContain('class="usa-hero__heading--alt"');
  });

  it("renders with custom description", async () => {
    const html = await renderHTML({
      description: "Custom description text",
    });

    expect(html).toContain("Custom description text");
    expect(html).not.toContain(defaultDescription);
  });

  it("renders with all custom props", async () => {
    const html = await renderHTML({
      title: "Custom Title",
      subtitle: "Custom Subtitle",
      description: "Custom Description",
    });

    expect(html).toContain("Custom Title");
    expect(html).toContain("Custom Subtitle");
    expect(html).toContain("Custom Description");
  });

  it("renders with custom CTA button", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: "Learn More",
        url: "/learn-more",
        style: "secondary",
      },
    });

    expect(html).toContain("Learn More");
    expect(html).toContain('href="/learn-more"');
    expect(html).toContain('class="usa-button"');
  });

  // Conditional Rendering Tests
  it("does not render subtitle when not provided", async () => {
    const html = await renderHTML({
      title: "Test Title",
    });

    expect(html).not.toContain('class="usa-hero__heading--alt"');
    expect(html).not.toContain("<h2");
  });

  it("renders subtitle when provided", async () => {
    const html = await renderHTML({
      subtitle: "Test Subtitle",
    });

    expect(html).toContain("Test Subtitle");
    expect(html).toContain('<h2 class="usa-hero__heading--alt">');
  });

  it("renders description when provided", async () => {
    const html = await renderHTML({
      description: "Test description",
    });

    expect(html).toContain("Test description");
    expect(html).toContain("<p>");
  });

  it("renders CTA button when both url and text are provided", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: "Click Here",
        url: "/click",
      },
    });

    expect(html).toContain("Click Here");
    expect(html).toContain('href="/click"');
    expect(html).toContain('class="usa-button"');
  });

  it("does not render CTA button when url is missing", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: "Click Here",
        url: undefined,
      },
    });

    expect(html).not.toContain("Click Here");
    expect(html).not.toContain('class="usa-button"');
  });

  it("does not render CTA button when text is missing", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: undefined,
        url: "/click",
      },
    });

    expect(html).not.toContain('href="/click"');
    expect(html).not.toContain('class="usa-button"');
  });

  it("does not render CTA button when both url and text are missing", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: undefined,
        url: undefined,
      },
    });

    expect(html).not.toContain('class="usa-button"');
  });

  // Background Image Handling Tests
  it("applies background image style when bgImage is provided", async () => {
    const mockBgImage = {
      url: "https://example.com/image.jpg",
      filename: "image.jpg",
      site: { bucket: "test-bucket" },
    };

    const html = await renderHTML({
      bgImage: mockBgImage,
    });

    expect(html).toContain('style="background-image:');
    expect(html).toContain("background-size: cover");
    expect(html).toContain("background-position: center");
  });

  it("does not apply background image style when bgImage is not provided", async () => {
    const html = await renderHTML({
      title: "Test Title",
    });

    expect(html).toContain('class="usa-hero"');
    // The style attribute should be empty or not contain background-image
    const styleMatch = html.match(/style="([^"]*)"/);
    if (styleMatch) {
      expect(styleMatch[1]).not.toContain("background-image");
    }
  });

  it("handles bgImage with getMediaUrl result", async () => {
    const mockBgImage = {
      url: "https://example.com/hero.jpg",
      filename: "hero.jpg",
      site: { bucket: "hero-bucket" },
    };

    const html = await renderHTML({
      bgImage: mockBgImage,
    });

    // The background image URL will be processed by getMediaUrl
    // In test environment, it should return /~assets/filename
    expect(html).toContain('style="background-image:');
  });

  // HTML Structure and CSS Classes Tests
  it("applies usa-hero class to section element", async () => {
    const html = await renderHTML();

    expect(html).toContain('<section class="usa-hero"');
  });

  it("contains grid-container class", async () => {
    const html = await renderHTML();

    expect(html).toContain('class="grid-container"');
  });

  it("contains usa-hero__callout class", async () => {
    const html = await renderHTML();

    expect(html).toContain('class="usa-hero__callout"');
  });

  it("applies usa-hero__heading class to h1", async () => {
    const html = await renderHTML();

    expect(html).toContain('<h1 class="usa-hero__heading"');
  });

  it("applies usa-hero__heading--alt class to h2 when subtitle is provided", async () => {
    const html = await renderHTML({
      subtitle: "Test Subtitle",
    });

    expect(html).toContain('<h2 class="usa-hero__heading--alt">');
  });

  it("applies usa-button class to CTA link", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: "Button",
        url: "/button",
      },
    });

    expect(html).toContain('class="usa-button"');
  });

  it("renders correct HTML structure", async () => {
    const html = await renderHTML({
      title: "Test",
      subtitle: "Subtitle",
      description: "Description",
    });

    // Verify structure: section > div.grid-container > div.usa-hero__callout
    expect(html).toMatch(/<section[^>]*class="usa-hero"[^>]*>/);
    expect(html).toContain('<div class="grid-container">');
    expect(html).toContain('<div class="usa-hero__callout">');
    expect(html).toContain("<h1");
    expect(html).toContain("<h2");
    expect(html).toContain("<p>");
  });

  // Edge Cases Tests
  it("handles null subtitle", async () => {
    const html = await renderHTML({
      subtitle: null,
    });

    expect(html).not.toContain('class="usa-hero__heading--alt"');
  });

  it("handles undefined subtitle", async () => {
    const html = await renderHTML({
      subtitle: undefined,
    });

    expect(html).not.toContain('class="usa-hero__heading--alt"');
  });

  it("handles undefined description", async () => {
    const html = await renderHTML({
      description: undefined,
    });

    // Default description should render
    expect(html).toContain(defaultDescription);
  });

  it("handles null bgImage", async () => {
    const html = await renderHTML({
      bgImage: null,
    });

    const styleMatch = html.match(/style="([^"]*)"/);
    if (styleMatch) {
      expect(styleMatch[1]).not.toContain("background-image");
    }
  });

  it("handles undefined bgImage", async () => {
    const html = await renderHTML({
      bgImage: undefined,
    });

    const styleMatch = html.match(/style="([^"]*)"/);
    if (styleMatch) {
      expect(styleMatch[1]).not.toContain("background-image");
    }
  });

  it("handles incomplete ctaButton object with missing url", async () => {
    const html = await renderHTML({
      ctaButton: {
        text: "Button Text",
      },
    });

    expect(html).not.toContain("Button Text");
    expect(html).not.toContain('class="usa-button"');
  });

  it("handles incomplete ctaButton object with missing text", async () => {
    const html = await renderHTML({
      ctaButton: {
        url: "/link",
      },
    });

    expect(html).not.toContain('href="/link"');
    expect(html).not.toContain('class="usa-button"');
  });

  it("handles empty string for title", async () => {
    const html = await renderHTML({
      title: "",
    });

    expect(html).not.toContain('<h1 class="usa-hero__heading">');
  });

  it("handles empty string for subtitle", async () => {
    const html = await renderHTML({
      subtitle: "",
    });

    expect(html).not.toContain('class="usa-hero__heading--alt"');
  });

  it("handles empty string for description", async () => {
    const html = await renderHTML({
      description: "",
    });

    expect(html).not.toContain(defaultDescription);
  });
});
