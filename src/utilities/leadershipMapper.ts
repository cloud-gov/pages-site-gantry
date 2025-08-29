import type { CollectionEntry } from "astro:content";
import { getMediaUrl } from "@/utilities/media";

export function leadershipMapper(data: CollectionEntry<"leadership">["data"]) {
  const image = getMediaUrl(data.image);

  return {
    title: data.title,
    description: data.description,
    jobTitle: data.jobTitle,
    isLeadership: true,
    image,
    imageAlt: (data as any)?.image?.altText || data.title,
    link: `/leadership/${data.slug}`,
  };
}
