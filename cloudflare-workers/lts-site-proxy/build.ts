#!/usr/bin/env -S npx tsx
/**
 * Build Cloudflare Worker from TypeScript Source
 *
 * Compiles worker.ts to standalone worker.js using esbuild.
 *
 * Usage:
 *   npm run build              # From lts-site-proxy directory
 *   tsx build.ts               # Direct execution
 *
 * Output:
 *   worker.js - Standalone Cloudflare Worker (ready to deploy)
 */

import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const WORKER_TS = resolve(import.meta.dirname, 'worker.ts');
const WORKER_JS = resolve(import.meta.dirname, 'worker.js');

async function buildWorker(): Promise<void> {
  console.log('Building Cloudflare Worker...\n');

  try {
    await build({
      entryPoints: [WORKER_TS],
      bundle: true,
      outfile: WORKER_JS,
      format: 'esm',
      target: 'es2020',
      platform: 'browser',
      minify: false,
      sourcemap: false,
      logLevel: 'info',
    });

    let workerCode = readFileSync(WORKER_JS, 'utf-8');
    const timestamp = new Date().toISOString();
    const header = `/**
 * Cloudflare Worker for LTS Commerce Site
 *
 * Built: ${timestamp}
 * Source: worker.ts
 *
 * IMPORTANT: This file is auto-generated. Do not edit directly.
 * To make changes, edit worker.ts and run: npm run build
 */

`;

    workerCode = header + workerCode;
    writeFileSync(WORKER_JS, workerCode, 'utf-8');

    console.log(`\nWorker built successfully: ${WORKER_JS}`);
    console.log(`File size: ${(workerCode.length / 1024).toFixed(2)} KB`);
    console.log(`\nReady to deploy to Cloudflare Workers`);

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log('Cloudflare Worker Build System\n');
  await buildWorker();
  console.log('\nBuild complete\n');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
