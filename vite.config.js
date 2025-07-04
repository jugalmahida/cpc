import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      // '/api' : "http://localhost:4001"
      '/api': "https://api.gucpc.in"
    }
  },
  build: {
    sourcemap: false,
    outDir: '/var/www/html/dist',
  }
});