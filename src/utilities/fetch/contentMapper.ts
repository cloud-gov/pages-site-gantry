import { formatDate } from "../formatting";
import { type DateParts, getYearTag, parseDateParts } from "../dates";
import {
  type AlertModel,
  type CollectionEntry,
  type CollectionTagProps,
  type FooterModel,
  type LinkModel,
  type LogoModel,
  type MediaValueProps,
  type PageModel,
  type Tag,
} from "@/env";
import { preFooterMapper } from "./preFooterMapper.ts";

type ContentData = {
  title?: string;
  content?: string;
  excerpt?: string;
  publishedAt?: string;
  slug?: string;
  tags?: CollectionTagProps[];
  [key: string]: any;
};

type MapperConfig = {
  baseUrl: string;
  dateField?: string;
  dateConversionFunction?: (any) => any;
};

function safeParse(input?: string | number | Date): DateParts | null {
  if (!input) return null;
  const parts = parseDateParts(input);
  return Number.isNaN(parts.raw.getTime()) ? null : parts;
}

export function filteredContentMapper(data, baseUrl, yearTag) {
  return {
    tags: (data.tags ?? []).map(
      (c): Tag => ({
        title: c.title,
        url: `${baseUrl}?tag=${c.slug}`,
      }),
    ),
    yearTag: yearTag,
    sortField: data.publishedAt,
  };
}

export function contentMapper(
  data: ContentData,
  { baseUrl, dateField = "publishedAt", dateConversionFunction }: MapperConfig,
) {
  const endSrc = (data as any).endDate;

  return {
    title: data.title,
    content: data.content,
    date: dateConversionFunction(data[dateField] || data.publishedAt || ""),
    startDate: safeParse(data.startDate || ""),
    endDate: safeParse(endSrc),
    description: data.description || "",
    media: data.image,
    imageAlt: data.image?.altText || data.title,
    link: `${baseUrl}/${data.slug}`,
    showInPageNav: data.showInPageNav ?? true,
    ...filteredContentMapper(
      data,
      baseUrl,
      getYearTag(data[dateField] || data.publishedAt || ""),
    ),
  };
}

export function customCollectionEntryMapper(data: any, collectionSlug: string) {
  return contentMapper(data, {
    baseUrl: `/${collectionSlug}`,
    dateField: data.contentDate ? "contentDate" : "publishedAt",
    dateConversionFunction: formatDate,
  });
}

/**
 * Creates a customCollectionEntryMapper with a specific collection slug
 * Use this when you need to map custom collection pages with the correct URL slug
 */
export function createCustomCollectionEntryMapper(collectionSlug: string) {
  return (data: any) => customCollectionEntryMapper(data, collectionSlug);
}

export function shouldDisplay(a: any, currentDate: Date): boolean {
  const publishDate = new Date(a?.publishDate);
  return (
    !!a?.isActive &&
    (isNaN(publishDate.getTime()) || publishDate <= currentDate)
  );
}

export function alertsMapper(
  responseData: any,
  preRendered: boolean = false,
): AlertModel[] {
  const getData = (a) => (preRendered ? a?.data : a);
  return (
    responseData
      ?.filter((a) => !!getData(a)?.isActive)
      ?.map((a) => {
        const data = getData(a);
        const result: AlertModel = {
          title: data.title,
          type: data.type,
          content: data.content,
        };
        // Only include optional fields if they are defined
        if (data.icon !== undefined) {
          result.icon = data.icon;
        }
        if (data.slim !== undefined) {
          result.slim = data.slim;
        }
        if (data.alignment !== undefined) {
          result.alignment = data.alignment;
        }
        return result;
      }) ?? []
  );
}

export function pageUrlMapper(page: PageModel) {
  return page?.slug ? `/${page?.slug}` : null;
}

export function collectionUrlMapper(page: string) {
  return page ? `/${page}` : null;
}

export function collectionEntryUrlMapper(collectionType: string, page: string) {
  return page ? `/${collectionType}/${page}` : null;
}

export function linkMapper(link): LinkModel {
  let result: LinkModel = null;
  switch (link?.blockType) {
    case "link":
      result = {
        text: link?.label,
        url: link?.url,
        externalLink: true,
      };
      break;
    case "slimExternalLink":
    case "externalLink":
      result = {
        text: link?.label,
        url: link?.url,
        externalLink: true,
      };
      break;
    case "slimPageLink":
    case "pageLink":
      result = {
        text: link?.label,
        url: pageUrlMapper(link?.page),
        externalLink: false,
      };
      break;
    case "slimCollectionLink":
    case "collectionLink":
      result = {
        text: link?.label,
        url: collectionUrlMapper(link?.page),
        externalLink: false,
      };
      break;
    case "collectionEntryLink":
      result = {
        text: link?.label,
        url: collectionEntryUrlMapper(
          link?.collectionEntry?.collectionSlug,
          link?.collectionEntry?.slug,
        ),
        externalLink: false,
      };
      break;
    case "collectionTypeLink":
      result = {
        text: link?.label,
        url: collectionUrlMapper(link?.collectionType?.slug),
        externalLink: false,
      };
      break;
  }
  return result;
}

export function logoMapper(logo): LogoModel {
  const result = {
    media: { ...logo?.image, altText: logo?.image?.altText || `Logo` },
    url: logo?.url,
  };
  return result;
}

export function footerMapper(i: any, pf: any): FooterModel {
  return {
    preFooter: preFooterMapper(pf),
    identifier: {
      siteDomain: i?.domain,
      logos: i?.logos?.map((l) => logoMapper(l)),
      content: i?.content,
      links: i?.link?.map((l) => linkMapper(l)),
      colorFamilies: {
        identifier: i?.identifierColor,
        identityDomain: i?.identityDomainColor,
        primaryLink: i?.primaryLinkColor,
        secondaryLink: i?.secondaryLinkColor,
      },
    },
  };
}

export interface RelatedItem {
  label: string;
  description?: string;
  link?: string;
  collectionEntry?: CollectionEntry;
  externalLink: boolean;
  media?: MediaValueProps;
  date?: DateParts | string;
  page?: CollectionEntry;
}

export function relatedItemsMapper(
  relatedItems: any[],
  collectionMapper: (data: any) => any,
): RelatedItem[] {
  if (!relatedItems || relatedItems.length === 0) {
    return [];
  }

  return relatedItems
    .map((block): RelatedItem | null => {
      // Handle external links
      if (block.blockType === "externalLink") {
        return {
          label: block.label || "",
          description: block.description || "",
          link: block.url || "",
          externalLink: true,
        };
      }

      // Handle internal items
      if (block.blockType === "internalItem" && block.item) {
        const item =
          typeof block.item === "object" && block.item !== null
            ? block.item
            : null;

        if (!item) {
          return null;
        }

        // Map the internal item using the provided mapper
        const mapped = collectionMapper(item);
        return {
          label: mapped.label || item.label || "",
          description: block.description || mapped.description || "",
          link: mapped.link || "",
          externalLink: false,
          media: mapped.media,
          date: mapped.date,
        };
      }

      // Unknown block type
      return null;
    })
    .filter((item): item is RelatedItem => item !== null); // Fixed: proper filter syntax
}
