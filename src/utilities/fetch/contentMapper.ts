import { type CollectionEntry } from "astro:content";
import { formatDate } from "../formatting";
import { type DateParts, parseDateParts } from "../dates";
import {
  type AlertModel,
  type CollectionCategoryProps,
  type FooterModel,
  type LinkModel,
  type LogoModel,
  type PageModel,
} from "@/env";
import { preFooterMapper } from "@/utilities/fetch/preFooterMapper.ts";

type Category = {
  title: string;
  slug: string;
};

type File = {
  file?: {
    url?: string;
    alt?: string;
  };
};

type ContentData = {
  title?: string;
  content?: string;
  excerpt?: string;
  publishedAt?: string;
  slug?: string;
  categories?: CollectionCategoryProps[];
  [key: string]: any;
};

type MapperConfig = {
  baseUrl: string;
  dateField?: string;
  fileField?: string;
};

function safeParse(input?: string | number | Date): DateParts | null {
  if (!input) return null;
  const parts = parseDateParts(input);
  return Number.isNaN(parts.raw.getTime()) ? null : parts;
}

export function contentMapper(
  data: ContentData,
  { baseUrl, dateField = "publishedAt", fileField }: MapperConfig,
) {
  const endSrc = (data as any).endDate;
  const files: File[] = fileField ? data[fileField] : [];
  const dateParts = parseDateParts(data[dateField] || data.publishedAt || "");

  return {
    title: data.title,
    content: data.content,
    date: safeParse(data[dateField] || data.publishedAt || ""),
    startDate: safeParse(data.startDate || ""),
    endDate: safeParse(endSrc),
    description: data.excerpt,
    media: data.image,
    imageAlt: data.image?.altText || data.title,
    link: `${baseUrl}/${data.slug}`,
    tags: (data.categories ?? []).map((c) => ({
      label: c.title,
      url: `${baseUrl}?category=${c.slug}`,
    })),
  };
}

export function eventsMapper(data: any) {
  const mapped = contentMapper(data, {
    baseUrl: "/events",
    dateField: "startDate",
    fileField: "attachments",
  });

  // Override description to use the correct field for events
  return {
    ...mapped,
    description: data.description || data.excerpt || "",
    showInPageNav: data.showInPageNav ?? true,
  };
}

export function leadershipMapper(data: CollectionEntry<"leadership">["data"]) {
  return {
    title: data.title,
    description: data.description,
    jobTitle: data.jobTitle,
    isLeadership: true,
    media: data.image,
    imageAlt: data.image?.altText || data.title,
    link: `/leadership/${data.slug}`,
  };
}

export function newsMapper(data: CollectionEntry<"news">["data"]) {
  const mapped = contentMapper(data, {
    baseUrl: "/news",
    dateField: "newsDate",
    fileField: "newsFiles",
  });
  return {
    ...mapped,
    showInPageNav: data.showInPageNav ?? true,
  };
}

export function postsMapper(data: CollectionEntry<"posts">["data"]) {
  const mapped = contentMapper(data, {
    baseUrl: "/posts",
    dateField: "postsDate",
    fileField: "postsFiles",
  });
  return {
    ...mapped,
    showInPageNav: data.showInPageNav ?? true,
  };
}

export function reportMapper(data: CollectionEntry<"reports">["data"]) {
  return {
    title: data.title,
    content: data.content,
    date: data.reportDate
      ? formatDate(data.reportDate)
      : formatDate(data.publishedAt),
    description: data.excerpt,
    media: data.image,
    imageAlt: data.image?.altText || data.title,
    link: `/reports/${data.slug}`,
    tags: data.categories.map((c) => ({
      label: c.title,
      url: `/reports?category=${c.slug}`,
    })),
    showInPageNav: data.showInPageNav ?? true,
  };
}

export function resourceMapper(data: CollectionEntry<"resources">["data"]) {
  return {
    title: data.title,
    content: data.content,
    date: data.resourceDate
      ? formatDate(data.resourceDate)
      : formatDate(data.publishedAt),
    description: data.excerpt,
    media: data.image,
    imageAlt: data.image?.altText || data.title,
    link: `/resources/${data.slug}`,
    tags: data.categories.map((c) => ({
      label: c.title,
      url: `/resources?category=${c.slug}`,
    })),
    showInPageNav: data.showInPageNav ?? true,
  };
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

export function linkMapper(link): LinkModel {
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
        url: pageUrlMapper(link?.page),
        externalLink: false,
      };
      break;
    case "slimCollectionLink":
    case "collectionLink":
      result = {
        text: link?.name,
        url: collectionUrlMapper(link?.page),
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
