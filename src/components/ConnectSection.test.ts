import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import ConnectSection from "./ConnectSection.astro";
import * as TestData from "@/components/ConnectSection.testData.ts";

export const contactSectionStart =
  '<div class="grid-row grid-gap-4 grid-col-auto"';
export const socialLinksStart =
  '<div class="usa-footer__social-links grid-row grid-gap-1"';

describe("ConnectSection", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  function expectPhone(result: string, expected: boolean) {
    let phoneLink = '<a href="tel:' + TestData.contactCenterPhone;
    if (expected) {
      expect(result).toContain(TestData.contactCenterPhone);
      expect(result).toContain(phoneLink);
    } else {
      expect(result).not.toContain(TestData.contactCenterPhone);
      expect(result).not.toContain(phoneLink);
    }
  }

  function expectEmail(result: string, expected: boolean) {
    let mailLink = '<a href="mailto:' + TestData.contactCenterEmail;
    if (expected) {
      expect(result).toContain(TestData.contactCenterEmail);
      expect(result).toContain(mailLink);
    } else {
      expect(result).not.toContain(TestData.contactCenterEmail);
      expect(result).not.toContain(mailLink);
    }
  }

  function expectTextCount(
    result: string,
    searchText: string,
    expectedCount: number,
  ) {
    let foundValues = result.match(new RegExp(searchText, "g")) || [];
    const count = foundValues.length;
    expect(count).toBe(expectedCount);
  }

  function expectListItems(result: string, listItemCount: number) {
    expectTextCount(
      result,
      '<li class="usa-footer__secondary-content',
      listItemCount,
    );
  }

  it("does not render a Connect Section if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: null },
    });
    expect(result).toBe("");
  });

  it("does not render a Connect Section if empty object", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionEmpty,
        ),
      },
    });
    expect(result).toBe("");
  });

  it("does not render a Connect Section if no values", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithEmptyFields,
        ),
      },
    });

    expect(result).toBe("");
  });

  it("renders a Contact Center if provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(TestData.ConnectSectionFull),
      },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).toContain(TestData.contactCenterName);
    expectPhone(result, true);
    expectEmail(result, true);
    expectListItems(result, 2);
  });

  it("does not render a Contact Center if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithoutContactCenter,
        ),
      },
    });

    expect(result).not.toContain(contactSectionStart);
    expect(result).not.toContain(TestData.contactCenterName);
    expectPhone(result, false);
    expectEmail(result, false);
    expectListItems(result, 0);
  });

  it("does not render a Contact Center if empty", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithEmptyContactCenter,
        ),
      },
    });

    expect(result).not.toContain(contactSectionStart);
    expect(result).not.toContain(TestData.contactCenterName);
    expectPhone(result, false);
    expectEmail(result, false);
    expectListItems(result, 0);
  });

  it("does not render a Contact Center if phone and email not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithoutEmailAndPhone,
        ),
      },
    });

    expect(result).not.toContain(contactSectionStart);
    expect(result).not.toContain(TestData.contactCenterName);
    expectPhone(result, false);
    expectEmail(result, false);
    expectListItems(result, 0);
  });

  it("does not render a contact center name if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithoutContactCenterName,
        ),
      },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).not.toContain(TestData.contactCenterName);
    expectPhone(result, true);
    expectEmail(result, true);
    expectListItems(result, 2);
  });

  it("does not render a contact center phone if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithoutPhone,
        ),
      },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).toContain(TestData.contactCenterName);
    expectPhone(result, false);
    expectEmail(result, true);
    expectListItems(result, 1);
  });

  it("does not render a contact center email if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithoutEmail,
        ),
      },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).toContain(TestData.contactCenterName);
    expectPhone(result, true);
    expectEmail(result, false);
    expectListItems(result, 1);
  });

  it("renders a list of social links when they are provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(TestData.ConnectSectionFull),
      },
    });

    expect(result).toContain(socialLinksStart);
    expect(result).toContain(TestData.facebookLink);
    expect(result).toContain(TestData.xLink);
    expect(result).toContain(TestData.youtubeLink);
    expect(result).toContain(TestData.instagramLink);
    expect(result).toContain(TestData.rssFeedLink);
    expect(result).not.toContain(TestData.unexpectedPlatformLink);

    const facebookLinkIndex: number = result.indexOf(TestData.facebookLink);
    const xLinkIndex: number = result.indexOf(TestData.xLink);
    const youtubeLinkIndex: number = result.indexOf(TestData.youtubeLink);
    const instagramLinkIndex: number = result.indexOf(TestData.instagramLink);
    const rssFeedLinkIndex: number = result.indexOf(TestData.rssFeedLink);

    let b = facebookLinkIndex < xLinkIndex;
    expect(b).toBe(true);
    expect(xLinkIndex < youtubeLinkIndex).toBe(true);
    expect(youtubeLinkIndex < instagramLinkIndex).toBe(true);
    expect(instagramLinkIndex < rssFeedLinkIndex).toBe(true);
  });

  it("renders a list of social links when they are partially provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWith3Platforms,
        ),
      },
    });

    expect(result).toContain(socialLinksStart);
    expect(result).toContain(TestData.facebookLink);
    expect(result).not.toContain(TestData.xLink);
    expect(result).toContain(TestData.youtubeLink);
    expect(result).not.toContain(TestData.instagramLink);
    expect(result).toContain(TestData.rssFeedLink);
    expect(result).not.toContain(TestData.unexpectedPlatformLink);

    const facebookLinkIndex: number = result.indexOf(TestData.facebookLink);
    const youtubeLinkIndex: number = result.indexOf(TestData.youtubeLink);
    const rssFeedLinkIndex: number = result.indexOf(TestData.rssFeedLink);

    expect(facebookLinkIndex < youtubeLinkIndex).toBe(true);
    expect(youtubeLinkIndex < rssFeedLinkIndex).toBe(true);
  });

  function expectNotToContainSocialLinks(result: string) {
    expect(result).not.toContain(socialLinksStart);
    expect(result).not.toContain(TestData.facebookLink);
    expect(result).not.toContain(TestData.xLink);
    expect(result).not.toContain(TestData.youtubeLink);
    expect(result).not.toContain(TestData.instagramLink);
    expect(result).not.toContain(TestData.rssFeedLink);
    expect(result).not.toContain(TestData.unexpectedPlatformLink);
  }

  it("does not render a list of social links when they are not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithoutSocialLinks,
        ),
      },
    });
    expectNotToContainSocialLinks(result);
  });

  it("does not render a list of social links when list is empty", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithEmptySocialLinks,
        ),
      },
    });

    expectNotToContainSocialLinks(result);
  });

  it("does not render a list of social links when no available platforms", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: {
        connectSection: TestData.getConnectSection(
          TestData.ConnectSectionWithUnexpectedSocialLinks,
        ),
      },
    });

    expectNotToContainSocialLinks(result);
  });
});
