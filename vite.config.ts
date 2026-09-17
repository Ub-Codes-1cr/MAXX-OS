import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: process.env.DISABLE_HMR !== 'true',
    fs: {
      deny: ['**/my old build/**', '**/MAXX OS/**', '**/maxxx Final/**', '**/maxxos/**', '**/maxx/**'],
    },
    watch: {
      ignored: [
        '**/my old build/**',
        '**/MAXX OS/**',
        '**/maxxx Final/**',
        '**/maxxos/**',
        '**/maxx/**',
        '**/.git/**',
      ],
    },
  },
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.{ts,tsx,js,jsx}'],
  },
});
