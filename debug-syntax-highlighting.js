#!/usr/bin/env node

import { chromium } from 'playwright';
import { readFileSync } from 'fs';

async function debugSyntaxHighlighting() {
  console.log('🔍 Starting syntax highlighting debugging...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });
  
  const page = await context.newPage();
  
  // Enable console logging to see JavaScript errors
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warn') {
      console.log(`🚨 Console ${type.toUpperCase()}: ${msg.text()}`);
    } else {
      console.log(`📝 Console: ${msg.text()}`);
    }
  });
  
  // Listen for JavaScript errors
  page.on('pageerror', err => {
    console.log('💥 Page Error:', err.message);
  });
  
  try {
    // Test 1: Load an article page from the built version
    console.log('\n📄 Testing article page with syntax highlighting...');
    
    // Use the local preview server
    const articleUrl = 'http://localhost:4173/articles/ai-enhanced-php-development.html';
    
    await page.goto(articleUrl, { waitUntil: 'networkidle' });
    
    // Wait a bit for any async JavaScript to load
    await page.waitForTimeout(3000);
    
    // Take screenshot of the whole page
    await page.screenshot({ 
      path: 'debug-full-page.png', 
      fullPage: true 
    });
    console.log('📸 Full page screenshot saved as debug-full-page.png');
    
    // Check if Prism.js loaded
    const prismLoaded = await page.evaluate(() => {
      return typeof window.Prism !== 'undefined';
    });
    console.log(`🎨 Prism.js loaded: ${prismLoaded}`);
    
    // Check for syntax highlighter script
    const syntaxHighlighterLoaded = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(script => script.src.includes('syntax-highlighter'));
    });
    console.log(`📜 Syntax highlighter script found: ${syntaxHighlighterLoaded}`);
    
    // Find all code blocks and check their state
    const codeBlocks = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('pre code'));
      return blocks.map((block, index) => {
        const computedStyle = window.getComputedStyle(block);
        return {
          index,
          className: block.className,
          hasLanguageClass: block.className.includes('language-'),
          textContent: block.textContent.substring(0, 50) + '...',
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          innerHTML: block.innerHTML.substring(0, 100) + '...'
        };
      });
    });
    
    console.log('\n🔤 Code blocks found:');
    codeBlocks.forEach(block => {
      console.log(`  Block ${block.index}:`);
      console.log(`    Class: ${block.className}`);
      console.log(`    Has language class: ${block.hasLanguageClass}`);
      console.log(`    Background: ${block.backgroundColor}`);
      console.log(`    Color: ${block.color}`);
      console.log(`    Content: ${block.textContent}`);
      console.log(`    HTML: ${block.innerHTML}`);
      console.log('');
    });
    
    // Take screenshot of first code block
    if (codeBlocks.length > 0) {
      const firstCodeBlock = await page.locator('pre code').first();
      await firstCodeBlock.screenshot({ path: 'debug-code-block.png' });
      console.log('📸 First code block screenshot saved as debug-code-block.png');
    }
    
    // Check network requests for Prism.js CDN
    const networkLogs = [];
    page.on('response', response => {
      if (response.url().includes('prism') || response.url().includes('cdnjs')) {
        networkLogs.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Wait a bit more to capture any late-loading resources
    await page.waitForTimeout(2000);
    
    console.log('\n🌐 Network requests for Prism.js:');
    networkLogs.forEach(log => {
      console.log(`  ${log.status} ${log.statusText}: ${log.url}`);
    });
    
    // Check if HTML entities are still present
    const hasHtmlEntities = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('pre code'));
      return blocks.some(block => 
        block.innerHTML.includes('&lt;') || 
        block.innerHTML.includes('&gt;') ||
        block.innerHTML.includes('&amp;')
      );
    });
    console.log(`🏷️  HTML entities still present: ${hasHtmlEntities}`);
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await browser.close();
  }
}

// Run the debug script
debugSyntaxHighlighting().catch(console.error);