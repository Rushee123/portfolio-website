import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Phase 2: forward /api to the FastAPI dev server
    // proxy: { '/api': 'http://localhost:8000' },
  },
});
