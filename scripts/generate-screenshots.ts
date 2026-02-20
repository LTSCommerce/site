#!/usr/bin/env -S npx tsx
/**
 * Screenshot Generator - LTS Commerce
 *
 * Generates screenshots of all site pages at mobile, tablet, and desktop viewports.
 * Auto-manages the Vite preview server (builds first, then serves, then cleans up).
 *
 * Usage:
 *   npm run screenshots                         # All pages, all devices
 *   npm run screenshots -- --pages=/            # Homepage only
 *   npm run screenshots -- --pages=/,/about     # Multiple pages
 *   npm run screenshots -- --devices=mobile     # Mobile only
 *   npm run screenshots -- --devices=mobile,desktop
 *
 * Output:
 *   untracked/screenshots/
 *     mobile/home/scroll-0.png
 *     tablet/home/scroll-0.png
 *     desktop/home/scroll-0.png
 *     manifest.json
 *
 * Adapted from EC site generate-screenshots.ts v3.0.0
 */

import { type ChildProcess, spawn } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Hard global timeout — kills the process if it runs over 3 minutes
const GLOBAL_TIMEOUT_MS = 3 * 60 * 1000;
setTimeout(() => {
  console.error(`\n⏱ Global timeout (${GLOBAL_TIMEOUT_MS / 1000}s) reached — forcing exit.`);
  void cleanup().then(() => process.exit(1));
}, GLOBAL_TIMEOUT_MS).unref();

// ============================================================================
// Configuration
// ============================================================================

const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
} as const;

type DeviceName = keyof typeof VIEWPORTS;

/** All pages available for screenshotting */
const ALL_PAGES: Array<{ path: string; name: string }> = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/articles', name: 'articles' },
];

const SCROLL_CONFIG = {
  step: 400,
  stabilisationDelay: 300,
  maxScreenshots: 20,
};

// Hard overall timeout — process exits if something hangs
const OVERALL_TIMEOUT_MS = 120_000;
setTimeout(() => {
  console.error(`\n❌ Hard timeout (${OVERALL_TIMEOUT_MS / 1000}s) reached — killing process`);
  process.exit(1);
}, OVERALL_TIMEOUT_MS).unref();

const PREVIEW_PORT = 4173;
const BASE_URL = `http://localhost:${PREVIEW_PORT}`;
const SCREENSHOT_DIR = join(ROOT, 'untracked', 'screenshots');

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseArgs(): { pages: string[]; devices: DeviceName[] } {
  const args = process.argv.slice(2);

  const pagesArg = args.find(a => a.startsWith('--pages='));
  const devicesArg = args.find(a => a.startsWith('--devices='));

  const pages = pagesArg
    ? pagesArg.replace('--pages=', '').split(',')
    : ALL_PAGES.map(p => p.path);

  const allDevices = Object.keys(VIEWPORTS) as DeviceName[];
  const devices = devicesArg
    ? (devicesArg.replace('--devices=', '').split(',') as DeviceName[]).filter(d =>
        allDevices.includes(d)
      )
    : allDevices;

  return { pages, devices };
}

function pathToName(path: string): string {
  const found = ALL_PAGES.find(p => p.path === path);
  if (found) return found.name;
  // Fallback: strip leading slash, replace remaining slashes with dashes
  return path.replace(/^\//, '').replace(/\//g, '-') || 'home';
}

// ============================================================================
// Server Management
// ============================================================================

let previewProcess: ChildProcess | null = null;
let cleanupInProgress = false;

async function cleanup() {
  if (cleanupInProgress) return;
  cleanupInProgress = true;

  if (previewProcess && !previewProcess.killed) {
    console.log('\n🛑 Stopping preview server...');
    previewProcess.kill('SIGTERM');
    await new Promise<void>(resolve => {
      const timeout = setTimeout(() => {
        previewProcess?.kill('SIGKILL');
        resolve();
      }, 2000);
      previewProcess?.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });
    previewProcess = null;
  }
}

process.on('exit', () => { void cleanup(); });
process.on('SIGINT', () => { void cleanup().then(() => process.exit(0)); });
process.on('SIGTERM', () => { void cleanup().then(() => process.exit(0)); });

async function buildSite(): Promise<void> {
  console.log('🔨 Building site...');
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'build'], {
      cwd: ROOT,
      stdio: 'inherit',
      shell: true,
    });
    proc.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`Build failed with exit code ${code}`));
    });
  });
}

