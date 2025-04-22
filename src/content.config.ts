import { defineCollection, z } from 'astro:content';
import payloadFetch from './payload-fetch';

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

const events = defineCollection({
    loader: collectionLoader('events'),
    schema: z.object({
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
    })
});
const news = defineCollection({
    loader: collectionLoader('news'),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        content: z.any(), // content is a lexical object
        updatedAt: z.string().datetime(),
        createdAt: z.string().datetime(),
        _status: z.enum(["draft", "published"]),
    })
});

// Single pages are represented as globals in the API
const aboutUs = defineCollection({
    loader: collectionLoader('globals/about-us'),
    schema: z.object({
      subtitle: z.string(),
      content: z.any(), // content is a lexical object
    })
});

export const collections = { events, news, aboutUs };
