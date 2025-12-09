import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build the React popup into the Safari extension Resources directory.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../Prompt Wrangler Extension/Resources/popup-dist',
    emptyOutDir: true,
  },
});
