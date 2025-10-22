import { describe, expect, it } from "vitest";
import {
  cleanConfiguration,
  cleanConnectSection,
  cleanPreFooterBig,
  cleanLinkGroups,
  cleanLinkGroupColumns,
} from "@/utilities/preFooterBig";
import {
  type ConnectSectionModel,
  type ContactCenter,
  CONNECT_SECTION_LOCATION_DEFAULT,
  LINK_GROUP_COLUMNS_DEFAULT,
  LINK_GROUP_COLUMNS_MAX,
  type PreFooterBigConfiguration,
  type PreFooterBigModel,
  type SocialLink,
  type LinkGroup,
  SocialPlatform,
} from "@/env";
import {
  contactCenterEmail,
  contactCenterName,
  contactCenterPhone,
  facebookLink,
  instagramLink,
  rssFeedLink,
  unexpectedPlatform,
  unexpectedPlatformLink,
  xLink,
  youtubeLink,
  getConnectSectionFull,
  getContactCenter,
  getUnexpectedPlatformSocialLink,
} from "@/components/ConnectSection.testData.ts";
import { getCouncilsLinkGroups } from "@/components/PreFooterBig.testData";

function expectInitialSocialLinks(socialLinks: SocialLink[]) {
  expect(socialLinks.length).toEqual(6);

  expect(socialLinks[0].platform).toEqual(SocialPlatform.YOUTUBE);
  expect(socialLinks[0].url).toEqual(youtubeLink);

  expect(socialLinks[1].platform).toEqual(SocialPlatform.INSTAGRAM);
  expect(socialLinks[1].url).toEqual(instagramLink);

  expect(socialLinks[2].platform).toEqual(SocialPlatform.X);
  expect(socialLinks[2].url).toEqual(xLink);

  expect(socialLinks[3].platform).toEqual(SocialPlatform.RSS_FEED);
  expect(socialLinks[3].url).toEqual(rssFeedLink);

  expect(socialLinks[4].platform).toEqual(unexpectedPlatform);
  expect(socialLinks[4].url).toEqual(unexpectedPlatformLink);

  expect(socialLinks[5].platform).toEqual(SocialPlatform.FACEBOOK);
  expect(socialLinks[5].url).toEqual(facebookLink);
}

function expectCleanedSocialLinks(socialLinks: SocialLink[]) {
  expect(socialLinks.length).toEqual(5);

  expect(socialLinks[0].platform).toEqual(SocialPlatform.FACEBOOK);
  expect(socialLinks[0].url).toEqual(facebookLink);

  expect(socialLinks[1].platform).toEqual(SocialPlatform.X);
  expect(socialLinks[1].url).toEqual(xLink);

  expect(socialLinks[2].platform).toEqual(SocialPlatform.YOUTUBE);
  expect(socialLinks[2].url).toEqual(youtubeLink);

  expect(socialLinks[3].platform).toEqual(SocialPlatform.INSTAGRAM);
  expect(socialLinks[3].url).toEqual(instagramLink);

  expect(socialLinks[4].platform).toEqual(SocialPlatform.RSS_FEED);
  expect(socialLinks[4].url).toEqual(rssFeedLink);
}

function expectcleanedLinkGroups(cleanedLinkGroups: LinkGroup[]) {
  expect(cleanedLinkGroups.length).toEqual(1);

  expect(cleanedLinkGroups[0].name).toEqual("Federal Executive Councils");
  expect(cleanedLinkGroups[0].links.length).toEqual(12);

  expect(cleanedLinkGroups[0].links[0].text).toEqual(
    "Chief Acquisition Officers Council",
  );
  expect(cleanedLinkGroups[0].links[0].url).toEqual("#url1");

  expect(cleanedLinkGroups[0].links[1].text).toEqual(
    "Chief Data Officers Council",
  );
  expect(cleanedLinkGroups[0].links[1].url).toEqual("#url2");

  expect(cleanedLinkGroups[0].links[2].text).toEqual(
    "Chief Information Officers Council",
  );
  expect(cleanedLinkGroups[0].links[2].url).toEqual("#url3");

  expect(cleanedLinkGroups[0].links[3].text).toEqual(
    "Evaluation Officer Council",
  );
  expect(cleanedLinkGroups[0].links[3].url).toEqual("#url4");

  expect(cleanedLinkGroups[0].links[4].text).toEqual(
    "Federal Real Property Council",
  );
  expect(cleanedLinkGroups[0].links[4].url).toEqual("#url5");

  expect(cleanedLinkGroups[0].links[5].text).toEqual(
    "Interagency Council on Statistical Policy",
  );
  expect(cleanedLinkGroups[0].links[5].url).toEqual("#url6");

  expect(cleanedLinkGroups[0].links[6].text).toEqual(
    "Chief AI Officers Council",
  );
  expect(cleanedLinkGroups[0].links[6].url).toEqual("#url7");

  expect(cleanedLinkGroups[0].links[7].text).toEqual(
    "Chief Financial Officers Council",
  );
  expect(cleanedLinkGroups[0].links[7].url).toEqual("#url8");

  expect(cleanedLinkGroups[0].links[8].text).toEqual(
    "Council on Federal Financial Assistance",
  );
  expect(cleanedLinkGroups[0].links[8].url).toEqual("#url9");

  expect(cleanedLinkGroups[0].links[9].text).toEqual("Made in America Council");
  expect(cleanedLinkGroups[0].links[9].url).toEqual("#url10");

  expect(cleanedLinkGroups[0].links[10].text).toEqual(
    "Federal Privacy Council",
  );
  expect(cleanedLinkGroups[0].links[10].url).toEqual("#url11");

  expect(cleanedLinkGroups[0].links[11].text).toEqual(
    "Performance Improvement Council",
  );
  expect(cleanedLinkGroups[0].links[11].url).toEqual("#url12");
}

