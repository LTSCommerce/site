# Article review: sql-first-php

Reviewer: article-reviewer. Scope: article object in `src/data/articles.ts` (lines 8-293), all 18 snippets in
`code-snippets/sql-first-php/`, the local demo checkout at `untracked/repos/sql-first-php-demo`, and the built
`dist/articles/sql-first-php/index.html` (it exists; all 18 snippets resolve, 17 php + 1 bash, no leftover `{{SNIPPET:`).
Register: `formal` (explicit).

## What I checked live, not just by reading

These were tested against the MariaDB 11.8 server and PHP 8.4.28 on this host, not just asserted:

- **Emulated prepares, PHP 8.4:** `SELECT CAST(42 AS SIGNED)` returns `int(42)`, not `"42"`. DECIMAL comes back as `"1.50"`. This contradicts the article and snippet (see M1).
- **Native prepares, repeated `:x`:** fails with `SQLSTATE[HY093]: Invalid parameter number`. The article's claim is right. It also proves the article's own `(:x IS NULL OR col = :x)` advice is wrong (see M2).
- **Server-side prepare:**
  - `SELECT nosuch FROM t` fails at prepare with 1054 Unknown column.
  - `SELECT a, COUNT(*) ... GROUP BY b` fails at prepare with 1055, but only once `ONLY_FULL_GROUP_BY` is in `sql_mode`, which the demo's factory sets.
  - So the article's prepare-check claims hold.
- **PHP casts:**
  - `(int)"18446744073709551615"` gives `9223372036854775807` silently. The claim is correct.
  - `(string)(float)"9999999999999.99"` gives `"10000000000000"`. So the DECIMAL(15,2) digit-loss claim holds in PHP practice, because string conversion uses `precision=14` (see m6).
- **PHPStan output:** I ran the demo's own PHPStan config on the `ShortcutQueryTest` body, with a namespace and use lines added. It reproduced `phpstan-output.txt` exactly: the same three errors, messages and identifiers, on lines 14, 15 and 17. Scratch file deleted afterwards.

Link check: every `blob/main/<path>` in the article exists in the checkout and is tracked by git:

- `src/Db/PdoDbService.php`, `src/Db/PdoConnectionFactory.php`
- `tests/Db/PdoDbServiceTest.php`
- `src/Stmt/AbstractPreparedStmt.php`
- `src/Result/Row.php`, `src/Result/RowSet.php`
- `src/Schema/Insert.php`
- `example/Product/ProductStatusCount.php`, `example/Product/CountProductsByStatusQuery.php`
- `src/Testing/FakeDbService.php`
- `tests/Support/RealDatabase.php`, `tests/Support/TableClassSchemaChecker.php`
- all three `phpstan/Rules/*.php`
- `phpstan.neon`, `.github/workflows/ci.yml`

`README.md` has `## Reading order`, so `#reading-order` resolves on GitHub. The README links back to
`https://ltscommerce.dev/articles/sql-first-php`, which matches `SITE_URL`.

No em or en dashes anywhere in the article, snippets or demo. No fourth-wall breaks. No meta-commentary.

---

## CRITICAL

None.

## MODERATE

FINDING \[MODERATE\]: The int-typing claim is outdated for PHP 8.1+. It is repeated in the article, two snippets and the demo.
Location: "Depending on the driver and on whether prepares are emulated, an INT can arrive as 42 or as "42"". In `row-decimal.php`: `// native prepares send ints` and `// emulated prepares send strings`.
Detail:

- Since PHP 8.1, pdo_mysql with mysqlnd returns native ints and floats under emulated prepares as well. I verified this on 8.4 (above).
- Strings now arrive only with `PDO::ATTR_STRINGIFY_FETCHES`, with libmysqlclient builds, or on PHP < 8.1. The demo requires PHP 8.4, so the "emulated prepares send strings" comment is wrong for its own platform.
- The same error appears in other places:
  - `fake-unit-test.php` ("rows shaped as PDO sends them: strings and nulls")
  - the FakeDbService docblock ("rows shaped exactly like PDO's (strings everywhere)")
  - the PdoConnectionFactory docblock, which implies ints happen only because emulation is off
