// @ts-check
import { configLoader } from "./src/utils/configLoader";
const CONFIG = await configLoader();

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import run from "vite-plugin-run";

import mdx from "@astrojs/mdx";

import expressiveCode from "astro-expressive-code";
import ecConfig from "./ec.config.mjs";

// TODO: fallback to src/posts is set in 4 different locations. Move into configLoader.
const postsDir = CONFIG.POSTS_DIR ?? "src/posts";

const imageConfig =
  // Check if user is bypassing the warning by setting IMAGE_REMOTE_DOMAINS to 'unsafe'.
  CONFIG.IMAGE_REMOTE_DOMAINS === "unsafe"
    // If so, allow all remote images by using remotePatterns
    ? { remotePatterns: [{ protocol: "https" }, { protocol: "http" }] }
    // Otherwise, check that an array of domains (or blank array) has been provided
    : CONFIG.IMAGE_REMOTE_DOMAINS instanceof Array
      ? { domains: CONFIG.IMAGE_REMOTE_DOMAINS }
      // If anything else is set, use a blank array to prevent errors.
      : { domains: [] };

// https://astro.build/config
export default defineConfig({
  image: imageConfig,
  vite: {
    plugins: [
      tailwindcss(),
      CONFIG.TODOS_ENABLED &&
        run([
          {
            name: "todo index",
            run: ["node", "src/scripts/buildTodos.js"],
            condition: (file) =>
              file.includes(postsDir) && /\.mdx$/.test(file),
          },
        ]),
    ].filter(Boolean),
  },
  site: CONFIG.URL,
  markdown: {
    syntaxHighlight: false, // disable Astro's default highlighting
  },
  integrations: [
    sitemap(),
    robotsTxt({
      transform(content) {
        return `${CONFIG.ROBOTS_OVERRIDE || content}`;
      },
    }),
    expressiveCode(ecConfig),
    mdx(),
  ],
});
