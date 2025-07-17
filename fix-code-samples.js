#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔧 Fixing corrupted code samples...');

// Find all HTML files
const htmlFiles = glob.sync('public_html/articles/*.html');

let fixedFiles = 0;
let totalReplacements = 0;

htmlFiles.forEach(file => {
  console.log(`Processing: ${file}`);
  
  let content = readFileSync(file, 'utf8');
  let replacements = 0;
  
  // Fix PHP opening tags
  const beforePhp = content;
  content = content.replace(/&lt;!--\?php/g, '<?php');
  if (content !== beforePhp) {
    replacements += (beforePhp.match(/&lt;!--\?php/g) || []).length;
  }
  
  // Fix arrow operators
  const beforeArrow = content;
  content = content.replace(/---&gt;/g, '->');
  if (content !== beforeArrow) {
    replacements += (beforeArrow.match(/---&gt;/g) || []).length;
  }
  
  // Fix other common PHP entities
  const beforeAmp = content;
  content = content.replace(/&amp;/g, '&');
  if (content !== beforeAmp && beforeAmp.includes('&amp;')) {
    replacements += (beforeAmp.match(/&amp;/g) || []).length;
  }
  
  // Fix less than and greater than in code blocks only
  content = content.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (match, codeContent) => {
    const fixed = codeContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    return match.replace(codeContent, fixed);
  });
  
  if (replacements > 0) {
    writeFileSync(file, content);
    fixedFiles++;
    totalReplacements += replacements;
    console.log(`  ✅ Fixed ${replacements} issues in ${file}`);
  } else {
    console.log(`  ✨ No issues found in ${file}`);
  }
});

console.log(`\n🎉 Fixed ${totalReplacements} issues across ${fixedFiles} files!`);