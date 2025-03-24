// @ts-check
import { configLoader } from "./src/utils/configLoader";
const CONFIG = await configLoader();

import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    vite: {
      plugins: [tailwindcss()],
    },
    site: CONFIG.URL,
    integrations: [
      sitemap(), 
      robotsTxt({
        transform(content) {
          return `${CONFIG.ROBOTS_OVERRIDE || content}`;        
        },
      }),
    ],
  });