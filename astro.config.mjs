// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Astro fingerprints inline <style> and <script> blocks with sha256 hashes only
 * when it builds. The dev server injects Tailwind's stylesheet inline so it can
 * hot-reload; those blocks get no hash, so a `style-src 'self'` policy blocks
 * every one of them and the whole app renders as unstyled text.
 *
 * Full policy in production, no policy on the dev server. Do not simplify this
 * back to a plain `csp: true` -- see docs/ARCHITECTURE.md.
 */
/** @type {import("astro").AstroIntegration} */
const cspOffInDevServer = {
  name: "hawk-csp-off-in-dev",
  hooks: {
    "astro:config:setup": ({ command, updateConfig }) => {
      if (command === "dev") updateConfig({ security: { csp: false } });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
    staticHeaders: true,
  }),
  integrations: [react(), cspOffInDevServer],
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
