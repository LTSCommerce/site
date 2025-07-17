import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public_html',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public_html/index.html'),
        about: resolve(__dirname, 'public_html/about.html'),
        services: resolve(__dirname, 'public_html/services.html'),
        articles: resolve(__dirname, 'public_html/articles.html'),
        contact: resolve(__dirname, 'public_html/contact.html'),
        author: resolve(__dirname, 'public_html/author.html'),
        // Article pages
        'legacy-php-modernization': resolve(__dirname, 'public_html/articles/legacy-php-modernization.html'),
        'high-performance-php': resolve(__dirname, 'public_html/articles/high-performance-php.html'),
        'scalable-php-apis': resolve(__dirname, 'public_html/articles/scalable-php-apis.html'),
        'mysql-performance-php': resolve(__dirname, 'public_html/articles/mysql-performance-php.html'),
        'ansible-php-infrastructure': resolve(__dirname, 'public_html/articles/ansible-php-infrastructure.html'),
        'ai-enhanced-php-development': resolve(__dirname, 'public_html/articles/ai-enhanced-php-development.html'),
        'proxmox-vs-cloud': resolve(__dirname, 'public_html/articles/proxmox-vs-cloud.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    devSourcemap: true,
  },
  publicDir: 'public_html',
});