import type { CollectionEntry } from "astro:content";
import { contentMapper } from "./contentMapper";

export function newsMapper(data: CollectionEntry<"news">["data"]) {
  return contentMapper(data, {
    baseUrl: "/news",
    dateField: "newsDate",
    fileField: "newsFiles",
  });
}
