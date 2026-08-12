---
name: voice-check
description: Check this site's prose against Joseph's real writing voice (sampled from his private book manuscript, not generic AI/marketing copy) and propose rewrites for anything that reads off
argument-hint: "[path...]"
disable-model-invocation: false
user-invocable: true
allowed-tools: Bash, Read, Grep, Edit, Write
---

# Voice Check

Checks this site's user-facing prose against how Joseph actually writes — not the site's own
prior copy, which is itself probably AI-written (see references) — and proposes specific
rewrites for anything that reads like generic AI/marketing copy instead of him.

**Report only by default.** This skill quotes problems and proposes better versions; it does
not silently rewrite files. If the user wants the proposals applied, do that as a normal
follow-up edit once they've seen and agreed with the list.

## Step 1 — Ensure the reference manuscript is available

His private Packt book manuscript is the richest confirmed-genuine (2021, pre-LLM, git-blame
verified) voice sample available. Clone it if it isn't already present:

```bash
if [ ! -d /workspace/untracked/repos/php-book/.git ]; then
  gh repo clone LongTermSupport/php-book /workspace/untracked/repos/php-book
fi
```

`untracked/` is gitignored local scratch space — this clone is not meant to be committed.
Requires `gh` to be authenticated with access to `LongTermSupport/php-book` (it's private);
if the clone fails, report that plainly rather than proceeding without ground truth.

## Step 2 — Calibrate

Read, in this order:

1. `references/voice-pointers.md` (in this skill directory) — the distilled style guide: real
   traits, specific AI tells to flag, and which sources are/aren't trustworthy as ground truth.
2. `untracked/repos/php-book/chapters/Part1/Chapter1-Object-Oriented-PHP.md` in full — read for
   the actual cadence, not just the bullet-point summary. This is the confirmed-rich sample.
3. If doing a thorough pass (not a quick check), also read
   `untracked/repos/php-book/chapters/Part4/Chapter12-The-Awesomeness-That-is-8.1.md` for a
   second, differently-toned sample (more enthusiastic register).

Do not substitute this step with docs/READMEs from `fedora-desktop` or any other Claude-Code-era
repo — `references/voice-pointers.md` explains why those are unreliable.

## Step 3 — Determine scope

If invoked with path arguments (`$ARGUMENTS`), check exactly those files/directories. Otherwise
default to the site's main prose surfaces:

```
src/pages/Home.tsx
src/pages/About.tsx
src/pages/Contact.tsx
src/pages/ProjectList.tsx
src/pages/ArticleList.tsx
src/pages/Privacy.tsx
src/components/layout/Footer.tsx
src/components/content/Hero.tsx
src/components/article/ArticleNextStep.tsx
src/data/projects.ts
README.md
```

**`src/pages/Privacy.tsx` is special-cased**: it's a GDPR legal notice. Only flag genuine
corporate-buzzword abuse there, not stylistic looseness — a privacy policy should stay precise,
not chase brand voice at the expense of clarity.

**`src/data/articles.ts` is out of scope by default** — it's ~19k lines of already-known
Claude-written article content, a separate and much bigger cleanup than a routine check. Only
scan it if the user explicitly names it or a specific article slug as an argument.

## Step 4 — Mechanical scan

Fast, high-confidence candidates — run these across the scoped files first:

```bash
# Corporate buzzwords
grep -rniE "leverage|seamless|robust|streamline|cutting-edge|cutting edge|unlock|elevate|best-in-class|synergy|holistic|world-class|innovative|state-of-the-art|revolutioniz|game-chang|empower|comprehensive solution|dedicated to|passionate about" <scoped paths>

# Decorative "X, not Y" contrastive-clause AI tell
grep -rn ", not \|not just\|not after\|— the opposite of" <scoped paths>

# American spellings that should be British on this project (NOT Tailwind class names)
grep -rnoiE "\b(virtualization|optimization|modernization|customization|standardization|utilization|initialize[ds]?|organized|prioritized|specialize[ds]?|behavior|favor|defense|analyz(e|ed|ing)|recogniz(e|ed|ing)|realiz(e|ed|ing)|catalog\b|favorite|honor|labeled|traveled|canceled|fulfill)\b" <scoped paths>
```

Every hit needs a human (your) judgement pass before reporting — e.g. `gray` inside a
`className` string is Tailwind's palette name, not prose, and must be ignored; a `, not `
inside an actually-informative contrast is fine and shouldn't be flagged.

## Step 5 — Judgement scan

Read each scoped file with the calibration from Step 2 fresh in mind. Look specifically for
what grep can't catch:

- Suspiciously uniform polish — zero typos, every sentence the same length/rhythm as its
  neighbour, across a whole paragraph.
- Decorative rule-of-three enumeration (three items listed for cadence, not because there are
  genuinely three things worth naming).
- Sentences that would read more like him if loosened into one longer, comma-linked sentence
  instead of two or three short chopped ones — but don't force this everywhere; punchy is
  sometimes correct (CTAs, disqualifying/positioning one-liners).
- Missing his actual recurring phrasing where a generic equivalent was used instead (the clearest
  case: any CTA that isn't "Get in touch" where that would fit naturally).

## Step 6 — Report

For each finding, in file order:

```
<file>:<line>
Current:  "<exact quoted text>"
Why:      <which trait/tell this violates, one line>
Proposed: "<specific rewritten version>"
```

Group findings by file. End with a one-line summary count. Do not apply any changes — stop
after the report unless the user asks you to apply specific ones.
