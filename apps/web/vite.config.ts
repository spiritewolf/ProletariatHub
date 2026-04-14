import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packageDir, '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, '');
  const apiProxyTarget =
    process.env.VITE_PROXY_TARGET ?? process.env.VITE_API_URL ?? env.VITE_API_URL;
  if (!apiProxyTarget) {
    throw new Error(
      'Set VITE_API_URL (and in Docker web, VITE_PROXY_TARGET=http://api:3000) — see .env.example and docker-compose.yml.',
    );
  }

  return {
    plugins: [react()],
    envDir: repoRoot,
    resolve: {
      alias: {
        '@proletariat-hub/web': path.resolve(packageDir, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/trpc': { target: apiProxyTarget, changeOrigin: true },
        '/health': { target: apiProxyTarget, changeOrigin: true },
      },
    },
  };
});
