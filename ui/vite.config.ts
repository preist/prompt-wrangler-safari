import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

const isContentScript = process.env.BUILD_TARGET === 'content';
const isBackgroundScript = process.env.BUILD_TARGET === 'background';
const isInjectedScript = process.env.BUILD_TARGET === 'injected';
const isExtensionScript = isContentScript || isBackgroundScript || isInjectedScript;

const outDir = isExtensionScript
  ? '../Prompt Wrangler Extension/Resources'
  : '../Prompt Wrangler Extension/Resources/popup-dist';

// Build popup, content script, background, and injected script.
export default defineConfig({
  plugins: [react(), svgr()],
  base: isExtensionScript ? undefined : './',
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'src/lib'),
      '@types': resolve(__dirname, 'src/types'),
      '@shared': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/lib/utils'),
      '@popup': resolve(__dirname, 'src/popup'),
    },
  },
  build: {
    outDir,
    emptyOutDir: !isExtensionScript,
    rollupOptions: isContentScript
      ? {
          input: resolve(__dirname, 'src/extension/content/index.ts'),
          output: {
            entryFileNames: 'content.js',
            format: 'iife',
            inlineDynamicImports: true,
          },
          preserveEntrySignatures: false,
        }
      : isBackgroundScript
        ? {
            input: resolve(__dirname, 'src/extension/background/index.ts'),
            output: {
              entryFileNames: 'background.js',
              format: 'es',
              inlineDynamicImports: true,
            },
            preserveEntrySignatures: false,
          }
        : isInjectedScript
          ? {
              input: resolve(__dirname, 'src/extension/content/injected.ts'),
              output: {
                entryFileNames: 'injected.js',
                format: 'iife',
                inlineDynamicImports: true,
              },
              preserveEntrySignatures: false,
            }
          : {
              input: {
                popup: resolve(__dirname, 'index.html'),
              },
              output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                format: 'es',
              },
            },
  },
  publicDir: isExtensionScript ? false : 'public',
});
