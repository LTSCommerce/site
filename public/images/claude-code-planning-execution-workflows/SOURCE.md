# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Interior View of Drafting Room in ERB" (GPN-2000-001447) — a black-and-white
  photograph of the drafting room in the Engine Research Building at the NACA/NASA Aircraft
  Engine Research Laboratory, Cleveland, Ohio (now the John H. Glenn Research Center at Lewis
  Field). Shows dozens of engineers/draftsmen at rows of drafting tables, several with rolled
  blueprints stacked on their desks. Photographed 21 September 1942, shortly after the building's
  completion.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Interior_View_of_Drafting_Room_in_ERB_-_GPN-2000-001447.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/3/3b/Interior_View_of_Drafting_Room_in_ERB_-_GPN-2000-001447.jpg>
- **Original dimensions**: 3,000×2,400px JPEG, already greyscale
- **Licence**: Public domain — "This file is in the public domain in the United States because it
  was solely created by NASA. NASA copyright policy states that 'NASA material is not protected
  by copyright unless noted.'" Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article separates a planning phase from an execution phase in AI-assisted development
workflows — think/design before you act, with a deliberate hand-off between the two. A drafting
room is a literal, unforced match for that idea: rows of engineers producing the plans (rolled
blueprints visible on several desks) before anything gets built from them, without needing a
software-specific metaphor (a screenshot, a diagram) that would date quickly. Composition was the
deciding factor over other drafting-room candidates on Commons — this frame is packed edge to
edge with drafting tables and people at every depth of field, rather than a few isolated desks
with empty space around them, so it holds up as a wide 5:1 crop rather than reading as a small
subject on a big background. It was also already public-domain federal photography (NASA) with
no CC BY-SA entanglement, consistent with every other hero image on this site.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png   # → 2400x1920

# 2. Crop a wide band from the densest row of tables (chosen by eye after comparing three
#    candidate offsets — this one keeps the two foreground figures conferring over a drawing,
#    with rolled blueprints on the desk in front of them, plus two further rows of drafting
#    tables receding into the background on both sides)
convert resized.png -crop 2400x480+0+950 +repage crop.png

# 3. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried — 78 was the chosen balance; no blur-before-encode step was needed, this source
#    compressed cleanly at every quality level tried)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~83KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
used for the hero — a different offset chosen to keep the same two-figures-conferring subject at
this taller aspect ratio (a first candidate crop, further left, showed more of the room but no
single clear subject; this one keeps the two foreground figures as the visual anchor):

```bash
convert resized.png -crop 1200x630+600+850 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~112KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the NASA source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- No blur-before-encode step was needed — unlike a high-frequency stone/foliage texture source,
  this photograph's detail (fabric, paper, skin, painted walls) compressed cleanly at every
  quality level tried, well under the usual ~100–140KB range even at q78.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
