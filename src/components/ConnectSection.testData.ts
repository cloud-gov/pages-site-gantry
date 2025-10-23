import {
  type ConnectSectionModel,
  type SocialLink,
  SocialPlatform,
} from "@/env";

export const contactCenterName = "Agency Contact Center";
export const contactCenterPhone = "1-800-555-GOVT";
export const contactCenterEmail = "contact@agency.gov";
export const youtubeLink = "https://www.youtube.com/usgsa";
export const instagramLink = "https://www.instagram.com/usgsa/";
export const xLink = "https://x.com/usgsa";
export const rssFeedLink = "https://www.govinfo.gov/rss/budget.xmll";
export const unexpectedPlatformLink = "https://www.agency.com";
export const facebookLink = "https://www.facebook.com/GSA";

export const unexpectedPlatform = "UnexpectedPlatform";
export const ConnectSectionFull = 1;
export const ConnectSectionWithEmptyFields = 2;
export const ConnectSectionEmpty = 3;
export const ConnectSectionWithoutContactCenter = 4;
export const ConnectSectionWithEmptyContactCenter = 5;
export const ConnectSectionWithoutEmailAndPhone = 6;
export const ConnectSectionWithoutContactCenterName = 7;
export const ConnectSectionWithoutEmail = 8;
export const ConnectSectionWithoutPhone = 9;
export const ConnectSectionWith3Platforms = 10;
export const ConnectSectionWithoutSocialLinks = 11;
export const ConnectSectionWithEmptySocialLinks = 12;
export const ConnectSectionWithUnexpectedSocialLinks = 13;

export function getUnexpectedPlatformSocialLink(): SocialLink {
  return {
    platform: unexpectedPlatform,
    url: unexpectedPlatformLink,
  };
}

export function getSocialLinks(): SocialLink[] {
  return [
    {
      platform: "youtube",
      url: youtubeLink,
    },
    {
      platform: "instagram",
      url: instagramLink,
    },
    {
      platform: "x",
      url: xLink,
    },
    {
      platform: "rssFeed",
      url: rssFeedLink,
    },
    getUnexpectedPlatformSocialLink(),
    {
      platform: "facebook",
      url: facebookLink,
    },
  ];
}

export function getContactCenter() {
  return {
    name: contactCenterName,
    phone: contactCenterPhone,
    email: contactCenterEmail,
  };
}

export function getConnectSectionFull(shuffle = true): ConnectSectionModel {
  const connectSection: ConnectSectionModel = {
    contactCenter: getContactCenter(),
    socialLinks: getSocialLinks(),
  };

  if (shuffle) {
    connectSection.socialLinks.sort(() => Math.random() - 0.5);
  }

  return connectSection;
}

export function getConnectSectionWithEmptyFields() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter = null;
  connectSection.socialLinks = null;

  return connectSection;
}

export function getConnectSectionEmpty(): ConnectSectionModel | any {
  return {};
}

export function getConnectSectionWithoutContactCenter() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter = null;

  return connectSection;
}

export function getConnectSectionWithEmptyContactCenter() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter.name = null;
  connectSection.contactCenter.phone = null;
  connectSection.contactCenter.email = null;

  return connectSection;
}

export function getConnectSectionWithoutEmailAndPhone() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter.phone = null;
  connectSection.contactCenter.email = null;

  return connectSection;
}

export function getConnectSectionWithoutContactCenterName() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter.name = null;

  return connectSection;
}

export function getConnectSectionWithoutEmail() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter.email = null;

  return connectSection;
}

export function getConnectSectionWithoutPhone() {
  const connectSection = getConnectSectionFull();

  connectSection.contactCenter.phone = null;

  return connectSection;
}

export function getConnectSectionWith3Platforms() {
  const connectSection = getConnectSectionFull();

  const shuffledSocialLinks = connectSection.socialLinks.sort(
    () => Math.random() - 0.5,
  );
  connectSection.socialLinks = shuffledSocialLinks.filter(
    (item) =>
      item.platform === SocialPlatform.FACEBOOK ||
      item.platform === SocialPlatform.YOUTUBE ||
      item.platform === SocialPlatform.RSS_FEED,
  );

  return connectSection;
}

export function getConnectSectionWithoutSocialLinks() {
  const connectSection = getConnectSectionFull();

  connectSection.socialLinks = null;
  return connectSection;
}

export function getConnectSectionWithEmptySocialLinks() {
  const connectSection = getConnectSectionFull();

  connectSection.socialLinks = [];
  return connectSection;
}

export function getConnectSectionWithUnexpectedSocialLinks() {
  const connectSection = getConnectSectionFull();

  connectSection.socialLinks = connectSection.socialLinks.filter(
    (item) => item.platform === unexpectedPlatform,
  );

  return connectSection;
}

export function getConnectSection(testCase: number): ConnectSectionModel {
  let connectSection: ConnectSectionModel;

  switch (testCase) {
    case ConnectSectionFull:
      connectSection = getConnectSectionFull();
      break;
    case ConnectSectionWithEmptyFields:
      connectSection = getConnectSectionWithEmptyFields();
      break;
    case ConnectSectionEmpty:
      connectSection = getConnectSectionEmpty();
      break;
    case ConnectSectionWithoutContactCenter:
      connectSection = getConnectSectionWithoutContactCenter();
      break;
    case ConnectSectionWithEmptyContactCenter:
      connectSection = getConnectSectionWithEmptyContactCenter();
      break;
    case ConnectSectionWithoutEmailAndPhone:
      connectSection = getConnectSectionWithoutEmailAndPhone();
      break;
    case ConnectSectionWithoutContactCenterName:
      connectSection = getConnectSectionWithoutContactCenterName();
      break;
    case ConnectSectionWithoutEmail:
      connectSection = getConnectSectionWithoutEmail();
      break;
    case ConnectSectionWithoutPhone:
      connectSection = getConnectSectionWithoutPhone();
      break;
    case ConnectSectionWith3Platforms:
      connectSection = getConnectSectionWith3Platforms();
      break;
    case ConnectSectionWithoutSocialLinks:
      connectSection = getConnectSectionWithoutSocialLinks();
      break;
    case ConnectSectionWithEmptySocialLinks:
      connectSection = getConnectSectionWithEmptySocialLinks();
      break;
    case ConnectSectionWithUnexpectedSocialLinks:
      connectSection = getConnectSectionWithUnexpectedSocialLinks();
      break;
    default:
      connectSection = getConnectSectionFull();
      break;
  }

  return connectSection;
}
