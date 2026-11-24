/**
 * ESLint wrapper - lints files with the eslint.config.js of the checkout this
 * script lives in, whatever the caller's working directory.
 *
 * The hooks daemon's validate_eslint_on_write handler runs it after every
 * TypeScript write as `tsx scripts/eslint-wrapper.ts <file> --max-warnings 0 --human`.
 * In a worktree (untracked/worktrees/<name>/) it resolves that worktree's own
 * config, so a file is linted against the rules of the branch it belongs to.
 *
 * Usage:
 *   npx tsx scripts/eslint-wrapper.ts [paths...] [--max-warnings N] [--human | --json]
 *
 * Exit codes: 0 clean, 1 lint errors or too many warnings, 2 bad arguments.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ESLint } from 'eslint';

export interface WrapperOptions {
  targets: string[];
  /** -1 means no limit, matching ESLint's own CLI default. */
  maxWarnings: number;
  format: 'stylish' | 'json';
}

function parseMaxWarnings(raw: string | undefined): number {
  const value = Number(raw);
  if (raw === undefined || raw === '' || !Number.isInteger(value) || value < -1) {
    throw new Error(`--max-warnings needs a whole number, got "${raw ?? ''}"`);
  }
  return value;
}

export function parseWrapperArgs(argv: readonly string[]): WrapperOptions {
  const targets: string[] = [];
  let maxWarnings = -1;
  let format: WrapperOptions['format'] = 'stylish';

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? '';
    if (arg === '--max-warnings') {
      i++;
      maxWarnings = parseMaxWarnings(argv[i]);
    } else if (arg.startsWith('--max-warnings=')) {
      maxWarnings = parseMaxWarnings(arg.slice('--max-warnings='.length));
    } else if (arg === '--human') {
      format = 'stylish';
    } else if (arg === '--json') {
      format = 'json';
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      targets.push(arg);
    }
  }

  return { targets: targets.length > 0 ? targets : ['.'], maxWarnings, format };
}

async function main(): Promise<number> {
  let options: WrapperOptions;
  try {
    options = parseWrapperArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const checkoutRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  // warnIgnored: false, so a file the config deliberately ignores is not
  // reported as a warning and failed under --max-warnings 0.
  const eslint = new ESLint({ cwd: checkoutRoot, warnIgnored: false });
  const results = await eslint.lintFiles(
    options.targets.map(target => path.resolve(process.cwd(), target))
  );

  const formatter = await eslint.loadFormatter(options.format);
  const output = await formatter.format(results);
  if (output) console.log(output);

  const errors = results.reduce((sum, result) => sum + result.errorCount, 0);
  const warnings = results.reduce((sum, result) => sum + result.warningCount, 0);
  const tooManyWarnings = options.maxWarnings >= 0 && warnings > options.maxWarnings;
  if (tooManyWarnings) {
    console.error(`ESLint found too many warnings (maximum: ${options.maxWarnings}).`);
  }
  return errors > 0 || tooManyWarnings ? 1 : 0;
}

const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.exitCode = await main();
}
