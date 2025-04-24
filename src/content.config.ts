import { defineCollection, z } from 'astro:content';
import payloadFetch from './payload-fetch';
import type { ZodObject, ZodRawShape } from 'astro:schema';

function collectionLoader (apiPath: string) {
  return async () => {
    const response = await payloadFetch(`${apiPath}?draft=true`)
    const data = await response.json();
    if (apiPath.includes('globals')) {
        return [{...data, id: 'main' }]
    } else {
        return data.docs
          .filter(doc => doc.slug) // we have issues without a slug
          .map(doc => {
            return { ...doc, id: doc.slug }
        })
    }
  }
}

// NOTE: because we are rendering drafts, every property should
// accept being nullable
export function makeAllKeysNullable<T extends ZodRawShape>(
  schema: ZodObject<T>
) {
  const nullableShape: {
    [K in keyof T]: z.ZodNullable<T[K]>
  } = {} as any;

  for (const key in schema.shape) {
    nullableShape[key] = z.nullable(schema.shape[key]);
  }

  return z.object(nullableShape);
}

const events = defineCollection({
    loader: collectionLoader('events'),
    schema: makeAllKeysNullable(z.object({
      title: z.string(),
      slug: z.string(),
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      location: z.string(),
      format: z.enum(["inperson", "virtual"]),
      registrationUrl: z.string(),
      description: z.string(),
      updatedAt: z.string().datetime(),
      createdAt: z.string().datetime(),
      _status: z.enum(["draft", "published"]),
    }))
});

const news = defineCollection({
    loader: collectionLoader('news'),
    schema: makeAllKeysNullable(z.object({
        title: z.string(),
        slug: z.string(),
        content: z.any(), // content is a lexical object
        updatedAt: z.string().datetime(),
        createdAt: z.string().datetime(),
        _status: z.enum(["draft", "published"]),
    }))
});

// Single pages are represented as globals in the API
const aboutUs = defineCollection({
    loader: collectionLoader('globals/about-us'),
    schema: makeAllKeysNullable(z.object({
      subtitle: z.string(),
      content: z.any(), // content is a lexical object
    }))
});

export const collections = { events, news, aboutUs };
