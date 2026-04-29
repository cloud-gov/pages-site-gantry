import { defineCollection, z } from "astro:content";
import type { ZodObject, ZodRawShape } from "astro:schema";
import type { MediaValueProps, CollectionTagProps } from "@/env";
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

// Custom Zod schema for CollectionTagProps
const cCustom = z.custom<CollectionTagProps>(
  (val) => {
    return (
      typeof val === "object" &&
      val !== null &&
      typeof (val as any).title === "string"
    );
  },
  {
    message:
      "Invalid CollectionTagProps: must be an object with at least a 'title' string",
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
              z.object({
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
                blockType: z.literal("richText"),
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

// Menu types to satisfy dropdown
const BaseBlock = z.object({
  id: z.string(),
  label: z.string(),
  blockName: z.string().nullable().optional(),
});

const PageLink = BaseBlock.extend({
  blockType: z.literal("pageLink"),
  page: z.any().nullable().optional(),
});

const SiteLink = BaseBlock.extend({
  blockType: z.literal("link"),
  url: z.string().nullable().optional(),
});

const ExternalLink = BaseBlock.extend({
  blockType: z.literal("externalLink"),
  url: z.string().nullable().optional(),
});

const CollectionTypeLink = BaseBlock.extend({
  blockType: z.literal("collectionTypeLink"),
  collectionType: z.any().nullable().optional(),
});

const CollectionEntryLink = BaseBlock.extend({
  blockType: z.literal("collectionEntryLink"),
  collectionEntry: z.any().nullable().optional(),
});

const Dropdown = BaseBlock.extend({
  blockType: z.literal("dropdown"),
  links: z
    .array(
      z.discriminatedUnion("blockType", [
        PageLink,
        SiteLink,
        ExternalLink,
        CollectionTypeLink,
        CollectionEntryLink,
      ]),
    )
    .default([])
    .nullable()
    .optional(),
});

const MenuItem = z.discriminatedUnion("blockType", [
  PageLink,
  SiteLink,
  ExternalLink,
  CollectionTypeLink,
  CollectionEntryLink,
  Dropdown,
]);

const menu = defineCollection({
  loader: collectionLoader("globals/menu"),
  schema: makeAllKeysNullable(
    z
      .object({
        items: z.array(MenuItem).nullable().optional(),
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

// Group with a name and an array of links (used in both variants)
const LinkGroup = z.object({
  id: z.string().nullable().optional(),
  groupName: z.string().nullable().optional(),
  link: z.array(MenuItem).nullable().optional(),
});

// Fields shared by "big" and "slim" preFooter
const PreFooterBase = z.object({
  id: z.string().nullable().optional(),
  groupCol: z.string().nullable().optional(),
  linkGroup: z.array(LinkGroup).nullable().optional(),

  connectSectionLocation: z.string().nullable().optional(),
  contactCenter: z
    .array(
      z
        .object({
          name: z.string().nullable().optional(),
          phone: z.string().nullable().optional(),
          email: z.string().nullable().optional(),
          id: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    )
    .nullable()
    .optional(),

  facebook: z
    .array(
      z.object({ url: z.string().nullable().optional() }).nullable().optional(),
    )
    .nullable()
    .optional(),
  platform_x: z
    .array(
      z.object({ url: z.string().nullable().optional() }).nullable().optional(),
    )
    .nullable()
    .optional(),
  youtube: z
    .array(
      z.object({ url: z.string().nullable().optional() }).nullable().optional(),
    )
    .nullable()
    .optional(),
  instagram: z
    .array(
      z.object({ url: z.string().nullable().optional() }).nullable().optional(),
    )
    .nullable()
    .optional(),
  rssfeed: z
    .array(
      z.object({ url: z.string().nullable().optional() }).nullable().optional(),
    )
    .nullable()
    .optional(),

  reviewReady: z.boolean().nullable().optional(),
  _status: z.enum(["draft", "published"]).nullable().optional(),
  updatedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime().nullable().optional(),
  globalType: z.string().nullable().optional(),
});

// "big" variant: just the base + type literal
const PreFooterBig = PreFooterBase.extend({
  type: z.literal("big").optional(),
});

// "slim" variant: base + type + extra slimLink[] (same union)
const PreFooterSlim = PreFooterBase.extend({
  type: z.literal("slim"),
  slimLink: z.array(MenuItem).nullable().optional(),
});

// Final discriminated union on `type`
const PreFooterSchema = z.discriminatedUnion("type", [
  PreFooterBig,
  PreFooterSlim,
]);

const preFooter = defineCollection({
  loader: collectionLoader("globals/pre-footer"),
  schema: PreFooterSchema,
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
      tags: z.array(cCustom.optional()).optional(),
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

const collectionTypes = defineCollection({
  loader: collectionLoader("collection-types"),
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

const collectionEntries = defineCollection({
  loader: collectionLoader("collection-entries"),
  schema: makeAllKeysNullable(
    z.object({
      id: z.string(),
      collectionConfig: z.any(), // relationship to collection-types
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
      tags: z.array(cCustom.optional()).optional(),
      site: z.any(),
      externalLink: z.object({
        url: z.string().optional().nullable(),
        label: z.string().optional().nullable(),
      }),
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
        link: z.array(MenuItem).nullable().optional(),
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
  collectionTypes,
  collectionEntries,
  sideNavigations,
  // site globals
  homepage,
  menu,
  siteConfig,
  preFooter,
  footer,
  notFoundPage,
};
