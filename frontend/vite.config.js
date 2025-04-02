import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias `@` to `src`
      "@media": path.resolve(__dirname, "src/icons"),
      "@composables": path.resolve(__dirname, "src/composables"),
    },
  },
});
