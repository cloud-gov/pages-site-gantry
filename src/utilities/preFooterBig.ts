import {
  type ConnectSectionLocation,
  type ConnectSectionModel,
  type ContactCenter,
  type PreFooterBigConfiguration,
  type PreFooterBigModel,
  type SocialLink,
  type LinkGroup,
  SocialPlatform,
  CONNECT_SECTION_LOCATION_DEFAULT,
  LINK_GROUP_COLUMNS_DEFAULT,
  LINK_GROUP_COLUMNS_MAX,
  CONNECT_SECTION_BOTTOM,
} from "@/env";

function filterByPlatforms(
  items: SocialLink[],
  allowedPlatforms: string[],
): SocialLink[] {
  let socialLinks = items?.filter?.(
    (item) =>
      item != null &&
      allowedPlatforms.includes(item?.platform) &&
      item?.url?.trim().length > 0,
  );

  return socialLinks;
}

const platformsOrder: Record<SocialPlatform, number> = {
  [SocialPlatform.FACEBOOK]: 1,
  [SocialPlatform.X]: 2,
  [SocialPlatform.YOUTUBE]: 3,
  [SocialPlatform.INSTAGRAM]: 4,
  [SocialPlatform.RSS_FEED]: 5,
};

function sortSocialLinks(items: SocialLink[]) {
  return items?.sort(
    (a, b) =>
      (platformsOrder[a?.platform] ?? 0) - (platformsOrder[b?.platform] ?? 0),
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
  let sortedSocialLinks = sortSocialLinks(cleanedSocialLinks);
  return sortedSocialLinks ? sortedSocialLinks : null;
}

function cleanContactCenter(contactCenter: ContactCenter): ContactCenter {
  return contactCenter?.email?.trim() || contactCenter?.phone?.trim()
    ? contactCenter
    : null;
}

export function cleanLinkGroup(linkGroup: LinkGroup): LinkGroup {
  if (linkGroup) {
    linkGroup.name =
      linkGroup?.name?.trim()?.length > 0 ? linkGroup?.name?.trim() : null;
    if (linkGroup.links) {
      linkGroup.links = linkGroup?.links?.filter?.(
        (item) => item?.text?.trim().length > 0 && item?.url?.trim().length > 0,
      );
      if (linkGroup?.links?.length == 0) {
        return null;
      }
    }
  }
  return linkGroup;
}

export function cleanLinkGroups(linkGroups: LinkGroup[]): LinkGroup[] {
  let filteredLinkGroups = linkGroups?.filter?.((item) => cleanLinkGroup(item));
  filteredLinkGroups = filteredLinkGroups?.filter?.(
    (item) => item != null && item != undefined,
  );
  let isPopulated = filteredLinkGroups && filteredLinkGroups.length > 0;
  return isPopulated ? filteredLinkGroups : null;
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

export function cleanLinkGroupColumns(columnsInLinkGroup: string | number) {
  let columnsInLinkGroupInt: number;
  try {
    columnsInLinkGroupInt = Number(columnsInLinkGroup);
  } catch (error) {
    console.error(error);
  }
  let cleanedLinkGroupColumns = columnsInLinkGroupInt
    ? columnsInLinkGroupInt
    : LINK_GROUP_COLUMNS_DEFAULT;
  return cleanedLinkGroupColumns;
}

export function cleanConnectSectionLocation(connectSectionLocation: string) {
  return connectSectionLocation !== "bottom" &&
    connectSectionLocation !== "right"
    ? CONNECT_SECTION_LOCATION_DEFAULT
    : connectSectionLocation;
}

export function cleanConfiguration(
  configuration: PreFooterBigConfiguration,
): PreFooterBigConfiguration {
  let cleanedConnectSectionLocation: ConnectSectionLocation =
    cleanConnectSectionLocation(configuration?.connectSectionLocation);
  let cleanedLinkGroupColumns = cleanLinkGroupColumns(
    configuration?.columnsInLinkGroup,
  );
  cleanedLinkGroupColumns =
    cleanedLinkGroupColumns <= LINK_GROUP_COLUMNS_MAX
      ? cleanedLinkGroupColumns
      : LINK_GROUP_COLUMNS_MAX;
  return {
    connectSectionLocation: cleanedConnectSectionLocation,
    columnsInLinkGroup: cleanedLinkGroupColumns,
  };
}

export function cleanPreFooterBig(
  preFooterBig: PreFooterBigModel,
): PreFooterBigModel {
  const cleanedConnectSection: ConnectSectionModel = cleanConnectSection(
    preFooterBig?.connectSection,
  );
  const cleanedLinkGroups: LinkGroup[] = cleanLinkGroups(
    preFooterBig?.linkGroups,
  );

  const cleanedConfiguration: PreFooterBigConfiguration = cleanConfiguration(
    preFooterBig?.configuration,
  );

  if (!cleanedLinkGroups) {
    cleanedConfiguration.connectSectionLocation = CONNECT_SECTION_BOTTOM;
  }

  const isPopulated =
    cleanedConnectSection != null || cleanedLinkGroups != null;

  return isPopulated
    ? {
        linkGroups: cleanedLinkGroups,
        connectSection: cleanedConnectSection,
        configuration: cleanedConfiguration,
      }
    : null;
}
