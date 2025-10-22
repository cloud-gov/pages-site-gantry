export interface MediaValueProps {
  id: number;
  altText: string;
  caption: string | null;
  _status: "published";
  reviewReady: boolean;
  prefix: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  site: {
    bucket: string;
  };
  sizes: {
    thumbnail: Record<string, any>;
    square: Record<string, any>;
    small: Record<string, any>;
    medium: Record<string, any>;
    large: Record<string, any>;
    xlarge: Record<string, any>;
    og: Record<string, any>;
  };
}

export interface CollectionCategoryProps {
  id: number;
  title: string;
  slug?: string | null;
  slugLock?: boolean;
  site: {
    bucket: string;
  };
  parent: CollectionCategoryProps | null;
  breadcrumbs?: {
    doc?: CollectionCategoryProps | null;
    url?: string | null;
    label?: string | null;
    id?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}

export interface LinkModel {
  text: string;
  url: string;
  externalLink?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Identifiers {
  siteDomain: string;
  identifierLinks: LinkItem[];
  identifierName: string;
  identifierUrl: string;
}

export interface PreFooterSlimModel {
  contactTelephone: string;
  contactEmail: string;
  footerLinks: LinkModel[];
}

export const CONNECT_SECTION_RIGHT = "right";
export const CONNECT_SECTION_BOTTOM = "bottom";
export const CONNECT_SECTION_LOCATION_DEFAULT = CONNECT_SECTION_RIGHT;

export const LINK_GROUP_COLUMNS_DEFAULT = 2;
export const LINK_GROUP_COLUMNS_MAX = 4;

export enum SocialPlatform {
  FACEBOOK = "facebook",
  X = "x",
  YOUTUBE = "youtube",
  INSTAGRAM = "instagram",
  RSS_FEED = "rssFeed",
}

export interface ContactCenter {
  name: string;
  phone: string;
  email: string;
}

export interface ConnectSectionModel {
  contactCenter: ContactCenter;
  socialLinks: SocialLink[];
}

export interface LinkGroup {
  name: string;
  links: LinkModel[];
}

export type ConnectSectionLocation = "right" | "bottom";

export interface PreFooterBigConfiguration {
  connectSectionLocation: ConnectSectionLocation;
  columnsInLinkGroup: number;
}

export interface PreFooterBigModel {
  linkGroups?: LinkGroup[];
  connectSection?: ConnectSectionModel;
  configuration: PreFooterBigConfiguration;
}

export const PRE_FOOTER_TYPE_BIG = "big";
export const PRE_FOOTER_TYPE_SLIM = "slim";
export const PRE_FOOTER_TYPE_NONE = "none";

export type PreFooterType = "big" | "slim" | "none";

export type PreFooterData = PreFooterBigModel | PreFooterSlimModel;

export interface PreFooterModel {
  preFooterType: PreFooterType;
  preFooterData: PreFooterData;
}

export interface PageModel {
  title?: string;
  slug?: string;
}