- With the demo's own native-prepare connection, PDO sends `'id' => 3`, not `'3'`. So the fake's rows are the *legacy or stringified* shape, not "as PDO sends them".
  Fix: REPHRASE (article and snippet), and fix the demo docblocks to match.
  Suggested text (article): "Depending on the PHP version, the driver build and `PDO::ATTR_STRINGIFY_FETCHES`, an `INT` can arrive as `42` or as `"42"` (mysqlnd on PHP 8.1+ sends ints whether or not prepares are emulated)."
  Suggested snippet comments: `// what mysqlnd sends on PHP 8.1+` / `// STRINGIFY_FETCHES, libmysqlclient or older PHP send strings`.
  Suggested fake comment: "strings, as PDO sends them with STRINGIFY_FETCHES on; Row accepts either form".

FINDING \[MODERATE\]: The dynamic-query advice contradicts the article's own native-prepare rule.
Location: "a single statement that handles optional parameters with (:x IS NULL OR col = :x)-style conditions"
Detail: Earlier, the article correctly says a named placeholder cannot appear twice under native prepares. I confirmed that here: HY093. The demo runs native prepares, so this exact pattern fails on the reader's first try. A sharp reader will spot the contradiction.
Fix: REPHRASE.
Suggested text: "...with (:x IS NULL OR col = :x_again)-style conditions (two parameters bound to the same value, since native prepares will not reuse a name)..."

FINDING \[MODERATE\]: "Retrying a self-contained statement on a fresh connection is safe" is overstated for writes.
Location: "Retrying a self-contained statement on a fresh connection is safe, and long-running workers..."
Detail:

- Error 2013 ("Lost connection to MySQL server during query") can occur *after* the server has executed and auto-committed the statement.
- The demo retries `execute()` and `insert()` as well as reads, and matches '2013' and 'Lost connection'. So a non-idempotent write could be applied twice, for example `SET stock = stock + :delta` from the article's own AdjustStockStmt, or an INSERT.
- "Gone away" detected before sending (2006, broken pipe on send) is the genuinely safe case.
- The article is careful about the transaction subtlety but silent on this one, and calls the outside-transaction case "safe" outright.
  Fix: REPHRASE. Either qualify the claim, or have the demo retry only reads and pre-send failures.
  Suggested text: "Retrying a read, or a statement that never reached the server, on a fresh connection is safe... (A write whose connection dropped mid-query may already have committed, so a non-idempotent UPDATE or INSERT is only safe to retry if running it twice is harmless.)"

FINDING \[MODERATE\]: The rename walkthrough claims a guarantee the rules do not give.
Location: "Every hydration and every insert goes through the table class, and the rules guarantee nothing bypasses it"
Detail: By the article's own account, the rules let indirection through:

- `$row->int($var)` passes.
- `DbServiceInterface::query()` and `stream()` return raw arrays, and `$rows[0]['sale_price']` is not caught by any rule.
- Exempt classes are skipped by name.
- `SqlMustBeAClassConstantRule` is described as making the prepare check "complete rather than mostly complete", but variables pass, `Insert::row()` SQL is not prepare-checked, and `SqlConstantFinder` scans only `example/`.
  "Guarantee" and "complete" conflict with the later, honest paragraph on narrow rules.
  Fix: REPHRASE.
  Suggested text: "...and the rules stop the usual ways of bypassing it, so all of those follow." For the other sentence: "which is what makes the prepare check cover the application's SQL rather than most of it."

FINDING \[MODERATE\]: Several snippets labelled "Trimmed from" are rewrites, not trims.
Location: `fake-unit-test.php`, `row-decimal.php`, `create-product-command.php`, `with-retry.php`, `rename-drift-test.php`
Detail:

