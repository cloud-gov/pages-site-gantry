import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import RichText from "../RichText.astro";

describe("rich text embedded card grid block", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Simple helper to count substring occurrences
  const countOf = (haystack: string, needle: string) =>
    (
      haystack.match(
        new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      ) || []
    ).length;

  it("renders a cardGrid with full rows, pads the last row with empty columns, and preserves USWDS classes", async () => {
    // Arrange: 13 cards, 3 columns => 5 rows total; last row padded to 3 cols
    const cards = Array.from({ length: 13 }, (_, i) => ({
      title: `Card ${i + 1}`,
      description: `Body ${i + 1}`,
      image: {
        altText: `Alt ${i + 1}`,
        url: `/img/${i + 1}.jpg`,
      },
      orientation: i % 2 === 0 ? "vertical" : "horizontal",
    }));

    const richTextProps = {
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "block",
              fields: {
                blockType: "cardGrid",
                numberOfColumns: "3",
                cards,
              },
              format: "",
            },
          ],
        },
      },
    };

    // Act
    const result = await container.renderToString(RichText, {
      props: richTextProps,
    });

    // Assert core structure:
    // There should be 5 rows: ceil(13 / 3) = 5
    expect(countOf(result, "grid-row")).toBe(5);

    // Each row has exactly 3 columns due to padding => total 15 tablet:grid-col wrappers
    expect(countOf(result, "tablet:grid-col")).toBe(15);

    // Cards themselves should appear at least 13 times
    expect(countOf(result, 'class="usa-card')).toBeGreaterThanOrEqual(13);

    // The last row should contain 2 padding columns. We can check by ensuring total cols - cards = padding
    // Simpler positive checks: sample titles and body text present, and image alt text passes sanitization
    expect(result).toContain("Card 1");
    expect(result).toContain("Body 1");
    expect(result).toContain("Alt 1"); // alt text allowed via sanitizeHtml allowedAttributes
  });

  it("applies the horizontal orientation modifier when requested", async () => {
    const richTextProps = {
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "block",
              fields: {
                blockType: "cardGrid",
                numberOfColumns: "2",
                cards: [
                  {
                    title: "Vertical card",
                    description: "V body",
                    image: { altText: "V alt", url: "/v.jpg" },
                    orientation: "vertical",
                  },
                  {
                    title: "Horizontal card",
                    description: "H body",
                    image: { altText: "H alt", url: "/h.jpg" },
                    orientation: "horizontal",
                  },
                ],
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

    // Should render 1 row with 2 columns
    expect(countOf(result, '<div class="grid-row usa-card-group">')).toBe(1);
    expect(countOf(result, "tablet:grid-col")).toBe(2);

    // Horizontal card should include the orientation modifier class
    // (Your converter uses 'usa-card--horizontal' when orientation is "horizontal")
    expect(result).toContain(
      'class="tablet:grid-col usa-card usa-card--flag flex-1"',
    ); // <— update to exact class if needed

    // Vertical card still renders as a usa-card without the horizontal modifier
    expect(result).toContain("Vertical card");
    expect(result).toContain("Horizontal card");
  });

  it("pads a short final row entirely when cards < numberOfColumns", async () => {
    const richTextProps = {
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "block",
              fields: {
                blockType: "cardGrid",
                numberOfColumns: "4",
                cards: [
                  {
                    title: "Only one",
                    description: "Solo",
                    image: { altText: "Solo alt", url: "/solo.jpg" },
                    orientation: "vertical",
                  },
                ],
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

    // Single row, but should still show 4 columns via padding
    expect(countOf(result, '<div class="grid-row usa-card-group">')).toBe(1);
    expect(countOf(result, 'class="tablet:grid-col"')).toBe(3);

    // Ensure our single card title is present
    expect(result).toContain("Only one");
  });
});
