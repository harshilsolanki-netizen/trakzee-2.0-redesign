import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    host: true,
    port: 8081,
    strictPort: true,
  },
});
