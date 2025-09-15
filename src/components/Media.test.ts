import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import Media from "./Media.astro";

describe("Media", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders an image tag when receiving a media prop", async () => {
    const mediaValues = {
      media: {
        mimeType: "image/jpeg",
        filesize: 9999,
        filename: "stock-photo.jpg",
        altText: "a stock photo",
      }
    }

    const result = await container.renderToString(Media, { props: mediaValues });

    expect(result).toContain("img");
    expect(result).toContain("a stock photo");
    expect(result).toContain("maxw-tablet");
    expect(result).not.toContain("usa-alert__text");
  });

  it("renders a link to download a file when receiving a media prop", async () => {
    const mediaValues = {
      media: {
        mimeType: "application/pdf",
        filesize: 99999,
        filename: "quick-brown-fox.pdf",
        altText: "a description",
      }
    }

    const result = await container.renderToString(Media, { props: mediaValues });

    expect(result).not.toContain("maxw-tablet")
    expect(result).toContain("usa-link");
    expect(result).toContain("usa-alert__text");
  });
});
