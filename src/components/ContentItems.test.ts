import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import ContentItems from "./ContentItems.astro";

describe("ContentItems", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders "No items found" when no items are provided', async () => {
    const result = await container.renderToString(ContentItems, { props: {} });
    expect(result).toContain("No items found");
  });

  it('renders "No items found" when empty array is provided', async () => {
    const result = await container.renderToString(ContentItems, {
      props: { items: [] },
    });
    expect(result).toContain("No items found");
  });

  it("renders a list of items when items are provided", async () => {
    const items = [
      {
        title: "Test Item 1",
        description: "Test description 1",
        date: "2024-01-01",
        link: "/test-1",
      },
      {
        title: "Test Item 2",
        description: "Test description 2",
        date: "2024-01-02",
        link: "/test-2",
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that the list is rendered
    expect(result).toContain("<ol");
    expect(result).toContain("</ol>");

    // Check that both items are rendered
    expect(result).toContain("Test Item 1");
    expect(result).toContain("Test Item 2");
  });

  it("renders item with all properties", async () => {
    const items = [
      {
        title: "Complete Test Item",
        description: "This is a complete test item with all properties",
        date: "2024-01-15",
        image: "/test-image.jpg",
        imageAlt: "Test Item Image Alt",
        link: "/complete-test",
        linkText: "Read More",
        tags: [
          { label: "Tag 1", color: "blue" },
          { label: "Tag 2", color: "green" },
        ],
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that the item is rendered
    expect(result).toContain("Complete Test Item");

    // Check that it has the correct CSS class
    expect(result).toContain("usa-card");
    expect(result).toContain("usa-card--flag");

    // Check that description is rendered
    expect(result).toContain(
      "This is a complete test item with all properties"
    );

    // Check that date is rendered
    expect(result).toContain("2024-01-15");

    // Check that image is rendered
    expect(result).toContain("/test-image.jpg");
    expect(result).toContain('alt="Test Item Image Alt"');
  });

  it("renders item without optional properties", async () => {
    const items = [
      {
        title: "Minimal Test Item",
        link: "/minimal-test",
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that the item is rendered
    expect(result).toContain("Minimal Test Item");

    // Check that description is not rendered
    expect(result).not.toContain("undefined");

    // Check that date is not rendered
    expect(result).not.toContain("usa-card__meta");

    // Check that image is not rendered
    expect(result).not.toContain("<img");
    expect(result).not.toContain("usa-card__media");

    // Check that tags are not rendered
    expect(result).not.toContain("usa-card__footer");
  });

  it("renders tags when provided", async () => {
    const items = [
      {
        title: "Item with Tags",
        description: "An item with tags",
        link: "/tagged-item",
        tags: [
          { label: "Important", color: "red" },
          { label: "News", color: "blue" },
          { label: "Update", color: "green" },
        ],
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that tags footer is rendered
    expect(result).toContain("usa-card__footer");
  });

  it("does not render tags footer when no tags are provided", async () => {
    const items = [
      {
        title: "Item without Tags",
        description: "An item without tags",
        link: "/untagged-item",
      },
    ];

    const result = await container.renderToString(ContentItems, { items });

    // Check that tags footer is not rendered
    expect(result).not.toContain("usa-card__footer");
  });

  it("does not render tags footer when empty tags array is provided", async () => {
    const items = [
      {
        title: "Item with Empty Tags",
        description: "An item with empty tags array",
        link: "/empty-tags-item",
        tags: [],
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that tags footer is not rendered
    expect(result).not.toContain("usa-card__footer");
  });

  it("renders image when image property is provided", async () => {
    const items = [
      {
        title: "Item with Image",
        description: "An item with an image",
        link: "/image-item",
        image: "/test-image.jpg",
        imageAlt: "Item with Image Alt Tag",
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that image media section is rendered
    expect(result).toContain("usa-card__media");
    expect(result).toContain("usa-card__img");
    expect(result).toContain("/test-image.jpg");
    expect(result).toContain('alt="Item with Image Alt Tag"');
  });

  it("does not render image when image property is empty string", async () => {
    const items = [
      {
        title: "Item with Empty Image",
        description: "An item with empty image string",
        link: "/empty-image-item",
        image: "",
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that image media section is not rendered
    expect(result).not.toContain("usa-card__media");
    expect(result).not.toContain("usa-card__img");
  });

  it("does not render image when image property is null", async () => {
    const items = [
      {
        title: "Item with Null Image",
        description: "An item with null image",
        link: "/null-image-item",
        image: null,
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that image media section is not rendered
    expect(result).not.toContain("usa-card__media");
    expect(result).not.toContain("usa-card__img");
  });

  it("renders link correctly", async () => {
    const items = [
      {
        title: "Linked Item",
        description: "An item with a link",
        link: "/linked-item",
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that the link is rendered
    expect(result).toContain('href="/linked-item"');
    expect(result).toContain("Linked Item");
  });

  it("renders multiple items with different properties", async () => {
    const items = [
      {
        title: "Item 1",
        description: "Description 1",
        date: "2024-01-01",
        link: "/item-1",
        tags: [{ label: "Tag1", color: "blue" }],
      },
      {
        title: "Item 2",
        link: "/item-2",
      },
      {
        title: "Item 3",
        description: "Description 3",
        date: "2024-01-03",
        image: "/image-3.jpg",
        link: "/item-3",
        tags: [
          { label: "Tag2", color: "red" },
          { label: "Tag3", color: "green" },
        ],
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that all items are rendered
    expect(result).toContain("Item 1");
    expect(result).toContain("Item 2");
    expect(result).toContain("Item 3");

    // Check that descriptions are rendered where provided
    expect(result).toContain("Description 1");
    expect(result).toContain("Description 3");

    // Check that dates are rendered where provided
    expect(result).toContain("2024-01-01");
    expect(result).toContain("2024-01-03");

    // Check that image is rendered where provided
    expect(result).toContain("/image-3.jpg");
  });

  it("applies correct CSS classes and structure", async () => {
    const items = [
      {
        title: "Test Item",
        description: "Test description",
        link: "/test",
      },
    ];

    const result = await container.renderToString(ContentItems, {
      props: { items },
    });

    // Check that the list is rendered
    expect(result).toContain("<ol");
    expect(result).toContain("</ol>");

    // Check that list item has correct classes
    expect(result).toContain("usa-card");
    expect(result).toContain("usa-card--flag");
    expect(result).toContain("flex-1");

    // Check that card container exists
    expect(result).toContain("usa-card__container");

    // Check that card header exists
    expect(result).toContain("usa-card__header");

    // Check that card heading exists
    expect(result).toContain("usa-card__heading");

    // Check that card body exists
    expect(result).toContain("usa-card__body");
  });
});
