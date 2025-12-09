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

  describe("rich text embedded Process List blocks", () => {
    it("renders a processList block with USWDS classes and converted nested body", async () => {
      const richTextProps = {
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "block",
                fields: {
                  items: [
                    {
                      body: {
                        root: {
                          type: "root",
                          children: [
                            {
                              type: "paragraph",
                              children: [
                                {
                                  text: "Lorem ipsum",
                                  type: "text",
                                },
                              ],
                            },
                            {
                              tag: "ul",
                              type: "list",
                              start: 1,
                              children: [
                                {
                                  type: "listitem",
                                  value: 1,
                                  children: [
                                    {
                                      text: "Alpha",
                                      type: "text",
                                    },
                                  ],
                                },
                                {
                                  type: "listitem",
                                  value: 2,
                                  children: [
                                    {
                                      text: "Beta",
                                      type: "text",
                                    },
                                  ],
                                  direction: null,
                                },
                                {
                                  type: "listitem",
                                  value: 3,
                                  children: [
                                    {
                                      text: "Next paragraph",
                                      type: "text",
                                    },
                                  ],
                                  direction: null,
                                },
                              ],
                              listType: "bullet",
                              direction: null,
                            },
                          ],
                          direction: null,
                        },
                      },
                      heading: "Start a process",
                    },
                    {
                      body: {
                        root: {
                          type: "root",
                          children: [
                            {
                              type: "paragraph",
                              children: [
                                {
                                  text: "Next paragraph",
                                  type: "text",
                                },
                              ],
                            },
                          ],
                        },
                      },
                      heading: "Proceed to the second step",
                    },
                  ],
                  blockType: "processList",
                },
                format: "",
              },
            ],
          },
        },
      };

      const result = await container.renderToString(RichText, {
        props: richTextProps,
      });

      expect(result.toLowerCase()).not.toContain("unknown node");

      // Top-level USWDS process list
      expect(result).toContain('<ol class="usa-process-list">');

      // Item class
      expect(result).toContain('<li class="usa-process-list__item">');

      // Headings with class
      expect(result).toContain(
        '<h4 class="usa-process-list__heading">Start a process</h4>',
      );
      expect(result).toContain(
        '<h4 class="usa-process-list__heading">Proceed to the second step</h4>',
      );

      // Nested body conversion: paragraph + bullet list items
      expect(result).toContain("Lorem ipsum");
      expect(result).toContain('<ul class="list-bullet">');
      expect(result).toContain("<li>Alpha</li>");
      expect(result).toContain("<li>Beta</li>");
      expect(result).toContain("Next paragraph");
    });
  });
});
