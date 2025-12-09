import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@types': resolve(__dirname, 'src/types'),
      '@shared': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/lib/utils'),
      '@popup': resolve(__dirname, 'src/popup'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
