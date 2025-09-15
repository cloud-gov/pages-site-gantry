import { defineCollection, z } from "astro:content";
import payloadFetch from "./utilities/payload-fetch";
import type { ZodObject, ZodRawShape } from "astro:schema";
import type { MediaValueProps } from "@/env";

function collectionLoader(apiPath: string) {
  return async () => {
    // fetch drafts for the previewer, not on build
    const fetchDrafts =
      import.meta.env.RENDER_MODE === "static" ? "" : "?draft=true";

    const response = await payloadFetch(`${apiPath}${fetchDrafts}`);

    if (!response.ok) {
      console.error(
        `API call failed for ${apiPath}:`,
        response.status,
        response.statusText
      );
      return [];
    }

    const data = await response.json();

    if (apiPath.includes("globals")) {
      return [{ ...data, id: "main" }];
    } else {
      if (!data.docs) {
        console.error(`No docs property in response for ${apiPath}:`, data);
        return [];
      }
      return data.docs
        .filter((doc) => doc.slug) // we have issues without a slug
        .map((doc) => {
          return { ...doc, id: doc.slug };
        });
    }
  };
}

// NOTE: because we are rendering drafts, every property should
// accept being nullable
export function makeAllKeysNullable<T extends ZodRawShape>(
  schema: ZodObject<T>
) {
  const nullableShape: {
    [K in keyof T]: z.ZodNullable<T[K]>;
  } = {} as any;

  for (const key in schema.shape) {
    nullableShape[key] = z.nullable(schema.shape[key]);
  }

  return z.object(nullableShape);
}

// Site Collections

const events = defineCollection({
  loader: collectionLoader("events"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      startDate: z.string().datetime(),
      image: z.custom<MediaValueProps>(),
      endDate: z.string().datetime(),
      location: z.string(),
      format: z.enum(["inperson", "virtual"]),
      registrationUrl: z.string(),
      description: z.string(),
      content: z.any(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    })
  ),
});

const leadership = defineCollection({
  loader: collectionLoader("leadership"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      jobTitle: z.string(),
      description: z.string(),
      image: z.custom<MediaValueProps>(),
      imageAlt: z.string(),
      content: z.any(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    })
  ),
});

const news = defineCollection({
  loader: collectionLoader("news"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      content: z.any(), // content is a lexical object
      image: z.custom<MediaValueProps>(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    })
  ),
});

const posts = defineCollection({
  loader: collectionLoader("posts"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      content: z.any(), // content is a lexical object
      image: z.custom<MediaValueProps>(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    })
  ),
});

const reports = defineCollection({
  loader: collectionLoader("reports"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      excerpt: z.string(),
      image: z.custom<MediaValueProps>(), // relation to media, https://zod.dev/api#custom
      reportFiles: z.custom<MediaValueProps>(),
      slug: z.string(),
      reportDate: z.string().datetime(),
      categories: z.any(), // categoriesField, can be any
      site: z.any(), // siteField, can be any
      content: z.any(), // richText, can be any
      reviewReady: z.boolean(),
      publishedAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]).optional(),
      createdAt: z.string().datetime().optional(),
      updatedAt: z.string().datetime().optional(),
    })
  ),
});

// Site Globals

const menu = defineCollection({
  loader: collectionLoader("globals/menu"),
  schema: makeAllKeysNullable(
    z
      .object({
        items: z
          .array(
            z
              .object({
                label: z.string(),
                page: z.any(), // relation to page, can be any
                id: z.string(),
                blockName: z.string().nullable(),
                blockType: z.string(),
                url: z.string().optional(),
                subitems: z
                  .array(
                    z.object({
                      label: z.string(),
                      page: z.any(), // relation to page, can be any
                      id: z.string(),
                      blockName: z.string().nullable(),
                      blockType: z.string(),
                    })
                  )
                  .optional(),
              })
              .optional()
          )
          .optional(),
        _status: z.enum(["draft", "published"]),
        updatedAt: z.string().datetime(),
        createdAt: z.string().datetime(),
        globalType: z.string(),
      })
      .partial()
  ),
});

const siteConfig = defineCollection({
  loader: collectionLoader("globals/site-config"),
  schema: makeAllKeysNullable(
    z
      .object({
        agencyName: z.string(),
        tagline: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        primaryFont: z.string().optional(),
        favicon: z.any().optional(),
        logo: z.any().optional(),
      })
      .partial()
  ),
});

export const collections = {
  // site collections
  events,
  news,
  leadership,
  posts,
  reports,
  // site globals
  menu,
  siteConfig,
};
