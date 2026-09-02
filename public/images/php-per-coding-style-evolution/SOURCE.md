# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Aeronautic instrument exhibit of thermometers, inclinometers, airspeed
  meters, and pressure gages at A.P.S., May 1919" — a black-and-white photograph of a museum/
  exhibition display room at the (then) National Bureau of Standards' Aerodynamical Physical
  Section, showing tables and a pegboard wall laid out with categorised, labelled aeronautic
  measuring instruments (thermometers, inclinometers, airspeed meters, pressure gauges) alongside
  framed reference photos and calibration charts.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Aeronautic_instrument_exhibit_of_thermometers,_inclinometers,_airspeed_meters,_and_pressure_gages_at_A.P.S.,_May_1919.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/9/96/Aeronautic_instrument_exhibit_of_thermometers%2C_inclinometers%2C_airspeed_meters%2C_and_pressure_gages_at_A.P.S.%2C_May_1919.jpg>
- **Original dimensions**: 6,027×4,658px JPEG
- **Licence**: Public domain — "This work is in the public domain in the United States because
  it is a work prepared by an officer or employee of the United States Federal Government as
  part of that person's official duties under the terms of Title 17, Chapter 1, Section 105 of
  the US Code." Credited to NIST (National Institute of Standards and Technology, the National
  Bureau of Standards' modern successor). Verified on the Wikimedia Commons file page at fetch
  time.
- **Fetched**: 2026-09-02

## Why this image

The article is about PHP's PER (PHP Evolving Recommendation) coding style — a standard that is
explicitly versioned and revised over time, unlike PSR's frozen-on-acceptance model. This 1919
Bureau of Standards exhibit photograph shows exactly that idea in physical form: an array of
measuring instruments — the literal tools of "what counts as a correct measurement" — laid out,
categorised by labelled cards (Thermometers / Inclinometers / Airspeed Meters / Pressure Gages),
next to calibration charts recording how each instrument's readings were checked and revised.
A standards body organising and calibrating its own measuring tools is a direct, unforced visual
match for a coding-style standard that organises and revises its own rules. Two rows of the
Aeronautic Instruments Photographic Collection (a wide static team photo, and a single close-up
of one instrument) were considered and rejected: neither filled a wide frame with content the
way this exhibit-room shot does — see the composition note in the skill about avoiding a small
subject on an empty background.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to a wide working width (3200px, not the 2400px hero target) so the hero crop can
#    be positioned within a wider canvas and exclude the sparser left-hand table without
#    upscaling anything
convert original.jpg -resize 3200x resized-wide.png   # -> 3200x2473

# 2. Hero crop: a wide band across the two right-hand tables and the labelled pegboard/gauge
#    panel (chosen by eye — this excludes the left-most table, which has a lot of empty wall
#    above it and reads as sparse at 5:1)
convert resized-wide.png -crop 2400x480+800+1120 +repage crop-final.png

# 3. Light contrast boost (source is already black-and-white archival photography, no
#    -colorspace Gray needed)
convert crop-final.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the
#    bottom edge needs to fade into the article header)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (photographic crop, no existing transparency to
#    preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q85/q75/q65 compared — 75 was the chosen balance of pegboard-texture
#    detail vs file size for this source)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~108KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized-wide.png` used for the hero, at a taller aspect ratio centred on the labelled gauge
panel (the strongest single focal point in the source):

```bash
convert resized-wide.png -crop 1200x630+1600+1050 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~135KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the source is already black-and-white archival photography, so
  it sits calmly against the site's blue/white/grey palette with only a light contrast boost.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav, so only the
  bottom edge needed a fade, not the top.
- The hero and og crops both come from the same `resized-wide.png` intermediate (a wider working
  resize than the hero's own 2400px target) rather than two independent re-derivations, so they
  stay visually consistent as "the same photograph, two different crops."
- To rebuild for new styling, rerun from the original JPEG with new crop offsets/quality values
  — the source URL and licence above are exactly what's needed to refetch it from scratch if
  this processed copy is ever lost.
