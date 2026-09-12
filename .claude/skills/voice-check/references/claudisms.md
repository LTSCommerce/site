# Claudisms

A list of recurring AI-writing tics to check for in this site's Claude-authored prose. This is
distinct from `untracked/JOSEPH-VOICE.md` (which describes what his real voice *is*, from
measured evidence) and from the generic corporate-buzzword list in
`content-editor.md`/`article-reviewer.md`. A claudism is neither of those: it's a specific
phrase or construction that isn't necessarily wrong or corporate, but reads as machine-generated
filler once you've seen it enough times.

Two tiers, kept separate because they carry different evidence:

- **Confirmed on this site** — Joseph has personally flagged a real instance in real published
  (or about-to-publish) prose here. Treat every hit as a near-certain fix, not a judgement call.
- **Known from published research** — widely documented AI writing tells (Wikipedia's
  "Signs of AI writing" project, AI-detection write-ups, LLM-watching blogs, September 2026),
  seeded here as a broader watchlist. These are real, evidenced patterns from research on AI
  output generally, not yet individually confirmed against this site's own prose — treat a hit
  as **worth a judgement call**, not an automatic rewrite, since some will be legitimate usage.

**Growth rule**: a confirmed-tier entry only ever comes from Joseph directly flagging a real
instance — never move something from research-tier to confirmed-tier just because it seems
likely. The research tier can be topped up from further research on request; don't add entries
to it from guessing either.

## Confirmed on this site

| Phrase / construction         | Flagged    | Where seen                                                                                                    | Fix                                                                                                                                                                                                                                    |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "it is worth stating plainly" | 2026-09-02 | the-ouroboros-problem, "What I Mean by It"                                                                    | Delete the throat-clearing, state the thing directly.                                                                                                                                                                                  |
| "load-bearing" (metaphorical) | 2026-09-02 | the-ouroboros-problem; php-exception-best-practices; article-image SKILL.md; mocking-best-practices/SOURCE.md | Replace with a plain word for the sense meant: "structural", "necessary", "actually matters", "does real work" - or just say what breaks if it's removed. Literal uses (an actual load-bearing wall/column) are fine and out of scope. |

## Known from published research (watchlist, judgement call)

