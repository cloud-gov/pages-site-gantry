import { describe, expect, it, vi } from "vitest";
import { alertsMapper, footerMapper } from "@/utilities/fetch";
import {
  collectionUrlMapper,
  linkMapper,
  logoMapper,
  pageUrlMapper,
  shouldDisplay,
} from "@/utilities/fetch/contentMapper";
import type { FooterModel, PageModel } from "@/env";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn(),
  // Add other exports if needed
}));

describe("Content Mapper Utility maps Alerts", () => {
  it("does not throw errors if no data", () => {
    expect(alertsMapper(null)).toEqual([]);
    expect(alertsMapper(undefined)).toEqual([]);
    expect(alertsMapper([])).toEqual([]);
    expect(alertsMapper([null])).toEqual([]);
    expect(alertsMapper([undefined])).toEqual([]);
    expect(alertsMapper([{}])).toEqual([]);
  });

  it("processes alerts response in server mode", () => {
    const content = {
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                mode: "normal",
                text: "Alert Text",
                type: "text",
                style: "",
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            textStyle: "",
            textFormat: 0,
          },
        ],
        direction: "ltr",
      },
    };
    expect(
      alertsMapper([
        {
          content: content,
          isActive: true,
          publishDate: undefined,
          title: "Alert Title",
          type: "info",
        },
      ]),
    ).toEqual([
      {
        content: content,
        title: "Alert Title",
        type: "info",
      },
    ]);
  });

  it("filters out alerts based on isActive flag", () => {
    expect(
      alertsMapper([
        {
          content: null,
          isActive: true,
          publishDate: undefined,
          title: "Alert Title 1",
          type: "info",
        },
        {
          content: null,
          isActive: false,
          publishDate: undefined,
          title: "Alert Title 2",
          type: "info",
        },
      ]),
    ).toEqual([
      {
        content: null,
        title: "Alert Title 1",
        type: "info",
      },
    ]);
  });

  it("filters out alerts based on publish date", () => {
    expect(
      shouldDisplay(
        { isActive: true, publishDate: "2025-11-06T20:00:00.000Z" },
        new Date("Thu Nov 06 2025 13:59:00 GMT-0600"),
      ),
    ).toEqual(false);
    expect(
      shouldDisplay(
        { isActive: true, publishDate: "2025-11-06T20:00:00.000Z" },
        new Date("Thu Nov 06 2025 14:00:00 GMT-0600"),
      ),
    ).toEqual(true);
    expect(
      shouldDisplay(
        { isActive: true, publishDate: "2025-11-06T20:00:00.000Z" },
        new Date("Thu Nov 06 2025 14:01:00 GMT-0600"),
      ),
    ).toEqual(true);
  });

  it("considers alert published if there is no published date", () => {
    expect(
      shouldDisplay({ isActive: true, publishDate: null }, new Date()),
    ).toEqual(true);
    expect(
      shouldDisplay({ isActive: true, publishDate: undefined }, new Date()),
    ).toEqual(true);
    expect(
      shouldDisplay({ isActive: true, publishDate: "" }, new Date()),
    ).toEqual(true);
  });

  it("displays alert if both publish date and active flag criteria are met", () => {
    expect(shouldDisplay(undefined, new Date())).toEqual(false);
    expect(shouldDisplay(null, new Date())).toEqual(false);
    expect(shouldDisplay({}, new Date())).toEqual(false);
    expect(shouldDisplay(undefined, null)).toEqual(false);
    expect(
      shouldDisplay({ isActive: true, publishDate: null }, new Date()),
    ).toEqual(true);
    expect(
      shouldDisplay(
        { isActive: true, publishDate: "2025-11-06T20:00:00.000Z" },
        new Date("Thu Nov 06 2025 14:00:00 GMT-0600"),
      ),
    ).toEqual(true);
    expect(
      shouldDisplay(
        { isActive: false, publishDate: "2025-11-06T20:00:00.000Z" },
        new Date("Thu Nov 06 2025 14:00:00 GMT-0600"),
      ),
    ).toEqual(false);
    expect(shouldDisplay({ isActive: true }, new Date())).toEqual(true);
  });

  it("processes alerts response in static mode", () => {
    const content = {
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                mode: "normal",
                text: "Alert Text",
                type: "text",
                style: "",
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            textStyle: "",
            textFormat: 0,
          },
        ],
        direction: "ltr",
      },
    };
    expect(
      alertsMapper(
        [
          {
            data: {
              content: content,
              isActive: true,
              publishDate: undefined,
              title: "Alert Title",
              type: "info",
              icon: true,
              slim: false,
            },
          },
        ],
        true,
      ),
    ).toEqual([
      {
        content: content,
        title: "Alert Title",
        type: "info",
        icon: true,
        slim: false,
      },
    ]);
  });
});

