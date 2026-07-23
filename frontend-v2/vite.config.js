import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // In Docker Compose this is overridden to http://backend:8000 (see docker-compose.yml).
    // Running the frontend standalone (npm run dev) falls back to localhost.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Uploaded images are served by the backend at /uploads/<file> (see
      // app/main.py's StaticFiles mount) and referenced by that exact path
      // in image_url fields - so this needs its own proxy entry, not just /api.
      '/uploads': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
