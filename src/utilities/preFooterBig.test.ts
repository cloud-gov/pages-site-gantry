import { describe, expect, it } from "vitest";
import {
  cleanConfiguration,
  cleanConnectSection,
  cleanPreFooterBig,
  cleanTopics,
} from "@/utilities/preFooterBig";
import {
  type ConnectSectionModel,
  type ContactCenter,
  CONNECT_SECTION_LOCATION_DEFAULT,
  TOPIC_COLUMNS_DEFAULT,
  TOPIC_COLUMNS_MAX,
  type PreFooterBigConfiguration,
  type PreFooterBigModel,
  type SocialLink,
  type Topic,
  SocialPlatform,
} from "@/env";
import {
  contactCenterEmail,
  contactCenterName,
  contactCenterPhone,
  facebookDisplayOrder,
  facebookLink,
  instagramDisplayOrder,
  instagramLink,
  rssFeedDisplayOrder,
  rssFeedLink,
  unexpectedPlatform,
  unexpectedPlatformDisplayOrder,
  unexpectedPlatformLink,
  xDisplayOrder,
  xLink,
  youtubeDisplayOrder,
  youtubeLink,
  getConnectSectionFull,
  getContactCenter,
  getUnexpectedPlatformSocialLink,
} from "@/components/ConnectSection.testData.ts";
import { getCouncilsTopics } from "@/components/PreFooterBig.testData";

function expectInitialSocialLinks(socialLinks: SocialLink[]) {
  expect(socialLinks.length).toEqual(6);

  expect(socialLinks[0].platform).toEqual(SocialPlatform.YOUTUBE);
  expect(socialLinks[0].link).toEqual(youtubeLink);
  expect(socialLinks[0].displayOrder).toEqual(youtubeDisplayOrder);

  expect(socialLinks[1].platform).toEqual(SocialPlatform.INSTAGRAM);
  expect(socialLinks[1].link).toEqual(instagramLink);
  expect(socialLinks[1].displayOrder).toEqual(instagramDisplayOrder);

  expect(socialLinks[2].platform).toEqual(SocialPlatform.X);
  expect(socialLinks[2].link).toEqual(xLink);
  expect(socialLinks[2].displayOrder).toEqual(xDisplayOrder);

  expect(socialLinks[3].platform).toEqual(SocialPlatform.RSS_FEED);
  expect(socialLinks[3].link).toEqual(rssFeedLink);
  expect(socialLinks[3].displayOrder).toEqual(rssFeedDisplayOrder);

  expect(socialLinks[4].platform).toEqual(unexpectedPlatform);
  expect(socialLinks[4].link).toEqual(unexpectedPlatformLink);
  expect(socialLinks[4].displayOrder).toEqual(unexpectedPlatformDisplayOrder);

  expect(socialLinks[5].platform).toEqual(SocialPlatform.FACEBOOK);
  expect(socialLinks[5].link).toEqual(facebookLink);
  expect(socialLinks[5].displayOrder).toEqual(facebookDisplayOrder);
}

function expectCleanedSocialLinks(socialLinks: SocialLink[]) {
  expect(socialLinks.length).toEqual(5);

  expect(socialLinks[0].platform).toEqual(SocialPlatform.FACEBOOK);
  expect(socialLinks[0].link).toEqual(facebookLink);
  expect(socialLinks[0].displayOrder).toEqual(facebookDisplayOrder);

  expect(socialLinks[1].platform).toEqual(SocialPlatform.X);
  expect(socialLinks[1].link).toEqual(xLink);
  expect(socialLinks[1].displayOrder).toEqual(xDisplayOrder);

  expect(socialLinks[2].platform).toEqual(SocialPlatform.YOUTUBE);
  expect(socialLinks[2].link).toEqual(youtubeLink);
  expect(socialLinks[2].displayOrder).toEqual(youtubeDisplayOrder);

  expect(socialLinks[3].platform).toEqual(SocialPlatform.INSTAGRAM);
  expect(socialLinks[3].link).toEqual(instagramLink);
  expect(socialLinks[3].displayOrder).toEqual(instagramDisplayOrder);

  expect(socialLinks[4].platform).toEqual(SocialPlatform.RSS_FEED);
  expect(socialLinks[4].link).toEqual(rssFeedLink);
  expect(socialLinks[4].displayOrder).toEqual(rssFeedDisplayOrder);
}

