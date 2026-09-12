# Joseph's voice — distilled pointers

Derived from two independently-verified real sources: a LinkedIn Pulse article + featured
posts (fetched live, quotes below are verbatim), and his private Packt book manuscript
(`LongTermSupport/php-book`, 2021, git-blame confirmed as his own commits). Cross-validated —
both sources land on the same traits independently, which is what makes this reliable rather
than a guess from vibes.

A third source was added 2026-09-11: [linkedin-corpus/](linkedin-corpus/), 28 of his full
long-form LinkedIn articles (2014–2021, official data export) — a much larger sample than the
single fetched-live article above. Treat it as a calibration source the same way as the book
manuscript chapters below, not just as more of the same "featured posts" evidence.

**Do not trust these as voice sources, even though they look plausible:**

- `LongTermSupport/fedora-desktop`'s `docs/ccy.md` and friends — git-blame shows commits
  literally tagged `Co-Authored-By: Claude Opus 5`. AI-written, human-reviewed, not his prose.
- This site's own pre-existing copy (before any voice-pass work) — stylistic fingerprinting
  (short aphoristic sentences, rule-of-three, near-zero typos) matches the confirmed-AI CCY
  docs, not the confirmed-human book/READMEs. Likely AI-written under his name. "Preserve the
  existing voice" is not a safe default on this project.
- Anything from 2024 onward, generally — his current output is heavily Claude-Code-assisted.
  The reliable window is roughly 2016–2021.

## Real traits (confirmed)

- **Long, loosely-built, comma-heavy sentences.** He does not chop everything into short
  punchy fragments. Explanatory prose runs on, piling up clauses:
  > "Whilst there isn't sufficient space in this book to do a deep dive on this topic, we hope
  > that you will be able to use the contents of the following three chapters as a jumping
  > point for your own further study and experimentation."
- **British spelling and idiom, throughout.** Whilst, optimise/organise/modernise/virtualise,
  colour. Idiom: "the big daddy", "kick the tyres", "jump in at the deep end", "get your hands
  dirty", "dip our toes in", "count your blessings", "proper" as an intensifier ("a *proper*
  PHP developer"), "fancy" ("if you fancy a change").
- **Hedges and asides before landing the point** — not corporate throat-clearing, more
  thinking-out-loud: "Whilst...", "I seriously hope you don't find this overwhelming...", "I
  think it would be fair to say...", "I will admit I have never seen...", "Of course...".
- **Opinions stated as plain fact, unhedged, once he gets there:**
  > "Magento is the big daddy in open source PHP E-Commerce."
  > "PSR-4 is a very sane and sensible system to follow, and I highly encourage you to do so."
- **Direct reader address**, second person, sometimes a named person mid-text: *"Yes Ben, it
  is a bit cheesy, sounds like the kind of thing you'd expect written under a motivational
  poster."*
- **Rhetorical mini Q&A as a teaching device:** *"What is an object? Well in PHP, an object is
  an 'instance' of a 'class'."*
- **Self-aware, mildly self-deprecating asides and jokes.** *"In the end, the answer was pretty
  simple, just ask the team."* / *"Hope to hear from you soon! P.S - we have great coffee as
  well"* / commit message: *"stuck on something stupid so calling it a day for now"*.
- **"Get in touch"** is his actual recurring CTA phrase — verified twice independently on
  LinkedIn. Prefer it over invented alternatives ("Start a Conversation", "Reach Out", etc.).
- **Genuinely imperfect, and that's fine.** Real typos and inconsistencies survive uncorrected
  in his real writing ("staritng", "persistance", "utlisation"). Over-polishing a passage to
  remove all rough edges works *against* sounding like him, not for it.

## What reads as AI, not him — flag these specifically

- **"X. Not Y." balanced contrastive clauses** used as a rhetorical flourish where the contrast
  isn't actually informative: "...catches a problem before it ships, not after." / "...permission,
  not just isolation." A single genuinely load-bearing contrast (i.e. it corrects a real
  misconception) is fine; a decorative one at the end of a sentence for cadence is the tell.
