// Modern Prism.js setup for syntax highlighting
import Prism from 'prismjs';

// Import language components
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-nginx.js';

// Import Prism CSS theme
import 'prismjs/themes/prism-tomorrow.css';

// Configure Prism
Prism.manual = true;

// Auto-highlight code blocks on page load
document.addEventListener('DOMContentLoaded', () => {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    // Get raw HTML content and decode entities
    let content = block.innerHTML;
    
    // Decode HTML entities thoroughly
    content = content
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
    
    // Set cleaned content
    block.textContent = content.trim();
    
    const code = block.textContent;
    
    // Auto-detect language
    let language = 'php';
    if (code.includes('<?php')) {
      language = 'php';
    } else if (code.includes('#!/bin/bash') || code.includes('apt install') || code.includes('systemctl')) {
      language = 'bash';
    } else if (code.includes('---') && code.includes('name:')) {
      language = 'yaml';
    } else if (code.includes('SELECT') || code.includes('CREATE TABLE')) {
      language = 'sql';
    } else if (code.includes('server {') || code.includes('location')) {
      language = 'nginx';
    } else if (code.startsWith('{') || code.startsWith('[')) {
      language = 'json';
    }
    
    // Add language class
    block.classList.add(`language-${language}`);
    
    // Highlight with Prism
    try {
      Prism.highlightElement(block);
    } catch (error) {
      console.warn('Failed to highlight code block:', error);
    }
  });
});

export default Prism;