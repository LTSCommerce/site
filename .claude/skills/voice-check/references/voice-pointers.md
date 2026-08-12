# Joseph's voice — distilled pointers

Derived from two independently-verified real sources: a LinkedIn Pulse article + featured
posts (fetched live, quotes below are verbatim), and his private Packt book manuscript
(`LongTermSupport/php-book`, 2021, git-blame confirmed as his own commits). Cross-validated —
both sources land on the same traits independently, which is what makes this reliable rather
than a guess from vibes.

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

## Calibration source

`untracked/repos/php-book/chapters/Part1/Chapter1-Object-Oriented-PHP.md` is the confirmed-rich
sample — read it in full for the real cadence, not just these bullet points, before judging
borderline cases. `chapters/Part4/Chapter12-The-Awesomeness-That-is-8.1.md` is a second
confirmed-genuine sample (more enthusiastic/excited register — useful contrast). Any other
chapter is presumably just as genuine (same manuscript, same 2021 authorship) if those two are
unavailable for some reason.
