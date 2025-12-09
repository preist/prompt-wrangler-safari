import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/lib/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
