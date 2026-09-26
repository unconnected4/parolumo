/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import fs from 'node:fs';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // `npm run dev:mock` runs Vite in mode "mock". The app itself checks a single flag,
  // import.meta.env.VITE_API_MOCKS, so mode "mock" is exposed as that flag here.
  const isMockMode = mode === 'mock' || env.VITE_API_MOCKS === '1';

  return {
    define: isMockMode ? { 'import.meta.env.VITE_API_MOCKS': JSON.stringify('1') } : undefined,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'exclude-mock-service-worker-from-dist',
        closeBundle() {
          const workerInDist = path.resolve(import.meta.dirname, 'dist/mockServiceWorker.js');
          if (fs.existsSync(workerInDist)) {
            fs.unlinkSync(workerInDist);
          }
        },
      },
    ],
    server: {
      port: 5173,
      proxy: isMockMode
        ? undefined
        : {
            '/api': {
              target: env.API_PROXY_TARGET || 'http://localhost:8000',
              changeOrigin: true,
            },
          },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  };
});
