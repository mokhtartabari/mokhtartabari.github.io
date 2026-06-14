import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://mokhtartabari.github.io",
  // Charts moved from /data/* to /charts/* (URL now matches the "Charts" label).
  // Keep the old paths working for bookmarks/inbound links.
  redirects: {
    "/data": "/charts",
    "/data/inflation": "/charts/inflation",
    "/data/gdp": "/charts/gdp",
    "/data/trade": "/charts/trade",
    "/data/employment": "/charts/employment",
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "directory",
  },
});
