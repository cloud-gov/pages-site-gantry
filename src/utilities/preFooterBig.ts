import {
  type ConnectSectionLocation,
  type ConnectSectionModel,
  type ContactCenter,
  type PreFooterBigConfiguration,
  type PreFooterBigModel,
  type SocialLink,
  type Topic,
  SocialPlatform,
  CONNECT_SECTION_LOCATION_DEFAULT,
  TOPIC_COLUMNS_DEFAULT,
  TOPIC_COLUMNS_MAX,
} from "@/env";

function filterByPlatforms(items: SocialLink[], allowedPlatforms: string[]) {
  return items?.filter?.(
    (item) =>
      item != null &&
      allowedPlatforms.includes(item?.platform) &&
      item?.link?.trim().length > 0,
  );
}

function sortByDisplayOrder<T>(items: T[]) {
  return items?.sort(
    (a, b) => (a["displayOrder"] ?? 0) - (b["displayOrder"] ?? 0),
  );
}

function getAllowedPlatforms() {
  return [
    SocialPlatform.FACEBOOK,
    SocialPlatform.YOUTUBE,
    SocialPlatform.INSTAGRAM,
    SocialPlatform.X,
    SocialPlatform.RSS_FEED,
  ];
}

function cleanSocialLinks(socialLinks: SocialLink[]) {
  const filteredSocialLinks = filterByPlatforms(
    socialLinks,
    getAllowedPlatforms(),
  );
  const cleanedSocialLinks =
    filteredSocialLinks && filteredSocialLinks?.length
      ? filteredSocialLinks
      : null;
  let sortedSocialLinks = sortByDisplayOrder(cleanedSocialLinks);
  return sortedSocialLinks ? sortedSocialLinks : null;
}

function cleanContactCenter(contactCenter: ContactCenter): ContactCenter {
  return contactCenter?.email?.trim() || contactCenter?.phone?.trim()
    ? contactCenter
    : null;
}

export function cleanTopic(topic: Topic): Topic {
  if (topic) {
    topic.name = topic?.name?.trim()?.length > 0 ? topic?.name?.trim() : null;
    if (topic.links) {
      topic.links = topic?.links?.filter?.(
        (item) => item?.text?.trim().length > 0 && item?.url?.trim().length > 0,
      );
      if (topic?.links?.length == 0) {
        return null;
      }
      sortByDisplayOrder(topic?.links);
    }
  }
  return topic;
}

export function cleanTopics(topics: Topic[]): Topic[] {
  let filteredTopics = topics?.filter?.((item) => cleanTopic(item));
  filteredTopics = filteredTopics?.filter?.((item) => item != null);
  let isPopulated = filteredTopics && filteredTopics.length > 0;
  return isPopulated ? filteredTopics : null;
}

export function cleanConnectSection(
  connectSection: ConnectSectionModel,
): ConnectSectionModel {
  const cleanedSocialLinks: SocialLink[] = cleanSocialLinks(
    connectSection?.socialLinks,
  );
  const cleanedContactCenter = cleanContactCenter(
    connectSection?.contactCenter,
  );
  let isPopulated = cleanedContactCenter != null || cleanedSocialLinks != null;
  return isPopulated
    ? {
        contactCenter: cleanedContactCenter,
        socialLinks: cleanedSocialLinks,
      }
    : null;
}

export function cleanConfiguration(
  configuration: PreFooterBigConfiguration,
): PreFooterBigConfiguration {
  let cleanedConnectSectionLocation: ConnectSectionLocation =
    configuration?.connectSectionLocation !== "bottom" &&
    configuration?.connectSectionLocation !== "right"
      ? CONNECT_SECTION_LOCATION_DEFAULT
      : configuration?.connectSectionLocation;
  let cleanedTopicColumns = Number.isInteger(configuration?.columnsInTopic)
    ? configuration?.columnsInTopic
    : TOPIC_COLUMNS_DEFAULT;
  cleanedTopicColumns =
    cleanedTopicColumns <= TOPIC_COLUMNS_MAX
      ? cleanedTopicColumns
      : TOPIC_COLUMNS_MAX;
  return {
    connectSectionLocation: cleanedConnectSectionLocation,
    columnsInTopic: cleanedTopicColumns,
  };
}

export function cleanPreFooterBig(
  preFooterBig: PreFooterBigModel,
): PreFooterBigModel {
  const cleanedConnectSection: ConnectSectionModel = cleanConnectSection(
    preFooterBig?.connectSection,
  );
  const cleanedTopics: Topic[] = cleanTopics(preFooterBig?.topics);
  const cleanedConfiguration: PreFooterBigConfiguration = cleanConfiguration(
    preFooterBig?.configuration,
  );
  const isPopulated = cleanedConnectSection != null || cleanedTopics != null;

  return isPopulated
    ? {
        id: preFooterBig?.id,
        topics: cleanedTopics,
        connectSection: cleanedConnectSection,
        configuration: cleanedConfiguration,
      }
    : null;
}
