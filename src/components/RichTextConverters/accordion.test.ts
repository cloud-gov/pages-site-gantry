import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import RichText from "../RichText.astro";

describe("rich text embedded accordion block", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders an accordion block with USWDS classes and converted nested body", async () => {
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
                    content: {
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
                    heading: "Institutional Guidelines",
                  },
                  {
                    content: {
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
                    heading: "Policy procedures",
                  },
                ],
                blockType: "accordion",
                headingLevel: "h4",
              },
              format: "",
            },
            {
              type: "block",
              fields: {
                items: [
                  {
                    content: {
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
                    heading: "Operating procedures",
                  },
                  {
                    content: {
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
                    heading: "Meeting guidelines",
                  },
                ],
                blockType: "accordion",
                headingLevel: "h3",
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

    expect(result).toContain(
      '<div class="usa-accordion usa-accordion--multiselectable" data-allow-multiple>',
    );
    expect(result).toContain('<h4 class="usa-accordion__heading">');
    expect(result).toContain('<h3 class="usa-accordion__heading">');

    expect(result).toContain(
      '<button type="button" class="usa-accordion__button" aria-expanded="true" aria-controls="a1">',
    );
    expect(result).toContain(
      '<div id="a1" class="usa-accordion__content usa-prose">',
    );
    expect(result).toContain('<ul class="list-bullet">');
  });
});
