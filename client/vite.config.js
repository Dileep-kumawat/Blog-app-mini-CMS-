import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://inkwell-blog-app.onrender.com',
        // target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://inkwell-blog-app.onrender.com',
        // target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