- `fake-unit-test.php`: the real test uses `[ProductTest::pdoRow()]` and asserts `'ANV-001' === $product->sku`. The snippet inlines the row and asserts `unitPrice === '149.90'`, which the real FindProductByIdQueryTest does not assert. That assertion lives in ProductTest.
- `row-decimal.php`: the real `int()` delegates to a private `toInt()`. The snippet inlines that logic, and uses literal regexes in place of the `self::DECIMAL` / `self::INTEGER` constants.
- `create-product-command.php`: it shows 5 of 9 columns, then `// ...` at the end. The real order puts description, status, salePrice and supplierId between them. The trailing SQL comment shows a 5-column INSERT the real class never produces.
- `with-retry.php`: the snippet's comment replaces the two logger calls with new prose that is not in the file.
- `rename-drift-test.php`: the second test's assertions are replaced by comments. The real test asserts `assertContains` / `assertStringContainsString`. The snippet's version has no assertion at all, so as shown it is a test that tests nothing.
  None of these change the meaning, but readers are told to click through and compare.
  Fix: REPHRASE the header comments where the snippet is a paraphrase ("Adapted from", or "Simplified from").
- In `rename-drift-test.php`, keep at least one real assertion line.
- In `fake-unit-test.php`, either assert `sku` as the real test does, or say "adapted from".

FINDING \[MODERATE\]: Possible internal-convention carry-overs in the demo. These need author confirmation against "The one rule".
Location (demo):

- `tests/Nets/` directory and the `SqlFirstDemo\Tests\Nets` namespace. These also appear in the README, in two docblocks, and in the article snippet header "Trimmed from tests/Nets/SqlConstantsPrepareTest.php".
- `$pinDepth` and "sections pinned to one connection" in PdoDbService.
- The `ProductTable::i()` singleton accessor.
  Detail:
- "Nets" is an unexplained, unusual proper-noun-like directory name. Nothing in the article or README says what a "Net" is. That reads like a term inherited from a source codebase rather than chosen for a public demo.
- "pin" terminology for transactions is similarly idiosyncratic. "Pinned" implies a more general mechanism than the transaction-only one that exists here.
- `::i()` is unusual but explained in the ProductTable docblock.
  I cannot tell from the public material whether these are client terms. If they are, they are leaks under the rule. If not, "Nets" still wants either a sentence of explanation or a self-explanatory name.
  Fix: REPHRASE / rename. For example, `tests/Checks/` (the article already calls these "check one" and "check two"), and `$transactionDepth`.

## MINOR

FINDING \[MINOR\]: The schema check accepts IntColumn over BIGINT UNSIGNED.
Location: the article says the check fails a column with "a type the PHP class cannot read". In `schema-check.php`, `INTEGER_TYPES` includes `bigint`, and the check ignores UNSIGNED in `COLUMN_TYPE`.
Detail: An `IntColumn` over `BIGINT UNSIGNED` passes the schema check, although the article says such values "stay as digit strings". Row::int would still throw at runtime on an overflowing value, so the risk is limited, but the claim is broader than the code.
Fix: REPHRASE (or reject `bigint unsigned` for IntColumn in the demo).

FINDING \[MINOR\]: The PHPStan output line numbers do not match the snippet as shown.
Location: `phpstan-output.txt` reports lines 14, 15 and 17. In `shortcut-query-test.php` the same lines are 10, 11 and 13.
Detail: The output is genuine. I reproduced it exactly, but only with `declare`, `namespace` and `use` lines present. Either add those four lines to the snippet, or renumber the output.
Fix: REWRITE the snippet header.

FINDING \[MINOR\]: "would compile" is loose.
Location: "if it were Stringable, "SELECT $column FROM ..." would compile"
Detail: Without `__toString` it also "compiles". It fails at runtime with "could not be converted to string", and PHPStan flags it.
Suggested text: "...would work, and pass static analysis, and a name would go into SQL..."

FINDING \[MINOR\]: The prepare-check scope is slightly overstated.
Location: "What it cannot prove is that ... the SQL in those constants is valid. For that you need the database"
Detail: A prepare proves the statement parses and resolves against the schema. It does not catch runtime errors, such as a subquery returning more than one row, data errors under strict mode, or wrong logic.
Suggested text: "...or that the SQL in those constants parses and matches the schema."

