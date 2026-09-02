# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Freezer Storage" — HAER AL-188-22, a black-and-white architectural
  documentation photograph of the freezer storage room at the Atlantic Ice and Coal Company ice
  manufacturing and cold storage plant, 135 Prince Street, Montgomery, Alabama. Shows a
  first-floor storage bay: rows of pipe-frame storage racks holding wooden pallets, receding
  into depth past a concrete support column, under overhead ductwork. Photographed 2000 by Jet
  Lowe for the Historic American Engineering Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:FREEZER_STORAGE._-_Atlantic_Ice_and_Coal_Company,_135_Prince_Street,_Montgomery,_Montgomery_County,_AL_HAER_AL-188-22.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/7/7f/FREEZER_STORAGE._-_Atlantic_Ice_and_Coal_Company%2C_135_Prince_Street%2C_Montgomery%2C_Montgomery_County%2C_AL_HAER_AL-188-22.tif>
- **Original dimensions**: 5,101×3,684px TIFF, already greyscale
- **Licence**: Public domain — a work created by a National Park Service employee, a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time
  ("This image or media file contains material based on a work of a National Park Service
  employee, created as part of that person's official duties. As a work of the U.S. federal
  government, such work is in the public domain in the United States.").
- **Fetched**: 2026-09-02

## Why this image

The article distinguishes caching (storing computed results so a costly derivation is never
repeated) from memoization (a narrower, function-scoped case of the same idea). A cold storage
warehouse — a room built specifically to hold things now so they can be retrieved fast and
cheaply later, instead of re-acquiring them from scratch — is a direct, unforced fit for that
idea. This particular HAER photograph was chosen over the companion "COLD STORAGE." frame
(HAER AL-188-21, same building) because it fills the frame edge to edge with dense structural
content — receding rows of pipe-frame storage racks, wooden pallets, a load-bearing column, and
overhead ductwork — where the other frame was a mostly-empty room with a small stack of pallets
in one corner and a lot of bare floor. Composition-dense wins over a technically-on-theme but
sparse alternative, consistent with the lesson recorded in this skill from its first run.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png                  # -> 2400x1733

# 2. Remove the HAER archival photo-frame border (black border strip along the edges,
#    part of the archival print, not the photographed subject)
convert resized.png -fuzz 8% -trim +repage trimmed.png          # -> 2343x1670
convert trimmed.png -resize 2400x clean-resized.png             # -> 2400x1711

# 3. A second manual crop to clear a residual corner vignette the auto-trim didn't fully
#    remove, then resize back up to the working width
convert clean-resized.png -crop 2360x1670+20+20 +repage clean2.png
convert clean2.png -resize 2400x clean2-resized.png             # -> 2400x1698

# 4. Hero crop: a wide band across the storage-rack rows (chosen by eye - the densest
#    structural region, mid-frame, avoiding the emptier floor area visible higher up
#    and the darker upper background)
convert clean2-resized.png -crop 2400x480+0+650 +repage final-crop.png

# 5. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert final-crop.png -brightness-contrast 3x8 crop-grey.png

# 6. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge - where it meets the article header - needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 7. Apply the gradient as the alpha channel (a photographic crop has no transparency of
#    its own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 8. Encode to WebP with alpha preserved, quality-controlled for file size (q85/75/65 were
#    compared - 124KB/86KB/77KB respectively; q75 chosen as the balance of detail vs size,
#    no blur-before-encode needed since this source has no high-frequency stone/foliage
#    texture to fight)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~86KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=graya alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same cleaned
source (`clean2-resized.png` from step 3 above, not a re-fetch and not a resize of `hero.webp`):

```bash
# A different crop from the same clean2-resized.png - centred on the same rack/pallet/column
# cluster as the hero, just at a taller aspect ratio so more of the receding depth is visible
convert clean2-resized.png -crop 1200x630+700+500 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~110KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the HAER source photograph is already black-and-white, so
  it sits calmly against the site's blue/white/grey palette without any processing.
- No blur-before-encode was needed — unlike a stone-wall or foliage source, this photograph's
  high-frequency detail (rust texture, spiderwebs, pallet wood grain) wasn't inflating the WebP
  file size beyond the usual range even at the higher quality settings tried.
- The extra manual crop in step 3 (on top of the fuzz-trim in step 2) was needed because the
  auto-trim alone left a small residual dark vignette in one corner of the archival print border
  — checked by eye against the resized preview before committing to a hero crop offset.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
