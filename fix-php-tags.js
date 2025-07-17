#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, 'public_html', 'articles');

function escapePhpTags(content) {
    // Replace <?php with HTML entity to avoid Vite parser issues
    return content.replace(/<\?php/g, '&lt;?php');
}

function processArticleFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = escapePhpTags(content);
        
        if (content !== fixedContent) {
            fs.writeFileSync(filePath, fixedContent);
            console.log(`✓ Fixed PHP tags in ${path.basename(filePath)}`);
            return 1;
        }
        
        return 0;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Escaping PHP opening tags for Vite compatibility...\n');
    
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
        console.log(`\n🎉 Fixed PHP tags in ${totalFixed} files!`);
    } else {
        console.log('\n✓ No PHP tags needed fixing.');
    }
}

main();