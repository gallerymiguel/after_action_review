import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001', // ✅ Backend API
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