describe("Content Mapper Utility maps links", () => {
  it("maps page url", () => {
    function test(page: PageModel | any) {
      let url = pageUrlMapper(page);
      expect(url).toBeNull;
    }
    test({});
    test(null);
    test(undefined);
    test({ slug: null });
    test({ slug: undefined });
    test("url");

    expect(pageUrlMapper({ slug: "page-slug" })).toEqual("/page-slug");
  });

  it("maps collection url", () => {
    function test(page: PageModel | any) {
      let url = collectionUrlMapper(page);
      expect(url).toBeNull;
    }
    test({});
    test(null);
    test(undefined);

    expect(collectionUrlMapper("page-slug")).toEqual("/page-slug");
  });

  it("maps link", () => {
    expect(linkMapper(null)).toEqual(null);
    expect(linkMapper(undefined)).toEqual(null);
    expect(linkMapper({})).toEqual(null);
    expect(linkMapper({ blockType: null })).toEqual(null);
    expect(linkMapper({ blockType: undefined })).toEqual(null);

    expect(
      linkMapper({
        blockType: "externalLink",
      }),
    ).toEqual({ text: undefined, url: undefined, externalLink: true });
    expect(
      linkMapper({
        blockType: "externalLink",
        name: "name",
        url: "url",
      }),
    ).toEqual({ text: "name", url: "url", externalLink: true });

    expect(
      linkMapper({
        blockType: "slimExternalLink",
      }),
    ).toEqual({ text: undefined, url: undefined, externalLink: true });
    expect(
      linkMapper({
        blockType: "slimExternalLink",
        name: "name",
        url: "url",
      }),
    ).toEqual({ text: "name", url: "url", externalLink: true });

    expect(
      linkMapper({
        blockType: "pageLink",
      }),
    ).toEqual({ text: undefined, url: null, externalLink: false });
    expect(
      linkMapper({
        blockType: "pageLink",
        name: "name",
        page: {
          slug: "page-slug",
        },
      }),
    ).toEqual({ text: "name", url: "/page-slug", externalLink: false });

    expect(
      linkMapper({
        blockType: "slimPageLink",
      }),
    ).toEqual({ text: undefined, url: null, externalLink: false });
    expect(
      linkMapper({
        blockType: "slimPageLink",
        name: "name",
        page: {
          slug: "page-slug",
        },
      }),
    ).toEqual({ text: "name", url: "/page-slug", externalLink: false });

    expect(
      linkMapper({
        blockType: "collectionLink",
      }),
    ).toEqual({ text: undefined, url: null, externalLink: false });
    expect(
      linkMapper({
        blockType: "collectionLink",
        name: "name",
        page: "page-slug",
      }),
    ).toEqual({ text: "name", url: "/page-slug", externalLink: false });

    expect(
      linkMapper({
        blockType: "slimCollectionLink",
      }),
    ).toEqual({ text: undefined, url: null, externalLink: false });
    expect(
      linkMapper({
        blockType: "slimCollectionLink",
        name: "name",
        page: "page-slug",
      }),
    ).toEqual({ text: "name", url: "/page-slug", externalLink: false });
  });
});

describe("Content Mapper Utility, Footer", () => {
  it("does not throw errors if no data", () => {
    const emptyFooter = {
      identifier: {
        colorFamilies: {
          identifier: undefined,
          identityDomain: undefined,
          primaryLink: undefined,
          secondaryLink: undefined,
        },
        content: undefined,
        links: undefined,
        logos: undefined,
        siteDomain: undefined,
      },
      preFooter: {
        preFooterData: undefined,
        preFooterType: null,
      },
    };

    expect(footerMapper(null, null)).toEqual(emptyFooter);
    expect(footerMapper(undefined, null)).toEqual(emptyFooter);
    expect(footerMapper({}, null)).toEqual(emptyFooter);
  });

  it("processes footer response", () => {
    const content = {
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                mode: "normal",
                text: "Footer Text",
                type: "text",
                style: "",
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
            direction: "ltr",
            textStyle: "",
            textFormat: 0,
          },
        ],
        direction: "ltr",
      },
    };
    const footer = footerMapper(
      {
        domain: "site domain",
        logos: [
          {
            image: { altText: "logo altText" },
            url: "test url",
          },
        ],
        content: content,
        links: [
          {
            blockType: "externalLink",
            name: "link name",
            url: "link url",
            externalLink: true,
          },
        ],
        identifierColor: "identifierColor",
        identityDomainColor: "identityDomain",
        primaryLinkColor: "primaryLink",
        secondaryLinkColor: "secondaryLink",
      },
      null,
    );
    expect(footer).toEqual({
      identifier: {
        siteDomain: "site domain",
        logos: [
          {
            url: "test url",
            media: {
              altText: "logo altText",
            },
          },
        ],
        content: content,
        links: undefined,
        colorFamilies: {
          identifier: "identifierColor",
          identityDomain: "identityDomain",
          primaryLink: "primaryLink",
          secondaryLink: "secondaryLink",
        },
      },
      preFooter: {
        preFooterData: undefined,
        preFooterType: null,
      },
    });
  });
});