- **Exhaustive parallel enumeration used decoratively** — rule-of-three lists that exist for
  rhythm rather than because there really are exactly three things worth naming.
- **Corporate buzzwords** — near-certain AI-or-marketing-template tells on this project:
  leverage, seamless, robust, streamline, cutting-edge, unlock, elevate, best-in-class,
  synergy, holistic, world-class, innovative, state-of-the-art, revolutionise/revolutionize,
  game-changing, empower, "comprehensive solution", "dedicated to", "passionate about".
- **American spellings** where the site's own convention is British — optimize→optimise,
  organize→organise, modernize→modernise, virtualization→virtualisation, color→colour,
  favorite→favourite, behavior→behaviour, analyze→analyse, recognize→recognise,
  realize→realise. **Caveat**: do not touch Tailwind class names (`text-gray-500`,
  `bg-gray-50`) — "gray" there is a hardcoded framework API name, not prose, and "fixing" it
  breaks the build.
- **Suspiciously uniform polish** — zero typos, perfectly balanced clause lengths, every
  sentence the same rhythm as its neighbour, across a long passage. Real writing (his or
  anyone's) has more variance than that.
- **Heavy markdown-table structuring or exhaustive bulleted enumeration inside prose** where a
  sentence or two would do — tables and bullet-walls are a strong AI tell when used as the
  default explanatory mode rather than for genuinely tabular data.

## Findings from the full linkedin-corpus read (2026-09-11)

All 28 corpus articles read directly (2014–2021: early Edmonds Commerce company-blog posts,
personal opinion pieces, technical explainers, recruiting posts, sales/CTA posts). This is a much
larger sample than the single fetched-live article the original traits above were based on.

**Genuinely new traits, each confirmed by 2+ independent instances:**

- **Self-correcting mid-sentence emphasis restatement.** States a quantity/claim, then interrupts
  himself to restate it with an intensifier, as if catching himself understating it:
  > "Loads, and I mean really - loads, of sites are still running on Magento 1."
  > "I get to look at a lot of websites, I mean, really quite a lot."
  > "Working with CSV files can be really, hugely painful."
- **Pose-then-answer heading structure.** A section heading is phrased as the reader's own
  question, and the very next sentence answers it in one short, often dry/blunt line before
  elaborating — a distinct, well-evidenced structural device, not just the "mini Q&A" already
  documented:
  > H3 "How to Upgrade" → "In a nutshell: carefully."
  > H3 "How big a job is the upgrade?" → "It's a pretty big job."
  > H2 "So the question is how do you do this?" → direct answer follows immediately.
  > This is a real, reusable structural pattern worth recognising as *his*, not an AI tell, when a
  > site article's heading poses a genuine question and answers it fast.
- **Extended analogy as an explanatory device**, beyond the already-documented rhetorical mini-Q&A:
  the Magento 1→2 upgrade explained via a car manufacturer changing "the engine, frame,
  suspension... It has the same badge on the back, but you couldn't just lift the customised
  engine from your old car and expect to drop it into the new model." Concrete, physical,
  slightly informal analogies for abstract technical migration concepts.
- **Disarming direct-address asides that aren't AI clichés**: "Let's be honest, the biggest
  difference most businesses will notice is the price tag." / "Call us old fashioned, but we
  really think that a team that is physically together is going to work better." These do the
  same job the banned "But here's the thing:" tries to do — a plain-spoken pivot — but read as
  genuinely his, not templated. Worth having as *positive* alternatives to suggest, not just a
  list of things to avoid.
- **Explicit, self-aware mockery of marketing/influencer voice** — direct negative evidence for
  why the corporate-buzzword ban is correct, not just a stylistic preference: "I haven't watched
  hours of youtube videos by self proclaimed gurus explaining the latest ways to tame the Google
  algorithms and shoot your site to the top of the rankings with this one easy trick your
  competitors wish they knew..." He satirises that register outright. Across all 28 articles,
  including outright sales/recruiting copy, there is **zero use of "leverage", "synergy",
  "holistic", "seamless", or any confirmed corporate buzzword** — strong negative evidence that
  the ban reflects how he actually talks, not an arbitrary house-style rule.
- **He names the rule-of-three device explicitly when someone else uses it, as a one-off quotable
  joke, not his own default habit**: quoting a colleague's one-liner "Challenging, Flexible, and
  Fun" and captioning it "Utilising the rhetoric rule of three to great effect". This is useful
  calibration for `claudisms.md`'s rule-of-three-overload category: in his own writing, triads are
  rare enough that when one does land, it's notable and sometimes literally called out — the
  opposite of the AI failure mode of scattering them invisibly through every paragraph.
- **Casual sign-offs beyond the "Get in touch" CTA**, confirmed many times over: "Cheers / Joseph"
  (most common), "Thanks for reading / Joseph", "Cheers, and Happy New Year! / Joseph". Genuine
  recurring sign-offs, distinct from "Get in touch" which remains the confirmed CTA phrase.
- **Genuine typos/grammar slips continue right up to 2021**, not just in the older material — and
  they're not limited to spelling: "teh engine" (letter transposition), "0044 113 880 56554" (an
  extra digit in a phone number), "its not the the full story" (doubled word + missing apostrophe),
  "malcious actor", "propogate", "all to often", "Talk to me today about we can assist" (missing
  "how"). Reinforces "genuinely imperfect" with much more evidence, across the whole date range,
  including numeric/factual slips, not just wording.
