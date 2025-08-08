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

import { formatDate } from "./formatting";

export function contentMapper(
  data: ContentData,
  { baseUrl, dateField = "publishedAt", fileField }: MapperConfig
) {
  const files: File[] = fileField ? data[fileField] : [];

  return {
    title: data.title,
    content: data.content,
    date: formatDate(data[dateField] || data.publishedAt),
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
