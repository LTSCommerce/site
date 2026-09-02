---
name: git-push
description: Push local commits to main and verify the deploy actually worked — watch CI through to completion, then smoke-test the live site. Use this instead of a bare `git push` on this repo; a push here triggers a real production deploy and is not done until it's been confirmed live.
argument-hint: ""
disable-model-invocation: false
user-invocable: true
allowed-tools: Bash, Read
---

# Git Push (with deploy verification)

A push to `main` on this repo triggers GitHub Actions: build → QA gate → (on success)
deploy to GitHub Pages at `https://ltscommerce.dev`. **A push is not "done" when `git push`
returns** — it's done when the deploy has actually succeeded and the live site reflects the
change. Treat this as an active operation you stay attached to, not fire-and-forget.

## Step 0 — Preflight (catch what CI would catch, before spending a CI run on it)

```bash
git status                    # must be clean or only contain what you intend to push
npm run format:check          # must pass — CI's QA gate checks-only, never auto-fixes (see
                               # .github/workflows/ci.yml comment on the QA step)
npm run build                 # must succeed locally — same build CI runs
```

If `format:check` fails, run `npx prettier --write <file>` on the specific offending file(s)
(never the whole tree blindly — review the diff) and re-check. Don't push knowing the QA gate
will fail; that just burns a CI run and delays the real feedback.

Record the current state before pushing:

```bash
git rev-parse HEAD                      # the commit(s) about to be pushed
git rev-parse origin/main               # what's live before this push
git diff --name-only origin/main HEAD   # files this push actually changes
```

## Step 1 — Push

```bash
git push origin main
```

If this is rejected (non-fast-forward), stop and reconcile with the user rather than
force-pushing — `git push --force` is a blocked, destructive operation on this project.

## Step 2 — Find the exact CI run for this push

Don't assume "the most recent run" — list by branch and match `headSha` to the commit you just
pushed, so a race with another push (or a stale cached list) can't point you at the wrong run:

```bash
HEAD_SHA=$(git rev-parse HEAD)
gh run list --branch main --json databaseId,headSha,status,displayTitle --limit 5 \
  | jq -r --arg sha "$HEAD_SHA" '.[] | select(.headSha == $sha) | .databaseId'
```

If nothing matches yet, the workflow may not have registered the push as an event yet — wait a
few seconds and retry rather than falling back to "most recent."

## Step 3 — Watch it through to completion

```bash
gh run watch <run-id> --exit-status
```

This blocks and streams job/step status until the run finishes — this is the correct tool for
"wait until CI is done," not a manual sleep-poll loop. Builds on this project typically take
around 1.5–2 minutes (build + QA + Playwright install + deploy); let it run.

**If it fails**: run `gh run view <run-id> --log-failed` to get the actual failing step's
output. Diagnose the real cause (a QA/formatting/type/build issue) and fix it properly — do not
retry the same push hoping it passes, and do not paper over a genuine failure. If the failure is
pre-existing and unrelated to this push's content (as happened once already on this project — a
stale Prettier issue in `CLAUDE.md` blocked an unrelated article push), fix that root cause too,
since it'll keep blocking every push until someone does.

**If the `deploy` job doesn't run at all**: check whether the `build` job actually failed (deploy
has a `needs: build` dependency and won't start otherwise) — this is the normal reason, not a
bug in the workflow.

## Step 4 — Smoke-test the live site

CI going green only proves the build succeeded — it does not prove the live site actually
serves the new content (CDN/Pages propagation, routing, wrong URL assumptions, etc. are all
still possible failure points). Confirm directly:

```bash
# Always check the homepage still loads as a baseline sanity check:
curl -sL -o /dev/null -w "%{http_code}\n" https://ltscommerce.dev/

# Then check whatever this push actually changed. Derive the check from the diff in Step 0:
# - New/changed article (src/data/articles.ts, code-snippets/<slug>/): fetch the article page
#   and grep for something specific to the change (a title, a fixed phrase, a new section) —
#   not just a 200, since a 200 alone doesn't prove the right content shipped.
curl -sL https://ltscommerce.dev/articles/<slug> | grep -c "<expected marker text>"

# - A page component change (src/pages/*.tsx): fetch that route directly.
# - Anything else: use judgement about which route(s) the diff actually touches.
```

Also worth a quick check for a new article specifically:

```bash
curl -sL https://ltscommerce.dev/sitemap.xml | grep -c "<slug>"
curl -sL https://ltscommerce.dev/articles | grep -c "<slug>"
```

## Step 5 — Report a real verdict, not an assumption

State plainly, with evidence:

- The run ID, its duration, and that both `build` and `deploy` jobs succeeded.
- The exact live URL(s) checked, their HTTP status, and the specific content marker confirmed
  present (quote it).
- If anything didn't check out, say so explicitly rather than reporting success — "pushed and
  CI passed" is not the same claim as "confirmed live and correct," and only the second one is
  the actual deliverable of this skill.

## What this skill deliberately does NOT do

- It does not decide *whether* to push — that's a judgement call for whoever invokes it (commit
  authorship, whether the user has actually authorized this specific push, etc. stay the
  responsibility of the calling context).
- It does not retry a failed push/deploy automatically in a loop — a real failure needs a human
  or an explicit fix, not blind retries.
