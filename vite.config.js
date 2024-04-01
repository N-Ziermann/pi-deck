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
    outDir: '../ui-dist/',
  },
  server: {
    // custom hmr & strict port for electron-dev-proxy to work
    port: 5123,
    strictPort: true,
    hmr: {
      port: 5423,
      clientPort: 5423,
    },
  },
});
