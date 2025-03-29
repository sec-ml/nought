import { configLoader } from "./utils/configLoader";
const CONFIG = await configLoader();

import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

var author = 
    CONFIG.DEFAULT_AUTHOR ? CONFIG.DEFAULT_AUTHOR : '';

var posts_path =
    CONFIG.POSTS_DIR ? CONFIG.POSTS_DIR : 'src/posts';

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: posts_path }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    author: z.string().default(author),
    dateCreated: z.date(),
    dateModified: z.array(z.date()).optional().nullable(),
    draft: z.boolean().default(true),
    image: image().optional().nullable(),
    imageAlt: z.string().optional().nullable(),
    slug: z.string(),
    tags: z.array(z.string()).optional().nullable(),
    redirects: z.array(z.string()).optional().nullable(),
    excerpt: z.string().optional().nullable(),
  }),
});

export const collections = {
  blog: blog,
};