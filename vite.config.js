import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  root: 'public_html',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // HTML pages
        main: resolve(__dirname, 'public_html/index.html'),
        about: resolve(__dirname, 'public_html/about.html'),
        services: resolve(__dirname, 'public_html/services.html'),
        articles: resolve(__dirname, 'public_html/articles.html'),
        contact: resolve(__dirname, 'public_html/contact.html'),
        author: resolve(__dirname, 'public_html/author.html'),
        // Article pages
        'articles/legacy-php-modernization': resolve(__dirname, 'public_html/articles/legacy-php-modernization.html'),
        'articles/high-performance-php': resolve(__dirname, 'public_html/articles/high-performance-php.html'),
        'articles/scalable-php-apis': resolve(__dirname, 'public_html/articles/scalable-php-apis.html'),
        'articles/mysql-performance-php': resolve(__dirname, 'public_html/articles/mysql-performance-php.html'),
        'articles/ansible-php-infrastructure': resolve(__dirname, 'public_html/articles/ansible-php-infrastructure.html'),
        'articles/ai-enhanced-php-development': resolve(__dirname, 'public_html/articles/ai-enhanced-php-development.html'),
        'articles/proxmox-vs-cloud': resolve(__dirname, 'public_html/articles/proxmox-vs-cloud.html'),
        'articles/claude-code-custom-commands-cc-commands': resolve(__dirname, 'public_html/articles/claude-code-custom-commands-cc-commands.html'),
        // JavaScript entry points
        'js/main': resolve(__dirname, 'public_html/js/main.js'),
        'js/articles': resolve(__dirname, 'public_html/js/articles.js'),
        'js/contact': resolve(__dirname, 'public_html/js/contact.js'),
        'js/syntax-highlighter': resolve(__dirname, 'public_html/js/syntax-highlighter.js'),
      },
      output: {
        // Ensure JS files keep their names and paths
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.startsWith('js/')) {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      plugins: [
        copy({
          targets: [
            { src: 'public_html/images/*', dest: 'dist/images' }
          ],
          hook: 'writeBundle'
        })
      ]
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    devSourcemap: true,
  },
  // Handle static assets properly
  publicDir: false, // We'll handle this through rollup options
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp']
});