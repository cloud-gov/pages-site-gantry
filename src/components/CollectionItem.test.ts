import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import CollectionItem from "./CollectionItem.astro";

describe("CollectionItem", () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  type AstroRender = string | { html: string };
  const renderHTML = async (props: Record<string, any>) => {
    const res = (await container.renderToString(CollectionItem, {
      props,
    })) as AstroRender;
    return typeof res === "string" ? res : res.html;
  };

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  afterEach(async () => {
    await (container as any)?.destroy?.();
  });

  it("renders with minimal props", async () => {
    const html = await renderHTML({
      title: "Test Report",
      link: "/test",
      description: "A report summary",
    });

    expect(html).toContain("Test Report");
    expect(html).toContain("A report summary");
    expect(html).toContain('href="/test"');
  });

  it("hides description when omitted", async () => {
    const html = await renderHTML({
      title: "No Description",
      link: "/no-desc",
    });

    expect(html).toContain("No Description");
    expect(html).toContain('href="/no-desc"');
    expect(html).not.toContain("usa-collection__description");
  });

  it("renders image with src and alt when thumbnailURL provided", async () => {
    const featureImage = {
      mimeType: "image/jpeg",
      site: {
        bucket: "bucket1",
      },
      url: "/img.jpg",
      filename: "img.jpg",
      thumbnailURL: "img-sm.jpg",
      altText: "Image description",
      filesize: 9999,
    };
    const html = await renderHTML({
      className: "usa-collection__img",
      media: featureImage,
      title: "With Image",
    });

    expect(html).toContain('class="usa-collection__img"');
    expect(html).toContain('src="/~assets/img.jpg"');
    expect(html).toContain('alt="Image description"');
  });

  it("does not render a pdf attachment media object", async () => {
    const fileAttachment = {
      mimeType: "application/pdf",
      site: {
        bucket: "bucket1",
      },
      url: "/file.pdf",
      filename: "file.pdf",
      thumbnailURL: null,
      altText: "",
      filesize: 131313,
    };
    const html = await renderHTML({
      className: "usa-collection__img",
      media: fileAttachment,
      title: "With PDF",
    });

    expect(html).not.toContain('src="/~assets/file.pdf"');
  });

  it("does not render image if none is provided", async () => {
    const html = await renderHTML({
      title: "No Image",
      link: "/no-img",
    });

    expect(html).not.toContain("usa-collection__img");
    expect(html).not.toContain("<img");
  });

  it("renders tags block when tags are provided", async () => {
    const html = await renderHTML({
      title: "With Tags",
      link: "/tags",
      tags: [
        { label: "News", url: "/?category=news" },
        { label: "UX", url: "/?category=ux" },
      ],
    });

    expect(html).toContain("usa-collection__meta");
    expect(html).toContain("Tag links"); // aria-label text
    expect(html).toContain("News");
    expect(html).toContain("UX");
  });

  it("does not render tags block when tags are omitted or empty", async () => {
    const html = await renderHTML({
      title: "No Tags",
      link: "/no-tags",
      tags: [],
    });

    expect(html).not.toContain("usa-collection__meta");
  });

  it("renders with bare minimum", async () => {
    const html = await renderHTML({
      title: "Bare minimum",
      link: "/bare",
    });

    expect(html).toContain("Bare minimum");
    expect(html).toContain('href="/bare"');
    expect(html).not.toContain("<img");
  });

  it("renders event date when showEvent and startDate are provided", async () => {
    const html = await renderHTML({
      title: "Event test",
      link: "/event",
      showEvent: true,
      startDate: "2024-12-25",
    });

    expect(html).toContain("Event test");
    expect(html).toContain('href="/event"');
    expect(html).toContain("Dec");
  });

  it("does not render event date when startDate is missing", async () => {
    const html = await renderHTML({
      title: "Event without Start",
      link: "/event-no-date",
      showEvent: true,
    });

    expect(html).not.toContain("usa-collection__calendar-date");
    expect(html).not.toContain("<time");
  });
});
