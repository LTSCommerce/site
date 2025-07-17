#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, 'public_html', 'articles');
const codeSnippetsDir = path.join(__dirname, 'code-snippets');

// Map file extensions to language identifiers
const extensionToLanguage = {
    '.php': 'php',
    '.js': 'javascript',
    '.sh': 'bash',
    '.bash': 'bash',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.sql': 'sql',
    '.json': 'json',
    '.conf': 'nginx',
    '.nginx': 'nginx'
};

function getLanguageFromExtension(filename) {
    const ext = path.extname(filename);
    return extensionToLanguage[ext] || 'text';
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function embedCodeSnippets(htmlContent, articleName) {
    const snippetDir = path.join(codeSnippetsDir, articleName);
    
    if (!fs.existsSync(snippetDir)) {
        return htmlContent;
    }
    
    // Find all placeholders like <!-- code: filename.php -->
    return htmlContent.replace(/<!--\s*code:\s*([^\s]+?)\s*-->/g, (match, filename) => {
        const filePath = path.join(snippetDir, filename.trim());
        
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  Code snippet not found: ${filePath}`);
            return `<pre><code>// Code snippet not found: ${filename}</code></pre>`;
        }
        
        try {
            const code = fs.readFileSync(filePath, 'utf8');
            const language = getLanguageFromExtension(filename);
            const escapedCode = escapeHtml(code);
            
            console.log(`✓ Embedded ${filename} (${language}) into ${articleName}`);
            
            return `<pre><code class="language-${language}">${escapedCode}</code></pre>`;
        } catch (error) {
            console.error(`✗ Error reading ${filename}:`, error.message);
            return `<pre><code>// Error reading code snippet: ${filename}</code></pre>`;
        }
    });
}

function processArticleFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const articleName = path.basename(filePath, '.html');
        const updatedContent = embedCodeSnippets(content, articleName);
        
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`✓ Updated ${path.basename(filePath)}`);
            return 1;
        }
        
        return 0;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Embedding code snippets into articles...\n');
    
    if (!fs.existsSync(articlesDir)) {
        console.error('❌ Articles directory not found:', articlesDir);
        process.exit(1);
    }
    
    const files = fs.readdirSync(articlesDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(articlesDir, file));
    
    let totalUpdated = 0;
    
    for (const file of files) {
        totalUpdated += processArticleFile(file);
    }
    
    if (totalUpdated > 0) {
        console.log(`\n🎉 Updated ${totalUpdated} article(s) with embedded code snippets!`);
    } else {
        console.log('\n✓ No articles needed code snippet updates.');
    }
}

main();