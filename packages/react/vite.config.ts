import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import mdx from '@mdx-js/rollup';
import { resolve } from 'node:path';
import rehypeHighlight from "rehype-highlight";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx({ rehypePlugins: [rehypeHighlight] })],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, './components'),
      '@': resolve(__dirname, './src'),
    }
  }
});
