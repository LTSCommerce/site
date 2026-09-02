# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Valves under central corridor of filtration bed building. Main flood
  valves is at left and crossover valve is at right." — HAER CT-186-A-30, a black-and-white
  architectural documentation photograph of the Lake Whitney Water Filtration Plant, Filtration
  Bed Building, 2600 Whitney Avenue, Hamden, New Haven County, Connecticut. Historic American
  Engineering Record (HAER), a National Park Service programme; original negative held by the
  Library of Congress.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Valves_under_central_corridor_of_filtration_bed_building._Main_flood_valves_is_at_left_and_crossover_valve_is_a_right._-_Lake_Whitney_Water_Filtration_Plant,_Filtration_Plant,_South_HAER_CT-186-A-30.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/6/68/Valves_under_central_corridor_of_filtration_bed_building._Main_flood_valves_is_at_left_and_crossover_valve_is_a_right._-_Lake_Whitney_Water_Filtration_Plant%2C_Filtration_Plant%2C_South_HAER_CT-186-A-30.tif>
- **Original dimensions**: 4,263×5,350px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work of
  the U.S. federal government, such work is in the public domain in the United States." Verified
  on the Wikimedia Commons file page at fetch time (extmetadata `LicenseShortName: Public domain`,
  `Restrictions: ` empty).
- **Fetched**: 2026-09-02

## Why this image

The article documents PHP-QA-CI: a single Composer dependency that runs a dozen QA tools in a
fixed, fail-fast sequence — each tool is a gate the codebase must pass before the pipeline moves
to the next one. This photograph shows a bank of manually-operated gate valves ("main flood
valve", "crossover valve") controlling sequential stages of a water filtration process — a
literal bank of gates in a row, in a system whose entire purpose is staged, sequential quality
control of water before it's fit to use. That's a direct structural match for a QA pipeline,
not a stretched metaphor.

Two other Lake Whitney candidates from the same HAER survey were considered and rejected:

- **A-31/A-32** ("Piping under central corridor") — a single valve in tight foreground close-up
  with pipes receding into shadow; reads as one component, not a row of sequential gates.
- **A-15/A-16** ("View west of central corridor between filtration beds") — a long corridor
  perspective, but mostly empty floor and ceiling with the filtration beds off to the sides,
  too sparse for a dense hero crop.

A-30 was chosen because two full valve assemblies (bonnets, wheel-actuator stems, and the pipe
run connecting them) sit side by side filling the frame edge to edge, with a diagonal overhead
pipe run tying them together visually — dense, mechanical, and legible as "more than one gate in
a row" even at hero-banner proportions.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width (source is already greyscale, no desaturation needed)
convert original.tif -resize 2400x resized.png   # → 2400x3012

# 2. Hero crop: a wide band across both valve bonnets + the diagonal overhead pipe run
#    (chosen by eye after comparing four candidate y-offsets — this one keeps both valve
#    domes and the connecting pipe fully in frame with no dead space at the crop edges)
convert resized.png -crop 2400x480+0+1350 +repage crop.png

# 3. Light contrast boost
convert crop.png -brightness-contrast 3x8 crop-grey.png

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
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried — this source compressed cleanly with no blur needed, unlike the high-texture
#    stone-wall source used for the component-driven-design article; 78 was the chosen balance)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~60KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` used for the hero — same source, same framing family, different aspect ratio:

```bash
convert resized.png -crop 1200x630+600+1150 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~99KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the HAER source is already black-and-white, so it sits
  calmly against the site's blue/white/grey palette without any extra processing.
- No blur-before-encode step was needed either — unlike the stone-wall texture on the
  component-driven-design article's gear photograph, this source's dominant surfaces (painted
  cast iron, smooth concrete) compressed to WebP at well under the ~100–140KB target without any
  visible loss even before trying a blur, so that step was skipped (checked, not assumed).
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, not the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
