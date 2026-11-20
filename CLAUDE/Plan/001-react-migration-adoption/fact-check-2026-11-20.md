# Fact check: 001-react-migration-adoption PLAN.md (2026-11-20)

Scope: claims added or changed by the diff.

## REFUTED

None.

## Notes (partially verified)

- The ESLint "React rules" and "TypeScript rules" claims are only partly verifiable. eslint.config.js:1 imports `projectEslintConfig` from `@longtermsupport/ts-qa-ci`. The rule sets live in that external package, which I did not inspect.

## Claims

| #   | Claim                                                                                                     | Verdict           | Evidence                                                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ARCHIVE/ holds private_html/, scripts/, vite.config.js, package.json, README.md                           | VERIFIED          | `ls ARCHIVE` lists exactly those five entries.                                                                                        |
| 2   | TypeScript interfaces in src/types/article.ts                                                             | VERIFIED          | The file exists and exports `Article` (line 52) and `ArticleHeroImage` (line 27).                                                     |
| 3   | Content format is an HTML string rendered via dangerouslySetInnerHTML                                     | VERIFIED          | src/components/article/ArticleContent.tsx:96. CLAUDE.md also says the `content` field holds HTML.                                     |
| 4   | All articles live in src/data/articles.ts, listed explicitly in SAMPLE_ARTICLES                           | VERIFIED          | articles.ts:8 `export const SAMPLE_ARTICLES: readonly Article[]`.                                                                     |
| 5   | Highlight.js plus the snippet system                                                                      | VERIFIED          | package.json:43 has highlight.js. src/data/snippets.ts exports `SNIPPETS`. src/components/article/ArticleContent.tsx references hljs. |
| 6   | Type-safe references via CATEGORIES ids and route helpers                                                 | VERIFIED          | categories.ts:8 `CATEGORIES`. routes.ts:61, 81 and 94 define `getArticleRoute`, `getCategoryRoute` and `getProjectRoute`.             |
| 7   | Tailwind CSS v4 is the styling system                                                                     | VERIFIED          | package.json has `tailwindcss ^4.1.18` and `@tailwindcss/postcss ^4.1.18`. src/styles has `@import 'tailwindcss'`.                    |
| 8   | playwright.config.ts exists                                                                               | VERIFIED          | The file is at the repo root. package.json has `@playwright/test`.                                                                    |
| 9   | e2e/pages.spec.ts exists                                                                                  | VERIFIED          | The file is tracked in git.                                                                                                           |
| 10  | Vitest page tests exist under src/pages                                                                   | VERIFIED          | Nine `*.test.tsx` files, including Home.test.tsx and ArticleDetail.test.tsx. vitest.config.ts exists.                                 |
| 11  | Strict mode compliance                                                                                    | VERIFIED          | tsconfig.json:17 has `"strict": true`. This is the config only. Compliance is not run (see #12).                                      |
| 12  | Zero type errors                                                                                          | UNVERIFIABLE-HERE | Needs `npx tsc --noEmit`. I did not run it. The CLAUDE.md build runs tsc as a gate.                                                   |
| 13  | ESLint violations fixed                                                                                   | UNVERIFIABLE-HERE | Needs an ESLint run.                                                                                                                  |
| 14  | ESLint React and TypeScript rules configured                                                              | PARTIAL           | eslint.config.js delegates to `@longtermsupport/ts-qa-ci`. The rule contents are external.                                            |
| 15  | Path aliases configured in tsconfig.json                                                                  | VERIFIED          | tsconfig.json:12-13 maps `"@/*": ["./src/*"]`. tsconfig.json has uncommitted modifications, but the alias is in the working tree.     |
| 16  | Decision 2 and Decision 3 sections exist (Decision 2 is referenced from Phase 6, Decision 3 from Phase 7) | VERIFIED          | PLAN.md:370 is "Decision 2: Article Content Format".                                                                                  |
| 17  | Phase 8 is partial: visual, cross-browser and mobile checks still open (Plan 006)                         | VERIFIED          | The diff leaves the Visual Testing items unticked. CLAUDE/Plan/006-testing-infrastructure/PLAN.md exists.                             |
| 18  | Phase 9 launch is tracked in Plan 010                                                                     | VERIFIED          | CLAUDE/Plan/010-go-live-react-migration/PLAN.md exists.                                                                               |
