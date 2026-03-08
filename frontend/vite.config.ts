import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (!env.VITE_MAPTILER_KEY) {
    console.warn('⚠️  VITE_MAPTILER_KEY is not set in .env');
  }
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@backend': path.resolve(__dirname, '../backend/src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/trpc': 'http://localhost:3000',
      },
    },
  };
});
