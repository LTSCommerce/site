# Fact check: plan 001 closure (2026-11-24)

Scope: claims added by the 001 diff (status flip, Closure entry, Phase 6-8 reconciliation was covered by the 2026-11-20 check and is not repeated).

## REFUTED

None.

## Claims

| #   | Claim                                                                           | Verdict           | Evidence                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | The React site was merged into main in `e4dd9ac` (2026-02-20)                   | VERIFIED          | `git show -s e4dd9ac`: "2026-02-20 Merge react-migration: Complete React/Vite migration", two parents, `git merge-base --is-ancestor e4dd9ac main` true.                 |
| 2   | ...and has been live since                                                      | UNVERIFIABLE-HERE | Needs a live-site or deploy-history check. `.github/workflows/ci.yml:55-57` uploads `./dist` as a Pages artifact, which is consistent but is not proof of deployment.    |
| 3   | The contact-form backend shipped under Plan 003 (`85b422e1`)                    | VERIFIED          | `85b422e1` 2026-02-20 "Plan 003: Contact form via Google Apps Script": adds google-apps-script/Code.gs, SETUP.md, rewrites src/pages/Contact.tsx. Ancestor of `e4dd9ac`. |
| 4   | Test tooling shipped under Plan 006 (`a1b09e25`)                                | VERIFIED          | `a1b09e25` "Plan 006: Add Vitest testing infrastructure": vitest.config.ts, src/test-utils/{index.tsx,setup.ts}, package.json.                                           |
| 5   | ...and Plan 011 (`02b6648`)                                                     | VERIFIED          | `02b6648` "Plan 011 Phase 4": adds e2e/pages.spec.ts, playwright.config.ts, Vitest smoke tests, wires ts-qa into ci.yml (commit message).                                |
| 6   | Go-live was tracked and finished in Plan 010                                    | VERIFIED          | CLAUDE/Plan/010-go-live-react-migration exists. Its own completion is partly open (see the 010 report: flowbite-react claim refuted there).                              |
| 7   | How to add articles and pages is now in the project CLAUDE.md                   | VERIFIED          | CLAUDE.md:149 "### Adding New Articles", CLAUDE.md:315 "### Adding New Pages".                                                                                           |
| 8   | Remaining unticked boxes in Phases 8-10 and Success Criteria were left unticked | VERIFIED          | The diff leaves Visual Testing and later boxes unticked.                                                                                                                 |

## Notes

- Plan 011 lives in CLAUDE/Plan/Completed/011-ts-qa-ci-package, not the Plan root.
