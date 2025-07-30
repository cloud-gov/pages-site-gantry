import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import Footer from "./Footer.astro";

describe("Footer", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders the USWDS footer and identifier classes', async () => {
    const result = await container.renderToString(Footer, { props: {} });
    expect(result).toContain("usa-footer");
    expect(result).toContain("usa-identifier");
  });

  it('renders the return to top link', async () => {
    const result = await container.renderToString(Footer, { props: {} });
    expect(result).toContain("Return to top");
  });

  it("renders a list of links when footerLinks are provided", async () => {
    const footerLinks = [
      {
        text: "First test link text",
        url: "url-test-1",
      },
      {
        text: "Second test link text",
        url: "url-test-2",
      },
    ];

    const result = await container.renderToString(Footer, {
      props: { footerLinks },
    });

    // Check that the list is rendered
    expect(result).toContain("<ul");
    expect(result).toContain("</ul>");

    // Check that both link items are rendered
    expect(result).toContain("First test link text");
    expect(result).toContain('href="/url-test-1"');

    expect(result).toContain("Second test link text");
    expect(result).toContain('href="/url-test-2"');
  });


  it("renders a contact email if provided", async () => {
    const contactEmail = "you@agency.gov"

    const result = await container.renderToString(Footer, {
      props: { contactEmail },
    });

    // Check that the email is rendered
    expect(result).toContain("mailto:you@agency.gov");
  });

  it("renders a contact phone if provided", async () => {
    const contactTelephone = "1-800-CALL-USA"

    const result = await container.renderToString(Footer, {
      props: { contactTelephone },
    });

    // Check that the phone is rendered
    expect(result).toContain("tel:1-800-CALL-USA");
  });


  it("renders the site identifier content from given props", async () => {
    const identifierName = "U.S. Agency Name"
    const identifierUrl = "https://domain.gov"
    const siteDomain = "Domain.gov"
    const identifierLinks = [{
      text: "About This Agency",
      url: "https://www.agency.gov/about-us",
    },
    {
      text: "Agency Statement",
      url: "https://www.agency.gov/statement",
    }]

    const result = await container.renderToString(Footer, {
      props: { identifierName, identifierUrl, siteDomain, identifierLinks },
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
    expect(result).toContain("Looking for U.S. government information and services?");
    expect(result).toContain('href="https://www.usa.gov/"');
    expect(result).toContain("Visit USA.gov");

  });

});
