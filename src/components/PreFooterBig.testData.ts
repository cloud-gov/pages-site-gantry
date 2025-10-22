import { getConnectSection } from "@/components/ConnectSection.testData.ts";
import type { PreFooterBigModel, LinkGroup } from "@/env";

export function getLinkGroups(testCase: number = 1): LinkGroup[] {
  let linkGroups: LinkGroup[];

  switch (testCase) {
    case 1:
      linkGroups = getCouncilsLinkGroups();
      break;

    case 2:
      linkGroups = getThreeLongLinkGroups();
      break;

    case 3:
      linkGroups = getTwoSmallHeadlessLinkGroups();
      break;

    case 4:
      linkGroups = getDigitalGovLinkGroups();
      break;

    case 5:
      linkGroups = getTemplateLinkGroup();
      break;

    case 6:
      linkGroups = getSmallHeadlessLinkGroup();
      break;

    default:
      linkGroups = getCouncilsLinkGroups();
      break;
  }

  return linkGroups;
}

export function getCouncilsLinkGroups(): LinkGroup[] {
  return [
    {
      name: "Federal Executive Councils",
      links: [
        {
          text: "Chief Acquisition Officers Council",
          url: "#url1",
        },
        {
          text: "Chief Data Officers Council",
          url: "#url2",
        },
        {
          text: "Chief Information Officers Council",
          url: "#url3",
        },
        {
          text: "Evaluation Officer Council",
          url: "#url4",
        },
        {
          text: "Federal Real Property Council",
          url: "#url5",
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url6",
        },
        {
          text: "Chief AI Officers Council",
          url: "#url7",
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url8",
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url9",
        },
        {
          text: "Made in America Council",
          url: "#url10",
        },
        {
          text: "Federal Privacy Council",
          url: "#url11",
        },
        {
          text: "Performance Improvement Council",
          url: "#url12",
        },
      ],
    },
  ];
}

export function getTemplateLinkGroup(): LinkGroup[] {
  return [
    {
      name: "Links Group 1",
      links: [
        {
          text: "Posts",
          url: "#url1",
        },
        {
          text: "Events",
          url: "#url1",
        },
        {
          text: "News",
          url: "#url1",
        },
      ],
    },
    {
      name: "Links Group 2",
      links: [
        {
          text: "Reports",
          url: "#url1",
        },
        {
          text: "Leadership",
          url: "#url1",
        },
        {
          text: "Resources",
          url: "#url1",
        },
      ],
    },
  ];
}

export function getDigitalGovLinkGroups(): LinkGroup[] {
  return [
    {
      name: "Learn",
      links: [
        {
          text: "Blogs",
          url: "#url1",
        },
        {
          text: "Events",
          url: "#url1",
        },
        {
          text: "Resources",
          url: "#url1",
        },
        {
          text: "Communities",
          url: "#url1",
        },
        {
          text: "Guides",
          url: "#url1",
        },
        {
          text: "Job Board",
          url: "#url1",
        },
      ],
    },
    {
      name: "Grow",
      links: [
        {
          text: "Write For Us",
          url: "#url1",
        },
        {
          text: "Host an Event",
          url: "#url1",
        },
        {
          text: "Submit GitHub Issue",
          url: "#url1",
        },
      ],
    },
    {
      name: "Connect",
      links: [
        {
          text: "About Us",
          url: "#url1",
        },
        {
          text: "Site Policies",
          url: "#url1",
        },
        {
          text: "Contact Us",
          url: "#url1",
        },
        {
          text: "Content Schedule",
          url: "#url1",
        },
      ],
    },
  ];
}

function getTwoSmallHeadlessLinkGroups(): LinkGroup[] {
  return [
    {
      name: null,
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
        },
      ],
    },
    {
      name: null,
      links: [
        {
          text: "Federal Privacy Council",
          url: "#url",
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url",
        },
        {
          text: "Performance Improvement Council",
          url: "#url",
        },
      ],
    },
  ];
}

function getSmallHeadlessLinkGroup(): LinkGroup[] {
  return [
    {
      name: null,
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
        },
      ],
    },
  ];
}

function getThreeLongLinkGroups(): LinkGroup[] {
  return [
    {
      name: "Federal Executive Councils",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url",
        },
        {
          text: "Chief Information Officers Council",
          url: "#url",
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url",
        },
        {
          text: "Evaluation Officer Council",
          url: "#url",
        },
        {
          text: "Made in America Council",
          url: "#url",
        },
        {
          text: "Federal Real Property Council",
          url: "#url",
        },
        {
          text: "Federal Privacy Council",
          url: "#url",
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url",
        },
        {
          text: "Performance Improvement Council",
          url: "#url",
        },
      ],
    },
    {
      name: "Another Footer Section",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url",
        },
        {
          text: "Chief Information Officers Council",
          url: "#url",
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url",
        },
        {
          text: "Evaluation Officer Council",
          url: "#url",
        },
        {
          text: "Made in America Council",
          url: "#url",
        },
        {
          text: "Federal Real Property Council",
          url: "#url",
        },
      ],
    },
    {
      name: "Another Footer Section 2",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url",
        },
        {
          text: "Chief Information Officers Council",
          url: "#url",
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url",
        },
        {
          text: "Evaluation Officer Council",
          url: "#url",
        },
        {
          text: "Made in America Council",
          url: "#url",
        },
        {
          text: "Federal Real Property Council",
          url: "#url",
        },
        {
          text: "Federal Privacy Council",
          url: "#url",
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url",
        },
        {
          text: "Performance Improvement Council",
          url: "#url",
        },
      ],
    },
  ];
}

export function getPreFooterBig(): PreFooterBigModel {
  const preFooterBigTest: PreFooterBigModel = {
    linkGroups: getLinkGroups(6), // 1 - 13
    connectSection: getConnectSection(1), // 1 - 4
    configuration: {
      columnsInLinkGroup: 4,
      // connectSectionLocation: 'bottom',
      connectSectionLocation: "right",
      // connectSectionLocation: null
    },
  };

  preFooterBigTest.connectSection.socialLinks = null;
  preFooterBigTest.connectSection.contactCenter.name = null;

  return preFooterBigTest;
}
