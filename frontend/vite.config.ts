import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const PORT = Number(env.VITE_PORT) || 5173;
  const SERVER_URI = env.VITE_SERVER_URI || 'http://localhost:3000'

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
      port: PORT,
      proxy: {
        '/trpc': SERVER_URI,
      },
    },
  };
});
