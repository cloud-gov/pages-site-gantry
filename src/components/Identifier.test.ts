import { beforeEach, describe, expect, it, vi } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Identifier from "./Identifier.astro";
import type { Media } from "@/payload-types.ts";

let container: any;

const agencyText = "An official website of the U.S. Agency Name";
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
            text: agencyText,
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

describe("Identifier", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    container = await AstroContainer.create();
  });

  it("renders the site identifier content from given props", async () => {
    const siteDomain = "Domain.gov";
    const container = await AstroContainer.create();
    const result = await container.renderToString(Identifier, {
      props: {
        identifier: {
          siteDomain,
          content,
          links: [
            {
              text: "About This Agency",
              url: "https://www.agency.gov/about-us",
              externalLink: true,
            },
            {
              text: "Agency Statement",
              url: "https://www.agency.gov/statement",
              externalLink: true,
            },
          ],
          logos: [
            {
              media: { altText: "Alt Text" },
              url: "https://domain.gov",
            },
          ],
        },
      },
    });

    expect(result).toContain(agencyText);
    expect(result).toContain(siteDomain);
    expect(result).toContain('href="https://domain.gov"');
    expect(result).toContain("Domain.gov");

    expect(result).toContain("usa-identifier__logo-img");
    expect(result).toContain('href="https://domain.gov"');

    expect(result).toContain("> About This Agency <");
    expect(result).toContain('href="https://www.agency.gov/about-us"');

    expect(result).toContain("> Agency Statement <");
    expect(result).toContain('href="https://www.agency.gov/statement"');

    expect(result).toContain(
      "Looking for U.S. government information and services?",
    );
    expect(result).toContain('href="https://www.usa.gov/"');
    expect(result).toContain("Visit USA.gov");
  });
});
