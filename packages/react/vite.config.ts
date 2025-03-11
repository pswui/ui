import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./components"),
      "@": resolve(__dirname, "./src"),
      "@pswui-lib": resolve(__dirname, "./lib/index.ts"),
    },
  },
});
