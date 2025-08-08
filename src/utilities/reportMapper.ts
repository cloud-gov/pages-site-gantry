import type { CollectionEntry } from "astro:content";
import { contentMapper } from "./contentMapper";

export function reportMapper(data: CollectionEntry<"reports">["data"]) {
  return contentMapper(data, {
    baseUrl: "/reports",
    dateField: "reportDate",
    fileField: "reportFiles",
  });
}
