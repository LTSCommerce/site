# Plan 00015: SQL-first PHP article and concept-demo repo

**Status**: In Progress
**Created**: 2026-11-20
**Owner**: joseph
**Priority**: Medium

## Overview

A comprehensive article describing, in generic terms, a SQL-first persistence pattern for PHP:
a thin hand-written DB service (mockable through an interface and a SQL-keyed fake), one
class per query or prepared statement with the SQL as a constant, a typed fail-fast row
reader, typed column/table classes as the single source of truth for names, and static
analysis plus real-database checks that keep the PHP and the SQL honest.

The source is a private client library checked out under `untracked/repos/`. Its owner,
client and repository names must appear NOWHERE: not in the article, not in the demo repo,
not in commit messages, not in this plan. Everything is a fresh, sanitised rewrite.

A new public repo, `LongTermSupport/sql-first-php-demo`, carries a cut-down, heavily
commented concept demo (explicitly not a library) that the article links into.

## Goals

- Public demo repo: gateway interface + PDO implementation with connection-loss retry,
  typed `Row`/`RowSet`, typed columns + one table class, `Insert::row()`, a query class, a
  prepared-statement class, a DTO, a SQL-keyed fake, unit tests, real-DB integration tests,
  two custom PHPStan rules, and the two real-DB nets (schema sync, SQL-const prepare).
- CI on the demo repo (GitHub Actions, MySQL service) that runs PHPStan and both test tiers.
- Article in `src/data/articles.ts` (category PHP) using the snippet system and linking to
  specific files in the demo repo.

## Non-Goals

- Migrations, `verify()`, the shadow-table converter, catalogues, bundles. The owner scoped
  these out.
- War stories or first-hand incident claims. The framing is best practice for working with
  raw SQL directly (owner ruling).
- A publishable/installable library.

## Tasks

### Phase 1: Demo repo

- [x] ✅ **Task 1.1**: Write the demo code under `untracked/repos/sql-first-php-demo/`
- [x] ✅ **Task 1.2**: Tests (unit + integration) and PHPStan rules, passing locally against MariaDB
- [ ] 🔄 **Task 1.3**: GitHub Actions CI with a MySQL service (written; unproven until first push)
- [x] ✅ **Task 1.4**: Sanitisation audit (no client identifiers anywhere, including git history)
- [ ] ⬜ **Task 1.5**: Create the public repo and push. NEEDS EXPLICIT OWNER GO-AHEAD.

### Phase 2: Article

- [x] ✅ **Task 2.1**: Snippets in `code-snippets/sql-first-php/`
- [x] ✅ **Task 2.2**: Article object in `src/data/articles.ts`; build and check the HTML
- [x] ✅ **Task 2.3**: `article-reviewer` until READY TO PUBLISH
- [x] ✅ **Task 2.4**: `voice-pass` (one pass; it reported no further pass needed)
- [ ] 🔄 **Task 2.5**: Commit locally (push only with owner authorisation)

## Success Criteria

- [ ] Demo repo CI green on GitHub
- [ ] Every article link to the demo repo resolves
- [ ] A grep for the client's name across the article, snippets, demo repo and its history finds nothing
- [ ] Article passes `article-reviewer` and `voice-pass`

## Delivery & Milestones

- (pending)
