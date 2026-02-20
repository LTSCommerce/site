#!/usr/bin/env node

/**
 * Generate paginated article HTML pages
 * 
 * This script creates static HTML pages for article pagination:
 * - /articles.html (page 1)
 * - /articles/page-2.html
 * - /articles/page-3.html
 * - etc.
 * 
 * Each page contains a subset of articles for better performance and SEO.
 */

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log('🔧 Generating paginated article pages...\n');

// Configuration
const ARTICLES_PER_PAGE = 9;

// Load necessary data
function loadTemplateData() {
  const siteDataPath = path.join(projectRoot, 'private_html/data/site.json');
  const navDataPath = path.join(projectRoot, 'private_html/data/navigation.json');
  const categoriesPath = path.join(projectRoot, 'private_html/data/categories.json');
  const articlesPath = path.join(projectRoot, 'private_html/js/articles.js');
  const manifestPath = path.join(projectRoot, 'public_html/.vite/manifest.json');

  let siteData = {};
  let navigationData = {};
  let categoriesData = {};
  let articlesData = [];
  let viteManifest = {};

  if (fs.existsSync(siteDataPath)) {
    siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
  }
  
  if (fs.existsSync(navDataPath)) {
    navigationData = JSON.parse(fs.readFileSync(navDataPath, 'utf8'));
  }
  
  if (fs.existsSync(categoriesPath)) {
    categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  }

  if (fs.existsSync(articlesPath)) {
    const articlesContent = fs.readFileSync(articlesPath, 'utf8');
    const articlesMatch = articlesContent.match(/const articles = (\[[\s\S]*?\]);/);
    if (articlesMatch) {
      articlesData = JSON.parse(articlesMatch[1]);
    }
  }

  if (fs.existsSync(manifestPath)) {
    viteManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }

  return {
    site: siteData,
    navigation: navigationData,
    categories: categoriesData,
    articles: articlesData,
    viteManifest,
    // Helper functions
    currentYear: new Date().getFullYear(),
    deploymentTimestamp: new Date().toISOString(),
    formatDate: (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    isActive: (current, target) => current === target,
    truncate: (text, length) => text.length > length ? text.substring(0, length) + '...' : text,
    articleUrl: (slug) => `/articles/${slug}.html`,
    getAssetPath: (originalPath) => {
      if (!viteManifest || Object.keys(viteManifest).length === 0) {
        return originalPath;
      }
      
      let searchKey = originalPath;
      if (originalPath.startsWith('/css/')) {
        searchKey = originalPath.replace('/css/', 'css/').replace('.css', '');
      } else if (originalPath.startsWith('/js/')) {
        searchKey = originalPath.replace('/js/', 'js/').replace('.js', '');
      }
      
      for (const [key, asset] of Object.entries(viteManifest)) {
        if (key === searchKey || key.includes(searchKey)) {
          return '/' + asset.file;
        }
      }
      
      return originalPath;
    }
  };
}

// Generate pagination info
function generatePaginationInfo(articles, currentPage, articlesPerPage) {
  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
  const pageArticles = articles.slice(startIndex, endIndex);

  return {
    currentPage,
    totalPages,
    totalArticles,
    pageArticles,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    nextPage: currentPage + 1,
    previousPage: currentPage - 1
  };
}

// Generate pagination controls HTML
function generatePaginationControls(paginationInfo) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage, nextPage, previousPage } = paginationInfo;
  
  if (totalPages <= 1) return '';

  let controls = '<nav class="pagination-nav" aria-label="Article pagination">\n';
  controls += '  <ul class="pagination-list">\n';

  // Previous button
  if (hasPreviousPage) {
    const prevUrl = previousPage === 1 ? '/articles.html' : `/articles/page-${previousPage}.html`;
    controls += `    <li><a href="${prevUrl}" class="pagination-link pagination-prev" aria-label="Previous page">‹ Previous</a></li>\n`;
  }

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  // First page if not in range
  if (startPage > 1) {
    controls += '    <li><a href="/articles.html" class="pagination-link">1</a></li>\n';
    if (startPage > 2) {
      controls += '    <li><span class="pagination-ellipsis">…</span></li>\n';
    }
  }

  // Page numbers in range
  for (let page = startPage; page <= endPage; page++) {
    const url = page === 1 ? '/articles.html' : `/articles/page-${page}.html`;
    const isActive = page === currentPage;
    const activeClass = isActive ? ' pagination-current' : '';
    const ariaLabel = isActive ? ` aria-current="page"` : '';
    
    controls += `    <li><a href="${url}" class="pagination-link${activeClass}"${ariaLabel}>${page}</a></li>\n`;
  }

  // Last page if not in range
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      controls += '    <li><span class="pagination-ellipsis">…</span></li>\n';
    }
    controls += `    <li><a href="/articles/page-${totalPages}.html" class="pagination-link">${totalPages}</a></li>\n`;
  }

  // Next button
  if (hasNextPage) {
    const nextUrl = `/articles/page-${nextPage}.html`;
    controls += `    <li><a href="${nextUrl}" class="pagination-link pagination-next" aria-label="Next page">Next ›</a></li>\n`;
  }

  controls += '  </ul>\n';
  controls += '</nav>';

  return controls;
}