FINDING \[MINOR\]: The float precision explanation is subtly off.
Location: "Once a value has been through a float its original digits are not recoverable ... values near the top of a DECIMAL(15,2) column lose real digits"
Detail: A double holds any 15-significant-digit decimal recoverably (DBL_DIG = 15). The digits are lost because PHP's float-to-string conversion uses `precision=14`: `(string)(float)"9999999999999.99"` is `"10000000000000"`, which I verified. The conclusion is right, but the mechanism as stated is not.
Suggested text: "...and values near the top of a DECIMAL(15,2) column lose real digits as soon as PHP turns the float back into a string."

FINDING \[MINOR\]: Implied experience claims under the owner's no-war-stories ruling.
Location: "which catches a surprising number of mistakes on its own"; "one of those small things you only learn by tripping over it"
Detail: Neither is an explicit "I saw" claim, but both lean on unstated experience. The first is the stronger one: surprising to whom?
Suggested text: "...which catches a whole class of mistakes on its own"; "...which is easy to trip over". Or leave the second as is.

FINDING \[MINOR\]: Long sentences (over 35 words).
Location:

- The lead, sentence 2 (~45 words).
- The final paragraph: "Query classes, typed rows and a table class each help a little ... after a dozen people have worked on it" (~60 words, with a "which turn" whose subject is hard to find).
- The retry paragraph: "The new connection has no open transaction, so ... permanently applied" (~40 words).
  Fix: REPHRASE. Split each one. The voice pass may handle these.

FINDING \[MINOR\]: Generic headings.
Location: `<h2>Taking It Further</h2>`, `<h2>The Costs, Honestly</h2>`
Detail: "Taking It Further" would close any article unchanged. "Honestly" is a mild sincerity tell.
Suggested text: "What the Demo Leaves Out"; "What This Costs".

FINDING \[MINOR\]: Formulaic closer.
Location: "If you take one thing from this, I would suggest it is the combination rather than any single piece."
Fix: REPHRASE. For example: "The combination matters more than any single piece."

FINDING \[MINOR\]: The description is long for a meta description.
Location: the `description` field, about 330 characters.
Detail: It is not a duplicate of the lead, which is good. But it will be truncated in search results at around 155-160 characters. The final sentence, "With a heavily commented concept demo on GitHub.", is a fragment.
Fix: REPHRASE. Trim it to about 160 characters, or accept truncation.

FINDING \[MINOR\]: The demo uses American "while" in prose comments. The site convention is "whilst".
Location: `src/Db/PdoDbService.php` line 26 ("while the caller is told it failed"), `tests/Db/PdoDbServiceTest.php` line 108.
Detail: The article prose and snippets are clean. The `with-retry.php` snippet already says "whilst", which diverges from the file it claims to trim.
Fix: REPHRASE in the demo for consistency.

FINDING \[MINOR\]: The article's KILL description does not match the test.
Location: "which kills its own connection with KILL CONNECTION_ID() to prove it"
Detail: The test reads `SELECT CONNECTION_ID()` on the service's connection, then runs `KILL <id>` from a second, separate `rawPdo()` connection. "KILL CONNECTION_ID()" suggests a self-kill.
Suggested text: "...which reads its own CONNECTION_ID() and KILLs it from a second connection to prove it."

FINDING \[MINOR\]: The `phpstan-output.txt` path is not in the repo.
Location: "$ vendor/bin/phpstan analyse tests/Scratch" and "here is what the demo's PHPStan configuration says about it"
Detail: This is fine as an illustration, since `tests/Scratch` is not shipped. A reader who tries to reproduce it has no file to run against. Consider a sentence like "(drop it into tests/Scratch/ to try it)".
Fix: optional REPHRASE.

## On target="\_blank" rel="noopener"

The article has about 20 external GitHub links and none carries `target="_blank"`. The rest of `articles.ts` has 791
occurrences, and `ArticleDetail.tsx` uses `target="_blank" rel="noopener noreferrer"` for its own external links. That is
a clear house convention, so I recommend adding `target="_blank" rel="noopener"` to every GitHub link for consistency.
Matching ArticleDetail's `noopener noreferrer` would be the better choice. This is not a correctness issue. Modern browsers
imply `noopener` for `_blank`, and the readers most likely to click through to the code would arguably prefer to keep their
place in the article.

## Leak check (CONTRIBUTING-PROJECTS "The one rule")

