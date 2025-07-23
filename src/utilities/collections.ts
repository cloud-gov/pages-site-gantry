import type { CollectionEntry } from "astro:content";
import { formatDate } from "./formatting";

export function reportMapper(data: CollectionEntry<"reports">["data"]) {
  return {
    title: data.title,
    content: data.content,
    date: data.reportDate
      ? formatDate(data.reportDate)
      : formatDate(data.publishedAt),
    description: data.excerpt,
    image: data.reportFiles[0]?.file?.url,
    imageAlt: data.reportFiles[0]?.file?.alt || data.title,
    link: `/reports/${data.slug}`,
    tags: data.categories.map((c) => ({
      label: c.title,
      url: `/reports?category=${c.slug}`,
    })),
  };
}
