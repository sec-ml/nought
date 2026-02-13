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

// https://astro.build/config
export default defineConfig({
  image: {
    // check that CONFIG.IMAGE_REMOTE_DOMAINS is an array, else set empty array
    domains:
      CONFIG.IMAGE_REMOTE_DOMAINS instanceof Array
        ? CONFIG.IMAGE_REMOTE_DOMAINS
        : [],
  },
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
