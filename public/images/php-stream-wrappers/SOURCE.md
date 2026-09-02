# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "STEEL MANIFOLD, HIGHLINE PUMPING PLANT" — HAER ARIZ,7-TEMP,6-26, an
  engineering drawing (not a photograph) documenting the discharge steel manifold at the
  Highline Canal and Pumping Station, on the south side of the Salt River between Tempe,
  Phoenix and Mesa, Arizona. Original drawing dated January 7, 1913, for the Salt River Valley
  Water Users' Association / U.S. Reclamation Service, digitised by the Historic American
  Engineering Record (HAER), a National Park Service programme.
- **Source page**:
  <https://commons.wikimedia.org/wiki/File:STEEL_MANIFOLD,_HIGHLINE_PUMPING_PLANT._January_7,_1913_-_Highline_Canal_and_Pumping_Station,_South_side_of_Salt_River_between_Tempe,_Phoenix_and_Mesa,_Tempe,_Maricopa_County,_AZ_HAER_ARIZ,7-TEMP,6-26.tif>
- **Direct file fetched**:
  <https://upload.wikimedia.org/wikipedia/commons/6/65/STEEL_MANIFOLD%2C_HIGHLINE_PUMPING_PLANT._January_7%2C_1913_-_Highline_Canal_and_Pumping_Station%2C_South_side_of_Salt_River_between_Tempe%2C_Phoenix_and_Mesa%2C_Tempe%2C_Maricopa_County%2C_AZ_HAER_ARIZ%2C7-TEMP%2C6-26.tif>
- **Original dimensions**: 5,000×4,003px TIFF, 8-bit greyscale (white line drawing on black
  ground — a photographed engineering drawing, not a photograph of physical hardware)
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties... such work
  is in the public domain in the United States." Verified on the Wikimedia Commons file page at
  fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article explains PHP stream wrappers: a single uniform interface (`fopen()`,
`file_get_contents()`) that routes to different underlying implementations — `file://`,
`http://`, `data://`, custom protocols — through the same `scheme://target` syntax. This
drawing depicts exactly that shape as physical plumbing: a single intake pipe meets a manifold
at a T-junction, then splits into three separate discharge branches, each terminating in its
own cast-iron flange (a distinct connector for a distinct downstream target) — one shared
junction, several interchangeable endpoints. It was chosen over photographic candidates (pump
house exteriors, generic pipe runs) because the manifold's branching structure is the load-
bearing visual, and a drawing makes that structure explicit and legible rather than merely
implied by a photograph of pipework. Also considered: a HAER photograph of gauges/valves at
San Francisco's Pumping Station No. 2 — rejected because a wall of individual gauges/valves
doesn't carry the same "one input, several outputs" narrative as this T-junction manifold.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # → 2400x1921

# 2. Hero crop: the "ELEVATION" view — the T-junction manifold splitting into three diagonal
#    branches with flanged ends (chosen by eye after comparing offsets +950/+1000/+1080; +950
#    was the only one that keeps all three discharge flanges fully in frame)
convert resized.png -crop 2400x480+0+950 +repage crop-test3.png

# 3. Light contrast boost (source is already a stark black/white line drawing, no desaturation
#    needed — it has no colour to remove)
convert crop-test3.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a straight CopyOpacity replace is correct — the
#    crop has no transparency of its own to preserve)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q90/85/80/75/70 all compared — line art on flat black compresses far
#    better than a photograph, so q90 was affordable at only ~98KB; there was no size-vs-detail
#    trade-off to make here, unlike the two photographic hero images before this one)
convert hero-faded.png -quality 90 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~98KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

```bash
# A taller crop from the same resized.png, centred slightly left of the hero crop so the
# "DISCHARGE PIPE FLANGE" label and the first two branch flanges are both in frame at the
# taller 1200x630 aspect ratio
convert resized.png -crop 1200x630+500+780 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 85 og.jpg
```

Result: 1200×630px JPEG, ~102KB. Wired in via `heroImage.ogImage`.

## Why this approach

- No desaturation step needed — the HAER source is a black-and-white line drawing with no
  colour to manage, only a brightness/contrast lift for crispness.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- Unlike the two prior HAER photographs used on this site (bridge trusses, meshing gears), this
  source is a photographed _drawing_, not a photograph of physical hardware — it was picked
  deliberately because the branching-manifold diagram states the "one interface, several
  endpoints" idea more directly than a photo of pipework would.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality — the
  source URL and licence above are exactly what's needed to refetch it from scratch.
