import { type ConnectSectionModel, SocialPlatform } from "@/env";

export const contactCenterName = "Agency Contact Center";
export const contactCenterPhone = "1-800-555-GOVT";
export const contactCenterEmail = "contact@agency.gov";
export const youtubeLink = "https://www.youtube.com/usgsa";
export const instagramLink = "https://www.instagram.com/usgsa/";
export const xLink = "https://x.com/usgsa";
export const rssFeedLink = "https://www.govinfo.gov/rss/budget.xmll";
export const unexpectedPlatformLink = "https://www.agency.com";
export const facebookLink = "https://www.facebook.com/GSA";

export const facebookDisplayOrder = 1;
export const xDisplayOrder = 2;
export const youtubeDisplayOrder = 3;
export const instagramDisplayOrder = 4;
export const rssFeedDisplayOrder = 5;
export const unexpectedPlatformDisplayOrder = 6;

export const unexpectedPlatform = "UnexpectedPlatform";

export function getUnexpectedPlatformSocialLink() {
  return {
    platform: unexpectedPlatform,
    link: unexpectedPlatformLink,
    displayOrder: unexpectedPlatformDisplayOrder,
  };
}

export function getSocialLinks() {
  return [
    {
      platform: "youtube",
      link: youtubeLink,
      displayOrder: youtubeDisplayOrder,
    },
    {
      platform: "instagram",
      link: instagramLink,
      displayOrder: instagramDisplayOrder,
    },
    {
      platform: "x",
      link: xLink,
      displayOrder: xDisplayOrder,
    },
    {
      platform: "rssFeed",
      link: rssFeedLink,
      displayOrder: rssFeedDisplayOrder,
    },
    getUnexpectedPlatformSocialLink(),
    {
      platform: "facebook",
      link: facebookLink,
      displayOrder: facebookDisplayOrder,
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

export function getConnectSectionFull(shuffle = true) {
  const connectSection = {
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

export function getConnectSection(testCase = 1): ConnectSectionModel {
  let connectSection: ConnectSectionModel;

  switch (testCase) {
    case 1:
      connectSection = getConnectSectionFull();
      break;
    case 2:
      connectSection = getConnectSectionWithEmptyFields();
      break;
    case 3:
      connectSection = getConnectSectionEmpty();
      break;
    case 4:
      connectSection = getConnectSectionWithoutContactCenter();
      break;
    case 5:
      connectSection = getConnectSectionWithEmptyContactCenter();
      break;
    case 6:
      connectSection = getConnectSectionWithoutEmailAndPhone();
      break;
    case 7:
      connectSection = getConnectSectionWithoutContactCenterName();
      break;
    case 8:
      connectSection = getConnectSectionWithoutEmail();
      break;
    case 9:
      connectSection = getConnectSectionWithoutPhone();
      break;
    case 10:
      connectSection = getConnectSectionWith3Platforms();
      break;
    case 11:
      connectSection = getConnectSectionWithoutSocialLinks();
      break;
    case 12:
      connectSection = getConnectSectionWithEmptySocialLinks();
      break;
    case 13:
      connectSection = getConnectSectionWithUnexpectedSocialLinks();
      break;
    default:
      connectSection = getConnectSectionFull();
      break;
  }

  return connectSection;
}
