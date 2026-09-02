# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "The Break of Gauge at Gloucester" — a wood-engraved illustration published
  in the _Illustrated London News_, 6 June 1846, depicting the chaos at Gloucester station where
  passengers and luggage had to be manually transferred between Great Western Railway
  broad-gauge trains and standard/narrow-gauge trains from the Midland/Birmingham lines, because
  the two companies' tracks used incompatible gauges and no train could run through. Also
  catalogued on Commons as "Break of gauge GWR Gloucester.jpg" (the specific file used here).
- **Source page**: <https://commons.wikimedia.org/wiki/File:Break_of_gauge_GWR_Gloucester.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/c/c0/Break_of_gauge_GWR_Gloucester.jpg>
- **Original dimensions**: 1,413×931px JPEG
- **Licence**: "This work is in the public domain in its country of origin and other countries
  and areas where the copyright term is the author's life plus 70 years or fewer." — published
  1846, well outside any copyright term; author J. H. Townshend. Verified on the Wikimedia
  Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article translates dependency-injection concepts from PHP (nominal typing, explicit
`implements`/`extends`) into TypeScript (structural typing, no runtime interface identity) — two
systems that look similar on the surface but are fundamentally incompatible underneath, so
anything crossing the boundary has to be actively reconciled rather than just plugged in. The
1846 break-of-gauge at Gloucester is the same shape of problem in physical form: the GWR's
broad-gauge track and the Midland's narrower gauge could not interoperate, so every passenger and
every piece of luggage had to be manually handed across the platform between two systems that
were both "railways" in name but incompatible in the way that actually mattered. The engraving
was chosen over the other two Gloucester break-of-gauge prints on Commons (832×600 and 894×579)
because it's the highest-resolution of the three and the most content-dense: porters in GWR
uniform mid-handoff, luggage stacked edge to edge, a "TO THE BIRMINGHAM TRAIN" sign visible, no
empty sky or background either side.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `gwr.jpg`:

```bash
# 1. Resize to the target hero width (source was already an effectively-greyscale scan)
convert gwr.jpg -resize 2400x resized.png   # → 2400x1581

# 2. Crop a wide, content-dense band — the porter handoff in the middle of the scene, not the
#    top-hat-and-empty-roof upper portion or the trunk-pile lower portion (chosen by eye after
#    comparing crops at y+450/+650/+850)
convert resized.png -crop 2400x480+0+450 +repage crop-a.png

# 3. Light contrast boost (source already B/W, no -colorspace Gray needed)
convert crop-a.png -brightness-contrast 3x10 crop-grey.png

# 4. Source is a dense cross-hatched engraving upscaled ~1.7x from the 1413px original — the
#    high-frequency line texture compressed poorly even at low WebP quality (q60 still ~198KB),
#    so apply a light blur before compositing/encoding, per the skill's texture-heavy-source
#    fallback (this cut file size by ~35% with no visible softness at on-page display size)
convert crop-grey.png -blur 0x1.0 crop-blurred10.png

# 5. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white gradient-top.png
convert -size 2400x216 gradient:white-black gradient-bottom.png
convert gradient-top.png gradient-bottom.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic/engraving crop has no transparency
#    of its own to preserve, so a straight CopyOpacity replace is correct)
convert crop-blurred10.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    tried on the unblurred crop first, then q65/75 on the blurred version — q75 post-blur was
#    the chosen balance: well under the target range vs. q60-unblurred at ~198KB)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~141KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
used for the hero (same source, different derivation — not a resize-in-place of `hero.webp`):

```bash
# Crop centred on the same porter-handoff group as the hero, at the taller 1200x630 ratio
convert resized.png -crop 1200x630+600+400 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x10 og-grey.png
convert og-grey.png -blur 0x1.0 og-blurred.png   # same texture-heavy-source fallback as the hero
convert og-blurred.png -quality 75 og.jpg
```

Result: 1200×630px JPEG, ~136KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No colourspace conversion was needed — the 1846 engraving scan on Commons is already
  effectively black-and-white, so it sits calmly against the site's blue/white/grey palette with
  just a contrast boost.
- The blur-before-encode step exists specifically because this source is cross-hatched line
  engraving upscaled ~1.7x from a modest 1,413px original — exactly the "rough stone, foliage,
  gravel, brick" high-frequency case the skill calls out, not a default step applied blindly.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality/blur
  values — the source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
