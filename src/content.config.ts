import { defineCollection, z } from 'astro:content';
import payloadFetch from './payload-fetch';

function collectionLoader (apiPath: string) {
  return async () => {
    const response = await payloadFetch(`${apiPath}?draft=true`)
    const data = await response.json();
    return data.docs.map(doc => {
        return { ...doc, id: doc.slug }
    })
  }
}

const posts = defineCollection({
    loader: collectionLoader('posts'),
    schema: z.object({
      title: z.string(),
      content_html: z.string(),
      slug: z.string(),
    })
});

const pages = defineCollection({
  loader: collectionLoader('pages'),
    schema: z.object({
      title: z.string(),
      content_html: z.string(),
      slug: z.string(),
    })
});

export const collections = { posts, pages };
