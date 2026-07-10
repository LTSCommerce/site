import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    watch: {
      ignored: ['**/.claude/**', '**/untracked/**', '**/var/**'],
    },
  },
  plugins: [
    react(),
    // Skip visualizer for SSR builds — only needed for client bundle analysis
    // rollup-plugin-visualizer's own types import Plugin from "rollup", which Vite 8
    // no longer depends on directly (it moved to rolldown) - that import resolves to
    // `any`, cascading into an unsafe-any spread below. The runtime value is still a
    // legitimate plugin object; casting to Vite's own Plugin type is a type-only fix.
    ...(!isSsrBuild
      ? [
          visualizer({
            filename: 'var/bundle-analysis.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
          }) as Plugin,
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: isSsrBuild
        ? {}
        : {
            manualChunks: (id: string) => {
              if (
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/') ||
                id.includes('node_modules/scheduler/')
              ) {
                return 'react-core';
              }
              if (
                id.includes('node_modules/react-router-dom/') ||
                id.includes('node_modules/react-router/') ||
                id.includes('node_modules/@remix-run/')
              ) {
                return 'react-router';
              }
              if (id.includes('node_modules/highlight.js/')) {
                return 'highlight-js';
              }
              if (
                id.includes('node_modules/react-hook-form/') ||
                id.includes('node_modules/zod/') ||
                id.includes('node_modules/@hookform/')
              ) {
                return 'ui-libs';
              }
              if (id.includes('node_modules/')) {
                return 'vendor';
              }
            },
            chunkFileNames: 'assets/[name]-[hash].js',
          },
    },
  },
}));