The article and snippets are clean:

- no client, organisation, repo or plan names
- no internal incidents
- no hostnames, IPs or paths beyond the demo's own
- the domain is a generic product, anvil and bellows

The demo's single commit is authored `joseph <joseph@ltscommerce.dev>`, which is public site identity and fine. The demo
credentials (`demo` / `demo-root`) are throwaway CI values. The only items needing confirmation are the naming
carry-overs in the MODERATE finding above (`Nets`, `pinDepth`).

## First-person and war stories

Every first-person use is opinion or recommendation, which the formal register allows:

- "I want to be clear"
- "I should say up front"
- "I suspect"
- "I would draw your attention to"
- "I would happily reach for one"
- "the one I find most satisfying"
- "I don't think there is a perfect answer"
- "I would rather say so"
- "I would suggest"

No sentence claims Joseph did, saw or built something specific. The two borderline implied-experience phrases are listed
under MINOR.

## Verdict

NEEDS FIXES. There are no critical issues. Three technical MODERATEs should be fixed before publication: the PHP 8.1
int-typing claim, the `:x` reused placeholder contradiction, and retry safety for writes. Then make the call on snippet
faithfulness and the `Nets` / `pin` naming.

## Re-review (demo commit 25e9a32)

I re-read the whole article object, all the changed snippets and the changed demo files: PdoDbService, the
TableClassSchemaChecker unsigned guard, the PdoDbServiceTest case list, tests/Checks and the README.

Every MODERATE is resolved:

- **Int typing.** The article, the `row-decimal.php` comments and the fake comment now state the PHP 8.1+ mysqlnd
  behaviour correctly. This matches what I measured on PHP 8.4.
- **`:x` reuse.** Now `(:status IS NULL OR status = :status_value)`, with an explanation of the two names. It no longer
  contradicts the earlier `:required` note.
- **Retry safety.**
  - Reads are retryable and writes are not. In `withRetry` the `$retryable` flag is set from the call site:
    `query`/`stream` pass true, `execute`/`insert` pass false.
  - A dead handle is discarded in both paths, and `transactional()` discards it on connection loss.
  - The article prose matches the code. The new test `aWriteThatLosesItsConnectionIsReportedNotRepeated` exists, so
    "real-database tests for all three cases" is accurate.
- **Overclaims.** "Guarantee" and "complete" are softened, and a "strong nudge rather than a proof" sentence was added.
- **Snippet faithfulness.**
  - "Simplified from" and "Adapted from" labels are used where appropriate, and each now says what was simplified.
  - `create-product-command` shows all 9 columns in the real order, with the real INSERT.
  - `rename-drift-test` carries the real assertions.
  - `shortcut-query-test` now has its namespace and use lines, so lines 14, 15 and 17 match the output I reproduced.
- **Inherited vocabulary.** `Nets`, `pinDepth`/"pinned" and `::i()` are gone from the demo, its README and the snippets.
  The grep is clean.

The MINORs are resolved as well:

- KILL description, float mechanism, Stringable wording and prepare-check scope.
- BIGINT UNSIGNED guard, with a test.
- Headings, closer, lead split and description (~165 chars).
- Implied-experience phrases, "whilst" in the demo prose comments, and the tests/Scratch mention.
- `target="_blank" rel="noopener noreferrer"` on all 19 external links.

There are still no em dashes anywhere.

Remaining (MINOR, optional):

FINDING \[MINOR\]: One "prove" overclaim survives, and the new nudge sentence contradicts it.
Location: "Static analysis can prove that every PHP reference goes through the table class and that every statement lives in a constant."
Detail: Two paragraphs earlier, the article says the rules are "a strong nudge rather than a proof".
Suggested text: "Static analysis can keep PHP references going through the table class and statements in constants."

FINDING \[MINOR\]: The short-version paragraph is slightly strong.
Location: "Then the build makes those conventions true rather than hoped for"
Detail: This is acceptable as framing, but it sits a little awkwardly beside "nudge, not proof". Consider "enforced rather than hoped for".

Re-review verdict: **READY TO PUBLISH.** Nothing CRITICAL or MODERATE remains. The two MINORs are author's discretion.
