/**
 * Sitemap & Robots.txt Generator
 *
 * Generates dist/sitemap.xml and dist/robots.txt from the SSR bundle's
 * route and article data.
 *
 * Usage: node scripts/generate-sitemap.mjs
 * (Run after: vite build && vite build --ssr && prerender)
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const serverDir = resolve(__dirname, '../dist-server');

const SITE_URL = 'https://ltscommerce.dev';

// Import the SSR bundle (same pattern as prerender.mjs)
const { getRoutes, getAllArticles } = await import(`${serverDir}/entry-server.js`);

// Build article id → date lookup
const articles = getAllArticles();
const articleDateMap = new Map();
for (const article of articles) {
  articleDateMap.set(article.id, article.date);
}

// Find the most recent article date (for /articles listing page)
const mostRecentArticleDate = articles.length > 0 ? articles[0].date : null;

// Today's date for static pages
const buildDate = new Date().toISOString().split('T')[0];

const routes = getRoutes();

// Filter out /errors/404
const sitemapRoutes = routes.filter(route => route !== '/errors/404');

// Build URL entries
const urlEntries = sitemapRoutes.map(route => {
  let priority;
  let changefreq;
  let lastmod;

  if (route === '/') {
    priority = '1.0';
    changefreq = 'daily';
    lastmod = buildDate;
  } else if (route === '/articles') {
    priority = '0.9';
    changefreq = 'daily';
    lastmod = mostRecentArticleDate || buildDate;
  } else if (route.startsWith('/articles/')) {
    const slug = route.replace('/articles/', '');
    priority = '0.8';
    changefreq = 'monthly';
    lastmod = articleDateMap.get(slug) || buildDate;
  } else {
    priority = '0.7';
    changefreq = 'monthly';
    lastmod = buildDate;
  }

  const loc = `${SITE_URL}${route}`;

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>
`;

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);
console.log(`Generated sitemap.xml with ${sitemapRoutes.length} URLs`);

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(resolve(distDir, 'robots.txt'), robotsTxt);
console.log('Generated robots.txt');
