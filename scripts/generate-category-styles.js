#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Load categories data
const categoriesPath = path.join(projectRoot, 'private_html/data/categories.json');
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

// Generate CSS
let css = `/* Auto-generated category styles - DO NOT EDIT MANUALLY */
/* Generated from private_html/data/categories.json */

`;

for (const [key, category] of Object.entries(categories)) {
  css += `.article-category.${key} {
    background-color: ${category.backgroundColor};
    color: ${category.textColor};
}

`;
}

// Write to file
const outputPath = path.join(projectRoot, 'private_html/css/category-styles.css');
fs.writeFileSync(outputPath, css);

console.log(`✓ Generated category styles: ${outputPath}`);