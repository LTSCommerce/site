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

| Phrase / construction         | Flagged    | Where seen                                 | Fix                                                   |
| ----------------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------- |
| "it is worth stating plainly" | 2026-09-02 | the-ouroboros-problem, "What I Mean by It" | Delete the throat-clearing, state the thing directly. |

## Known from published research (watchlist, judgement call)

Sources: [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing),
[Pangram: AI's Most Overused Phrases](https://www.pangram.com/blog/walking-through-ai-phrases),
plus general LLM-writing-tell coverage as of September 2026.

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

**Overused vocabulary** (frequency-spiked in published AI writing; not banned outright, but
suspicious in clusters):

- delve, underscore(s), pivotal, crucial, vital, tapestry, intricate/intricacies, testament,
  showcase/showcasing, fostering/cultivating, align with, enduring, boasts (meaning "has"),
  vibrant, robust, nuanced, multifaceted, landscape (figurative), realm, cornerstone, beacon,
  navigate the complexities of

**Vague-attribution hedges** — invoking an unnamed authority instead of a real citation:

- "industry reports suggest", "observers have cited", "experts argue", "some critics argue",
  "several sources note"

**Canned significance/legacy phrasing** — inflating importance without a specific claim:

- "a testament to", "underscores its importance", "reflects broader trends", "marking a shift
  in the landscape of", "highlighting the importance of"

**Promotional travel-brochure register** (unlikely on this site's technical prose, but worth
knowing): "nestled in", "in the heart of", "boasts a", "rich and vibrant", "groundbreaking",
"renowned", "diverse array of".

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
