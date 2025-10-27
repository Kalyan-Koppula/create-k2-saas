import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  // Use the Tailwind Vite plugin; the plugin will pick up `tailwind.config.cjs`.
  tailwindcss(),
  ],
});