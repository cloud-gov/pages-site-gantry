import { describe, expect, it, vi } from "vitest";
import { alertsMapper } from "@/utilities/fetch";
import { shouldDisplay } from "@/utilities/fetch/contentMapper";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn(),
  // Add other exports if needed
}));

describe("Content Mapper Utility", () => {
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
