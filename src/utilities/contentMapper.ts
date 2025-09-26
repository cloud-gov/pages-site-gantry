import type { CollectionEntry } from "astro:content";
import { formatDate } from "./formatting";
import { parseDateParts, type DateParts } from "./dates";
import type { CollectionCategoryProps } from "@/env";

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

function safeParse(input? : string | number | Date): DateParts | null {
  if (!input) return null; 
  const parts = parseDateParts(input);
  return Number.isNaN(parts.raw.getTime()) ? null : parts; 
} 

export function contentMapper(
  data: ContentData,
  { baseUrl, dateField = "publishedAt", fileField }: MapperConfig
) {
  const endSrc = (data as any).endDate; 
  const files: File[] = fileField ? data[fileField] : [];
  const dateParts = parseDateParts(data[dateField] || data.publishedAt || '');

  return {
    title: data.title,
    content: data.content,
    date: safeParse(data[dateField] || data.publishedAt || ''),
    startDate: safeParse(data.startDate || ''),
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

export function eventsMapper(data: CollectionEntry<"events">["data"]) {
  return contentMapper(data, {
    baseUrl: "/events",
    dateField: "eventsDate",
    fileField: "eventsFiles",
  });
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
  return contentMapper(data, {
    baseUrl: "/news",
    dateField: "newsDate",
    fileField: "newsFiles",
  });
}

export function postsMapper(data: CollectionEntry<"posts">["data"]) {
  return contentMapper(data, {
    baseUrl: "/posts",
    dateField: "postsDate",
    fileField: "postsFiles",
  });
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
  };
}