async function startPreviewServer(): Promise<void> {
  console.log(`🌐 Starting preview server on port ${PREVIEW_PORT}...`);
  previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT)], {
    cwd: ROOT,
    stdio: 'pipe',
    shell: true,
  });

  previewProcess.on('exit', code => {
    if (!cleanupInProgress) {
      console.error(`\n❌ Preview server exited unexpectedly (code ${code})`);
      process.exit(1);
    }
  });

  // Poll HTTP until server responds — reliable across all Vite output formats
  await new Promise<void>((resolve, reject) => {
    const deadline = Date.now() + 30_000;
    const poll = () => {
      if (Date.now() > deadline) {
        reject(new Error('Preview server did not respond within 30s'));
        return;
      }
      fetch(BASE_URL)
        .then(() => resolve())
        .catch(() => setTimeout(poll, 300));
    };
    setTimeout(poll, 500);
  });

  console.log(`✅ Preview server ready at ${BASE_URL}`);
}

// ============================================================================
// Screenshot Generation
// ============================================================================

async function screenshotPage(
  page: import('playwright').Page,
  url: string,
  outputDir: string,
  deviceName: string
): Promise<string[]> {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for body.loaded (our fade-in class)
  await page.waitForFunction(() => document.body.classList.contains('loaded'), { timeout: 5000 }).catch(() => {
    // Not critical if it doesn't appear
  });

  // Wait for CSS animations to complete (ThreeColumnFeatures delays up to ~1.5s)
  await page.waitForTimeout(2000);

  const files: string[] = [];
  let scrollY = 0;
  let screenshotCount = 0;

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  while (scrollY <= pageHeight && screenshotCount < SCROLL_CONFIG.maxScreenshots) {
    await page.evaluate(y => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(SCROLL_CONFIG.stabilisationDelay);

    const filename = `scroll-${scrollY}.png`;
    const filepath = join(outputDir, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    files.push(filepath);
    console.log(`  📸 ${deviceName} scroll-${scrollY}px`);

    scrollY += SCROLL_CONFIG.step;
    screenshotCount++;
  }

  return files;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const { pages, devices } = parseArgs();

  const selectedPages = ALL_PAGES.filter(p => pages.includes(p.path));
  if (selectedPages.length === 0) {
    console.error(`❌ No matching pages found for: ${pages.join(', ')}`);
    console.error(`Available: ${ALL_PAGES.map(p => p.path).join(', ')}`);
    process.exit(1);
  }

  console.log(`📷 LTS Commerce Screenshot Generator`);
  console.log(`   Pages:   ${selectedPages.map(p => p.path).join(', ')}`);
  console.log(`   Devices: ${devices.join(', ')}`);
  console.log('');

  // Build and serve
  await buildSite();
  await startPreviewServer();

  // Launch browser
  const browser = await chromium.launch();
  const manifest: Record<string, unknown> = {
    generated: new Date().toISOString(),
    pages: selectedPages.map(p => p.path),
    devices,
    screenshots: [],
  };

  try {
    for (const device of devices) {
      const viewport = VIEWPORTS[device];
      console.log(`\n📱 ${viewport.name} (${viewport.width}×${viewport.height})`);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor,
        isMobile: viewport.isMobile,
        hasTouch: viewport.hasTouch,
      });

      const browserPage = await context.newPage();

      for (const sitePageConfig of selectedPages) {
        const pageName = pathToName(sitePageConfig.path);
        const outputDir = join(SCREENSHOT_DIR, device, pageName);
        await mkdir(outputDir, { recursive: true });

        console.log(`\n  📄 ${sitePageConfig.path} → untracked/screenshots/${device}/${pageName}/`);
        const url = `${BASE_URL}${sitePageConfig.path}`;
        const files = await screenshotPage(browserPage, url, outputDir, viewport.name);
        (manifest['screenshots'] as unknown[]).push({ device, page: sitePageConfig.path, files });
      }

      await context.close();
    }
  } finally {
    await browser.close();
    await cleanup();
  }

  // Write manifest
  await writeFile(join(SCREENSHOT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('\n✅ Screenshots complete!');
  console.log(`   Output: untracked/screenshots/`);
  console.log(`   Manifest: untracked/screenshots/manifest.json`);

  // Explicit exit — child processes can keep the event loop alive otherwise
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Screenshot generation failed:', err);
  void cleanup().then(() => process.exit(1));
});
