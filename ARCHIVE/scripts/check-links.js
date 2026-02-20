#!/usr/bin/env node

/**
 * Link checker for article URLs
 * Extracts and validates all external links
 */

import https from 'https';
import http from 'http';

const urls = [
    'https://github.com/features/copilot',
    'https://techcrunch.com/2025/07/30/github-copilot-crosses-20-million-all-time-users/',
    'https://www.secondtalent.com/resources/github-copilot-statistics/',
    'https://www.anthropic.com/claude',
    'https://www.cursor.com/',
    'https://arxiv.org/abs/2508.14727',
    'https://en.wikipedia.org/wiki/Large_language_model',
    'https://openai.com/index/gpt-4o-system-card/',
    'https://www.llama.com/',
    'https://github.com/OpenCoder-llm/OpenCoder-8B',
    'https://owasp.org/www-community/attacks/Path_Traversal',
    'https://www.qodo.ai/reports/state-of-ai-code-quality/',
    'https://www.sonarqube.org/',
    'https://blog.pragmaticengineer.com/software-engineer-jobs-five-year-low/',
    'https://codeconductor.ai/blog/future-of-junior-developers-ai/',
    'https://www.wheresyoured.at/why-everybody-is-losing-money-on-ai/',
    'https://altersquare.io/cursor-github-copilot-claude-ai-coding-tool-comparison/',
    'https://www.anthropic.com/',
    'https://getdx.com/blog/ai-coding-assistant-pricing/',
    'https://en.wikipedia.org/wiki/Data_transfer_object',
    'https://en.wikipedia.org/wiki/Create,_read,_update_and_delete',
    'https://psalm.dev/',
    'https://www.gitclear.com/ai_assistant_code_quality_2025_research'
];

function checkUrl(url) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.get(url, { timeout: 10000 }, (res) => {
            const status = res.statusCode;
            if (status >= 200 && status < 400) {
                resolve({ url, status, ok: true });
            } else {
                resolve({ url, status, ok: false, error: `HTTP ${status}` });
            }
        });

        req.on('error', (error) => {
            resolve({ url, status: 0, ok: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 0, ok: false, error: 'Timeout' });
        });
    });
}

async function checkAll() {
    console.log('Checking links...\n');

    const results = await Promise.all(urls.map(checkUrl));

    const broken = results.filter(r => !r.ok);
    const working = results.filter(r => r.ok);

    if (broken.length > 0) {
        console.log('❌ BROKEN LINKS:\n');
        broken.forEach(({ url, error }) => {
            console.log(`  ${url}`);
            console.log(`    Error: ${error}\n`);
        });
    }

    console.log(`\n✅ Working: ${working.length}`);
    console.log(`❌ Broken: ${broken.length}`);

    process.exit(broken.length > 0 ? 1 : 0);
}

checkAll();
