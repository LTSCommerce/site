/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies make module boundaries meaningless and slow down builds.',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    // Without this, dependency-cruiser follows the FULL resolved graph into
    // node_modules and reports circular deps inside third-party packages' own
    // internals (e.g. zod, @testing-library) - real, but not this project's to fix.
    // Standard dependency-cruiser recommendation (its own --init default).
    doNotFollow: { path: 'node_modules' },
    // untracked/ holds Joseph's own local scratch clones of unrelated projects
    // (gitignored, not part of this repo's dependency graph) - one of them ships a
    // generated .ts file dependency-cruiser's parser chokes on entirely. dist/
    // dist-server/var are build output, not source.
    exclude: { path: '^(untracked|dist|dist-server|var)/' },
  },
};
