// Modern syntax highlighting with Highlight.js
(function() {
  'use strict';
  
  // Load Highlight.js - more reliable than Prism.js
  function loadHighlightJS() {
    // Load CSS theme
    const hlCSS = document.createElement('link');
    hlCSS.rel = 'stylesheet';
    hlCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
    document.head.appendChild(hlCSS);
    
    // Load main Highlight.js
    const hlScript = document.createElement('script');
    hlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    hlScript.onload = function() {
      console.log('✓ Highlight.js loaded successfully');
      
      // Initialize highlighting immediately
      setTimeout(processSyntaxHighlighting, 100);
    };
    hlScript.onerror = function() {
      console.error('✗ Failed to load Highlight.js, using fallback');
      setTimeout(processSyntaxHighlighting, 100);
    };
    document.head.appendChild(hlScript);
  }
  
  function processSyntaxHighlighting() {
    // Process all code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
      // Get both textContent and innerHTML to handle entities properly
      let content = block.innerHTML;
      
      // First decode common HTML entities
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
        
      // Use browser's built-in HTML entity decoder as fallback
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const decodedContent = tempDiv.textContent || tempDiv.innerText || content;
      
      // Only update textContent if we don't already have clean content
      // This preserves the original formatting for Highlight.js
      const code = decodedContent.trim();
      
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
      
      // Highlight with Highlight.js if available
      if (typeof hljs !== 'undefined') {
        try {
          // Convert language names to hljs equivalents
          const hlLang = getHLJSLanguage(language);
          
          // Highlight the element
          hljs.highlightElement(block);
          console.log(`✓ Highlighted code block with language: ${language} (${hlLang})`);
        } catch (error) {
          console.warn(`Failed to highlight code block (${language}):`, error);
          // Apply fallback styling
          if (language === 'php' && code.includes('<?php')) {
            applyBasicPhpStyling(block);
          }
        }
      } else {
        // Fallback for when hljs isn't loaded
        if (language === 'php' && code.includes('<?php')) {
          applyBasicPhpStyling(block);
        }
      }
    });
  }
  
  // Convert language names to Highlight.js equivalents
  function getHLJSLanguage(language) {
    const langMap = {
      'php': 'php',
      'javascript': 'javascript',
      'bash': 'bash',
      'yaml': 'yaml',
      'sql': 'sql',
      'json': 'json',
      'nginx': 'nginx',
      'css': 'css',
      'html': 'xml'
    };
    return langMap[language] || language;
  }
  
  // Basic PHP syntax styling as fallback
  function applyBasicPhpStyling(block) {
    let content = block.innerHTML;
    
    // Apply basic PHP syntax highlighting
    content = content
      .replace(/(&lt;\?php|&lt;\?)/g, '<span style="color: #ff6b35;">&lt;?php</span>')
      .replace(/(public|private|protected|function|class|interface|namespace|use|return|if|else|foreach|for|while|try|catch|finally|throw|new|extends|implements|const|static|final|readonly)/g, '<span style="color: #ff6b35;">$1</span>')
      .replace(/(\$\w+)/g, '<span style="color: #50fa7b;">$1</span>')
      .replace(/(\/\/.*|#.*)/g, '<span style="color: #6272a4;">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6272a4;">$1</span>')
      .replace(/('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g, '<span style="color: #f1fa8c;">$1</span>')
      .replace(/(-&gt;|\:\:)/g, '<span style="color: #ff79c6;">$1</span>');
    
    block.innerHTML = content;
    console.log('✓ Applied basic PHP styling');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHighlightJS);
  } else {
    loadHighlightJS();
  }
})();