import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import mdx from '@mdx-js/rollup';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
