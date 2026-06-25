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
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'rapier': ['@react-three/rapier'],
          'postprocessing': ['@react-three/postprocessing'],
          'gsap-core': ['gsap'],
        }
      }
    }
  }
});