- **Rhetorical question used to pivot an entire section**, beyond the "mini Q&A" teaching device
  already documented — a full paragraph builds toward a question, then the next heading answers it
  as an explicit stance, e.g. "So why would anyone want to give their agency a site wide link..."
  → next heading "My Opinion - It is Entirely Unethical". He sometimes labels an opinion section as
  such outright.
- **Self-aware markup/meta humour as a closer**, e.g. tagging an opinionated piece with a literal
  `</rant>` at the end, or a P.S. joke ("P.S - we have great coffee as well"). Consistent with the
  self-deprecating-aside trait, in a more visual/structural form.

**Important scope caveat**: most of this corpus is not directly comparable to this site's
technical-article genre. A large fraction is outright B2B sales copy and recruiting copy for his
old company (Edmonds Commerce) — CTAs, pricing, "get in touch", clickbait-style question
headlines ("Have You Left the Door Wide Open?"), company-culture pitches. That's real evidence of
who he is (confident, direct, funny, never reaches for corporate jargon even when literally
selling something), but it's a different genre from a technical explainer aimed at other
developers. The passages most directly comparable to site articles are the technical-explainer
ones (Magento performance breakdown, PWA explanation, testing philosophy, PIM tool comparison,
code/data migration mechanics) — weight those more heavily when calibrating register for actual
site prose, and treat the sales-copy passages as broader personality evidence rather than a
register template to copy.

**Register caveat**: several pieces (especially the more opinionated/rant-toned ones) are looser
than this site's `formal` register calls for — exclamation marks, triple question marks ("What is
a headless PWA???"), the `</rant>` tag, contact-block emoji (💻☎✉), sentence fragments as asides.
Treat those as evidence of who he is, not as license to import that looseness into site articles
wholesale. Weight traits that also independently show up in the book manuscript (comma-heavy long
sentences, hedges, direct address, rhetorical Q&A, self-deprecating asides, British spelling) as
the register-stable ones; treat LinkedIn-only looseness as source material for tone and
personality, not a license to change the site's register rules.

## Calibration source

`untracked/repos/php-book/chapters/Part1/Chapter1-Object-Oriented-PHP.md` is the confirmed-rich
sample — read it in full for the real cadence, not just these bullet points, before judging
borderline cases. `chapters/Part4/Chapter12-The-Awesomeness-That-is-8.1.md` is a second
confirmed-genuine sample (more enthusiastic/excited register — useful contrast). Any other
chapter is presumably just as genuine (same manuscript, same 2021 authorship) if those two are
unavailable for some reason.
