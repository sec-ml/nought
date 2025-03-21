import { configLoader } from '../utils/configLoader';
const CONFIG = await configLoader();

export function filterBlogPosts(posts) {
    return posts
      .filter((post) => import.meta.env.PROD ? post.data.draft !== true : true)
      .filter((post) => {
        // Do we enable the concept of scheduled posts?
        if (CONFIG.SCHEDULED_POSTS) {
          // If env is production, only show posts that are older than or equal to the current date
          if (import.meta.env.PROD) {
            return new Date(post.data.dateCreated) <= new Date();
          // If env is NOT production, also check for SCHEDULED_POSTS_SEE_IN_DEV. If false, only show posts that are older than or equal to the current date
          } else if (!import.meta.env.PROD && !CONFIG.SCHEDULED_POSTS_SEE_IN_DEV) {
            return new Date(post.data.dateCreated) <= new Date();
          }
        }
        return true; // otherwise, show/keep the post if no filtering is needed
      });
  }