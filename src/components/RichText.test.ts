import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import RichText from "./RichText.astro";

describe("RichText", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders an added img tag with the expected alt attribute and value", async () => {
    const richTextProps = {
      content: {
        root: {
          children: [
            {
              type: "upload",
              value: {
                altText: "alt text",
                site: {
                  bucket: "bucket1",
                },
                url: "/asset/upload.png",
                filename: "upload.png",
                mimeType: "image/png",
                filesize: 123456,
              },
            },
          ],
        },
      },
    };

    const result = await container.renderToString(RichText, {
      props: richTextProps,
    });

    expect(result).toContain("alt text");
  });
});
