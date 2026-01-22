#!/usr/bin/env node
/**
 * Article Migration Script
 *
 * Extracts article metadata and content from legacy EJS templates
 * and formats them for the React articles.ts file.
 *
 * Usage: node scripts/migrate-article.js <article-file-path>
 */

import { readFile } from 'fs/promises';
import { basename } from 'path';

async function extractArticleData(filePath) {
  const content = await readFile(filePath, 'utf-8');

  // Extract metadata from EJS template (handle both single and double quotes, including escaped quotes)
  const titleMatch = content.match(/articleTitle:\s*["']((?:[^"'\\]|\\.)*)["']/);
  const descriptionMatch = content.match(/articleDescription:\s*["']((?:[^"'\\]|\\.)*)["']/);
  const dateMatch = content.match(/articleDate:\s*["']([^"']+)["']/);
  const categoryMatch = content.match(/articleCategory:\s*["']([^"']+)["']/);
  const readingTimeMatch = content.match(/articleReadingTime:\s*['"]?(\d+)['"]?/);
  const subredditMatch = content.match(/articleSubreddit:\s*["']([^"']+)["']/);

  // Extract content between articleContent: ` and closing `
  const contentMatch = content.match(/articleContent:\s*`\s*([\s\S]*?)\s*`\s*\}\)/);

  if (!titleMatch || !descriptionMatch || !dateMatch || !categoryMatch || !contentMatch) {
    throw new Error('Failed to extract required article metadata');
  }

  const slug = basename(filePath, '.ejs');
  const title = titleMatch[1];
  const description = descriptionMatch[1];
  const date = dateMatch[1];
  const category = categoryMatch[1];
  const readingTime = readingTimeMatch ? readingTimeMatch[1] : '5';
  const subreddit = subredditMatch ? subredditMatch[1] : 'programming';
  const articleContent = contentMatch[1].trim();

  // Generate TypeScript article object
  return {
    id: slug,
    title,
    description,
    date,
    category,
    readingTime: parseInt(readingTime, 10),
    subreddit,
    content: articleContent,
  };
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node scripts/migrate-article.js <article-file-path>');
    process.exit(1);
  }

  try {
    const articleData = await extractArticleData(filePath);

    // Output formatted TypeScript object
    console.log('  {');
    console.log(`    id: '${articleData.id}',`);
    console.log(`    title: '${articleData.title}',`);
    console.log(`    description:`);
    console.log(`      '${articleData.description}',`);
    console.log(`    date: '${articleData.date}',`);
    console.log(`    category: CATEGORIES.${articleData.category}.id,`);
    console.log(`    readingTime: ${articleData.readingTime},`);
    console.log(`    author: 'Joseph Edmonds',`);
    console.log(`    tags: [],`);
    console.log(`    subreddit: '${articleData.subreddit}',`);
    console.log(`    content: \``);
    console.log(articleData.content);
    console.log(`    \`,`);
    console.log('  },');

  } catch (error) {
    console.error('Error migrating article:', error.message);
    process.exit(1);
  }
}

main();
