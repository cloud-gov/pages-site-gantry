import { defineCollection, z } from "astro:content";
import payloadFetch from "./utilities/payload-fetch";
import type { ZodObject, ZodRawShape } from "astro:schema";

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

const events = defineCollection({
  loader: collectionLoader("events"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      startDate: z.string().datetime(),
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

const news = defineCollection({
  loader: collectionLoader("news"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      content: z.any(), // content is a lexical object
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    })
  ),
});

const siteConfig = defineCollection({
  loader: collectionLoader("globals/site-config"),
  schema: makeAllKeysNullable(
    z
      .object({
        font: z.string(),
        agencyName: z.string(),
      })
      .partial()
  ),
});

const reports = defineCollection({
  loader: collectionLoader("reports"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      excerpt: z.string(),
      image: z.any(), // relation to media, can be any
      reportFiles: z.array(
        z.object({
          id: z.string(),
          file: z.object({
            id: z.string(),
            alt: z.string(),
            caption: z.any(),
            prefix: z.string(),
            updatedAt: z.string().datetime(),
            createdAt: z.string().datetime(),
            url: z.string(),
            thumbnailURL: z.string(),
            filename: z.string(),
            mimeType: z.string(),
            filesize: z.number(),
            width: z.number(),
            height: z.number(),
            focalX: z.number(),
            focalY: z.number(),
            sizes: z.array(z.any()),
          }), // relation to media, can be any
        })
      ),
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

const posts = defineCollection({
  loader: collectionLoader("posts"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string(),
      slug: z.string(),
      content: z.any(), // content is a lexical object
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    })
  ),
});

export const collections = { events, news, siteConfig, reports, posts};
