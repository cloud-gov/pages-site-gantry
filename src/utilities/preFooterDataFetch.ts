import {
  type LinkGroup,
  type LinkModel,
  type PageModel,
  PRE_FOOTER_TYPE_BIG,
  PRE_FOOTER_TYPE_SLIM,
  type PreFooterBigModel,
  type PreFooterModel,
  type PreFooterSlimModel,
  type SocialLink,
  SocialPlatform,
} from "@/env";
import { getPreFooter } from "@/components/Footer.testData";
import payloadFetch from "@/utilities/payload-fetch";
import { cleanConfiguration } from "@/utilities/preFooterBig";
import { type CollectionEntry } from "astro:content";

const preFooterEndpoint = "globals/pre-footer";
const preFooterCollectionName = "preFooter";

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

export function buildPreFooter(response) {
  let responseData: CollectionEntry<typeof preFooterCollectionName>["data"] =
    response;

  let preFooterData: PreFooterSlimModel | PreFooterBigModel;
  let type = response?.type;
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

export async function fetchPreFooter() {
  const preFooterResponse = await payloadFetch(
    `${preFooterEndpoint}?draft=true`,
  );
  const response = preFooterResponse ? await preFooterResponse.json() : null;
  return buildPreFooter(response);
}

export async function fetchPreFooterTest(): Promise<PreFooterModel> {
  const data: PreFooterModel = getPreFooter();
  return Promise.resolve(data);
}
