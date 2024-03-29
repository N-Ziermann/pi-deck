import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: 'src',
  resolve: {
    alias: { '/src': path.resolve(process.cwd(), 'src') },
  },
  build: {
    outDir: '../react/',
  },
  server: {
    port: 5123,
  },
});
