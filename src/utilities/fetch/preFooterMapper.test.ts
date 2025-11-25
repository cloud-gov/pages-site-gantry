import { describe, expect, it, vi } from "vitest";
import {
  mapContactCenter,
  mapLinkGroups,
  preFooterMapper,
  mapPreFooterBig,
  mapPreFooterBigConfiguration,
  mapPreFooterSlim,
  mapSocialLinks,
} from "./preFooterMapper";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  getEntry: vi.fn(),
  // Add other exports if needed
}));

export function getEmptySocialLinks(url) {
  return [
    {
      platform: "facebook",
      url: url,
    },
    {
      platform: "x",
      url: url,
    },
    {
      platform: "youtube",
      url: url,
    },
    {
      platform: "instagram",
      url: url,
    },
    {
      platform: "rssFeed",
      url: url,
    },
  ];
}
export function getEmptyContactCenter(value) {
  return { name: value, phone: value, email: value };
}

const defaultConfiguration = {
  columnsInLinkGroup: 2,
  connectSectionLocation: "right",
};

const slimPreFooterResponseData = {
  contactCenter: [{ phone: "(123)-456-7890", email: "email@gsa.gov" }],
  slimLink: [{ blockType: "externalLink", name: "name", url: "url" }],
};

const slimPreFooterBuilt = {
  contactEmail: "email@gsa.gov",
  contactTelephone: "(123)-456-7890",
  links: [{ text: "name", url: "url", externalLink: true }],
};

