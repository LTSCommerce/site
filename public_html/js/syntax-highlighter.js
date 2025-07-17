// Simple client-side syntax highlighting without ES modules
(function() {
  'use strict';
  
  // Load Prism.js from CDN
  function loadPrism() {
    // Load main Prism.js
    const prismScript = document.createElement('script');
    prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    prismScript.onload = function() {
      // Load language components
      const languages = ['php', 'bash', 'yaml', 'sql', 'json', 'nginx'];
      let loadedCount = 0;
      
      languages.forEach(lang => {
        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
        script.onload = function() {
          loadedCount++;
          if (loadedCount === languages.length) {
            processSyntaxHighlighting();
          }
        };
        document.head.appendChild(script);
      });
    };
    document.head.appendChild(prismScript);
  }
  
  function processSyntaxHighlighting() {
    // Process all code blocks
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
      
      // Auto-detect language if not already set
      let language = 'php'; // default
      const existingClasses = block.className;
      const languageMatch = existingClasses.match(/language-(\w+)/);
      
      if (languageMatch) {
        language = languageMatch[1];
      } else {
        // Auto-detect language
        if (code.includes('<?php') || code.includes('declare(strict_types=1)')) {
          language = 'php';
        } else if (code.includes('#!/bin/bash') || code.includes('apt install') || code.includes('git diff')) {
          language = 'bash';
        } else if (code.includes('---') && code.includes('name:')) {
          language = 'yaml';
        } else if (code.includes('SELECT') || code.includes('CREATE TABLE') || code.includes('INSERT INTO')) {
          language = 'sql';
        } else if (code.includes('server {') || code.includes('location') || code.includes('listen 80')) {
          language = 'nginx';
        } else if (code.startsWith('{') || code.startsWith('[')) {
          language = 'json';
        }
        
        // Add language class
        block.className = `language-${language}`;
      }
      
      // Highlight with Prism if available
      if (typeof Prism !== 'undefined' && Prism.languages[language]) {
        try {
          Prism.highlightElement(block);
        } catch (error) {
          console.warn('Failed to highlight code block:', error);
        }
      }
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPrism);
  } else {
    loadPrism();
  }
})();