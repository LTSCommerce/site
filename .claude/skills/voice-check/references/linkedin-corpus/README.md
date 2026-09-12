# LinkedIn Articles corpus

28 of Joseph's own long-form LinkedIn ("Pulse") articles, sourced from his official LinkedIn
data export ("Get a copy of your data" → Articles), downloaded 2026-09-11. Each file is
LinkedIn's own saved-article HTML template (title, created/published dates, article body) —
checked for embedded tokens/session data/other-people's PII before this was committed; none
found, each file is 5–13KB of clean article markup only.

Date range: 2014-02-26 to 2021-11-05. This sits inside the "reliable" pre-Claude-Code window
already established in [voice-pointers.md](../voice-pointers.md) (roughly 2016–2021, though these
2014/2015 pieces predate even that and are earlier Edmonds Commerce company-blog material rather
than personal LinkedIn posts — read with that in mind, tone shifts a bit article to article).

**One article from the same export was deliberately excluded**:
`building-custom-speech-to-text-system-linux-joseph-edmonds-bgn2f.html`, dated 2026-02-19 — well
inside the "don't trust, Claude-Code-assisted era" window. It's left in the gitignored
`untracked/Articles/` folder rather than here, so it doesn't get swept into voice calibration by
accident.

Use this corpus the same way as `untracked/repos/php-book/...` is used for the book manuscript:
read directly for cadence/register calibration, don't rely solely on the summarised traits in
`voice-pointers.md`.
