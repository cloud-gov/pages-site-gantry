import { defineCollection, z } from "astro:content";
import payloadFetch from "./utilities/payload-fetch";
import type { ZodObject, ZodRawShape } from "astro:schema";
import type { MediaValueProps, CollectionCategoryProps } from "@/env";

function collectionLoader(apiPath: string) {
  return async () => {
    // fetch drafts for the previewer, not on build
    const fetchDrafts =
      import.meta.env.RENDER_MODE === "static"
        ? "?limit=0"
        : "?draft=true&limit=0";

    const response = await payloadFetch(`${apiPath}${fetchDrafts}`);

    if (!response.ok) {
      console.error(
        `API call failed for ${apiPath}:`,
        response.status,
        response.statusText,
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
  schema: ZodObject<T>,
) {
  const nullableShape: {
    [K in keyof T]: z.ZodNullable<T[K]>;
  } = {} as any;

  for (const key in schema.shape) {
    nullableShape[key] = z.nullable(schema.shape[key]);
  }

  return z.object(nullableShape);
}

// Custom Zod schema for MediaValueProps
const mvCustom = z.custom<MediaValueProps>(
  (val) => {
    return (
      typeof val === "object" &&
      val !== null &&
      typeof (val as any).url === "string"
    );
  },
  {
    message:
      "Invalid MediaValueProps: must be an object with at least a 'url' string",
  },
);

// Custom Zod schema for CollectionCategoryProps
const cCustom = z.custom<CollectionCategoryProps>(
  (val) => {
    return (
      typeof val === "object" &&
      val !== null &&
      typeof (val as any).title === "string"
    );
  },
  {
    message:
      "Invalid CollectionCategoryProps: must be an object with at least a 'title' string",
  },
);

// Site Collections

const events = defineCollection({
  loader: collectionLoader("events"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      image: mvCustom,
      attachments: z
        .array(
          z.object({
            id: z.string(),
            file: mvCustom,
          }),
        )
        .optional(),
      categories: z.array(cCustom.optional()),
      site: z.any(),
      publishedAt: z.string().datetime(),
      slug: z.string(),
      slugLock: z.boolean(),
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      location: z.string(),
      format: z.enum(["inperson", "virtual"]),
      eventType: z.enum(["onetime", "series"]),
      registrationUrl: z.string(),
      content: z.any(),
      reviewReady: z.boolean(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const leadership = defineCollection({
  loader: collectionLoader("leadership"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      jobTitle: z.string(),
      description: z.string(),
      image: mvCustom,
      imageAlt: z.string(),
      content: z.any(),
      site: z.any(),
      slug: z.string(),
      slugLock: z.boolean(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const news = defineCollection({
  loader: collectionLoader("news"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      image: mvCustom,
      categories: z.array(cCustom.optional()),
      content: z.any(), // content is a lexical object
      site: z.any(),
      reviewReady: z.boolean(),
      publishedAt: z.string().datetime(),
      slug: z.string(),
      slugLock: z.boolean(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const posts = defineCollection({
  loader: collectionLoader("posts"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      image: mvCustom,
      categories: z.array(cCustom.optional()),
      site: z.any(),
      content: z.any(), // content is a lexical object
      reviewReady: z.boolean(),
      authors: z.any(),
      populatedAuthors: z.any(),
      publishedAt: z.string().datetime(),
      slug: z.string(),
      slugLock: z.boolean(),
      "Example Custom Field": z.enum([
        "radio",
        "television",
        "podcast",
        "video",
      ]),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const reports = defineCollection({
  loader: collectionLoader("reports"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      excerpt: z.string(),
      image: mvCustom, // relation to media
      reportFiles: z.array(
        z.object({
          id: z.string(),
          file: mvCustom,
        }),
      ),
      slug: z.string(),
      slugLock: z.boolean(),
      reportDate: z.string().datetime(),
      categories: z.array(cCustom.optional()), // categoriesField, can be any
      site: z.any(), // siteField, can be any
      content: z.any(), // richText, can be any
      reviewReady: z.boolean(),
      publishedAt: z.string().datetime(),
      updatedAt: z.string().datetime().optional(),
      createdAt: z.string().datetime().optional(),
      _status: z.enum(["draft", "published"]).optional(),
    }),
  ),
});

const resources = defineCollection({
  loader: collectionLoader("resources"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      excerpt: z.string(),
      image: mvCustom, // relation to media
      reportFiles: z.array(
        z.object({
          id: z.string(),
          file: mvCustom,
        }),
      ),
      slug: z.string(),
      slugLock: z.boolean(),
      resourceDate: z.string().datetime(),
      categories: z.array(cCustom.optional()), // categoriesField, can be any
      site: z.any(), // siteField, can be any
      content: z.any(), // richText, can be any
      reviewReady: z.boolean(),
      publishedAt: z.string().datetime(),
      updatedAt: z.string().datetime().optional(),
      createdAt: z.string().datetime().optional(),
      _status: z.enum(["draft", "published"]).optional(),
    }),
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
                    }),
                  )
                  .optional(),
              })
              .optional(),
          )
          .optional(),
        _status: z.enum(["draft", "published"]),
        updatedAt: z.string().datetime(),
        createdAt: z.string().datetime(),
        globalType: z.string(),
      })
      .partial(),
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
        searchAccessKey: z.any().optional(),
        searchAffiliate: z.any().optional(),
      })
      .partial(),
  ),
});

export const collections = {
  // site collections
  events,
  news,
  leadership,
  posts,
  reports,
  resources,
  // site globals
  menu,
  siteConfig,
};
