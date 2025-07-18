import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

// Plugin to remove HTML comments during build
function removeHtmlComments() {
  return {
    name: 'remove-html-comments',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (file.type === 'asset' && fileName.endsWith('.html')) {
          // Remove all HTML comments during build
          file.source = file.source.toString().replace(/<!--[\s\S]*?-->/g, '');
        }
      }
    }
  };
}

export default defineConfig({
  root: 'private_html',
  build: {
    outDir: '../public_html',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // HTML pages
        main: resolve(__dirname, 'private_html/index.html'),
        about: resolve(__dirname, 'private_html/about.html'),
        services: resolve(__dirname, 'private_html/services.html'),
        articles: resolve(__dirname, 'private_html/articles.html'),
        contact: resolve(__dirname, 'private_html/contact.html'),
        author: resolve(__dirname, 'private_html/author.html'),
        // Article pages
        'articles/claude-code-custom-commands-cc-commands': resolve(__dirname, 'private_html/articles/claude-code-custom-commands-cc-commands.html'),
        'articles/fedora-42-breakthrough-features': resolve(__dirname, 'private_html/articles/fedora-42-breakthrough-features.html'),
        'articles/legacy-php-modernization': resolve(__dirname, 'private_html/articles/legacy-php-modernization.html'),
        'articles/ansible-php-infrastructure': resolve(__dirname, 'private_html/articles/ansible-php-infrastructure.html'),
        'articles/proxmox-vs-cloud': resolve(__dirname, 'private_html/articles/proxmox-vs-cloud.html'),
        'articles/high-performance-php': resolve(__dirname, 'private_html/articles/high-performance-php.html'),
        'articles/mysql-performance-php': resolve(__dirname, 'private_html/articles/mysql-performance-php.html'),
        'articles/scalable-php-apis': resolve(__dirname, 'private_html/articles/scalable-php-apis.html'),
        'articles/ai-enhanced-php-development': resolve(__dirname, 'private_html/articles/ai-enhanced-php-development.html'),
        // JavaScript entry points
        'js/main': resolve(__dirname, 'private_html/js/main.js'),
        'js/about': resolve(__dirname, 'private_html/js/about.js'),
        'js/services': resolve(__dirname, 'private_html/js/services.js'),
        'js/articles': resolve(__dirname, 'private_html/js/articles.js'),
        'js/contact': resolve(__dirname, 'private_html/js/contact.js'),
        'js/author': resolve(__dirname, 'private_html/js/author.js'),
        'js/syntax-highlighter': resolve(__dirname, 'private_html/js/syntax-highlighter.js'),
        // Article JavaScript entry points
        'js/articles/claude-code-custom-commands-cc-commands': resolve(__dirname, 'private_html/js/articles/claude-code-custom-commands-cc-commands.js'),
        'js/articles/fedora-42-breakthrough-features': resolve(__dirname, 'private_html/js/articles/fedora-42-breakthrough-features.js'),
        'js/articles/legacy-php-modernization': resolve(__dirname, 'private_html/js/articles/legacy-php-modernization.js'),
        'js/articles/ansible-php-infrastructure': resolve(__dirname, 'private_html/js/articles/ansible-php-infrastructure.js'),
        'js/articles/proxmox-vs-cloud': resolve(__dirname, 'private_html/js/articles/proxmox-vs-cloud.js'),
        'js/articles/high-performance-php': resolve(__dirname, 'private_html/js/articles/high-performance-php.js'),
        'js/articles/mysql-performance-php': resolve(__dirname, 'private_html/js/articles/mysql-performance-php.js'),
        'js/articles/scalable-php-apis': resolve(__dirname, 'private_html/js/articles/scalable-php-apis.js'),
        'js/articles/ai-enhanced-php-development': resolve(__dirname, 'private_html/js/articles/ai-enhanced-php-development.js'),
        // Article JavaScript entry points
        'js/articles/claude-code-custom-commands-cc-commands': resolve(__dirname, 'private_html/js/articles/claude-code-custom-commands-cc-commands.js'),
        'js/articles/fedora-42-breakthrough-features': resolve(__dirname, 'private_html/js/articles/fedora-42-breakthrough-features.js'),
        'js/articles/legacy-php-modernization': resolve(__dirname, 'private_html/js/articles/legacy-php-modernization.js'),
        'js/articles/ansible-php-infrastructure': resolve(__dirname, 'private_html/js/articles/ansible-php-infrastructure.js'),
        'js/articles/proxmox-vs-cloud': resolve(__dirname, 'private_html/js/articles/proxmox-vs-cloud.js'),
        'js/articles/high-performance-php': resolve(__dirname, 'private_html/js/articles/high-performance-php.js'),
        'js/articles/mysql-performance-php': resolve(__dirname, 'private_html/js/articles/mysql-performance-php.js'),
        'js/articles/scalable-php-apis': resolve(__dirname, 'private_html/js/articles/scalable-php-apis.js'),
        'js/articles/ai-enhanced-php-development': resolve(__dirname, 'private_html/js/articles/ai-enhanced-php-development.js'),
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
            { src: 'private_html/images/*', dest: 'public_html/images' }
          ],
          hook: 'writeBundle'
        }),
        removeHtmlComments()
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