const bigPreFooterResponseData = {
  facebook: [{ url: "url1" }],
  platform_x: [{ url: "url2" }],
  youtube: [{ url: "url3" }],
  instagram: [{ url: "url4" }],
  rssfeed: [{ url: "url5" }],
  contactCenter: [
    {
      name: "contactCenterName",
      phone: "contactCenterPhone",
      email: "contactCenter@gsa.gov",
    },
  ],

  linkGroup: [
    {
      groupName: "groupName",
      link: [{ blockType: "externalLink", name: "name", url: "url" }],
    },
  ],
};
const bigPreFooterBuilt = {
  configuration: {
    columnsInLinkGroup: 2,
    connectSectionLocation: "right",
  },
  connectSection: {
    contactCenter: {
      name: "contactCenterName",
      phone: "contactCenterPhone",
      email: "contactCenter@gsa.gov",
    },
    socialLinks: [
      {
        platform: "facebook",
        url: "url1",
      },
      {
        platform: "x",
        url: "url2",
      },
      {
        platform: "youtube",
        url: "url3",
      },
      {
        platform: "instagram",
        url: "url4",
      },
      {
        platform: "rssFeed",
        url: "url5",
      },
    ],
  },
  linkGroups: [
    {
      links: [
        {
          externalLink: true,
          text: "name",
          url: "url",
        },
      ],
      name: "groupName",
    },
  ],
};
describe("PreFooter Data Fetch Utility", () => {
  it("maps slim pre-footer", () => {
    function test(response, expected) {
      expect(mapPreFooterSlim(response)).toEqual(expected);
    }

    test({}, {});
    test(null, {
      contactEmail: undefined,
      contactTelephone: undefined,
      links: undefined,
    });
    test(undefined, {
      contactEmail: undefined,
      contactTelephone: undefined,
      links: undefined,
    });
    test(
      { contactCenter: null, slimLink: null },
      {
        contactEmail: undefined,
        contactTelephone: undefined,
        links: undefined,
      },
    );
    test(
      { contactCenter: [], slimLink: undefined },
      {
        contactEmail: undefined,
        contactTelephone: undefined,
        links: undefined,
      },
    );
    test(
      { contactCenter: [{}], slimLink: [{}] },
      {
        contactEmail: undefined,
        contactTelephone: undefined,
        links: [null],
      },
    );
    test(
      {
        contactCenter: [{ phone: undefined, email: undefined }],
        slimLink: [{}],
      },
      {
        contactEmail: undefined,
        contactTelephone: undefined,
        links: [null],
      },
    );
    test(
      {
        contactCenter: [{ phone: null, email: null }],
        slimLink: [{ blockType: null }],
      },
      {
        contactEmail: null,
        contactTelephone: null,
        links: [null],
      },
    );
    test(slimPreFooterResponseData, slimPreFooterBuilt);
  });

  it("maps social links", () => {
    function test(response, expected) {
      expect(mapSocialLinks(response)).toEqual(expected);
    }

    test(null, getEmptySocialLinks(undefined));
    test(undefined, getEmptySocialLinks(undefined));
    test([], getEmptySocialLinks(undefined));
    test([{}], getEmptySocialLinks(undefined));
    test(
      {
        facebook: null,
        platform_x: null,
        youtube: null,
        instagram: null,
        rssfeed: null,
      },
      getEmptySocialLinks(undefined),
    );
    test(
      {
        facebook: [],
        platform_x: [],
        youtube: [],
        instagram: [],
        rssfeed: [],
      },
      getEmptySocialLinks(undefined),
    );
    test(
      {
        facebook: [{}],
        platform_x: [{}],
        youtube: [{}],
        instagram: [{}],
        rssfeed: [{}],
      },
      getEmptySocialLinks(undefined),
    );
    test(
      {
        facebook: [{ url: null }],
        platform_x: [{ url: null }],
        youtube: [{ url: null }],
        instagram: [{ url: null }],
        rssfeed: [{ url: null }],
      },
      getEmptySocialLinks(null),
    );
    test(
      {
        facebook: [{ url: undefined }],
        platform_x: [{ url: undefined }],
        youtube: [{ url: undefined }],
        instagram: [{ url: undefined }],
        rssfeed: [{ url: undefined }],
      },
      getEmptySocialLinks(undefined),
    );
    test(
      {
        facebook: [{ url: "url1" }],
        platform_x: [{ url: "url2" }],
        youtube: [{ url: "url3" }],
        instagram: [{ url: "url4" }],
        rssfeed: [{ url: "url5" }],
      },
      [
        {
          platform: "facebook",
          url: "url1",
        },
        {
          platform: "x",
          url: "url2",
        },
        {
          platform: "youtube",
          url: "url3",
        },
        {
          platform: "instagram",
          url: "url4",
        },
        {
          platform: "rssFeed",
          url: "url5",
        },
      ],
    );
  });

  it("maps contact center", () => {
    function test(response, expected) {
      expect(mapContactCenter(response)).toEqual(expected);
    }

    test(null, getEmptyContactCenter(undefined));
    test(undefined, getEmptyContactCenter(undefined));
    test({}, getEmptyContactCenter(undefined));
    test({ contactCenter: null }, getEmptyContactCenter(undefined));
    test({ contactCenter: undefined }, getEmptyContactCenter(undefined));
    test({ contactCenter: {} }, getEmptyContactCenter(undefined));
    test({ contactCenter: [] }, getEmptyContactCenter(undefined));
    test({ contactCenter: [{}] }, getEmptyContactCenter(undefined));
    test(
      {
        contactCenter: [
          { name: undefined, phone: undefined, email: undefined },
        ],
      },
      getEmptyContactCenter(undefined),
    );
    test(
      { contactCenter: [{ name: null, phone: null, email: null }] },
      getEmptyContactCenter(null),
    );
    const populatedContactCenter = {
      name: "name",
      phone: "(123)-456-7890",
      email: "email@gsa.gov",
    };
    test({ contactCenter: [populatedContactCenter] }, populatedContactCenter);
  });

  it("maps pre-footer big configuration", () => {
    function test(response, expected) {
      expect(mapPreFooterBigConfiguration(response)).toEqual(expected);
    }

    test(null, defaultConfiguration);
    test({}, defaultConfiguration);
    test(
      { connectSectionLocation: null, groupCol: null },
      defaultConfiguration,
    );
    test(
      { connectSectionLocation: undefined, groupCol: undefined },
      defaultConfiguration,
    );
    test(
      { connectSectionLocation: "left", groupCol: "one" },
      defaultConfiguration,
    );
    test(
      { connectSectionLocation: "left", groupCol: "0" },
      defaultConfiguration,
    );
    test(
      { connectSectionLocation: "left", groupCol: "10" },
      {
        columnsInLinkGroup: 4,
        connectSectionLocation: "right",
      },
    );
    test(
      { connectSectionLocation: "right", groupCol: "2" },
      {
        columnsInLinkGroup: 2,
        connectSectionLocation: "right",
      },
    );
    test(
      { connectSectionLocation: "bottom", groupCol: "2" },
      {
        columnsInLinkGroup: 2,
        connectSectionLocation: "bottom",
      },
    );
  });

  it("maps link groups", () => {
    function test(response, expected) {
      expect(mapLinkGroups(response)).toEqual(expected);
    }

    test(null, undefined);
    test({}, undefined);
    test({ linkGroup: null }, undefined);
    test({ linkGroup: undefined }, undefined);
    test({ linkGroup: [] }, []);
    test({ linkGroup: [null] }, [
      {
        links: undefined,
        name: undefined,
      },
    ]);
    test({ linkGroup: [undefined] }, [
      {
        links: undefined,
        name: undefined,
      },
    ]);
    test({ linkGroup: [{ groupName: null, link: null }] }, [
      {
        links: undefined,
        name: null,
      },
    ]);
    test({ linkGroup: [{ groupName: null, link: undefined }] }, [
      {
        links: undefined,
        name: null,
      },
    ]);
    test({ linkGroup: [{ groupName: null, link: [] }] }, [
      {
        links: [],
        name: null,
      },
    ]);
    test(
      {
        linkGroup: [
          {
            groupName: null,
            link: [{ blockType: null, name: null, url: null }],
          },
        ],
      },
      [
        {
          links: [null],
          name: null,
        },
      ],
    );
    test(
      {
        linkGroup: [
          {
            groupName: null,
            link: [{ blockType: "externalLink", name: null, url: null }],
          },
        ],
      },
      [
        {
          links: [
            {
              externalLink: true,
              text: null,
              url: null,
            },
          ],
          name: null,
        },
      ],
    );
    test(
      {
        linkGroup: [
          {
            groupName: "groupName",
            link: [{ blockType: "externalLink", name: "name", url: "url" }],
          },
        ],
      },
      [
        {
          links: [
            {
              externalLink: true,
              text: "name",
              url: "url",
            },
          ],
          name: "groupName",
        },
      ],
    );
  });

  it("maps big pre-footer", () => {
    function test(response, expected) {
      expect(mapPreFooterBig(response)).toEqual(expected);
    }

    const emptyPreFooterBig = {
      configuration: defaultConfiguration,
      connectSection: {
        contactCenter: getEmptyContactCenter(undefined),
        socialLinks: getEmptySocialLinks(undefined),
      },
      linkGroups: undefined,
    };
    test(null, emptyPreFooterBig);
    test({}, emptyPreFooterBig);
    test(bigPreFooterResponseData, bigPreFooterBuilt);
  });

  it("maps pre-footer", () => {
    function test(response, expected) {
      expect(preFooterMapper(response)).toEqual(expected);
    }

    function getEmptyPreFooter() {
      const emptyPreFooter = {
        preFooterData: undefined,
        preFooterType: null,
      };
      return emptyPreFooter;
    }

    const x = {
      type: "pre-footer",
    };

    test(null, getEmptyPreFooter());
    test({}, getEmptyPreFooter());
    test({ type: null }, getEmptyPreFooter());
    test({ type: undefined }, getEmptyPreFooter());
    test({ type: "unexpected" }, getEmptyPreFooter());
    test({ type: "unexpected" }, getEmptyPreFooter());
    test(
      {
        ...slimPreFooterResponseData,
        type: "slim",
      },
      {
        preFooterType: "slim",
        preFooterData: slimPreFooterBuilt,
      },
    );
    test(
      {
        ...bigPreFooterResponseData,
        type: "big",
      },
      {
        preFooterType: "big",
        preFooterData: bigPreFooterBuilt,
      },
    );
  });
});
