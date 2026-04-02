import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** In Docker, Compose sets this to http://api:3000 so the dev server proxies to the API container. */
const proxyTarget = process.env.VITE_PROXY_API ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '../..'),
  server: {
    // Required for Docker: default is localhost-only inside the container, so host:5173 port publish gets no response.
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true },
      '/health': { target: proxyTarget, changeOrigin: true },
    },
  },
});
