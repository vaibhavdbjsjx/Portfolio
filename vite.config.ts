import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three") || id.includes("three-stdlib")) {
              return "three-vendor";
            }
            if (
              id.includes("@react-three") ||
              id.includes("rapier") ||
              id.includes("@dimforge/rapier")
            ) {
              return "rapier-vendor";
            }
            return "vendor";
          }
        }
      }
    }
  }
});