function expectContactCenter(contactCenter: ContactCenter) {
  expect(contactCenter.email).toEqual(contactCenterEmail);
  expect(contactCenter.phone).toEqual(contactCenterPhone);
  expect(contactCenter.name).toEqual(contactCenterName);
}

describe("PreFooterBig Utilities, Connect Section", () => {
  it("does not clean populated Connect Section", () => {
    let connectSection: ConnectSectionModel | any = getConnectSectionFull();
    let cleanedConnectSection = cleanConnectSection(connectSection);

    expectContactCenter(cleanedConnectSection.contactCenter);
    expectCleanedSocialLinks(cleanedConnectSection.socialLinks);
  });

  it("does not throw errors if no Connect Section", () => {
    function test(connectSection: ConnectSectionModel | any) {
      expect(cleanConnectSection(connectSection)).toBeNull();
    }

    test({});
    test(null);
    test(undefined);
    test({
      contactCenter: null,
      socialLinks: null,
    });
    test({
      contactCenter: undefined,
      socialLinks: undefined,
    });
    test({
      contactCenter: {},
      socialLinks: [],
    });
    test({
      contactCenter: {},
      socialLinks: {},
    });
    test({
      contactCenter: {
        phone: null,
        email: null,
      },
      socialLinks: [],
    });
    test({
      contactCenter: {
        phone: undefined,
        email: undefined,
      },
      socialLinks: [],
    });
  });

  it("cleans Contact Center without phone and email", () => {
    function test(emptyPhone: string, emptyEmail: string) {
      let connectSection: ConnectSectionModel | any = getConnectSectionFull();
      connectSection.contactCenter.phone = emptyPhone;
      connectSection.contactCenter.email = emptyEmail;

      let cleanedConnectSection = cleanConnectSection(connectSection);

      expect(cleanedConnectSection.contactCenter).toBe(null);
      expectCleanedSocialLinks(cleanedConnectSection.socialLinks);
    }

    test(null, null);
    test("", null);
    test(null, "");
    test("", "");
    test(" ", null);
    test(null, "");
    test(" ", " ");
  });

  it("cleans, filters and sorts Social Links", () => {
    let connectSection: ConnectSectionModel | any =
      getConnectSectionFull(false);
    expectInitialSocialLinks(connectSection.socialLinks);

    let cleanedConnectSection = cleanConnectSection(connectSection);

    expectCleanedSocialLinks(cleanedConnectSection.socialLinks);
    expectContactCenter(cleanedConnectSection.contactCenter);
  });

  it("cleans empty Social Links", () => {
    function test(socialLinks: SocialLink[] | any) {
      let cleanedConnectSection = cleanConnectSection({
        contactCenter: getContactCenter(),
        socialLinks: socialLinks,
      });

      expect(cleanedConnectSection.socialLinks).toBeNull();
      expectContactCenter(cleanedConnectSection.contactCenter);
    }

    test([]);
    test([null, null]);
    test([{}, getUnexpectedPlatformSocialLink()]);
  });
});

describe("PreFooterBig Utilities, LinkGroups ", () => {
  it("does not clean populated LinkGroups ", () => {
    const linkGroups = getCouncilsLinkGroups();
    let cleanedLinkGroups = cleanLinkGroups(linkGroups);

    expectcleanedLinkGroups(cleanedLinkGroups);
  });

  it("does not throw errors if no LinkGroups ", () => {
    function test(linkGroups: LinkGroup[] | any) {
      let cleanedLinkGroups = cleanLinkGroups(linkGroups);
      expect(cleanedLinkGroups).toBeNull();
    }

    test(null);
    test(undefined);
    test([]);
    test({});
    test([null]);
    test([undefined]);
    test([{ name: "Topic Name", links: [] }]);
    test([{ name: "Topic Name", links: [{ text: null, url: "Link URL" }] }]);
    test([{ name: "Topic Name", links: [{ text: "Link text", url: null }] }]);
    test([{ name: "Topic Name", links: [{ text: "  ", url: "Link URL" }] }]);
    test([{ name: "Topic Name", links: [{ text: "Link text", url: "  " }] }]);
    test([
      { name: "Topic Name", links: [{ text: undefined, url: "Link URL" }] },
    ]);
    test([
      { name: "Topic Name", links: [{ text: "Link text", url: undefined }] },
    ]);
  });
});

