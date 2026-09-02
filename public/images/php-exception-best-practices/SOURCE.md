# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Detail of Electrical Panel" — HAER MD-133-16, a black-and-white
  architectural documentation photograph of the main switchboard/electrical panel aboard
  Lightship 116 (Lightship _Chesapeake_), Pier 3, Inner Harbor, Baltimore, Maryland.
  Photographed by Jet Lowe for the Historic American Engineering Record (HAER), a National
  Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:DETAIL_OF_ELECTRICAL_PANEL._-_Lightship_116,_Pier_3,_Inner_Harbor,_Baltimore,_Independent_City,_MD_HAER_MD-133-16.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/7/72/DETAIL_OF_ELECTRICAL_PANEL._-_Lightship_116%2C_Pier_3%2C_Inner_Harbor%2C_Baltimore%2C_Independent_City%2C_MD_HAER_MD-133-16.tif>
- **Original dimensions**: 5,152×3,707px TIFF, already greyscale
- **Licence**: "This image or media file contains material based on a work of a National Park
  Service employee, created as part of that person's official duties. As a work of the U.S.
  federal government, such work is in the public domain in the United States." Verified on the
  Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about PHP exception handling: catching, typing, and not swallowing errors before
they cascade into something worse. A shipboard switchboard/electrical panel — banks of ammeters,
voltmeters, breakers, and clearly labelled buses ("MAIN GEN BUSS", "AUX GEN", "DANGER HIGH
VOLTAGE") designed specifically to detect and interrupt a fault before it propagates — is a
direct visual match for that idea without being a literal code screenshot. It was chosen over a
plain fuse-box search because the frame is already dense edge to edge with real instrumentation
(large analogue gauges, toggle switches, breaker units, riveted plates) at very high original
resolution, rather than a small panel centred on an empty wall. Landscape orientation (unlike
most HAER interior shots, which run portrait) made a wide 5:1 hero crop straightforward without
upscaling.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to a working width, then remove the HAER archival photo-frame border (black
#    border strip on all four sides, printed as part of the archival print, not the
#    photographed subject) — a fuzz-trim gets most of it, a manual crop cleans up the rest
convert original.tif -resize 2400x resized.png                # → 2400x1727
convert resized.png -fuzz 8% -trim +repage trimmed.png        # → 2348x1674
convert trimmed.png -crop 2240x1600+45+30 +repage clean.png   # manual crop of remaining border

# 2. Re-resize the cleaned crop to a wider working width (3200, not 2400) specifically so the
#    hero crop below can zoom in on the densest instrument cluster and exclude a person visible
#    in the background at the right edge of the frame, without upscaling anything
convert clean.png -resize 3200x clean-resized3200.png         # → 3200x2286

# 3. Hero crop: a wide band across the ammeter/voltmeter cluster (chosen by eye — this
#    excludes the person standing at the far right of the original photograph, who was still
#    in-frame at a full-width 2400px crop)
convert clean-resized3200.png -crop 2400x480+0+520 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert \( -size ${W}x${OPAQUE_H} xc:white \) \( -size ${W}x${FADE_H} gradient:white-black \) -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q85/78/70/65 were
#    all tried — this source compresses cleanly with no need for a pre-encode blur, so q78 was
#    chosen as the balance of visible instrument detail vs size, well under the ~150KB budget)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~73KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized3200.png` source used for the hero — same framing family, taller aspect, no
transparency:

```bash
# A different crop from the same 3200-wide source, taller than the hero to show the large
# ammeter dial plus the small voltmeter beside it, plus one of the labelled plaques
convert clean-resized3200.png -crop 1200x630+30+380 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~106KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the HAER source photograph is already black-and-white, so
  it sits calmly against the site's blue/white/grey palette with only a light contrast boost.
- The intermediate 3200px-wide re-resize (rather than cropping straight out of the 2400px
  cleaned image) exists specifically to get a tighter, person-free hero crop without upscaling
  — worth recording because it is not obvious from the final asset alone why an extra resize
  step is in the recipe.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values
  — the source URL and licence above are exactly what's needed to refetch it from scratch if
  this processed copy is ever lost.
