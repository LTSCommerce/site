#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Articles metadata mapping (from articles.js data)
const articlesMetadata = {
  'ai-enhanced-php-development': {
    title: "AI-Enhanced PHP Development: Tools and Workflows",
    description: "Modern PHP development enhanced with AI tools and workflows for increased productivity and code quality",
    category: "ai",
    date: "2024-12-10",
    readingTime: 10
  },
  'ansible-php-infrastructure': {
    title: "Ansible Automation for PHP Infrastructure", 
    description: "Complete guide to automating PHP infrastructure deployment and management using Ansible",
    category: "infrastructure",
    date: "2025-01-10", 
    readingTime: 15
  },
  'claude-code-custom-commands-cc-commands': {
    title: "Building Better Claude Code Workflows with CC-Commands",
    description: "Discover how the CC-Commands repository solves the pain points of managing custom Claude Code commands across multiple projects with elegant automation and intelligent synchronization.",
    category: "ai",
    date: "2025-07-18",
    readingTime: 8
  },
  'high-performance-php': {
    title: "High-Performance PHP: Optimization Strategies",
    description: "Advanced PHP optimization techniques for high-performance applications and systems",
    category: "php", 
    date: "2024-12-28",
    readingTime: 12
  },
  'legacy-php-modernization': {
    title: "Managing Legacy PHP: From Technical Debt to Modern Architecture", 
    description: "Strategies for modernizing legacy PHP codebases and managing technical debt effectively",
    category: "php",
    date: "2025-01-15",
    readingTime: 14
  },
  'mysql-performance-php': {
    title: "MySQL Performance Tuning for Complex PHP Applications",
    description: "Database optimization strategies specifically tailored for bespoke PHP systems with complex queries",
    category: "database",
    date: "2024-12-20", 
    readingTime: 12
  },
  'proxmox-vs-cloud': {
    title: "Proxmox vs Cloud: Why Private Infrastructure Wins",
    description: "Comparative analysis of Proxmox private cloud vs public cloud solutions for enterprise infrastructure",
    category: "infrastructure", 
    date: "2025-01-05",
    readingTime: 10
  },
  'scalable-php-apis': {
    title: "Building Scalable Backend APIs with Modern PHP",
    description: "Comprehensive guide to building scalable, maintainable PHP APIs using modern architecture patterns", 
    category: "php",
    date: "2024-12-15",
    readingTime: 16
  }
};

console.log('🔄 Restoring all articles as EJS templates...\n');

// Get list of article files from git
const articleFiles = [
  'ai-enhanced-php-development.html',
  'ansible-php-infrastructure.html', 
  'claude-code-custom-commands-cc-commands.html',
  'high-performance-php.html',
  'legacy-php-modernization.html',
  'mysql-performance-php.html',
  'proxmox-vs-cloud.html',
  'scalable-php-apis.html'
];

for (const articleFile of articleFiles) {
  const slug = path.basename(articleFile, '.html');
  const gitPath = `private_html/articles/${articleFile}`;
  
  console.log(`Processing: ${slug}`);
  
  try {
    // Extract HTML content from git
    const htmlContent = execSync(`git show 57033bb:"${gitPath}"`, { encoding: 'utf8' });
    
    // Extract main content
    const mainContentMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (!mainContentMatch) {
      console.warn(`Could not extract main content from ${articleFile}`);
      continue;
    }
    
    const mainContent = mainContentMatch[1];
    
    // Extract content after article header
    const afterHeaderMatch = mainContent.match(/<\/header>\s*([\s\S]*)/);
    let articleContent = '';
    
    if (afterHeaderMatch) {
      articleContent = afterHeaderMatch[1].trim();
      // Remove closing article tag
      articleContent = articleContent.replace(/<\/article>\s*$/, '');
      // Remove any duplicate article containers
      articleContent = articleContent.replace(/<article[^>]*>[\s\S]*?<header[^>]*>[\s\S]*?<\/header>\s*/, '');
    }
    
    // Get metadata
    const metadata = articlesMetadata[slug];
    if (!metadata) {
      console.warn(`No metadata found for ${slug}`);
      continue;
    }
    
    // Generate EJS template
    const ejsContent = `<%- include('../templates/layouts/article', {
  articleTitle: "${metadata.title}",
  articleDescription: "${metadata.description}",
  articleDate: "${metadata.date}",
  articleCategory: "${metadata.category}",
  articleReadingTime: ${metadata.readingTime},
  articleContent: \`
${articleContent}
  \`
}) %>`;
    
    // Write EJS file
    const ejsPath = path.join(projectRoot, 'private_html/articles', `${slug}.ejs`);
    fs.writeFileSync(ejsPath, ejsContent);
    
    console.log(`✓ Created: ${slug}.ejs`);
    
  } catch (error) {
    console.error(`✗ Error processing ${slug}:`, error.message);
  }
}

console.log('\n✅ All articles restored as EJS templates!');