function expectCleanedTopics(cleanedTopics: Topic[]) {
  expect(cleanedTopics.length).toEqual(1);

  expect(cleanedTopics[0].name).toEqual("Federal Executive Councils");
  expect(cleanedTopics[0].links.length).toEqual(12);
  expect(cleanedTopics[0].links[1].text).toEqual("Chief AI Officers Council");
  expect(cleanedTopics[0].links[1].url).toEqual("#url1");
  expect(cleanedTopics[0].links[0].text).toEqual(
    "Chief Acquisition Officers Council",
  );
  expect(cleanedTopics[0].links[0].url).toEqual("#url2");
  expect(cleanedTopics[0].links[2].text).toEqual("Chief Data Officers Council");
  expect(cleanedTopics[0].links[2].url).toEqual("#url3");
  expect(cleanedTopics[0].links[3].text).toEqual(
    "Chief Financial Officers Council",
  );
  expect(cleanedTopics[0].links[3].url).toEqual("#url4");
  expect(cleanedTopics[0].links[4].text).toEqual(
    "Chief Information Officers Council",
  );
  expect(cleanedTopics[0].links[4].url).toEqual("#url5");
  expect(cleanedTopics[0].links[5].text).toEqual(
    "Council on Federal Financial Assistance",
  );
  expect(cleanedTopics[0].links[5].url).toEqual("#url6");
  expect(cleanedTopics[0].links[6].text).toEqual("Evaluation Officer Council");
  expect(cleanedTopics[0].links[6].url).toEqual("#url7");
  expect(cleanedTopics[0].links[7].text).toEqual("Made in America Council");
  expect(cleanedTopics[0].links[7].url).toEqual("#url8");
  expect(cleanedTopics[0].links[8].text).toEqual(
    "Federal Real Property Council",
  );
  expect(cleanedTopics[0].links[8].url).toEqual("#url9");
  expect(cleanedTopics[0].links[9].text).toEqual("Federal Privacy Council");
  expect(cleanedTopics[0].links[9].url).toEqual("#url10");
  expect(cleanedTopics[0].links[10].text).toEqual(
    "Interagency Council on Statistical Policy",
  );
  expect(cleanedTopics[0].links[10].url).toEqual("#url11");
  expect(cleanedTopics[0].links[11].text).toEqual(
    "Performance Improvement Council",
  );
  expect(cleanedTopics[0].links[11].url).toEqual("#url12");
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

describe("PreFooterBig Utilities, Topics", () => {
  it("does not clean populated Topics", () => {
    const topics = getCouncilsTopics();
    let cleanedTopics = cleanTopics(topics);

    expectCleanedTopics(cleanedTopics);
  });

  it("does not throw errors if no Topics", () => {
    function test(topics: Topic[] | any) {
      let cleanedTopics = cleanTopics(topics);
      expect(cleanedTopics).toBeNull();
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
      columnsInTopic: TOPIC_COLUMNS_MAX,
      connectSectionLocation: "bottom",
    };

    const cleanedConfiguration: PreFooterBigConfiguration =
      cleanConfiguration(configuration);

    expect(cleanedConfiguration.columnsInTopic).toEqual(TOPIC_COLUMNS_MAX);
    expect(cleanedConfiguration.connectSectionLocation).toEqual("bottom");
  });

  it("uses default configuration if not provided", () => {
    function test(configuration: PreFooterBigConfiguration | any) {
      const cleanedConfiguration: PreFooterBigConfiguration =
        cleanConfiguration(configuration);

      expect(cleanedConfiguration.columnsInTopic).toEqual(
        TOPIC_COLUMNS_DEFAULT,
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
      columnsInTopic: null,
      connectSectionLocation: null,
    });
    test({
      columnsInTopic: undefined,
      connectSectionLocation: undefined,
    });
    test({
      columnsInTopic: "test",
      connectSectionLocation: undefined,
    });
  });
});

describe("PreFooterBig Utilities, PreFooterBig", () => {
  it("does not clean populated PreFooterBig", () => {
    const preFooterBig: PreFooterBigModel = {
      id: 1111,
      topics: getCouncilsTopics(),
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: "bottom",
        columnsInTopic: 1,
      },
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expectContactCenter(cleanedPreFooterBig.connectSection.contactCenter);
    expectCleanedSocialLinks(cleanedPreFooterBig.connectSection.socialLinks);
    expectCleanedTopics(cleanedPreFooterBig.topics);
    expect(cleanedPreFooterBig.id).toEqual(1111);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      "bottom",
    );
    expect(cleanedPreFooterBig.configuration.columnsInTopic).toEqual(1);
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

  it("cleans Topics", () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      topics: [],
      connectSection: getConnectSectionFull(),
      configuration: {
        connectSectionLocation: "bottom",
        columnsInTopic: 1,
      },
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expectContactCenter(cleanedPreFooterBig.connectSection.contactCenter);
    expectCleanedSocialLinks(cleanedPreFooterBig.connectSection.socialLinks);
    expect(cleanedPreFooterBig.topics).toBeNull();
    expect(cleanedPreFooterBig.id).toEqual(1111);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      "bottom",
    );
    expect(cleanedPreFooterBig.configuration.columnsInTopic).toEqual(1);
  });

  it("cleans Connect Section", () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      topics: getCouncilsTopics(),
      connectSection: {},
      configuration: { connectSectionLocation: "bottom", columnsInTopic: 1 },
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expect(cleanedPreFooterBig.connectSection).toBeNull();
    expectCleanedTopics(cleanedPreFooterBig.topics);
    expect(cleanedPreFooterBig.id).toEqual(1111);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      "bottom",
    );
    expect(cleanedPreFooterBig.configuration.columnsInTopic).toEqual(1);
  });

  it("defaults Connect Section location", () => {
    const preFooterBig: PreFooterBigModel | any = {
      id: 1111,
      topics: getCouncilsTopics(),
      connectSection: getConnectSectionFull(),
      configuration: {},
    };

    const cleanedPreFooterBig = cleanPreFooterBig(preFooterBig);

    expectContactCenter(cleanedPreFooterBig.connectSection.contactCenter);
    expectCleanedSocialLinks(cleanedPreFooterBig.connectSection.socialLinks);
    expectCleanedTopics(cleanedPreFooterBig.topics);
    expect(cleanedPreFooterBig.id).toEqual(1111);
    expect(cleanedPreFooterBig.configuration.connectSectionLocation).toEqual(
      CONNECT_SECTION_LOCATION_DEFAULT,
    );
    expect(cleanedPreFooterBig.configuration.columnsInTopic).toEqual(
      TOPIC_COLUMNS_DEFAULT,
    );
  });
});
