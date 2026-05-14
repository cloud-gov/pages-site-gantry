import type { Media } from "@/payload-types.ts";

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

export interface CollectionTagProps {
  id: number;
  title: string;
  slug?: string | null;
  slugLock?: boolean;
  tagTypes?: {
    id: number;
    title: string;
    slug: string;
  };
  site: {
    bucket: string;
  };
  parent: CollectionTagProps | null;
  breadcrumbs?: {
    doc?: CollectionTagProps | null;
    url?: string | null;
    title?: string | null;
    id?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
export interface HomePage {
  id: number;
  content?:
    | (
        | {
            title: string;
            subtitle?: string | null;
            description?: string | null;
            bgImage?: (number | null) | MediaValueProps;
            ctaButton?: {
              text?: string | null;
              url?: string | null;
              style?: ("primary" | "secondary" | "outline") | null;
            };
            id?: string | null;
            blockName?: string | null;
            blockType: "hero";
          }
        | {
            title?: string | null;
            description?: string | null;
            cards?:
              | {
                  title: string;
                  description?: string | null;
                  image?: (number | null) | MediaValueProps;
                  link?: {
                    url?: string | null;
                    text?: string | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: "cardGrid";
          }
        | {
            title?: string | null;
            content?: {
              root: {
                type: string;
                children: {
                  type: string;
                  version: number;
                  [k: string]: unknown;
                }[];
                direction: ("ltr" | "rtl") | null;
                format:
                  | "left"
                  | "start"
                  | "center"
                  | "right"
                  | "end"
                  | "justify"
                  | "";
                indent: number;
                version: number;
              };
              [k: string]: unknown;
            } | null;
            id?: string | null;
            blockName?: string | null;
            blockType: "textBlock";
          }
      )[]
    | null;
  _status?: ("draft" | "published") | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface LinkModel {
  text?: string;
  url?: string;
  externalLink?: boolean;
}

export interface SocialLink {
  platform?: string;
  url?: string;
}

export interface PreFooterSlimModel {
  contactTelephone?: string;
  contactEmail?: string;
  links?: LinkModel[];
}

export const CONNECT_SECTION_RIGHT = "right";
export const CONNECT_SECTION_BOTTOM = "bottom";
export const CONNECT_SECTION_LOCATION_DEFAULT = CONNECT_SECTION_RIGHT;

export const LINK_GROUP_COLUMNS_DEFAULT = 2;
export const LINK_GROUP_COLUMNS_MAX = 4;

export interface SiteConfig {
  searchAccessKey?: string;
  searchAffiliate?: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryFont?: string;
  favicon?: any;
  logo?: any;
  agencyName?: string;
  dapAgencyCode?: string;
  dapSubAgencyCode?: string;
  collectionDisplayNames?: {
    collectionSlug: string;
    displayName: string;
    customSlug?: string;
  }[];
}

export enum SocialPlatform {
  FACEBOOK = "facebook",
  X = "x",
  YOUTUBE = "youtube",
  INSTAGRAM = "instagram",
  RSS_FEED = "rssFeed",
}

export interface ContactCenter {
  name?: string;
  phone?: string;
  email?: string;
}

export interface ConnectSectionModel {
  contactCenter?: ContactCenter;
  socialLinks?: SocialLink[];
}

export interface LinkGroup {
  name?: string;
  links?: LinkModel[];
}

export type ConnectSectionLocation = "right" | "bottom";

export interface PreFooterBigConfiguration {
  connectSectionLocation?: ConnectSectionLocation;
  columnsInLinkGroup?: number;
}

export interface PreFooterBigModel {
  linkGroups?: LinkGroup[];
  connectSection?: ConnectSectionModel;
  configuration?: PreFooterBigConfiguration;
}

export const PRE_FOOTER_TYPE_BIG = "big";
export const PRE_FOOTER_TYPE_SLIM = "slim";
export const PRE_FOOTER_TYPE_NONE = "none";

export type PreFooterType = "big" | "slim" | "none";

export type PreFooterData = PreFooterBigModel | PreFooterSlimModel;

export interface PreFooterModel {
  preFooterType?: PreFooterType;
  preFooterData?: PreFooterData;
}

export interface PageModel {
  title?: string;
  slug?: string | null;
}

export interface AlertModel {
  title?: string;
  type?: "info" | "warning" | "success" | "error" | "emergency";
  content?: any;
  icon?: boolean;
  slim?: boolean;
  alignment?: "left" | "center";
}

export interface CollectionExternalLink {
  label?: string;
  url?: string;
}

export interface IdentifierColorFamilies {
  identifier: string;
  identityDomain: string;
  primaryLink: string;
  secondaryLink: string;
}

export interface LogoModel {
  media: Media;
  url: string;
}

export interface IdentifierModel {
  siteDomain?: string;
  logos?: MediaModel[];
  content?: any;
  links?: LinkModel[];
  colorFamilies?: IdentifierColorFamilies;
}

export interface FooterModel {
  preFooter?: PreFooterModel;
  identifier?: IdentifierModel;
}

export interface PreFooterColors {
  bkgColorLightest: string;
}

export interface FooterColors {
  identifier: IdentifierColors;
  preFooter: PreFooterColors;
}

export interface IdentifierColors {
  bkgColor?: string;
  identityDomainColor?: string;
  primaryLinkColor?: string;
  secondaryLinkColor?: string;
}

interface FilterAttribute {
  attributeValue: string;
  content: string;
}

export interface FiltersSlugMetaDataModel {
  collectionItemId: string;
  sortField: string;
  filters: FilterAttribute[];
}

export interface FilteredPageConfig {
  collectionName?: string;
  pageSize?: number | string;
  currentPage?: number | string;
  totalItems?: number;
}

export type PageNavItemType = "prev" | "next" | "overflow" | "page";

export interface PageNavItemModel {
  pageNumber?: any;
  itemType: PageNavItemType;
  isCurrentPage?: boolean;
}

export interface ElementsPair {
  original?: HTMLElement;
  filtered?: HTMLElement;
}

export interface FiltersData {
  filtersMap: Map<string, FilterMapEntry>;
  baseUrl: string;
  pageSize: string;
  currentPage: string;
  collectionName: string;
  totalItems: number;
}

export interface FilterConfig {
  filterName: string;
  filterLabel: string;
}

export type FilterMapEntry = {
  filterName: string;
  pagefindfilter: string;
  filterElement?: any;
  navElement?: any;
};

export interface FilterOption {
  value: string;
  textContent: string;
}

export interface Tag {
  title: string;
  url: string;
  tagTypes?: {
    id: number;
    title: string;
    slug: string;
  };
}

interface PageFindResults {
  url: string;
  meta: {
    collectionItemId: string;
  };
}

export interface FilterSelection {
  filterName: string;
  selectedValue: string;
}

// Types for custom collection types menu items

export type PageLink = {
  blockType: "pageLink";
  id: string;
  label: string;
  page: { id: number | string; title: string; slug: string };
  blockName?: string | null;
  [k: string]: unknown;
};

export type CollectionTypeLink = {
  blockType: "collectionTypeLink";
  id: string;
  label: string;
  collectionType: { id: number | string; title: string; slug: string };
  blockName?: string | null;
  [k: string]: unknown;
};

export type CollectionEntry = {
  id: number | string;
  title: string;
  slug: string;
  publishedAt?: string;
  collectionSlug?: string; // to be added
};

export type CollectionEntryLink = {
  blockType: "collectionEntryLink";
  id: string;
  label: string;
  collectionEntry: CollectionEntry;
  blockName?: string | null;
  [k: string]: unknown;
};

export type Dropdown = {
  blockType: "dropdown";
  id: string;
  label: string;
  links: MenuItem[];
  blockName?: string | null;
  [k: string]: unknown;
};

export type NavItem = {
  blockType: "navItem";
  id: string;
  label: string;
  page: { slug: string };
  blockName?: string | null;
  [k: string]: unknown;
};

export type ExternalLink = {
  blockType: "externalLink";
  id: string;
  label: string;
  page: { slug: string };
  blockName?: string | null;
  [k: string]: unknown;
};

export type UnknownItem = {
  blockType?: string;
  [k: string]: unknown;
};

export type MenuItem =
  | PageLink
  | CollectionTypeLink
  | CollectionEntryLink
  | Dropdown
  | NavItem
  | ExternalLink
  | UnknownItem;

export type MenuRoot = {
  id: number | string;
  items: MenuItem[];
  [k: string]: unknown;
};

export type FetchResult = {
  docs?: Array<{
    collectionType?: { slug?: string | null } | null;
  }>;
};
