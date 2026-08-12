/**
 * RSS Feed Generator
 *
 * Generates dist/feed.xml from the SSR bundle's article data. Summary-only
 * (title/link/description) rather than full content — article `content`
 * strings still contain unresolved {{SNIPPET:...}} placeholders at this
 * point (resolved at render time by ArticleContent.tsx), so embedding raw
 * content here would leak literal placeholder text into the feed.
 *
 * Usage: node scripts/generate-feed.mjs
 * (Run after: vite build && vite build --ssr && prerender && generate-sitemap)
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const serverDir = resolve(__dirname, '../dist-server');

const SITE_URL = 'https://ltscommerce.dev';
const SITE_TITLE = 'LTS Commerce: Joseph Edmonds';
const SITE_DESCRIPTION =
  'Articles on PHP, infrastructure automation, databases, agentic delivery governance, and TypeScript.';

// Import the SSR bundle (same pattern as generate-sitemap.mjs)
const { getAllArticles } = await import(`${serverDir}/entry-server.js`);

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const articles = [...getAllArticles()].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const buildDate = new Date().toUTCString();

const items = articles.map(article => {
  const link = `${SITE_URL}/articles/${article.id}`;
  const pubDate = new Date(article.date).toUTCString();

  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
});

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-gb</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

writeFileSync(resolve(distDir, 'feed.xml'), feed);
console.log(`Generated feed.xml with ${articles.length} items`);
