#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('🔧 Processing EJS templates...\n');

// Function to inject code snippets
function injectCodeSnippets(html) {
  // Find all snippet placeholders
  const snippetPattern = /{{SNIPPET:([^}]+)}}/g;
  
  return html.replace(snippetPattern, (match, snippetPath) => {
    const fullPath = path.join(projectRoot, 'code-snippets', snippetPath);
    
    try {
      // Read the snippet file
      let snippetContent = fs.readFileSync(fullPath, 'utf8');
      // Ensure snippet doesn't end with a newline (we'll add it in the template)
      snippetContent = snippetContent.trimEnd();
      // Return the snippet content
      return snippetContent;
    } catch (error) {
      console.warn(`⚠️  Could not find snippet: ${snippetPath}`);
      return match; // Return placeholder if snippet not found
    }
  });
}

// Helper function to resolve asset paths from Vite manifest
function getAssetPath(originalPath) {
  if (!viteManifest || Object.keys(viteManifest).length === 0) {
    return originalPath; // Fallback to original path if no manifest
  }
  
  // Convert path to manifest key format
  let searchKey = originalPath;
  if (originalPath.startsWith('/css/')) {
    searchKey = originalPath.replace('/css/', 'css/').replace('.css', '');
  } else if (originalPath.startsWith('/js/')) {
    searchKey = originalPath.replace('/js/', 'js/').replace('.js', '');
  }
  
  // Look for the asset in the manifest
  for (const [key, asset] of Object.entries(viteManifest)) {
    if (key === searchKey || key.includes(searchKey)) {
      return '/' + asset.file;
    }
  }
  
  return originalPath; // Fallback if not found
}

// Load global data
let siteData = {};
let navigationData = {};
let categoriesData = {};
let articlesData = [];
let viteManifest = {};

try {
  const siteDataPath = path.join(projectRoot, 'private_html/data/site.json');
  const navDataPath = path.join(projectRoot, 'private_html/data/navigation.json');
  const categoriesPath = path.join(projectRoot, 'private_html/data/categories.json');
  const articlesPath = path.join(projectRoot, 'private_html/js/articles.js');
  const manifestPath = path.join(projectRoot, 'public_html/.vite/manifest.json');

  if (fs.existsSync(siteDataPath)) {
    siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
  }
  
  if (fs.existsSync(navDataPath)) {
    navigationData = JSON.parse(fs.readFileSync(navDataPath, 'utf8'));
  }
  
  if (fs.existsSync(categoriesPath)) {
    categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  }

  // Load articles data from existing articles.js if available
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

  console.log('✓ Loaded site data');
  console.log('✓ Loaded navigation data');
  console.log('✓ Loaded categories data');
  console.log(`✓ Loaded ${articlesData.length} articles`);
  console.log('✓ Loaded Vite manifest');
} catch (error) {
  console.warn('Warning: Could not load some data files:', error.message);
}

// Helper functions for templates
const helpers = {
  currentYear: new Date().getFullYear(),
  deploymentTimestamp: new Date().toLocaleDateString('en-GB', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  },
  getAssetPath: getAssetPath,
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
  categories: categoriesData,
  articles: articlesData,
  ...helpers
};

async function processEjsFiles() {
  // Find all EJS files in pages directory
  const ejsFiles = await glob('private_html/pages/**/*.ejs', { cwd: projectRoot });
  
  // Also find article EJS files
  const articleEjsFiles = await glob('private_html/articles/**/*.ejs', { cwd: projectRoot });
  
  if (ejsFiles.length === 0) {
    console.log('No EJS files found to process');
  } else {
    for (const ejsFile of ejsFiles) {
      const fullPath = path.join(projectRoot, ejsFile);
      const relativePath = path.relative(path.join(projectRoot, 'private_html/pages'), fullPath);
      const outputPath = path.join(
        projectRoot, 
        'public_html', 
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
          rmWhitespace: false
        });

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Inject code snippets
        const finalHtml = injectCodeSnippets(html);
        
        // Write processed HTML
        fs.writeFileSync(outputPath, finalHtml);
        console.log(`✓ Generated: ${path.relative(projectRoot, outputPath)}`);
        
      } catch (error) {
        console.error(`✗ Error processing ${ejsFile}:`, error.message);
        process.exit(1);
      }
    }
  }
  
  // Process article EJS files
  if (articleEjsFiles.length > 0) {
    console.log(`\nProcessing ${articleEjsFiles.length} article templates...`);
    
    for (const articleFile of articleEjsFiles) {
      const fullPath = path.join(projectRoot, articleFile);
      const fileName = path.basename(articleFile, '.ejs');
      const outputPath = path.join(projectRoot, 'public_html/articles', fileName + '.html');
      
      try {
        console.log(`Processing article: ${articleFile} → ${path.relative(projectRoot, outputPath)}`);
        
        // Read and process the article template
        const template = fs.readFileSync(fullPath, 'utf8');
        
        // Process with EJS
        const html = ejs.render(template, templateData, {
          filename: fullPath,
          views: [path.join(projectRoot, 'private_html')],
          rmWhitespace: false
        });
        
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Inject code snippets
        const finalHtml = injectCodeSnippets(html);
        
        // Write processed HTML
        fs.writeFileSync(outputPath, finalHtml);
        console.log(`✓ Generated: ${path.relative(projectRoot, outputPath)}`);
        
      } catch (error) {
        console.error(`✗ Error processing article ${articleFile}:`, error.message);
        process.exit(1);
      }
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