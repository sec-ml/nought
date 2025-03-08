// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import { CONFIG } from "./src/config/config.js";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    vite: {
      plugins: [tailwindcss()],
    },
    site: CONFIG.URL,
    integrations: [sitemap(), robotsTxt()],
  });