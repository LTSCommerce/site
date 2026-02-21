/**
 * SSG Prerender Script
 *
 * Renders all routes to static HTML files so GitHub Pages can serve them
 * on direct URL navigation without 404s.
 *
 * Usage: node scripts/prerender.mjs
 * (Run after: vite build && vite build --ssr src/entry-server.tsx --outDir dist-server)
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const serverDir = resolve(__dirname, '../dist-server');

// Import the SSR bundle (built by: vite build --ssr src/entry-server.tsx --outDir dist-server)
const { render, getRoutes } = await import(`${serverDir}/entry-server.js`);

// Read the Vite-built index.html template
const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

const routes = getRoutes();
console.log(`Pre-rendering ${routes.length} routes...`);

let successCount = 0;
let errorCount = 0;

for (const route of routes) {
  try {
    const html = render(route);
    const output = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    // / → dist/index.html, /about → dist/about/index.html
    const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
    const outPath = resolve(distDir, `.${routePath}`);

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, output);
    console.log(`  ✓ ${route}`);
    successCount++;
  } catch (err) {
    console.error(`  ✗ ${route} — ${err instanceof Error ? err.message : String(err)}`);
    errorCount++;
  }
}

console.log(`\nPre-rendering complete: ${successCount} succeeded, ${errorCount} failed.`);
if (errorCount > 0) {
  process.exit(1);
}
