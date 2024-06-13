import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./components"),
      "@": resolve(__dirname, "./src"),
      "@pswui-lib": resolve(__dirname, "./lib.tsx"),
    },
  },
});
