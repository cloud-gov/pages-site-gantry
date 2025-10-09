import { getConnectSection } from "@/components/ConnectSection.testData.ts";
import type { PreFooterBigModel, Topic } from "@/env";

export function getTopics(testCase: number = 1): Topic[] {
  let topics: Topic[];

  switch (testCase) {
    case 1:
      topics = getCouncilsTopics();
      break;

    case 2:
      topics = getThreeLongTopics();
      break;

    case 3:
      topics = getTwoSmallHeadlessTopics();
      break;

    default:
      topics = getCouncilsTopics();
      break;
  }

  return topics;
}

export function getCouncilsTopics(): Topic[] {
  return [
    {
      name: "Federal Executive Councils",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url1",
          displayOrder: 2,
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url2",
          displayOrder: 1,
        },
        {
          text: "Chief Data Officers Council",
          url: "#url3",
          displayOrder: 3,
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url4",
          displayOrder: 4,
        },
        {
          text: "Chief Information Officers Council",
          url: "#url5",
          displayOrder: 5,
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url6",
          displayOrder: 6,
        },
        {
          text: "Evaluation Officer Council",
          url: "#url7",
          displayOrder: 7,
        },
        {
          text: "Made in America Council",
          url: "#url8",
          displayOrder: 8,
        },
        {
          text: "Federal Real Property Council",
          url: "#url9",
          displayOrder: 9,
        },
        {
          text: "Federal Privacy Council",
          url: "#url10",
          displayOrder: 10,
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url11",
          displayOrder: 11,
        },
        {
          text: "Performance Improvement Council",
          url: "#url12",
          displayOrder: 12,
        },
      ],
    },
  ];
}

function getTwoSmallHeadlessTopics(): Topic[] {
  return [
    {
      name: null,
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
          displayOrder: 1,
        },
      ],
    },
    {
      name: null,
      links: [
        {
          text: "Federal Privacy Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Performance Improvement Council",
          url: "#url",
          displayOrder: 1,
        },
      ],
    },
  ];
}

function getThreeLongTopics(): Topic[] {
  return [
    {
      name: "Federal Executive Councils",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Information Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Evaluation Officer Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Made in America Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Federal Real Property Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Federal Privacy Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Performance Improvement Council",
          url: "#url",
          displayOrder: 1,
        },
      ],
    },
    {
      name: "Another Footer Section",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Information Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Evaluation Officer Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Made in America Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Federal Real Property Council",
          url: "#url",
          displayOrder: 1,
        },
      ],
    },
    {
      name: "Another Footer Section 2",
      links: [
        {
          text: "Chief AI Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Acquisition Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Data Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Financial Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Chief Information Officers Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Council on Federal Financial Assistance",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Evaluation Officer Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Made in America Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Federal Real Property Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Federal Privacy Council",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Interagency Council on Statistical Policy",
          url: "#url",
          displayOrder: 1,
        },
        {
          text: "Performance Improvement Council",
          url: "#url",
          displayOrder: 1,
        },
      ],
    },
  ];
}

export function getPreFooterBig(): PreFooterBigModel {
  const preFooterBigTest: PreFooterBigModel = {
    id: 1,
    topics: getTopics(1), // 1 - 13
    connectSection: getConnectSection(1), // 1 - 4
    configuration: {
      columnsInTopic: 2,
      // connectSectionLocation: 'bottom',
      connectSectionLocation: "right",
      // connectSectionLocation: null
    },
  };

  return preFooterBigTest;
}
