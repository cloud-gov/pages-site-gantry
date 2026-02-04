import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import RichText from "./RichText.astro";

describe("RichText", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  describe("rich text embedded images", () => {
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

  describe("rich text embedded tables", () => {
    it("renders a table with USWDS classes and semantic markup", async () => {
      const richTextProps = {
        content: {
          root: {
            children: [
              {
                type: "table",
                children: [
                  {
                    type: "tablerow",
                    children: [
                      {
                        type: "tablecell",
                        headerState: 1,
                        children: [{ text: "Header 1" }],
                      },
                      {
                        type: "tablecell",
                        headerState: 1,
                        children: [{ text: "Header 1" }],
                      },
                    ],
                  },
                  {
                    type: "tablerow",
                    children: [
                      {
                        type: "tablecell",
                        headerState: 2,
                        children: [{ text: "Row 1" }],
                      },
                      {
                        type: "tablecell",
                        headerState: 0,
                        children: [{ text: "Data 1" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      };

      const result = await container.renderToString(RichText, {
        props: richTextProps,
      });

      // Check for table classes
      expect(result).toContain('<table class="usa-table usa-table--striped">');

      // Check for thead and tbody
      expect(result).toContain("<thead>");
      expect(result).toContain("<tbody>");

      // Check for scope attributes
      expect(result).toContain('scope="col"');
      expect(result).toContain('scope="row"');

      // Check for cell content
      expect(result).toContain("Header 1");
      expect(result).toContain("Data 1");
    });
  });
});
