#!/usr/bin/env node
/**
 * Generate sitemap.xml from all HTML files in public_html/
 * Runs after EJS processing to ensure all HTML files are generated
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '../..');

const PUBLIC_DIR = join(__dirname, 'public_html');

// Load site config to get base URL
const siteConfigPath = join(__dirname, 'private_html/data/site.json');
const siteConfig = JSON.parse(await readFile(siteConfigPath, 'utf8'));
const HOSTNAME = siteConfig.baseUrl;

// Files/directories to exclude from sitemap
const EXCLUDE_PATTERNS = [
  '404.html',
  'articles-dynamic.html', // Dynamic version, exclude from sitemap
  /^\./, // Hidden files
];

/**
 * Recursively find all HTML files in a directory
 */
async function findHtmlFiles(dir, baseDir = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(fullPath, baseDir)));
    } else if (entry.name.endsWith('.html')) {
      const relativePath = relative(baseDir, fullPath);

      // Check if file should be excluded
      const shouldExclude = EXCLUDE_PATTERNS.some(pattern => {
        if (typeof pattern === 'string') {
          return relativePath === pattern || entry.name === pattern;
        }
        return pattern.test(relativePath) || pattern.test(entry.name);
      });

      if (!shouldExclude) {
        files.push(relativePath);
      }
    }
  }

  return files;
}

/**
 * Generate sitemap.xml content
 */
function generateSitemapXml(files) {
  const urls = files
    .map(file => {
      // Convert file path to URL path (forward slashes, strip .html for clean URLs)
      const urlPath = file.replace(/\\/g, '/').replace(/index\.html$/, '');

      // Determine priority and changefreq based on path
      let priority = '0.8';
      let changefreq = 'weekly';

      if (urlPath === 'index.html' || urlPath === '') {
        priority = '1.0';
        changefreq = 'daily';
      } else if (urlPath.startsWith('articles/')) {
        priority = '0.9';
        changefreq = 'monthly';
      } else if (urlPath.startsWith('articles')) {
        // Articles listing pages
        priority = '0.85';
        changefreq = 'weekly';
      }

      const url = urlPath === 'index.html' ? HOSTNAME : `${HOSTNAME}/${urlPath}`;

      return `  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${HOSTNAME}/sitemap.xml`;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🔧 Generating sitemap.xml and robots.txt...\n');

    // Find all HTML files
    const htmlFiles = await findHtmlFiles(PUBLIC_DIR);
    console.log(`Found ${htmlFiles.length} HTML files`);

    // Generate and write sitemap
    const sitemapXml = generateSitemapXml(htmlFiles);
    const sitemapPath = join(PUBLIC_DIR, 'sitemap.xml');
    await writeFile(sitemapPath, sitemapXml, 'utf8');
    console.log(`✓ Generated: ${relative(__dirname, sitemapPath)}`);

    // Generate and write robots.txt
    const robotsTxt = generateRobotsTxt();
    const robotsPath = join(PUBLIC_DIR, 'robots.txt');
    await writeFile(robotsPath, robotsTxt, 'utf8');
    console.log(`✓ Generated: ${relative(__dirname, robotsPath)}`);

    console.log(`\n✅ Sitemap and robots.txt generation completed!`);
    console.log(`📊 ${htmlFiles.length} URLs in sitemap`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
