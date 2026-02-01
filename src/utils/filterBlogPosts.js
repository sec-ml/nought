import { configLoader } from '../utils/configLoader';
const CONFIG = await configLoader();

export function filterBlogPosts(posts) {
  const public_build = import.meta.env.PROD && process.env.SHOW_DRAFTS !== "1"; // If public build, only show posts that are not drafts
    return posts
      .filter((post) => public_build ? post.data.draft !== true : true)
      .filter((post) => {
        // Do we enable the concept of scheduled posts?
        if (CONFIG.SCHEDULED_POSTS) {
          // If env is production, only show posts that are older than or equal to the current date
          //if (import.meta.env.PROD) {
          if (public_build) {
            return new Date(post.data.dateCreated) <= new Date();
          // If env is NOT production, also check for SCHEDULED_POSTS_SEE_IN_DEV. If false, only show posts that are older than or equal to the current date
          } else if (!import.meta.env.PROD && !CONFIG.SCHEDULED_POSTS_SEE_IN_DEV) {
            return new Date(post.data.dateCreated) <= new Date();
          }
        }
        return true; // otherwise, show/keep the post if no filtering is needed
      });
  }