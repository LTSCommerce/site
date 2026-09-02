# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Reform clock movement" — a macro photograph of the interior movement
  (balance wheel, escapement, mainspring barrel, regulator arm) of a Swiss-made Reform Brevet
  solenoid self-winding clock, viewed with the back cover removed. Photographed by Wikimedia
  contributor "Anonimski" on 29 November 2013 (Panasonic DMC-LX3).
- **Source page**: <https://commons.wikimedia.org/wiki/File:Reform_clock_movement.JPG>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/d/d0/Reform_clock_movement.JPG>
- **Original dimensions**: 2,273×2,273px JPEG
- **Licence**: "This file is made available under the Creative Commons CC0 1.0 Universal Public
  Domain Dedication. The person who associated a work with this deed has dedicated the work to
  the public domain by waiving all of their rights to the work worldwide under copyright law,
  including all related and neighboring rights, to the extent allowed by law." Verified on the
  Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about systemd timers replacing cron for scheduled tasks — a subject about
mechanical/software timing and scheduling. A literal timekeeping mechanism is a direct fit
without being a screenshot of a terminal or a unit file. The
`component-driven-design-react-typescript-storybook` article already uses a HAER marine-railway
gears photograph, so a second "gears" HAER image was deliberately avoided in favour of a
different subject entirely: an actual
clock movement, its own dedicated regulating/escapement mechanism, which is a closer visual
metaphor for a _timer_ specifically (as opposed to gears standing generically for "components
meeting"). This candidate was chosen over a documentation-style photo of a complete Simplex/Bundy
time-recorder unit (also PD, but presented as a single vertical object on a near-empty background
— exactly the "small icon on a big empty banner" composition problem flagged in the skill's
lessons-learned) because the movement photograph fills the frame edge to edge with dense
mechanical detail (balance wheel, gear train, engraved "REFORM BREVET" plate, mainspring barrel,
regulator weights) at every crop tested.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width (source is almost exactly square at 2273px, so this is a
#    ~5.6% upscale to 2400x2400, not a downscale)
convert original.jpg -resize 2400x resized.png   # → 2400x2400

# 2. Hero crop: a wide band across the vertical middle of the circular movement, where the
#    circle is widest and the frame is filled edge to edge with mechanism detail (balance wheel
#    bridge, "REFORM BREVET" engraved plate, gear train, two ball-weighted regulator arms).
#    Offsets +780 (too high, more empty background top corners) and +1050 (too low, dominated
#    by the plain mainspring/battery cylinder) were tried and rejected by eye before +950.
convert resized.png -crop 2400x480+0+950 +repage crop.png

# 3. Desaturate toward greyscale — the source has warm brass/gold tones that would clash with
#    the site's blue/white/grey palette
convert crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the translucent nav, so only
#    the bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried — 104KB/120KB/146KB/202KB respectively; q70 was the chosen balance of detail vs
#    size, consistent with the other HAER-sourced hero image on this site)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~117KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`;
alpha sampled at 255 in the opaque zone and 11 near the bottom edge).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
— same source, different derivation, same subject family (the "REFORM BREVET" plate and gear
train) but framed taller to suit the 1.91:1 ratio:

```bash
convert resized.png -crop 1200x630+600+750 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~140KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- Desaturation to greyscale removes the source's warm brass/gold cast so it sits calmly against
  the site's blue/white/grey palette, matching the treatment given to every other hero image on
  this site.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- No blur-before-encode step was needed — unlike the stone-wall-textured gears source used
  elsewhere on this site, this source's high-frequency detail (brushed metal, fine engraving)
  compressed cleanly to WebP well within the usual ~100–140KB range at q70 with no visible
  softening required.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
