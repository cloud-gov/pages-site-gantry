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

    test(null, null);
    test(undefined, null);
    test([], null);
    test([{}], null);
    test([{ text: null, url: null, externalLink: null }], null);
    test([{ text: undefined, url: undefined, externalLink: undefined }], null);
    test([{ text: "text", url: undefined, externalLink: undefined }], null);
    test([{ text: undefined, url: "url", externalLink: undefined }], null);
    test([{ text: undefined, url: undefined, externalLink: true }], null);
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
        footerLinks: [{ text: " ", url: " ", externalLink: true }],
      },
      null,
    );
    test(
      {
        contactEmail: "  ",
        contactTelephone: "(123)-456-7890",
        footerLinks: [{ text: "name", url: "url", externalLink: true }],
      },
      {
        contactEmail: null,
        contactTelephone: "(123)-456-7890",
        footerLinks: [{ text: "name", url: "url", externalLink: true }],
      },
    );
    test(
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "  ",
        footerLinks: [{ text: "name", url: "url", externalLink: true }],
      },
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: null,
        footerLinks: [{ text: "name", url: "url", externalLink: true }],
      },
    );
    test(
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        footerLinks: [],
      },
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        footerLinks: null,
      },
    );
    test(
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        footerLinks: [{ text: "name", url: "url", externalLink: true }],
      },
      {
        contactEmail: "email@gsa.gov",
        contactTelephone: "(123)-456-7890",
        footerLinks: [{ text: "name", url: "url", externalLink: true }],
      },
    );
  });
});
