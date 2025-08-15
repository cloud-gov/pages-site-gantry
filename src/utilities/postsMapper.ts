import type { CollectionEntry } from "astro:content";
import { contentMapper } from "./contentMapper";

export function postsMapper(data: CollectionEntry<"posts">["data"]) {
  return contentMapper(data, {
    baseUrl: "/posts",
    dateField: "postsDate",
    fileField: "postsFiles",
  });
}
