# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Interior of a Railway Post Office Car" — a 1905 black-and-white
  photographic print (600 dpi scan) held by the Smithsonian's National Postal Museum,
  depicting the interior of a Railway Post Office (RPO) car: two facing walls of pigeonhole
  mail-sorting racks, each pigeonhole individually labelled for a specific destination, with
  diagonal letter-sorting cases along the aisle below them.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Interior_of_a_Railway_Post_Office_Car_(2550262025).jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/b/ba/Interior_of_a_Railway_Post_Office_Car_%282550262025%29.jpg>
- **Original dimensions**: 5,700×4,595px JPEG
- **Licence**: "No known copyright restrictions" — Smithsonian Institution / National Postal
  Museum, distributed via the Flickr Commons programme and mirrored to Wikimedia Commons.
  Verified on the Wikimedia Commons file page at fetch time (not a search snippet). Not
  CC BY-SA and carries no share-alike or attribution obligation, consistent with every other
  hero image on this site.
- **Fetched**: 2026-09-02

## Why this image

The article is about how a loose regex pattern silently creates extra, unvalidated code paths,
where a strict pattern forces every input through one of a small number of exact, well-defined
paths. A Railway Post Office car's pigeonhole sorting rack is a literal instance of the same
idea: each pigeonhole accepts mail for one specific destination and one only — a piece of mail
either matches a slot exactly or it doesn't get sorted there. It's an exact-match filtering
mechanism, not a metaphor stretch.

Two candidates from the same Smithsonian RPO series were considered
(`Interior_of_Railway_Post_Office_Car_(2550262405).jpg`, portrait-oriented, showing the car's
sink/door/fittings rather than the sorting racks) and rejected in favour of this one because it
is landscape-oriented at source, and both walls of pigeonholes plus the sorting tables below
fill the frame edge to edge in a symmetrical corridor perspective — dense, wide, no empty
margins — rather than a small subject on a big background.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png   # → 2400x1935

# 2. Hero crop: a wide band across the pigeonhole shelving on both walls (chosen by eye after
#    comparing offsets +150/+250/+380 — +380 keeps the labelled pigeonhole doors fully in frame
#    on both sides without clipping into the plain wood panelling below or the bright ceiling
#    lamps' hot-spot above)
convert resized.png -crop 2400x480+0+380 +repage crop.png

# 3. Light contrast boost (source is already black-and-white, no -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white top.png
convert -size ${W}x${FADE_H} gradient:white-black bottom.png
convert top.png bottom.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q90/85/78/70/60 compared — 78 was the chosen balance: 86KB, clearly
#    legible pigeonhole detail, no need for the pre-encode blur step since the source wasn't
#    high-frequency-texture-dominated the way a stone/foliage photo would be)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~86KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms composite `og:image`/`twitter:image` at roughly 1.91:1 and don't reliably
render alpha transparency, so the on-page hero (5:1, alpha-faded) isn't usable directly. `og.jpg`
is a separate, fully opaque asset at the conventional 1200×630 social-card size, cropped from
the same `resized.png` used for the hero — same source, taller framing to also capture the
diagonal sorting-table detail below the pigeonholes that the 5:1 hero crop doesn't have room for:

```bash
# Offset +600+300 (centred, pigeonholes only) was tried first and rejected — too much plain
# ceiling/lamp area above; +600+500 drops the top margin and brings the diagonal sorting
# tables into frame at the bottom, which reads more clearly as "sorting mechanism"
convert resized.png -crop 1200x630+600+500 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~135KB. Wired in via the article's `heroImage.ogImage` field.

## Why this approach

- No desaturation step needed — the source photograph is already black-and-white.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, since the nav itself provides the top transition.
- No pre-encode blur was needed (unlike the stone-wall-textured `component-driven-design-react-typescript-storybook` source) — this source's dominant surfaces (varnished wood, printed
  paper labels) compress cleanly at q78 without visible artefacting.
- To rebuild for new styling, rerun from the original JPEG with new crop offsets/quality values
  — the source URL and licence above are exactly what's needed to refetch it from scratch if
  this processed copy is ever lost.
