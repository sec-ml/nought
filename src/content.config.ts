import { configLoader } from "./utils/configLoader";
const CONFIG = await configLoader();

import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import fs from 'node:fs';
import path from 'node:path';

var author = 
    CONFIG.DEFAULT_AUTHOR ? CONFIG.DEFAULT_AUTHOR : '';

var posts_path =
    CONFIG.POSTS_DIR ? CONFIG.POSTS_DIR : 'src/posts';

// == #55: Resolve fallback images. ==
// If a post doesn't have an image set in frontmatter, we try to find one automatically based on:
// - post slug
// - post tags
// - global fallback
// Each can be enabled/disabled independently in config.
//
// Use fs to scan the images dir (tl;dr: previous attempt used a script to glob all images, but
// I couldn't get this to work if POSTS_DIR was outside of `src`. This should now work...).
// Results in a rel path string (e.g. "images/my-slug.jpg") which gets injected into
// the raw frontmatter data before Astro processes it, so image() can resolve it (therefore Astro
// optimsation works).
//
// TIL about z.preprocess... transforms raw data before schema validation runs.
// https://zod.dev/?id=preprocess
//
// Painful sidequest: Astro maintains a data-store.json file in .astro/ (oh, and in
// node_modules/.astro/ too) to cache the collection data. This is used to speed
// up builds, and is only updated when the collection data changes.
// Because we're injecting into frontmatter, Astro believes this is from the files, so if images
// are added/changed (i.e. in dev, testing), data-store.json is not updated.
// Workaround: use `del-cli .astro/data-store.json .astro/content-assets.mjs node_modules/.astro`
// as `predev` and `prebuild` scripts in package.json.
// 
// Fallback order (each can be enabled/disabled in config):
// 1. slug match: image basename matches the post's slug (maybe useful? Can't
//    be bothered to set path, or using something else to generate images?)
// 2. tag match: image basename matches a tag slug (checked in post's tag order)
// 3. catch-all: FALLBACK_IMAGE filename (with extension) if set

// broad image support, but I'm not even sure if svg can be used by Astro...
const IMAGE_EXTENSIONS = ['png', 'webp', 'avif', 'jpg', 'jpeg', 'gif', 'svg'];

// Read the images directory once, cache it. Avoids repeated fs hits during build.
let _cachedImageFiles: Set<string> | null = null;
function getImageFiles(): Set<string> {
  if (_cachedImageFiles) return _cachedImageFiles;
  try {
    _cachedImageFiles = new Set(
      fs.readdirSync(path.join(posts_path, 'images'))
    );
  } catch {
    _cachedImageFiles = new Set();
  }
  return _cachedImageFiles;
}

// check if an image with this basename exists (try each extension in order).
function findImageByBasename(basename: string): string | null {
  const files = getImageFiles();
  for (const ext of IMAGE_EXTENSIONS) {
    const filename = `${basename}.${ext}`;
    if (files.has(filename)) return `images/${filename}`;
  }
  return null;
}

// step through fallback hierarchy. Return path relative to the post 9or null).
// Each checks for enabled/disabled in config.
function findFallbackImagePath(slug: unknown, tags: unknown): string | null {
  // image matching post slug
  if (CONFIG.FALLBACK_IMAGE_SLUG && typeof slug === 'string') {
    const match = findImageByBasename(slug);
    if (match) return match;
  }

  // image matching post tag
  if (CONFIG.FALLBACK_IMAGE_TAG && Array.isArray(tags)) {
    for (const tag of tags) {
      if (typeof tag !== 'string') continue;
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
      const match = findImageByBasename(tagSlug);
      if (match) return match;
    }
  }

  // catch-all FALLBACK_IMAGE (filename set in config, with extension).
  if (CONFIG.FALLBACK_IMAGE) {
    if (getImageFiles().has(CONFIG.FALLBACK_IMAGE)) {
      return `images/${CONFIG.FALLBACK_IMAGE}`;
    }
  }

  return null;
}
// Marking start and end of this for future, but also relies on `z.preprocess` below
// == /#55: Resolve fallback images. ==

const blog = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: posts_path }),
  schema: ({ image }) => z.preprocess(
    // preprocess receives the raw frontmatter before zod validates it.
    // If there's no image, we try to find a fallback and use that string.
    // image() continues to work/optimises images as it knows no difference.
    (raw) => {
      if (typeof raw !== 'object' || raw === null) return raw;
      const data = raw as Record<string, unknown>;
      if (data.image) return raw;

      const fallback = findFallbackImagePath(data.slug, data.tags);
      if (fallback) return { ...data, image: fallback };
      return raw;
    },
    z.object({
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
    })
  ).transform((data) => {
    return data;

  }),
// ),
});

var tag_pages_path =
    CONFIG.TAG_PAGES_DIR ? CONFIG.TAG_PAGES_DIR : 'src/tag-pages';

const tagPages = defineCollection({
  loader: glob({ pattern: "*.{md,mdx}", base: tag_pages_path }),
  schema: z.object({
    tag: z.string(), // tag slug as in URL, e.g. "markdown" or "expressive-code"
    title: z.string().optional(),
  }),
});

export const collections = {
  blog: blog,
  tagPages: tagPages,
};