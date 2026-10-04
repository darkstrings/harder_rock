import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The Firebase SDK chunk (~570 kB) only loads when VITE_DATA_SOURCE=firebase.
  build: { chunkSizeWarningLimit: 600 },
});
