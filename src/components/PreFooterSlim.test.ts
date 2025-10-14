import { experimental_AstroContainer as AstroContainer } from "astro/container";
import PreFooterSlim from "@/components/PreFooterSlim.astro";

import { describe, it, expect, beforeEach } from "vitest";

describe("PreFooterSlim", () => {
  let container: any;

  const preFooter = {
    contactEmail: "you@agency.gov",
    contactTelephone: "1-800-CALL-USA",
    footerLinks: [
      {
        text: "First link text",
        url: "url-test-1",
      },
      {
        text: "Second link text",
        url: "url-test-2",
      },
    ],
  };

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders a list of links when footerLinks are provided", async () => {
    const result = await container.renderToString(PreFooterSlim, {
      props: { preFooter },
    });

    // Check that the list is rendered
    expect(result).toContain("<ul");
    expect(result).toContain("</ul>");

    // Check that both link items are rendered
    expect(result).toContain("First link text");
    expect(result).toContain('href="/url-test-1"');

    expect(result).toContain("Second link text");
    expect(result).toContain('href="/url-test-2"');
  });

  it("renders a contact email if provided", async () => {
    const result = await container.renderToString(PreFooterSlim, {
      props: { preFooter },
    });

    // Check that the email is rendered
    expect(result).toContain("mailto:you@agency.gov");
  });

  it("renders a contact phone if provided", async () => {
    const result = await container.renderToString(PreFooterSlim, {
      props: { preFooter },
    });

    // Check that the phone is rendered
    expect(result).toContain("tel:1-800-CALL-USA");
  });
});