Sources: [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing),
[Pangram: AI's Most Overused Phrases](https://www.pangram.com/blog/walking-through-ai-phrases),
plus general LLM-writing-tell coverage as of September 2026, plus a tell/vocab list Joseph supplied
directly for review on 2026-09-11 (source: a circulating "25 tells" writing-advice list, not a
single citable article — treated as research-tier like the rest of this section, not confirmed-tier,
per the growth rule above).

**False-contrast constructions** — the single most-cited AI tell:

- "It's not just X, it's Y" / "This isn't about X. It's about Y."
- "Not X, but Y" used as a rhetorical drumbeat rather than a genuinely informative correction
  (already covered in `article-reviewer.md`/`content-editor.md`, repeated here for completeness)

**Copula avoidance** — replacing a plain "is/are" with an inflated verb:

- "serves as" / "stands as" / "functions as" / "represents" where "is" would do
  (e.g. "Gallery 825 serves as LAAA's exhibition space" instead of "is LAAA's exhibition space")

**Present-participle sentence endings** — a trailing "-ing" clause bolting on vague significance:

- "...further enhancing its significance as..." / "...ensuring a smoother experience" /
  "...contributing to a more robust outcome"

**Rule-of-three overload** — three-item lists (words, clauses, or examples) are a normal English
pattern in small doses but become an AI tell when every paragraph reaches for one.

Refined 2026-09-11 after a real test run surfaced overlap with the pre-existing sentence-rhythm
check (`voice-pass.md`/`content-editor.md`): three short consecutive sentences that also happen
to number three ("No new components to build. No new styles to write. No new test cases to
author.") is a **sentence-rhythm hit, not this one** — fix it there, don't double-count it here.
This category triggers only on genuine density, distinct from that check:

- a triad *inside* a single clause or sentence (three adjectives/nouns/short phrases joined by
  commas or "and") that recurs 2+ times across the same passage, or
- three or more consecutive paragraphs, headings, or list items that each independently reach for
  their own internal triad

A single triad anywhere in isolation — whether as one clause or as three short sentences in a row
— is not a hit for this category by itself.

**Parallel-structure overuse** — the same balanced-clause template reused 3+ times in one
article:

- "whether X or Y" repeated across unrelated sentences
- "from X to Y" repeated across unrelated sentences

**Transition clichés** — rhetorical-question or throat-clearing pivots nobody would say aloud:

- "So what's the takeaway?" / "So what does this mean in practice?" as a section pivot
- "But here's the thing:" — a hard fix whenever seen, not a judgement call

**Canned scene-setting openers** — generic framing with no specific content:

- "In today's fast-paced world..." / "In today's digital landscape..." / "Now more than ever..."

**Generic-noun avoidance of the real name** — substituting a vague generic ("the tool", "the
framework", "the platform") for the actual named thing across a whole passage, once the name has
already been introduced. On a technical site this reads as evasive rather than natural variation;
name the actual library/tool (PHPStan, ESLint, Redis, ...) on repeat reference, not just first
mention.

**Vague referent constructions** — a plural noun phrase standing in for a claim that should name
who or what:

- "the ones who...", "those who truly understand...", "the teams that get it right..."

**Overused vocabulary** (frequency-spiked in published AI writing; not banned outright, but
suspicious in clusters):

- delve, underscore(s), pivotal, crucial, vital, tapestry, intricate/intricacies, testament,
  showcase/showcasing, fostering/cultivating, align with, enduring, boasts (meaning "has"),
  vibrant, robust, nuanced, multifaceted, landscape (figurative), realm, cornerstone, beacon,
  navigate the complexities of, fluff, engine (figurative, e.g. "growth engine"), unsung hero,
  secret weapon, crafts/crafting, game changer, quiet (figurative intensifier — "the quiet cost
  of...", "a quiet revolution in..." — distinct from literal quietness)
- "leveraging" / "optimising" / "streamlining" and similar -ing verb forms opening a sentence or
  clause as a substitute for a plain finite verb — the individual words are fine when literal
  (optimising a SQL query is just what happened); the tell is reaching for the gerund as a vague
  scene-setter rather than describing a specific action

**Vague-attribution hedges** — invoking an unnamed authority instead of a real citation:

- "industry reports suggest", "observers have cited", "experts argue", "some critics argue",
  "several sources note", "some might argue" (used to smuggle in an opinion Joseph should just
  state plainly — distinct from honest first-person hedging like "I would suggest", which stays
  in scope, see `voice-pass.md`)

**Canned significance/legacy phrasing** — inflating importance without a specific claim:

- "a testament to", "underscores its importance", "reflects broader trends", "marking a shift
  in the landscape of", "highlighting the importance of", "this speaks to..." (used to claim
  unearned symbolic weight rather than stating the actual point)

**Promotional travel-brochure register** (unlikely on this site's technical prose, but worth
knowing): "nestled in", "in the heart of", "boasts a", "rich and vibrant", "groundbreaking",
"renowned", "diverse array of".

**Unsourced or undated statistics** — a number or claim presented with no citation and no date,
which an LLM cannot reliably fact-check and often invents or staleness-launders. Already partly
covered by the vague-attribution hedges above and by the site's SITE-TRUTH traceability rule, but
worth checking explicitly: any statistic needs either a source, a date, or both — or it should be
cut.

## Reviewed and deliberately not added

A few items from the 2026-09-11 list were considered and left out because they don't apply to
this site's technical-article format, or are already fully covered elsewhere:

- **Emoji density** — this site's articles don't use emoji at all; not a relevant signal here.
- **"No internal links" / "meta description = first sentence" / "exactly 5 bullets per section" /
  "repeats the same H2 across posts"** — these are structural/formatting tells, not prose-voice
  tells, so they belong with `article-reviewer.md`'s structural checks rather than this file (see
  that file's "Formulaic Structure Tells" section).
- **Fabricated named case studies ("Sarah Chen")** — already banned outright by this repo's
  No Bullshit Rule and SITE-TRUTH.md, and covered by the `feedback_no_fabricated_first_person_claims`
  memory; not a voice nuance, a hard content rule.
- **Generic corporate formality ("utilise", "implement", "facilitate")** — already covered by
  `content-editor.md`'s Common Replacements list; note "utilise" specifically is correct British
  spelling on this site and is not itself a tell here, only the vaguer synonyms are.
- **Repeated sentence structures / same opening clause** — already covered by `content-editor.md`
  ("vary sentence-opening words") and the sentence-rhythm check in `voice-pass.md`.
- **"Robotic cadence"** — too vague to action directly; it's the aggregate effect of the sentence-
  rhythm and parallel-structure checks already in this file and in `voice-pass.md`, not a separate
  check.

## How to use this during a voice pass

Grep for each confirmed-tier phrase (case-insensitive) across the scope being checked, same as
the mechanical buzzword scan — every hit is a near-certain fix. For the research-tier watchlist,
scan the same way but read each hit in context before touching it: some (especially the plain
vocabulary words, used literally and sparingly) are fine; the tell is density and the
constructions (false contrast, copula avoidance, trailing "-ing" clauses), not the mere presence
of a word.

## Adding a new confirmed entry

When Joseph flags a phrase, add a row to the confirmed table (phrase, date, where seen, the fix
applied) and apply the same fix anywhere else it appears in already-published content, not just
the article that prompted the flag.
