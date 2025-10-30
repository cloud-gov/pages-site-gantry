import {
  type LinkGroup,
  type LinkModel,
  type PageModel,
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_SLIM,
  type PreFooterBigModel,
  type PreFooterModel,
  type PreFooterSlimModel,
  type PreFooterType,
  type SocialLink,
  SocialPlatform,
} from "@/env";
import { cleanConfiguration } from "@/utilities/preFooterBig";
import type { CollectionEntry } from "astro:content";

const preFooterCollectionName = "preFooter";

export function mapPageUrl(page: PageModel) {
  return page?.slug ? `/${page?.slug}` : null;
}

export function mapCollectionUrl(page: string) {
  return page ? `/${page}` : null;
}

export function mapSocialLinks(response: any): SocialLink[] {
  const result = [
    {
      platform: SocialPlatform.FACEBOOK,
      url: response?.facebook?.[0]?.url,
    },
    {
      platform: SocialPlatform.X,
      url: response?.platform_x?.[0]?.url,
    },
    {
      platform: SocialPlatform.YOUTUBE,
      url: response?.youtube?.[0]?.url,
    },
    {
      platform: SocialPlatform.INSTAGRAM,
      url: response?.instagram?.[0]?.url,
    },
    {
      platform: SocialPlatform.RSS_FEED,
      url: response?.rssfeed?.[0]?.url,
    },
  ];
  return result;
}

export function mapContactCenter(response: any) {
  return {
    name: response?.contactCenter?.[0]?.name,
    phone: response?.contactCenter?.[0]?.phone,
    email: response?.contactCenter?.[0]?.email,
  };
}

export function mapPreFooterBigConfiguration(response: any) {
  return cleanConfiguration({
    connectSectionLocation: response?.connectSectionLocation,
    columnsInLinkGroup: response?.groupCol,
  });
}

export function mapLinkGroups(response: any) {
  return response?.linkGroup?.map((linkGroup) => {
    const builtLinkGroup: LinkGroup = {
      name: linkGroup?.groupName,
      links: linkGroup?.link?.map((l) => {
        return mapLink(l);
      }),
    };
    return builtLinkGroup;
  });
}

export function mapPreFooterBig(
  response: CollectionEntry<typeof preFooterCollectionName>["data"],
): PreFooterBigModel {
  const result: PreFooterBigModel = {
    configuration: mapPreFooterBigConfiguration(response),
    connectSection: {
      contactCenter: mapContactCenter(response),
      socialLinks: mapSocialLinks(response),
    },
    linkGroups: mapLinkGroups(response),
  };
  return result;
}

export function mapLink(link): LinkModel {
  let result: LinkModel = null;
  switch (link?.blockType) {
    case "slimExternalLink":
    case "externalLink":
      result = {
        text: link?.name,
        url: link?.url,
        externalLink: true,
      };
      break;
    case "slimPageLink":
    case "pageLink":
      result = {
        text: link?.name,
        url: mapPageUrl(link?.page),
        externalLink: false,
      };
      break;
    case "slimCollectionLink":
    case "collectionLink":
      result = {
        text: link?.name,
        url: mapCollectionUrl(link?.page),
        externalLink: false,
      };
      break;
  }
  return result;
}

export function mapPreFooterSlim(
  response: CollectionEntry<typeof preFooterCollectionName>["data"],
): PreFooterSlimModel {
  let contactTelephone = response?.contactCenter?.[0]?.phone;
  const contactEmail = response?.contactCenter?.[0]?.email;
  const footerLinks = response?.slimLink?.map((link) => {
    return mapLink(link);
  });
  const result: PreFooterSlimModel = {
    contactTelephone: contactTelephone,
    contactEmail: contactEmail,
    footerLinks: footerLinks,
  };
  return result;
}

export function preFooterMapper(
  data: CollectionEntry<typeof preFooterCollectionName>["data"],
): PreFooterModel {
  let preFooterData: PreFooterSlimModel | PreFooterBigModel;
  let type: PreFooterType | any = data?.type;
  switch (type) {
    case PRE_FOOTER_TYPE_BIG:
      preFooterData = mapPreFooterBig(data);
      break;
    case PRE_FOOTER_TYPE_SLIM:
      preFooterData = mapPreFooterSlim(data);
      break;
    default:
      type = null;
  }

  const preFooter: PreFooterModel = {
    preFooterData: preFooterData,
    preFooterType: type,
  };
  return preFooter;
}