// Main generation function
function generatePaginatedPages() {
  const templateData = loadTemplateData();
  const { articles } = templateData;

  if (articles.length === 0) {
    console.log('No articles found, skipping pagination generation.');
    return;
  }

  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  console.log(`Generating ${totalPages} paginated pages for ${articles.length} articles...\n`);

  // Ensure output directory exists
  const outputDir = path.join(projectRoot, 'public_html/articles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate each page
  for (let page = 1; page <= totalPages; page++) {
    const paginationInfo = generatePaginationInfo(articles, page, ARTICLES_PER_PAGE);
    const paginationControls = generatePaginationControls(paginationInfo);

    // Prepare unique categories from ALL articles (build-time generation)
    const allCategories = [...new Set(articles.map(article => article.category))].sort();
    let categoryButtons = '';
    for (const category of allCategories) { 
      const categoryInfo = templateData.categories[category] || { label: category };
      categoryButtons += `<button class="filter-btn" data-category="${category}">${categoryInfo.label}</button>`;
    }

    // Create template data specific to this page
    const pageTemplateData = {
      ...templateData,
      pageArticles: paginationInfo.pageArticles,
      paginationInfo,
      paginationControls,
      categoryButtons,
      currentPage: page,
      totalPages
    };

    // Create the page content
    const pageContent = `
    <section class="page-hero">
        <div class="container">
            <h1 class="page-title">Technical Articles${page > 1 ? ` - Page ${page}` : ''}</h1>
            <p class="page-subtitle">Insights and tutorials on PHP development and infrastructure</p>
        </div>
    </section>

    <section class="articles-section">
        <div class="container">
            <div class="search-container">
                <input type="text" id="articleSearch" class="search-input" placeholder="Search articles...">
                <div class="search-filters">
                    <button class="filter-btn active" data-category="all">All</button>
                    ${categoryButtons}
                </div>
                <p class="filter-help">Use search or filters to switch to dynamic mode with all articles.</p>
            </div>

            <div class="pagination-top">
                ${paginationControls}
            </div>

            <div id="articlesGrid" class="articles-grid static-page" data-page="${page}">
                <!-- Static articles for page ${page} -->
                ${paginationInfo.pageArticles.map(article => `
                <article class="article-card" data-category="${article.category}">
                    <a href="${templateData.articleUrl(article.slug)}" class="article-card-link">
                        <div class="article-meta">
                            <span class="article-category article-category-${article.category}">${templateData.categories[article.category]?.label || article.category}</span>
                            <time class="article-date" datetime="${article.date}">${templateData.formatDate(article.date)}</time>
                        </div>
                        <h2 class="article-title">${article.title}</h2>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <div class="article-footer">
                            <span class="read-more">Read Article</span>
                            <span class="reading-time">~${article.readingTime || '5'} min read</span>
                        </div>
                    </a>
                </article>
                `).join('')}
            </div>

            <div class="pagination-bottom">
                ${paginationControls}
            </div>

            <div id="noResults" class="no-results" style="display: none;">
                <p>No articles found matching your search.</p>
            </div>

            <div id="loadingIndicator" class="loading-indicator" style="display: none;">
                <p>Loading articles...</p>
            </div>
        </div>
    </section>`;

    // Generate the full page HTML
    const pageHtml = `<%- include('../templates/layouts/base', {
  pageTitle: 'Articles${page > 1 ? ` - Page ${page}` : ''} - ' + site.title,
  pageDescription: 'Technical articles on PHP development, infrastructure, and backend systems${page > 1 ? ` - Page ${page}` : ''}',
  pageCss: 'articles',
  pageJs: 'articles',
  currentPage: 'articles',
  content: \`${pageContent}\`
}) %>`;

    // Process with EJS
    try {
      const html = ejs.render(pageHtml, pageTemplateData, {
        views: [path.join(projectRoot, 'private_html/templates')],
        rmWhitespace: false
      });

      // Determine output filename
      const filename = page === 1 ? 'articles.html' : `page-${page}.html`;
      const outputPath = page === 1 
        ? path.join(projectRoot, 'public_html/articles.html')
        : path.join(projectRoot, 'public_html/articles', filename);

      // Write the file
      fs.writeFileSync(outputPath, html);
      console.log(`✓ Generated: ${path.relative(projectRoot, outputPath)} (${paginationInfo.pageArticles.length} articles)`);
      
    } catch (error) {
      console.error(`✗ Error generating page ${page}:`, error.message);
      process.exit(1);
    }
  }

  console.log(`\n✅ Generated ${totalPages} paginated article pages!`);
  console.log(`📊 ${articles.length} total articles, ${ARTICLES_PER_PAGE} per page`);
}

// Run the generation
generatePaginatedPages();