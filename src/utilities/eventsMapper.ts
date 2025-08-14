import type { CollectionEntry } from "astro:content";
import { contentMapper } from "./contentMapper";

export function eventsMapper(data: CollectionEntry<"events">["data"]) {
  return contentMapper(data, {
    baseUrl: "/events",
    dateField: "eventsDate",
    fileField: "eventsFiles",
  });
}
