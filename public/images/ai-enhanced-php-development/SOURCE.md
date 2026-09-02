# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "NASA Differential Analyzer" — a black-and-white photograph of a technician
  operating the control console of a mechanical differential analyzer (an analogue computer used
  for solving differential equations), with a dense wall of patch-panel switchboards and dial
  units filling the background. Catalogued by NASA under the Lewis Flight Propulsion Laboratory
  (now NASA John H. Glenn Research Center), Cleveland, Ohio. Photo ID GPN-2000-000353, dated
  5 June 1951.
- **Source page**: <https://commons.wikimedia.org/wiki/File:NASA_Differential_Analyzer.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/7/79/NASA_Differential_Analyzer.jpg>
- **Original dimensions**: 3,000×2,400px JPEG, already greyscale
- **Licence**: Public domain — quoted verbatim from the Wikimedia Commons file page: "This file
  is in the public domain in the United States because it was solely created by NASA." Verified
  on the file's own Commons page at fetch time (not inferred from a search snippet).
- **Fetched**: 2026-09-02

## Why this image

The article covers AI-assisted PHP development — tools like Copilot amplifying an existing
developer's skill rather than replacing it. A generic "robot"/circuit-board stock image was
avoided as a cliché. Instead: a person operating a complex calculating machine, hands on the
controls, is a direct visual analogue for "a tool that amplifies human work" without depicting
AI literally — the same augmentation relationship, one era earlier. A companion candidate
(`KayMcNultyAlyseSnyderSisStumpDifferentialAnalyzer.jpg`, showing three ENIAC-era human
computers at a differential analyzer, also US-federal public domain) was considered and rejected:
its native resolution (1,563×1,084) would have needed ~1.5x upsampling to hit the 2,400px hero
width, and its background wall had dead/empty space that didn't fill a wide 5:1 crop as densely
as this one. This NASA photograph was chosen because the patch-panel switchboard behind the
operator already fills the frame edge to edge with dense mechanical texture at full native
resolution — no upsampling needed for a 2,400px-wide hero.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width (source is already greyscale, no -colorspace Gray needed)
convert original.jpg -resize 2400x resized.png          # → 2400x1920

# 2. Light contrast boost
convert resized.png -brightness-contrast 3x8 crop-grey-full.png

# 3. Hero crop: a wide band across the patch-panel wall, including the operator's head/torso
#    and hands on the console switches (offset chosen by eye — this band avoids the mostly-empty
#    floor visible in the lower half of the original frame)
convert crop-grey-full.png -crop 2400x480+0+150 +repage crop-final.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-final.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/75/80/85 were
#    all tried — 37.6KB/42.7KB/45.6KB/57.9KB/77.1KB respectively; q80 was chosen because this
#    source has plenty of headroom under the usual ~100-140KB budget and the extra detail in the
#    patch-panel wiring is worth keeping at that budget — no blur-before-encode step was needed,
#    this source isn't high-frequency-noise-heavy the way stone/foliage textures are)
convert hero-faded.png -quality 80 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~57.9KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
source used for the hero (same source, taller framing — not a re-derivation):

```bash
# Same crop-grey-full.png as step 2 above, different crop window/ratio: centred further right
# than the hero crop to keep the operator, the paper-tape spool, and a good slice of the wired
# patch panel all in frame at the taller 1200x630 aspect (two offsets were tried: +700+0 and
# +750+50; +700+0 gave the better balance of panel wiring vs. operator, so that's the one used)
convert crop-grey-full.png -crop 1200x630+700+0 +repage og-crop.png
convert og-crop.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~103.6KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`'s `getImageForRoute()` picks up automatically for that route's
`og:image`/`twitter:image` meta tags.

## Why this approach

- No desaturation step was needed — the NASA source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- The hero crop deliberately favours the upper portion of the original frame (patch panel +
  operator's head/torso) over the lower portion (mostly bare floor) to keep the 5:1 band
  content-dense edge to edge, per the skill's composition guidance.
- To rebuild for new styling, rerun from the original JPEG with new crop offsets/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
