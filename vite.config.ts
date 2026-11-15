import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

declare const process: { env: Record<string, string | undefined> };

const host = process.env.SITE_URL || "https://be-themer.design";

const siteUrl = (): Plugin => ({
  name: "site-url",
  transformIndexHtml: html => html.replaceAll("%SITE_URL%", host.replace(/\/$/, "")),
});

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
});
