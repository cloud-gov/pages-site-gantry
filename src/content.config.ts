import { defineCollection, z } from "astro:content";
import type { ZodObject, ZodRawShape } from "astro:schema";
import type { MediaValueProps, CollectionCategoryProps } from "@/env";
import { collectionLoader } from "@/utilities/fetch";

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

const alerts = defineCollection({
  loader: collectionLoader("alerts", false),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string().nullable().optional(),
      title: z.string().nullable().optional().nullable().optional(),
      description: z.string().nullable().optional(),
      type: z
        .enum(["info", "warning", "success", "error", "emergency"])
        .nullable()
        .optional(),
      alignment: z.enum(["left", "center"]).nullable().optional(),
      isActive: z.boolean().nullable().optional(),
      content: z.any().nullable().optional(),
      slim: z.boolean().nullable().optional(),
      icon: z.boolean().nullable().optional(),
      site: z.any().nullable().optional(),
      reviewReady: z.boolean().nullable().optional(),
      updatedAt: z.string().datetime().nullable().optional(),
      createdAt: z.string().datetime().nullable().optional(),
      _status: z.enum(["draft", "published"]).nullable().optional(),
    }),
  ),
});

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
      relatedItems: z
        .array(
          z.discriminatedUnion("blockType", [
            z.object({
              blockType: z.literal("internalItem"),
              item: z.union([z.string(), z.number(), z.any()]),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
            z.object({
              blockType: z.literal("externalLink"),
              title: z.string(),
              url: z.string(),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
          ]),
        )
        .optional(),
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
      showInPageNav: z.boolean().optional(),
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
      showInPageNav: z.boolean().optional(),
      relatedItems: z
        .array(
          z.discriminatedUnion("blockType", [
            z.object({
              blockType: z.literal("internalItem"),
              item: z.union([z.string(), z.number(), z.any()]),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
            z.object({
              blockType: z.literal("externalLink"),
              title: z.string(),
              url: z.string(),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
          ]),
        )
        .optional(),
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
      showInPageNav: z.boolean().optional(),
      authors: z.any(),
      populatedAuthors: z.any(),
      relatedItems: z
        .array(
          z.discriminatedUnion("blockType", [
            z.object({
              blockType: z.literal("internalItem"),
              item: z.union([z.string(), z.number(), z.any()]),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
            z.object({
              blockType: z.literal("externalLink"),
              title: z.string(),
              url: z.string(),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
          ]),
        )
        .optional(),
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
      showInPageNav: z.boolean().optional(),
      relatedItems: z
        .array(
          z.discriminatedUnion("blockType", [
            z.object({
              blockType: z.literal("internalItem"),
              item: z.union([z.string(), z.number(), z.any()]),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
            z.object({
              blockType: z.literal("externalLink"),
              title: z.string(),
              url: z.string(),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
          ]),
        )
        .optional(),
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
      relatedItems: z
        .array(
          z.discriminatedUnion("blockType", [
            z.object({
              blockType: z.literal("internalItem"),
              item: z.union([z.string(), z.number(), z.any()]),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
            z.object({
              blockType: z.literal("externalLink"),
              title: z.string(),
              url: z.string(),
              description: z.string().optional(),
              id: z.string().optional(),
            }),
          ]),
        )
        .optional(),
      showInPageNav: z.boolean().optional(),
      publishedAt: z.string().datetime(),
      updatedAt: z.string().datetime().optional(),
      createdAt: z.string().datetime().optional(),
      _status: z.enum(["draft", "published"]).optional(),
    }),
  ),
});

const policies = defineCollection({
  loader: collectionLoader("policies"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      slugLock: z.boolean(),
      site: z.any(), // siteField, can be any
      content: z.any(), // richText, can be any
      reviewReady: z.boolean(),
      publishedAt: z.string().datetime().optional(),
      updatedAt: z.string().datetime().optional(),
      createdAt: z.string().datetime().optional(),
      _status: z.enum(["draft", "published"]).optional(),
    }),
  ),
});

// Site Globals

const homepage = defineCollection({
  loader: collectionLoader("globals/home-page"),
  schema: makeAllKeysNullable(
    z
      .object({
        id: z.string(),
        content: z
          .array(
            z.discriminatedUnion("blockType", [
              z.object({
                title: z.string(),
                subtitle: z.string().nullable().optional(),
                description: z.string().nullable().optional(),
                bgImage: z.union([z.number().nullable(), z.any()]).optional(), // MediaValueProps or number
                ctaButton: z
                  .object({
                    text: z.string().nullable().optional(),
                    url: z.string().nullable().optional(),
                    style: z
                      .enum(["primary", "secondary", "outline"])
                      .nullable()
                      .optional(),
                  })
                  .optional(),
                id: z.string().nullable().optional(),
                blockName: z.string().nullable().optional(),
                blockType: z.literal("hero"),
              }),
              z.object({
                title: z.string().nullable().optional(),
                description: z.string().nullable().optional(),
                cards: z
                  .array(
                    z.object({
                      title: z.string(),
                      description: z.string().nullable().optional(),
                      image: z
                        .union([z.number().nullable(), z.any()])
                        .optional(), // MediaValueProps or number
                      link: z
                        .object({
                          url: z.string().nullable().optional(),
                          text: z.string().nullable().optional(),
                        })
                        .optional(),
                      id: z.string().nullable().optional(),
                    }),
                  )
                  .nullable()
                  .optional(),
                id: z.string().nullable().optional(),
                blockName: z.string().nullable().optional(),
                blockType: z.literal("cardGrid"),
              }),
              z.object({
                title: z.string().nullable().optional(),
                content: z
                  .object({
                    root: z.object({
                      type: z.string(),
                      children: z.array(z.any()),
                      direction: z.enum(["ltr", "rtl"]).nullable(),
                      format: z.enum([
                        "left",
                        "start",
                        "center",
                        "right",
                        "end",
                        "justify",
                        "",
                      ]),
                      indent: z.number(),
                      version: z.number(),
                    }),
                  })
                  .nullable()
                  .optional(),
                id: z.string().nullable().optional(),
                blockName: z.string().nullable().optional(),
                blockType: z.literal("textBlock"),
              }),
            ]),
          )
          .nullable()
          .optional(),
        _status: z.enum(["draft", "published"]).nullable().optional(),
        updatedAt: z.string().nullable().optional(),
        createdAt: z.string().nullable().optional(),
      })
      .partial(),
  ),
});

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
        dapAgencyCode: z.string().optional(),
        dapSubAgencyCode: z.string().optional(),
        collectionDisplayNames: z
          .array(
            z.object({
              collectionSlug: z.string(),
              displayName: z.string(),
              customSlug: z.string().optional(),
            }),
          )
          .optional(),
      })
      .partial(),
  ),
});

const preFooter = defineCollection({
  loader: collectionLoader("globals/pre-footer"),
  schema: makeAllKeysNullable(
    z
      .object({
        type: z.string().nullable().optional(),
        connectSectionLocation: z.string().nullable().optional(),
        contactCenter: z.array(
          z
            .object({
              name: z.string().nullable().optional(),
              phone: z.string().nullable().optional(),
              email: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
        ),
        facebook: z.array(
          z
            .object({
              url: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
        ),
        platform_x: z.array(
          z
            .object({
              url: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
        ),
        youtube: z.array(
          z
            .object({
              url: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
        ),
        instagram: z.array(
          z
            .object({
              url: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
        ),
        rssfeed: z.array(
          z
            .object({
              url: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
        ),
        groupCol: z.string().nullable().optional(),
        linkGroup: z.array(
          z
            .object({
              groupName: z.string().nullable().optional(),
              link: z.array(
                z
                  .object({
                    blockType: z.string().nullable().optional(),
                    name: z.string().nullable().optional(),
                    type: z.any().nullable().optional(),
                    id: z.string().nullable().optional(),
                    url: z.string().nullable().optional(),
                  })
                  .nullable()
                  .optional(),
              ),
            })
            .nullable()
            .optional(),
        ),
        slimLink: z.array(
          z
            .object({
              blockType: z.string().nullable().optional(),
              name: z.string().nullable().optional(),
              page: z.any().nullable().optional(),
              id: z.string().nullable().optional(),
              url: z.string().nullable().optional(),
            })
            .optional(),
        ),
        _status: z.enum(["draft", "published"]),
        updatedAt: z.string().datetime(),
        createdAt: z.string().datetime(),
        globalType: z.string(),
      })
      .partial(),
  ),
});

const general = defineCollection({
  loader: collectionLoader("general"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      excerpt: z.string().optional(),
      image: mvCustom.optional(),
      files: z
        .array(
          z.object({
            id: z.string(),
            file: mvCustom,
            label: z.string().optional(),
          }),
        )
        .optional(),
      slug: z.string(),
      slugLock: z.boolean().optional(),
      contentDate: z.string().datetime().optional(),
      location: z.string().optional(),
      categories: z.array(cCustom.optional()).optional(),
      site: z.any(),
      content: z.any().optional(), // richText
      reviewReady: z.boolean().optional(),
      showInPageNav: z.boolean().optional(),
      publishedAt: z.string().datetime().optional(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const customCollections = defineCollection({
  loader: collectionLoader("custom-collections"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      site: z.any(),
      reviewReady: z.boolean().optional(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const customCollectionPages = defineCollection({
  loader: collectionLoader("custom-collection-pages"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      collectionConfig: z.any(), // relationship to custom-collections
      title: z.string(),
      excerpt: z.string().optional(),
      image: mvCustom.optional(),
      files: z
        .array(
          z.object({
            id: z.string(),
            file: mvCustom,
            label: z.string().optional(),
          }),
        )
        .optional(),
      slug: z.string(),
      slugLock: z.boolean().optional(),
      contentDate: z.string().datetime().optional(),
      categories: z.array(cCustom.optional()).optional(),
      site: z.any(),
      content: z.any().optional(), // richText
      reviewReady: z.boolean().optional(),
      showInPageNav: z.boolean().optional(),
      publishedAt: z.string().datetime().optional(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const sideNavigations = defineCollection({
  loader: collectionLoader("side-navigation"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      name: z.string(),
      title: z.string().optional(),
      enabled: z.boolean().optional(),
      items: z
        .array(
          z.object({
            id: z.string(),
            label: z.string(),
            blockType: z.string(),
            page: z.any().optional(),
            url: z.string().optional(),
            order: z.number().optional(),
            subitems: z
              .array(
                z.object({
                  id: z.string(),
                  label: z.string(),
                  blockType: z.string(),
                  page: z.any().optional(),
                  url: z.string().optional(),
                  order: z.number().optional(),
                }),
              )
              .optional(),
          }),
        )
        .optional(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }),
  ),
});

const footer = defineCollection({
  loader: collectionLoader("globals/footer"),
  schema: makeAllKeysNullable(
    z
      .object({
        domain: z.string().nullable().optional(),
        content: z.any().nullable().optional(),
        logos: z.array(
          z
            .object({
              image: z.any().nullable().optional(),
              url: z.string().nullable().optional(),
            })
            .optional(),
        ),
        identifierColor: z.string().nullable().optional(),
        identityDomainColor: z.string().nullable().optional(),
        primaryLinkColor: z.string().nullable().optional(),
        secondaryLinkColor: z.string().nullable().optional(),
        link: z.array(
          z
            .object({
              blockType: z.string().nullable().optional(),
              name: z.string().nullable().optional(),
              page: z.any().nullable().optional(),
              id: z.string().nullable().optional(),
              url: z.string().nullable().optional(),
            })
            .optional(),
        ),
        _status: z.enum(["draft", "published"]),
        updatedAt: z.string().datetime(),
        createdAt: z.string().datetime(),
        globalType: z.string(),
      })
      .partial(),
  ),
});

const notFoundPage = defineCollection({
  loader: collectionLoader("globals/not-found-page"),
  schema: makeAllKeysNullable(
    z.object({
      title: z.string().nullable().optional(),
      heading: z.string().nullable().optional(),
      content: z.any(), // richText
      showSearch: z.boolean().optional(),
    }),
  ),
});

export const collections = {
  // site collections
  alerts,
  events,
  news,
  leadership,
  posts,
  reports,
  resources,
  policies,
  customCollections,
  customCollectionPages,
  sideNavigations,
  // site globals
  homepage,
  menu,
  siteConfig,
  preFooter,
  footer,
  notFoundPage,
};
