import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import mdx from '@mdx-js/rollup';
import { resolve } from 'node:path';
import remarkGfm from "remark-gfm";
import withSlug from "rehype-slug"
import withToc from "@stefanprobst/rehype-extract-toc";
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx({ rehypePlugins: [withSlug, withToc, withTocExport], remarkPlugins: [remarkGfm] }), dynamicImport()],
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
