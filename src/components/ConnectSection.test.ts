import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import ConnectSection from "./ConnectSection.astro";
import {
  contactCenterEmail,
  contactCenterName,
  contactCenterPhone,
  facebookLink,
  getConnectSectionEmpty,
  getConnectSectionFull,
  getConnectSectionWith3Platforms,
  getConnectSectionWithEmptyContactCenter,
  getConnectSectionWithEmptyFields,
  getConnectSectionWithEmptySocialLinks,
  getConnectSectionWithoutContactCenter,
  getConnectSectionWithoutContactCenterName,
  getConnectSectionWithoutEmail,
  getConnectSectionWithoutEmailAndPhone,
  getConnectSectionWithoutPhone,
  getConnectSectionWithoutSocialLinks,
  getConnectSectionWithUnexpectedSocialLinks,
  instagramLink,
  rssFeedLink,
  unexpectedPlatformLink,
  xLink,
  youtubeLink,
} from "@/components/ConnectSection.testData.ts";

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
    let phoneLink = '<a href="tel:' + contactCenterPhone;
    if (expected) {
      expect(result).toContain(contactCenterPhone);
      expect(result).toContain(phoneLink);
    } else {
      expect(result).not.toContain(contactCenterPhone);
      expect(result).not.toContain(phoneLink);
    }
  }

  function expectEmail(result: string, expected: boolean) {
    let mailLink = '<a href="mailto:' + contactCenterEmail;
    if (expected) {
      expect(result).toContain(contactCenterEmail);
      expect(result).toContain(mailLink);
    } else {
      expect(result).not.toContain(contactCenterEmail);
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
      props: { connectSection: getConnectSectionEmpty() },
    });
    expect(result).toBe("");
  });

  it("does not render a Connect Section if no values", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithEmptyFields() },
    });

    expect(result).toBe("");
  });

  it("renders a Contact Center if provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionFull() },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).toContain(contactCenterName);
    expectPhone(result, true);
    expectEmail(result, true);
    expectListItems(result, 2);
  });

  it("does not render a Contact Center if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithoutContactCenter() },
    });

    expect(result).not.toContain(contactSectionStart);
    expect(result).not.toContain(contactCenterName);
    expectPhone(result, false);
    expectEmail(result, false);
    expectListItems(result, 0);
  });

  it("does not render a Contact Center if empty", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithEmptyContactCenter() },
    });

    expect(result).not.toContain(contactSectionStart);
    expect(result).not.toContain(contactCenterName);
    expectPhone(result, false);
    expectEmail(result, false);
    expectListItems(result, 0);
  });

  it("does not render a Contact Center if phone and email not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithoutEmailAndPhone() },
    });

    expect(result).not.toContain(contactSectionStart);
    expect(result).not.toContain(contactCenterName);
    expectPhone(result, false);
    expectEmail(result, false);
    expectListItems(result, 0);
  });

  it("does not render a contact center name if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithoutContactCenterName() },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).not.toContain(contactCenterName);
    expectPhone(result, true);
    expectEmail(result, true);
    expectListItems(result, 2);
  });

  it("does not render a contact center phone if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithoutPhone() },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).toContain(contactCenterName);
    expectPhone(result, false);
    expectEmail(result, true);
    expectListItems(result, 1);
  });

  it("does not render a contact center email if not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithoutEmail() },
    });

    expect(result).toContain(contactSectionStart);
    expect(result).toContain(contactCenterName);
    expectPhone(result, true);
    expectEmail(result, false);
    expectListItems(result, 1);
  });

  it("renders a list of social links when they are provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionFull() },
    });

    expect(result).toContain(socialLinksStart);
    expect(result).toContain(facebookLink);
    expect(result).toContain(xLink);
    expect(result).toContain(youtubeLink);
    expect(result).toContain(instagramLink);
    expect(result).toContain(rssFeedLink);
    expect(result).not.toContain(unexpectedPlatformLink);

    const facebookLinkIndex: number = result.indexOf(facebookLink);
    const xLinkIndex: number = result.indexOf(xLink);
    const youtubeLinkIndex: number = result.indexOf(youtubeLink);
    const instagramLinkIndex: number = result.indexOf(instagramLink);
    const rssFeedLinkIndex: number = result.indexOf(rssFeedLink);

    expect(facebookLinkIndex < xLinkIndex).toBe(true);
    expect(xLinkIndex < youtubeLinkIndex).toBe(true);
    expect(youtubeLinkIndex < instagramLinkIndex).toBe(true);
    expect(instagramLinkIndex < rssFeedLinkIndex).toBe(true);
  });

  it("renders a list of social links when they are partially provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWith3Platforms() },
    });

    expect(result).toContain(socialLinksStart);
    expect(result).toContain(facebookLink);
    expect(result).not.toContain(xLink);
    expect(result).toContain(youtubeLink);
    expect(result).not.toContain(instagramLink);
    expect(result).toContain(rssFeedLink);
    expect(result).not.toContain(unexpectedPlatformLink);

    const facebookLinkIndex: number = result.indexOf(facebookLink);
    const youtubeLinkIndex: number = result.indexOf(youtubeLink);
    const rssFeedLinkIndex: number = result.indexOf(rssFeedLink);

    expect(facebookLinkIndex < youtubeLinkIndex).toBe(true);
    expect(youtubeLinkIndex < rssFeedLinkIndex).toBe(true);
  });

  function expectNotToContainSocialLinks(result: string) {
    expect(result).not.toContain(socialLinksStart);
    expect(result).not.toContain(facebookLink);
    expect(result).not.toContain(xLink);
    expect(result).not.toContain(youtubeLink);
    expect(result).not.toContain(instagramLink);
    expect(result).not.toContain(rssFeedLink);
    expect(result).not.toContain(unexpectedPlatformLink);
  }

  it("does not render a list of social links when they are not provided", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithoutSocialLinks() },
    });
    expectNotToContainSocialLinks(result);
  });

  it("does not render a list of social links when list is empty", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithEmptySocialLinks() },
    });

    expectNotToContainSocialLinks(result);
  });

  it("does not render a list of social links when no available platforms", async () => {
    const result = await container.renderToString(ConnectSection, {
      props: { connectSection: getConnectSectionWithUnexpectedSocialLinks() },
    });

    expectNotToContainSocialLinks(result);
  });
});
