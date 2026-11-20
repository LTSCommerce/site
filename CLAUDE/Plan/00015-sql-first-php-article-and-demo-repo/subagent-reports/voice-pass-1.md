# Voice pass 1: sql-first-php

Reference read in full: `untracked/JOSEPH-VOICE.md`, `.claude/skills/voice-check/references/claudisms.md`.
Scope: the `content` and `description` fields of `sql-first-php` in `src/data/articles.ts`, plus every file in `code-snippets/sql-first-php/`.

## Mechanical scan

- Em dashes: none in the article, description or snippets.
- Confirmed claudisms ("it is worth stating plainly", metaphorical "load-bearing"): none.
- American spelling and idiom ("while", "-ize", "gotten" and so on): none. "Whilst" is used correctly in the lead.
- Corporate register (leverage, seamless, unlock, robust and the rest): none.

## Changes (all in articles.ts; no snippet files changed)

### Sentence rhythm (short declaratives stacked for punch)

- "Every statement lives as ... class. Every statement goes through one thin gateway interface, ..." → merged into one sentence: "... on its own small class and goes through one thin gateway interface, ..."
- "The size is the point. Six methods, every one of which ..." → "The size is the point: six methods, every one of which ..."
- "Notice there is no "which database" parameter anywhere. One instance of the service is one connection." → "You'll notice there's no "which database" parameter anywhere, because one instance of the service is one connection."
- "What the fake cannot do is tell you the SQL is right. It returns ... does not exist. A suite of fake-only tests can be entirely green ... So every query class also gets ..." → "What the fake can't do is ... It returns ... doesn't exist, so a suite of fake-only tests can be entirely green ... That is why every query class also gets ..."
- In What This Costs, several paragraphs opened on a clipped declarative. Two of them now read as single sentences:
  - "SQL text still spells column names. That is a deliberate trade," → "The SQL text itself still spells out column names, which is a deliberate trade,"
  - "Genuinely dynamic queries are awkward. A search screen ... does not fit neatly" → "Genuinely dynamic queries are awkward, because a search screen ... doesn't fit neatly"
- Closing: "The combination matters more than any single piece. Query classes, typed rows and a table class each help a little on their own." → "The combination matters more than any single piece, since query classes, typed rows and a table class each only help a little on their own."

### Repeated "it is worth ..." filler (5 uses; close to the confirmed "it is worth stating plainly" entry)

- "so it is worth showing." → "so here it is."
- "The strict mode is worth a moment on legacy servers" → "The strict mode matters on legacy servers"
- "It is also worth noticing where the business rule lives." → "It's also worth looking at where the business rule lives." (one use kept, now with a contraction)
- "The difference from a mocking library is worth spelling out." → "The difference from a mocking library matters here."
- "It is worth walking through the case ..." → "Let's walk through the case ..." ("Let's" is one of his most frequent constructions)

### Figurative "quietly" (4 uses; on the research-tier watchlist)

- "instead of quietly skipping the only tests" → "instead of silently skipping the only tests". The other three are left as they are.

### Contractions (the article had almost none)

- "a table that does not exist" → "doesn't exist"; "There is no lazy loading to trigger a query you did not write" → "There's no lazy loading ... you didn't write". Also the contractions added in the rhythm edits above. Most "does not" / "cannot" are left uncontracted, so the mix stays varied.

### Not changed, on purpose

- Hedging: the "strong nudge rather than a proof" PHPStan caveat, reads-only retry, "I don't think there is a perfect answer here", "probably the faster and more sensible route" for ORMs, and the What This Costs section all already hedge well. I added no confident claims anywhere.
- "Not X" contrasts ("concept demo, not a library", "A Fake, Not a Mock", "a small object, not a method on a repository") each carry information, so I left them. They don't read as a drumbeat.
- First person: only the existing opinion and recommendation uses ("I would happily reach for one", "I find most satisfying", "I suspect"). I added no experience claims.
- Links, target/rel attributes, the line breaks after URLs, the SNIPPET placeholders and the entity encoding are all untouched.
- Snippet comments: plain British, no em dashes, no filler. Nothing to change.
- Description: clean.

## Unresolved tension

None.

## Another pass?

Not recommended. The remaining texture (some short sentences, varied lengths) is within his measured range. A re-run would mostly churn prose that already reads as his.

## Build

`npm run llm:build` passed: 71/71 routes prerendered, snippets resolved (531), tsc clean.
