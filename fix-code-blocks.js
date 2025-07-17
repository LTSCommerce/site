#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, 'public_html', 'articles');

function escapeCodeBlocks(content) {
    // Find all code blocks and escape problematic HTML-like syntax
    return content.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gs, (match, codeContent) => {
        let escaped = codeContent;
        
        // Escape < and > characters inside code blocks
        escaped = escaped
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // But preserve already escaped entities
            .replace(/&lt;(\/?)([a-z]+)&gt;/g, '<$1$2>') // Restore HTML tags like </code>
            .replace(/&lt;\?php/g, '&lt;?php') // Keep escaped PHP tags
            .replace(/&lt;&lt;&lt;/g, '&lt;&lt;&lt;'); // Escape heredoc syntax
        
        return `<pre><code${match.match(/<code([^>]*)>/)[1]}>${escaped}</code></pre>`;
    });
}

function processArticleFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = escapeCodeBlocks(content);
        
        if (content !== fixedContent) {
            fs.writeFileSync(filePath, fixedContent);
            console.log(`✓ Fixed code blocks in ${path.basename(filePath)}`);
            return 1;
        }
        
        return 0;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Escaping code blocks for Vite compatibility...\n');
    
    if (!fs.existsSync(articlesDir)) {
        console.error('❌ Articles directory not found:', articlesDir);
        process.exit(1);
    }
    
    const files = fs.readdirSync(articlesDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(articlesDir, file));
    
    let totalFixed = 0;
    
    for (const file of files) {
        totalFixed += processArticleFile(file);
    }
    
    if (totalFixed > 0) {
        console.log(`\n🎉 Fixed code blocks in ${totalFixed} files!`);
    } else {
        console.log('\n✓ No code blocks needed fixing.');
    }
}

main();