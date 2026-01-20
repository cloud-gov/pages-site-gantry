import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import RichText from "../RichText.astro";

describe("rich text embedded Process List blocks", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders a processList block with USWDS classes and converted nested body", async () => {
    const richTextProps = {
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "block",
              fields: {
                headingLevel: "h4",
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

  it("renders processList items with chosen heading levels", async () => {
    const richTextProps = {
      content: {
        root: {
          children: [
            {
              type: "block",
              fields: {
                headingLevel: "h3",
                blockType: "processList",
                items: [
                  {
                    fields: {
                      heading: "H3 step",
                      body: {
                        root: {
                          type: "root",
                          children: [
                            {
                              type: "paragraph",
                              children: [{ text: "Body A" }],
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    fields: {
                      heading: "H5 step",
                      body: {
                        root: {
                          type: "root",
                          children: [
                            {
                              type: "paragraph",
                              children: [{ text: "Body B" }],
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const result = await container.renderToString(RichText, {
      props: richTextProps,
    });

    expect(result).toContain(
      '<h3 class="usa-process-list__heading">H3 step</h3>',
    );
    expect(result).toContain('<ol class="usa-process-list">');
    expect(result).toContain('<li class="usa-process-list__item">');
  });
});
