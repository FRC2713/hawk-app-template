// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
    staticHeaders: true,
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      forwardConsole: true,
    },
  },
  server: {
    host: process.env.HOST ?? "127.0.0.1",
    port: Number(process.env.PORT ?? 3000),
  },
  security: {
    checkOrigin: true,
    csp: true,
  },
  session: false,
  markdown: { syntaxHighlight: false },
});
