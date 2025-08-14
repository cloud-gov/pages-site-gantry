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
  categories?: Category[];
  [key: string]: any;
};

type MapperConfig = {
  baseUrl: string;
  dateField?: string;
  fileField?: string;
};

import { parseDateParts, type DateParts } from "./dates";

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
    image: files?.[0]?.file?.url,
    imageAlt: files?.[0]?.file?.alt || data.title,
    link: `${baseUrl}/${data.slug}`,
    tags: (data.categories ?? []).map((c) => ({
      label: c.title,
      url: `${baseUrl}?category=${c.slug}`,
    })),
  };
}
