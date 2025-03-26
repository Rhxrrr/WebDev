import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  optimizeDeps: {
    include: ["jquery"], // Ensure Vite processes jQuery
  },
  plugins: [tailwindcss()],
  root: "public", // Ensure Vite serves from the `public` directory
});
