import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "disable-enc-compression",
      configurePreviewServer(server) {
        server.middlewares.use((req: any, res: any, next: any) => {
          if (req.url && req.url.endsWith(".enc")) {
            res.setHeader("Content-Encoding", "identity");
          }
          next();
        });
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    // NOTE: no manualChunks on purpose.
    // Listing three / @react-three / rapier as manual chunks promoted them into
    // the entry's STATIC graph, so index.html modulepreloaded ~1.1 MB of
    // Three.js before the hero could paint — even though every consumer
    // (Character, TechStack, EarthCanvas) is behind a dynamic import.
    // Letting Rollup split naturally keeps those libraries inside the async
    // chunks that actually use them.
  }
});


