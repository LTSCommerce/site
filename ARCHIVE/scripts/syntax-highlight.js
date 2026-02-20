#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { load } from 'cheerio';
import Prism from 'prismjs';

// Load PHP language support
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-nginx.js';

console.log('🎨 Starting syntax highlighting process...');

// Find all HTML files
const htmlFiles = glob.sync('public_html/**/*.html');

let processedFiles = 0;
let processedCodeBlocks = 0;

htmlFiles.forEach(file => {
  console.log(`Processing: ${file}`);
  
  const content = readFileSync(file, 'utf8');
  const $ = load(content);
  
  let fileChanged = false;
  
  $('pre code').each((i, element) => {
    const $code = $(element);
    let codeContent = $code.html();
    
    // Decode HTML entities thoroughly
    codeContent = codeContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/---&gt;/g, '->')
      .replace(/&lt;!--/g, '<!--')
      .replace(/--&gt;/g, '-->')
      .replace(/&nbsp;/g, ' ')
      .replace(/&hellip;/g, '...')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–');
    
    // Clean up the content
    codeContent = codeContent.trim();
    
    // Detect language from existing class or auto-detect
    let language = 'php';
    const existingClasses = $code.attr('class') || '';
    const languageMatch = existingClasses.match(/language-(\w+)/);
    
    if (languageMatch) {
      language = languageMatch[1];
    } else {
      // Auto-detect language
      if (codeContent.includes('<?php') || codeContent.includes('declare(strict_types=1)')) {
        language = 'php';
      } else if (codeContent.includes('#!/bin/bash') || codeContent.includes('apt install') || codeContent.includes('systemctl') || codeContent.includes('git diff')) {
        language = 'bash';
      } else if (codeContent.includes('---') && codeContent.includes('name:')) {
        language = 'yaml';
      } else if (codeContent.includes('SELECT') || codeContent.includes('CREATE TABLE') || codeContent.includes('INSERT INTO')) {
        language = 'sql';
      } else if (codeContent.includes('server {') || codeContent.includes('location') || codeContent.includes('listen 80')) {
        language = 'nginx';
      } else if (codeContent.startsWith('{') || codeContent.startsWith('[')) {
        language = 'json';
      }
    }
    
    // Add language class
    $code.addClass(`language-${language}`);
    
    // Highlight with Prism
    try {
      if (Prism.languages[language]) {
        const highlighted = Prism.highlight(codeContent, Prism.languages[language], language);
        $code.html(highlighted);
        fileChanged = true;
        processedCodeBlocks++;
        console.log(`  ✓ Highlighted code block (${language})`);
      } else {
        // Language not available, just set clean text
        $code.text(codeContent);
        $code.addClass(`language-${language}`);
        fileChanged = true;
        console.log(`  ℹ Language ${language} not available, using plain text`);
      }
    } catch (error) {
      console.warn(`  ⚠ Failed to highlight code block (${language}): ${error.message}`);
      // Fallback: just set the plain text
      $code.text(codeContent);
      $code.addClass(`language-${language}`);
      fileChanged = true;
    }
  });
  
  if (fileChanged) {
    writeFileSync(file, $.html());
    processedFiles++;
    console.log(`  ✅ Updated ${file}`);
  }
});

console.log(`\n🎉 Syntax highlighting complete!`);
console.log(`📁 Processed ${processedFiles} files`);
console.log(`🎨 Highlighted ${processedCodeBlocks} code blocks`);