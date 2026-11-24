import { describe, it, expect } from 'vitest';

import { parseWrapperArgs } from './eslint-wrapper';

describe('parseWrapperArgs', () => {
  it('defaults to unlimited warnings and human-readable output', () => {
    expect(parseWrapperArgs(['src/'])).toEqual({
      targets: ['src/'],
      maxWarnings: -1,
      format: 'stylish',
    });
  });

  it('reads the hooks-daemon invocation shape', () => {
    expect(parseWrapperArgs(['src/pages/Home.tsx', '--max-warnings', '0', '--human'])).toEqual({
      targets: ['src/pages/Home.tsx'],
      maxWarnings: 0,
      format: 'stylish',
    });
  });

  it('accepts the --max-warnings=N form and --json', () => {
    expect(parseWrapperArgs(['--json', '--max-warnings=3', 'a.ts', 'b.ts'])).toEqual({
      targets: ['a.ts', 'b.ts'],
      maxWarnings: 3,
      format: 'json',
    });
  });

  it('lints the whole project when no target is given', () => {
    expect(parseWrapperArgs([]).targets).toEqual(['.']);
  });

  it('rejects a non-numeric --max-warnings value', () => {
    expect(() => parseWrapperArgs(['--max-warnings', 'lots'])).toThrow(/--max-warnings/);
  });

  it('rejects an unknown flag rather than passing it to ESLint as a path', () => {
    expect(() => parseWrapperArgs(['--fix-everything', 'a.ts'])).toThrow(/Unknown option/);
  });
});