describe("PreFooterBig Utilities, Configuration", () => {
  it("does not clean populated Configuration", () => {
    const configuration: PreFooterBigConfiguration = {
      columnsInLinkGroup: LINK_GROUP_COLUMNS_MAX,
      connectSectionLocation: "bottom",
    };

    const cleanedConfiguration: PreFooterBigConfiguration =
      cleanConfiguration(configuration);

    expect(cleanedConfiguration.columnsInLinkGroup).toEqual(
      LINK_GROUP_COLUMNS_MAX,
    );
    expect(cleanedConfiguration.connectSectionLocation).toEqual("bottom");
  });

  it("uses default configuration if not provided", () => {
    function test(configuration: PreFooterBigConfiguration | any) {
      const cleanedConfiguration: PreFooterBigConfiguration =
        cleanConfiguration(configuration);

      expect(cleanedConfiguration.columnsInLinkGroup).toEqual(
        LINK_GROUP_COLUMNS_DEFAULT,
      );
      expect(cleanedConfiguration.connectSectionLocation).toEqual(
        CONNECT_SECTION_LOCATION_DEFAULT,
      );
    }

    test({});
    test(null);
    test(undefined);
    test([]);
    test({
      columnsInLinkGroup: null,
      connectSectionLocation: null,
    });
    test({
      columnsInLinkGroup: undefined,
      connectSectionLocation: undefined,
    });
    test({
      columnsInLinkGroup: "test",
      connectSectionLocation: undefined,
    });
  });
});

describe("PreFooterBig Utilities, PreFooterBig", () => {
  it("does not clean populated PreFooterBig", () => {
    const preFooterBig: PreFooterBigModel = {
      linkGroups: getCouncilsLinkGroups(),
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: "bottom",
        columnsInLinkGroup: 1,
      },
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expectContactCenter(cleanedPreFooterBig.connectSection.contactCenter);
    expectCleanedSocialLinks(cleanedPreFooterBig.connectSection.socialLinks);
    expectcleanedLinkGroups(cleanedPreFooterBig.linkGroups);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      "bottom",
    );
    expect(cleanedPreFooterBig.configuration.columnsInLinkGroup).toEqual(1);
  });

  it("does not throw errors if no data", () => {
    function test(preFooterBig: PreFooterBigModel | any) {
      let cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);
      expect(cleanedPreFooterBig).toBeNull();
    }

    test(null);
    test(undefined);
    test([]);
    test({});
  });

  it("cleans LinkGroups ", () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      linkGroups: [],
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: "bottom",
        columnsInLinkGroup: 1,
      },
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expectContactCenter(cleanedPreFooterBig.connectSection.contactCenter);
    expectCleanedSocialLinks(cleanedPreFooterBig.connectSection.socialLinks);
    expect(cleanedPreFooterBig.linkGroups).toBeNull();
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      "bottom",
    );
    expect(cleanedPreFooterBig.configuration.columnsInLinkGroup).toEqual(1);
  });

  it("cleans Connect Section", () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      linkGroups: getCouncilsLinkGroups(),
      connectSection: {},
      configuration: {
        connectSectionLocation: "bottom",
        columnsInLinkGroup: 1,
      },
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expect(cleanedPreFooterBig.connectSection).toBeNull();
    expectcleanedLinkGroups(cleanedPreFooterBig.linkGroups);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      "bottom",
    );
    expect(cleanedPreFooterBig.configuration.columnsInLinkGroup).toEqual(1);
  });

  it("defaults Connect Section location", () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      linkGroups: getCouncilsLinkGroups(),
      connectSection: getConnectSectionFull(),
      configuration: {},
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expectContactCenter(cleanedPreFooterBig.connectSection.contactCenter);
    expectCleanedSocialLinks(cleanedPreFooterBig.connectSection.socialLinks);
    expectcleanedLinkGroups(cleanedPreFooterBig.linkGroups);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      CONNECT_SECTION_LOCATION_DEFAULT,
    );
    expect(cleanedPreFooterBig.configuration.columnsInLinkGroup).toEqual(
      LINK_GROUP_COLUMNS_DEFAULT,
    );
  });

  it("doesn't throw an error if not a number", () => {
    expect(cleanLinkGroupColumns("not a number")).toEqual(2);
  });
});
