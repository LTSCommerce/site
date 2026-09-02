# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "First Computer Bug, 1947" — the Harvard Mark II relay-calculator logbook
  page for 9 September 1947, with the moth found jammed in Relay #70, Panel F, taped in and
  annotated "First actual case of bug being found." U.S. Naval Historical Center Online Library
  Photograph NH 96566-KN; courtesy of the Naval Surface Warfare Center, Dahlgren, VA (photograph
  made 1988 of the original 1947 logbook page, held by the Smithsonian's National Museum of
  American History).
- **Source page**: <https://commons.wikimedia.org/wiki/File:First_Computer_Bug,_1947.jpg>
  (a duplicate upload of the same file also exists at
  <https://commons.wikimedia.org/wiki/File:H96566k.jpg>, lower resolution — the fetch used the
  full-resolution file above)
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/e/e7/First_Computer_Bug%2C_1947.jpg>
- **Original dimensions**: 2,889×2,285px JPEG
- **Licence**: Public domain — "This file is a work of a sailor or employee of the U.S. Navy,
  taken or made as part of that person's official duties. As a work of the U.S. federal
  government, it is in the public domain in the United States." Verified on the Wikimedia
  Commons file page at fetch time (both the primary file page and the duplicate carry the
  identical statement and NH 96566-KN source credit).
- **Fetched**: 2026-09-02

## Why this image

The article draws a hard distinction between an error (the system tells you what broke) and a
bug (you have to go find it) — and this is, literally, the origin of the word "bug" for exactly
that second kind of failure: an undetected physical fault an engineer had to physically locate
and diagnose, not a reported condition. It's about as direct and unforced a fit as a hero image
gets for this specific article, and it's a widely documented, genuinely iconic artefact rather
than a generic stock illustration. The crop was chosen because the logbook page is already dense
with handwritten content edge to edge (relay test entries, the taped moth itself, and the "First
actual case of bug being found" caption directly beneath it) — no empty margins to work around,
unlike a smaller emblem/icon-shaped source would have needed.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png   # → 2400x1898

# 2. Crop a wide band across the moth-tape + caption region (chosen by eye — this band sits
#    almost exactly on the logbook's own "1545 ... Relay #70 Panel F (moth) in relay ...
#    First actual case of bug being found" entry, with no dead space above or below)
convert resized.png -crop 2400x480+0+1000 +repage crop-test1.png

# 3. Desaturate toward greyscale — the source is an aged, sepia-toned paper photograph; this
#    keeps it calm against the site's blue/white/grey palette rather than clashing with it
convert crop-test1.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade). Built as two separate flat
#    images then stacked with -append, rather than the inline "( ... ) ( ... ) -append" one-liner
#    seen in other SOURCE.md files, to avoid a shell-quoting pitfall — functionally identical.
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried — 78 was the chosen balance: the handwriting stays crisp and legible, and file
#    size was still comfortably small for this source, 32-92KB across the range tried)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~52KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` used for the hero — a taller crop than the hero band so it also shows the "Started
Cosine Tape" / "Started Mult + Adder Test" lines above the moth entry for extra context:

```bash
convert resized.png -crop 1200x630+0+780 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~76KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- The source photograph is a photographic reproduction of an aged paper logbook page (warm
  sepia tone from age, not a modern colour photo), so it was desaturated the same way a colour
  photograph would be — to sit calmly against the site's blue/white/grey palette rather than
  carrying its own tint into the page design.
- No blur-before-encode step was needed — this is document/text content, not a high-frequency
  natural texture (stone, foliage), so WebP compresses it comfortably even at higher quality
  settings; q78 landed at ~52KB, well inside the usual budget with quality to spare.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
