# Plan 011 — Phase 1 Concept-Extraction Report: Opus Review (Task 1.2)

**Verdict: READY FOR PHASE 2**

**Reviewer**: Opus review pass, 2026-07-10
**Reviewed**: `untracked/plan-011-phase1-concept-report.md` against Task 1.1's requirements and against the actual source in `untracked/repos/php-qa-ci` and `untracked/ec-site`.
**Provenance note**: this file cites the report's original `untracked/` path — the document itself was later moved into this plan folder as [`phase1-concept-report.md`](phase1-concept-report.md); there is no second, divergent copy left in `untracked/`.

## Summary

The report is solid, accurate, and complete. Every Task 1.1 research bullet is
covered: all eight php-qa-ci bullets (A.1–A.8) and all five ec-site bullets
(B.1–B.5), including the "catalogue all 57 rules, classify lift/adapt/drop"
requirement and all six named CDD deep-dive rules plus the tailwindcss-plugin
integration (B.2). The lift/adapt/drop classification is sound: I re-checked the
borderline `adapt` calls and the classification reasoning holds, with the
highest-risk item (`validate-routes-have-pages.js`) correctly flagged as
must-harden-before-lift.

I spot-checked six substantive claims against source and **all six verified true**:

1. `validate-routes-have-pages.js:398` really does `eval(\`(${routesMatch[1]})\`)\` — the report's central hardening flag is accurate, not speculative.
2. `cva()` appears in exactly one ec-site file (`src/components/ui/button.tsx`) — B.2's "single-component pilot, not a catalogue" finding is exact.
3. `no-html-in-pages.js` really has the two-tier prose system: LENIENT (`ProseSection`, all HTML) vs STRICT (`ArticleContent`/`ArticleCallout`, whitelist only), filename-gated to `src/pages/**`.
4. `detectReadOnly()` (functions.inc.bash:273) with the `QA_READONLY` → `GITHUB_ACTIONS=true` precedence is exactly as described in the A.2 table.
5. `CLAUDECODE=1` → CI mode is real (bin/qa:77,84; setConfig.inc.bash:95-96) — the load-bearing "Claude Code session = CI true / qaReadOnly false" regime is grounded in real code.
6. SensitiveParameter is an always-on pipeline tool with `useSensitiveParameterCheck=${:-1}` opt-out (opt-out, not opt-in) — A.6's estate-wide lesson is accurately sourced; `configDefaults/` really contains only `generic/`.

The report is also commendably honest about its own limits: it explicitly flags
the knip-vs-depcheck / markdown-link tool choice (Part C §2.1) and the Task 2.6
CI-install mechanism (Part C §2.6) as genuinely open, not covered by any research
section. These are correctly scoped as **Phase 2 research items**, not Phase 1
omissions — they do not block starting design work.

## Findings (minor — none blocking)

1. **Rule-count framing is internally inconsistent and undersells the coverage.**
   The prose says "all 57 rules live in `eslint-rules/*.js`" and "collectively
   covered 55 distinct named rules from the full 57," which reads as if 2–3 rules
   went unclassified. In fact there are 57 `.js` files but only **54 are actual
   rules**; the other three are non-rules: a POC file, a `load-routes.js` helper
   module (already referenced in row #16), and one `.test.js` test file (paired
   with an adapted rule already classified in the catalogue). The B.1 table
   classifies exactly 54 rules (summary counts 8+25+21=54), so coverage is actually
   **complete — every real rule is classified**.
   _Fix_: correct the B.1 preamble to "57 `.js` files = 54 rules + 3 non-rule files
   (POC, `load-routes.js` helper, one `.test.js`); all 54 rules classified below."
   This is a framing correction, not new research — do it before Phase 2 so a
   reader doesn't waste time hunting for three "missing" rules or assume they were
   silently dropped.

2. **A.2 table mis-attributes the `CLAUDECODE`/CI signal source.** The "Set by"
   column implies the CI/CLAUDECODE/TTY detection lives in `functions.inc.bash`;
   it is actually in `bin/qa` (lines 77–84) and `includes/generic/setConfig.inc.bash`
   (lines 95–96). The behaviour described is correct — only the file citation is
   loose. _Fix_: optional; adjust the source note if the Appendix is tidied.
   Non-blocking.

## Conclusion

No load-bearing concept was missed and no verified claim was inaccurate. The two
findings are cosmetic (a count-framing correction and a file-citation nit); neither
changes any classification or any Part C design recommendation. Phase 2 (design)
can proceed on this report. Recommend applying fix #1 opportunistically so the
"57 rules" framing does not mislead the Phase 2 designer.
