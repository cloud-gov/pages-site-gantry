import { describe, expect, it, vi } from "vitest";
import {
  cleanLink,
  cleanLinks,
  cleanPreFooterSlim,
} from "@/utilities/preFooterSlim";

describe("PreFooterBig Utilities", () => {
  it("cleans link", () => {
    function test(input, expected) {
      expect(cleanLink(input)).toEqual(expected);
    }

    test(null, null);
    test(undefined, null);
    test({}, null);
    test({ text: null, url: null, externalLink: null }, null);
    test({ text: undefined, url: undefined, externalLink: undefined }, null);
    test({ text: "text", url: undefined, externalLink: undefined }, null);
    test({ text: undefined, url: "url", externalLink: undefined }, null);
    test({ text: undefined, url: undefined, externalLink: true }, null);
    test(
      { text: "text", url: "url", externalLink: true },
      { text: "text", url: "url", externalLink: true },
    );
  });

  it("cleans links", () => {
    function test(input, expected) {
      expect(cleanLinks(input)).toEqual(expected);
    }

    test(null, undefined);
    test(undefined, undefined);
    test([], []);
    test([{}], []);
    test([{ text: null, url: null, externalLink: null }], []);
    test([{ text: undefined, url: undefined, externalLink: undefined }], []);
    test([{ text: "text", url: undefined, externalLink: undefined }], []);
    test([{ text: undefined, url: "url", externalLink: undefined }], []);
    test([{ text: undefined, url: undefined, externalLink: true }], []);
    test(
      [{ text: "text", url: "url", externalLink: true }],
      [{ text: "text", url: "url", externalLink: true }],
    );
  });

  it("cleans slim pre-footer", () => {
    function test(input, expected) {
      expect(cleanPreFooterSlim(input)).toEqual(expected);
    }

    test(null, null);
    test(undefined, null);
    test(
      {
        contactEmail: " ",
        contactTelephone: " ",
        links: [{ text: " ", url: " ", externalLink: true }],
      },
      null,
    );
    test(
      {
        contactEmail: "  ",
        contactTelephone: "(123)-456-7890",
        links: [{ text: "name", url: "url", externalLink: true }],
      },
      {
        contactEmail: null,
        contactTelephone: "(123)-456-7890",
        links: [{ text: "name", url: "url", externalLink: true }],
      },
    );
    test(
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "  ",
        links: [{ text: "name", url: "url", externalLink: true }],
      },
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: null,
        links: [{ text: "name", url: "url", externalLink: true }],
      },
    );
    test(
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        links: [],
      },
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        links: [],
      },
    );
    test(
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        links: [{ text: "name", url: "url", externalLink: true }],
      },
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        links: [{ text: "name", url: "url", externalLink: true }],
      },
    );
  });
});
