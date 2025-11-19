#!/usr/bin/env node

/**
 * CI-friendly link checker for article URLs
 * Extracts links from EJS templates and validates them
 */

import https from 'https';
import http from 'http';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Known false positives - sites that block bots but work for humans
const FALSE_POSITIVE_DOMAINS = [
    'en.wikipedia.org',
    'wikipedia.org',
    'openai.com'
];

function extractLinksFromEJS(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const linkRegex = /href="(https?:\/\/[^"]+)"/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }

    return [...new Set(links)]; // Deduplicate
}

function getAllArticleLinks() {
    const articlesDir = 'private_html/articles';
    const files = readdirSync(articlesDir)
        .filter(f => f.endsWith('.ejs') && !f.startsWith('_'));

    const allLinks = new Map(); // URL -> [files that use it]

    files.forEach(file => {
        const filePath = join(articlesDir, file);
        const links = extractLinksFromEJS(filePath);

        links.forEach(link => {
            if (!allLinks.has(link)) {
                allLinks.set(link, []);
            }
            allLinks.get(link).push(file);
        });
    });

    return allLinks;
}

function isFalsePositiveDomain(url) {
    try {
        const domain = new URL(url).hostname;
        return FALSE_POSITIVE_DOMAINS.some(fp => domain.includes(fp));
    } catch {
        return false;
    }
}

function checkUrl(url) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        const options = {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0; +https://ltscommerce.com)'
            }
        };

        const req = protocol.get(url, options, (res) => {
            const status = res.statusCode;

            if (status >= 200 && status < 400) {
                resolve({ url, status, ok: true, category: 'success' });
            } else if (status === 403 && isFalsePositiveDomain(url)) {
                resolve({ url, status, ok: true, category: 'likely-ok', warning: 'Bot protection (probably OK)' });
            } else if (status >= 300 && status < 400) {
                resolve({ url, status, ok: true, category: 'redirect', warning: `Redirects to ${res.headers.location}` });
            } else {
                resolve({ url, status, ok: false, category: 'error', error: `HTTP ${status}` });
            }
        });

        req.on('error', (error) => {
            resolve({ url, status: 0, ok: false, category: 'error', error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 0, ok: false, category: 'warning', error: 'Timeout (may be temporary)' });
        });
    });
}

async function checkAll() {
    console.log('🔗 Checking article links...\n');

    const linkMap = getAllArticleLinks();
    const totalLinks = linkMap.size;

    console.log(`Found ${totalLinks} unique links across ${readdirSync('private_html/articles').filter(f => f.endsWith('.ejs') && !f.startsWith('_')).length} articles\n`);

    const results = await Promise.all(
        Array.from(linkMap.keys()).map(checkUrl)
    );

    const errors = results.filter(r => r.category === 'error');
    const warnings = results.filter(r => r.category === 'warning' || r.category === 'likely-ok');
    const redirects = results.filter(r => r.category === 'redirect');
    const success = results.filter(r => r.category === 'success');

    if (errors.length > 0) {
        console.log('❌ BROKEN LINKS:\n');
        errors.forEach(({ url, error }) => {
            console.log(`  ${url}`);
            console.log(`    Error: ${error}`);
            console.log(`    Used in: ${linkMap.get(url).join(', ')}\n`);
        });
    }

    if (warnings.length > 0) {
        console.log('⚠️  WARNINGS (may be false positives):\n');
        warnings.forEach(({ url, warning, error }) => {
            console.log(`  ${url}`);
            console.log(`    Note: ${warning || error}`);
            console.log(`    Used in: ${linkMap.get(url).join(', ')}\n`);
        });
    }

    if (redirects.length > 0) {
        console.log('🔀 REDIRECTS (consider updating):\n');
        redirects.forEach(({ url, warning }) => {
            console.log(`  ${url}`);
            console.log(`    ${warning}`);
            console.log(`    Used in: ${linkMap.get(url).join(', ')}\n`);
        });
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ Working: ${success.length}`);
    console.log(`  🔀 Redirects: ${redirects.length}`);
    console.log(`  ⚠️  Warnings: ${warnings.length}`);
    console.log(`  ❌ Broken: ${errors.length}`);

    // Exit with error only for critical breaks
    if (errors.length > 0) {
        console.log('\n❌ Link check failed - broken links found');
        process.exit(1);
    } else if (warnings.length > 0 || redirects.length > 0) {
        console.log('\n⚠️  Link check passed with warnings');
        process.exit(0);
    } else {
        console.log('\n✅ All links OK!');
        process.exit(0);
    }
}

checkAll();
