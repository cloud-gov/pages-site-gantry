import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Footer from "./Footer.astro";
import {
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_NONE,
  PRE_FOOTER_TYPE_SLIM,
} from "@/env";

import { getPreFooterBig } from "@/components/PreFooterBig.testData";
import { getPreFooterSlim } from "@/components/PreFooterSlim.testData.ts";
import { getPreFooter } from "@/components/Footer.testData";

let container: any;

describe("Footer", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    container = await AstroContainer.create();
  });

  it("renders PreFooterBig", async () => {
    const result = await container.renderToString(Footer, {
      props: {
        preFooter: {
          preFooterType: PRE_FOOTER_TYPE_BIG,
          preFooterData: getPreFooterBig(),
        },
      },
    });

    expect(result).not.toContain("pre-footer-slim");
    expect(result).toContain('id="pre-footer-big-link-groups"');
  });

  it("renders PreFooterSlim", async () => {
    const result = await container.renderToString(Footer, {
      props: {
        preFooter: {
          preFooterType: PRE_FOOTER_TYPE_SLIM,
          preFooterData: getPreFooterSlim(),
        },
      },
    });

    expect(result).toContain("pre-footer-slim");
    expect(result).not.toContain('id="pre-footer-big-link-groups"');
  });

  it("does not render prefooter", async () => {
    const result = await container.renderToString(Footer, {
      props: { preFooterType: PRE_FOOTER_TYPE_NONE, preFooterData: null },
    });

    expect(result).not.toContain("pre-footer-slim");
    expect(result).not.toContain('id="pre-footer-big-link-groups"');
  });

  it("renders the USWDS footer and identifier classes", async () => {
    const result = await container.renderToString(Footer);
    expect(result).toContain("usa-footer");
    expect(result).toContain("usa-identifier");
  });

  it("renders prefooter", async () => {
    let preFooter = getPreFooter();
    const result = await container.renderToString(Footer, {
      props: {
        preFooterType: preFooter.preFooterType,
        preFooterData: preFooter.preFooterData,
      },
    });

    expect(result).toContain("usa-footer");
    expect(result).toContain("usa-identifier");
  });

  it("renders the return to top link", async () => {
    const result = await container.renderToString(Footer);
    expect(result).toContain("Return to top");
  });

  it("renders the site identifier content from given props", async () => {
    const identifierName = "U.S. Agency Name";
    const identifierUrl = "https://domain.gov";
    const siteDomain = "Domain.gov";
    const identifierLinks = [
      {
        text: "About This Agency",
        url: "https://www.agency.gov/about-us",
      },
      {
        text: "Agency Statement",
        url: "https://www.agency.gov/statement",
      },
    ];

    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer, {
      props: {
        identifiers: {
          identifierName,
          identifierUrl,
          siteDomain,
          identifierLinks,
        },
      },
    });

    // Check that the Identifier renders given content
    expect(result).toContain("An official website of the");
    expect(result).toContain("> U.S. Agency Name<");
    expect(result).toContain('href="https://domain.gov"');
    expect(result).toContain(">Domain.gov<");

    // identifierLogoImg isn't yet passed in, but update this test when it is
    expect(result).toContain("usa-identifier__logo-img");
    expect(result).toContain('alt="Domain.gov"');

    // renders first identifier link
    expect(result).toContain("> About This Agency <");
    expect(result).toContain('href="https://www.agency.gov/about-us"');

    // renders second identifier link
    expect(result).toContain("> Agency Statement <");
    expect(result).toContain('href="https://www.agency.gov/statement"');

    // Renders USA.gov required content
    expect(result).toContain(
      "Looking for U.S. government information and services?",
    );
    expect(result).toContain('href="https://www.usa.gov/"');
    expect(result).toContain("Visit USA.gov");
  });
});
