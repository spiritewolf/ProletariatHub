import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packageDir, '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, '');
  const apiProxyTarget = env.VITE_API_URL;
  if (!apiProxyTarget) {
    throw new Error(
      'Set VITE_API_URL in the repo root .env (see .env.example). It must match the API origin (scheme, host, port) for the dev proxy and tRPC client.',
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
