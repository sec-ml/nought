import { configLoader } from '../utils/configLoader';
const CONFIG = await configLoader();

import { filterBlogPosts } from '../utils/filterBlogPosts';

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog_posts = filterBlogPosts(await getCollection('blog'));
  return rss({
    title: CONFIG.TITLE,
    description: CONFIG.DESCRIPTION,
    site: context.site,
    items: blog_posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.dateCreated,
      description: post.data.description,
      link: `/${post.id}`,
    })),
  });
}