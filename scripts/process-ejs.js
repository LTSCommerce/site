#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('🔧 Processing EJS templates...\n');

// Load global data
let siteData = {};
let navigationData = {};
let articlesData = [];

try {
  const siteDataPath = path.join(projectRoot, 'private_html/data/site.json');
  const navDataPath = path.join(projectRoot, 'private_html/data/navigation.json');
  const articlesPath = path.join(projectRoot, 'private_html/js/articles.js');

  if (fs.existsSync(siteDataPath)) {
    siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
  }
  
  if (fs.existsSync(navDataPath)) {
    navigationData = JSON.parse(fs.readFileSync(navDataPath, 'utf8'));
  }

  // Load articles data from existing articles.js if available
  if (fs.existsSync(articlesPath)) {
    const articlesContent = fs.readFileSync(articlesPath, 'utf8');
    const articlesMatch = articlesContent.match(/const articles = (\[[\s\S]*?\]);/);
    if (articlesMatch) {
      articlesData = JSON.parse(articlesMatch[1]);
    }
  }

  console.log('✓ Loaded site data');
  console.log('✓ Loaded navigation data');
  console.log(`✓ Loaded ${articlesData.length} articles`);
} catch (error) {
  console.warn('Warning: Could not load some data files:', error.message);
}

// Helper functions for templates
const helpers = {
  currentYear: new Date().getFullYear(),
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  },
  isActive: (currentPage, targetPage) => currentPage === targetPage,
  articleUrl: (slug) => `/articles/${slug}.html`,
  truncate: (text, length = 150) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
  articlesByCategory: (articles, category) => {
    return articles.filter(article => article.category === category);
  },
  recentArticles: (articles, limit = 5) => {
    return articles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
};

// Global template data
const templateData = {
  site: siteData,
  navigation: navigationData,
  articles: articlesData,
  ...helpers
};

async function processEjsFiles() {
  // Find all EJS files in pages directory
  const ejsFiles = await glob('private_html/pages/**/*.ejs', { cwd: projectRoot });
  
  if (ejsFiles.length === 0) {
    console.log('No EJS files found to process');
  } else {
    for (const ejsFile of ejsFiles) {
      const fullPath = path.join(projectRoot, ejsFile);
      const relativePath = path.relative(path.join(projectRoot, 'private_html/pages'), fullPath);
      const outputPath = path.join(
        projectRoot, 
        'private_html', 
        relativePath.replace('.ejs', '.html')
      );

      try {
        console.log(`Processing: ${ejsFile} → ${path.relative(projectRoot, outputPath)}`);
        
        // Read template
        const template = fs.readFileSync(fullPath, 'utf8');
        
        // Process with EJS
        const html = ejs.render(template, templateData, {
          filename: fullPath,
          views: [path.join(projectRoot, 'private_html/templates')],
          rmWhitespace: true
        });

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write processed HTML
        fs.writeFileSync(outputPath, html);
        console.log(`✓ Generated: ${path.relative(projectRoot, outputPath)}`);
        
      } catch (error) {
        console.error(`✗ Error processing ${ejsFile}:`, error.message);
        process.exit(1);
      }
    }
  }
  
  // Process static article HTML files and convert them to use templates
  await processStaticArticles();
}

async function processStaticArticles() {
  const articleFiles = await glob('private_html/articles/*.html', { cwd: projectRoot });
  
  if (articleFiles.length === 0) {
    console.log('No static article files to convert');
    return;
  }

  console.log(`\nConverting ${articleFiles.length} static articles to use templates...`);
  
  for (const articleFile of articleFiles) {
    const fullPath = path.join(projectRoot, articleFile);
    const fileName = path.basename(articleFile, '.html');
    
    try {
      // Read the static article HTML
      const staticHtml = fs.readFileSync(fullPath, 'utf8');
      
      // Extract article metadata from HTML comments
      const metaMatch = staticHtml.match(/<!--\s*ARTICLE_META:\s*([\s\S]*?)\s*-->/);
      let category = 'general';
      let readingTime = 5;
      
      if (metaMatch) {
        const metaContent = metaMatch[1];
        const categoryMatch = metaContent.match(/category:\s*(\w+)/);
        const timeMatch = metaContent.match(/readingTime:\s*(\d+)/);
        if (categoryMatch) category = categoryMatch[1];
        if (timeMatch) readingTime = parseInt(timeMatch[1]);
      }
      
      // Extract article content (everything between <main> and </main>)
      const mainContentMatch = staticHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
      if (!mainContentMatch) {
        console.warn(`Could not extract content from ${articleFile}`);
        continue;
      }
      
      const mainContent = mainContentMatch[1];
      
      // Extract just the content sections, excluding the article header
      // Look for content after the first </header> tag within the article
      let articleContent;
      
      // Find all content after the article header ends
      const afterHeaderMatch = mainContent.match(/<\/header>\s*([\s\S]*)/);
      if (afterHeaderMatch) {
        let contentAfterHeader = afterHeaderMatch[1];
        
        // Remove the closing </article> tag at the end if present
        contentAfterHeader = contentAfterHeader.replace(/<\/article>\s*$/, '');
        
        // Remove any duplicate article containers that might have been nested
        contentAfterHeader = contentAfterHeader.replace(/<article[^>]*>[\s\S]*?<header[^>]*>[\s\S]*?<\/header>\s*/, '');
        
        articleContent = contentAfterHeader.trim();
      } else {
        // Fallback: use all main content
        articleContent = mainContent.trim();
      }
      
      // Extract title and description from meta tags
      const titleMatch = staticHtml.match(/<title>([^<]+)/);
      const descMatch = staticHtml.match(/<meta name="description" content="([^"]+)"/);
      
      const title = titleMatch ? titleMatch[1].replace(' | Joseph', '') : fileName;
      const description = descMatch ? descMatch[1] : '';
      
      // Find matching article data
      const articleData = articlesData.find(article => article.slug === fileName);
      const date = articleData ? articleData.date : new Date().toISOString().split('T')[0];
      
      // Generate article using template
      const html = ejs.render(`<%- include('./templates/layouts/article', {
        articleTitle: "${title}",
        articleDescription: "${description}", 
        articleDate: "${date}",
        articleCategory: "${category}",
        articleReadingTime: ${readingTime},
        articleContent: \`${articleContent}\`
      }) %>`, templateData, {
        filename: fullPath,
        views: [path.join(projectRoot, 'private_html')],
        rmWhitespace: true
      });

      // Write the templated version
      fs.writeFileSync(fullPath, html);
      console.log(`✓ Converted article: ${fileName}`);
      
    } catch (error) {
      console.error(`✗ Error converting ${articleFile}:`, error.message);
    }
  }
}

// Run the processor
try {
  await processEjsFiles();
  console.log('\n✅ EJS processing completed!');
} catch (error) {
  console.error('✗ EJS processing failed:', error);
  process.exit(1);
}