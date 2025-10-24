import type {
  PreFooterData,
  PreFooterModel,
  PreFooterBigModel,
  PreFooterSlimModel,
  PageModel,
  SocialLink,
  LinkGroup,
  LinkModel,
  PreFooterType,
} from "@/env";
import {
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_NONE,
  PRE_FOOTER_TYPE_SLIM,
  SocialPlatform
} from "@/env";

import {
  cleanConfiguration,
  cleanPreFooterBig,
} from "@/utilities/preFooterBig.ts";
import { cleanPreFooterSlim } from "@/utilities/preFooterSlim";
import type { CollectionEntry } from "astro:content";
import { preFooterCollectionName } from "@/utilities/fetch";

export function cleanPreFooter(preFooter: PreFooterModel): PreFooterModel {
  let preFooterType = preFooter?.preFooterType ?? PRE_FOOTER_TYPE_NONE;
  let cleanedPreFooterData: PreFooterData;
  switch (preFooterType) {
    case PRE_FOOTER_TYPE_BIG:
      cleanedPreFooterData = cleanPreFooterBig(
        <PreFooterBigModel>preFooter?.preFooterData,
      );
      break;
    case PRE_FOOTER_TYPE_SLIM:
      cleanedPreFooterData = cleanPreFooterSlim(
        <PreFooterSlimModel>preFooter?.preFooterData,
      );
      break;
    case PRE_FOOTER_TYPE_NONE:
    default:
      cleanedPreFooterData = null;
      preFooterType = PRE_FOOTER_TYPE_NONE;
      break;
  }

  const preFooterCleaned = {
    preFooterType: preFooterType,
    preFooterData: cleanedPreFooterData,
  };

  return preFooterCleaned;
}

export async function getUsaFooterClass(preFooterType) {
  return preFooterType === "big" ? "usa-footer--big" : "usa-footer--slim";
}

export function buildPageUrl(page: PageModel) {
  return page?.slug ? `/${page?.slug}` : null;
}

export function buildCollectionUrl(page: string) {
  return page ? `/${page}` : null;
}

export function buildSocialLinks(response: any): SocialLink[] {
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

export function buildContactCenter(response: any) {
  return {
    name: response?.contactCenter?.[0]?.name,
    phone: response?.contactCenter?.[0]?.phone,
    email: response?.contactCenter?.[0]?.email,
  };
}

export function buildPreFooterBigConfiguration(response: any) {
  return cleanConfiguration({
    connectSectionLocation: response?.connectSectionLocation,
    columnsInLinkGroup: response?.groupCol,
  });
}

export function buildLinkGroups(response: any) {
  return response?.linkGroup?.map((linkGroup) => {
    const builtLinkGroup: LinkGroup = {
      name: linkGroup?.groupName,
      links: linkGroup?.link?.map((l) => {
        return buildLink(l);
      }),
    };
    return builtLinkGroup;
  });
}

export function buildPreFooterBig(
  response: CollectionEntry<typeof preFooterCollectionName>["data"],
): PreFooterBigModel {
  const result: PreFooterBigModel = {
    configuration: buildPreFooterBigConfiguration(response),
    connectSection: {
      contactCenter: buildContactCenter(response),
      socialLinks: buildSocialLinks(response),
    },
    linkGroups: buildLinkGroups(response),
  };
  return result;
}

export function buildLink(link): LinkModel {
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
        url: buildPageUrl(link?.page),
        externalLink: false,
      };
      break;
    case "slimCollectionLink":
    case "collectionLink":
      result = {
        text: link?.name,
        url: buildCollectionUrl(link?.page),
        externalLink: false,
      };
      break;
  }
  return result;
}

export function buildPreFooterSlim(
  response: CollectionEntry<typeof preFooterCollectionName>["data"],
): PreFooterSlimModel {
  let contactTelephone = response?.contactCenter?.[0]?.phone;
  const contactEmail = response?.contactCenter?.[0]?.email;
  const footerLinks = response?.slimLink?.map((link) => {
    return buildLink(link);
  });
  const result: PreFooterSlimModel = {
    contactTelephone: contactTelephone,
    contactEmail: contactEmail,
    footerLinks: footerLinks,
  };
  return result;
}

export function buildPreFooter(
  responseData: CollectionEntry<typeof preFooterCollectionName>["data"],
): PreFooterModel {
  let preFooterData: PreFooterSlimModel | PreFooterBigModel;
  let type: PreFooterType | any = responseData?.type;
  switch (type) {
    case PRE_FOOTER_TYPE_BIG:
      preFooterData = buildPreFooterBig(responseData);
      break;
    case PRE_FOOTER_TYPE_SLIM:
      preFooterData = buildPreFooterSlim(responseData);
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
