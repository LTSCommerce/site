# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Navy Yard, N.Y. 6-27-41. U.S.S. Iowa, B.B. 61. View about midship looking
  aft" — a photograph of the battleship USS Iowa (BB-61) under construction on the building ways
  at the New York Navy Yard, Brooklyn. The view looks aft down the length of the hull, showing
  the turret barbette rings and machinery housings being installed inside the framed-up hull,
  flanked by the shipway's overhead crane gantries.
- **Source page**: <https://commons.wikimedia.org/wiki/File:19-LCunnumbered.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/f/f5/19-LCunnumbered.tif>
- **Original dimensions**: 5,028×6,053px TIFF (16-bit greyscale)
- **Licence**: Public domain — "a work prepared by an officer or employee of the United States
  Federal Government as part of that person's official duties" (source: U.S. National Archives
  and Records Administration). Verified on the Wikimedia Commons file page at fetch time.
- **Date**: 27 June 1941
- **Fetched**: 2026-09-02

## Why this image

The article covers new capabilities being added to Claude Code over a few months — checkpoints,
subagents, a plugin marketplace, a web interface — features layered onto an already-functional
tool rather than a ground-up rebuild. A warship's hull mid-construction, with turret machinery
and internal structure visibly being fitted into a hull that already has its basic form, is a
direct visual match for "new capability being actively added to something that already works,"
without repeating the toolbox theme used for the custom-commands article or the railway
interlocking theme used for the hooks/subagents article in the same batch.

Two other Bethlehem-Fairfield Liberty ship construction candidates were considered and rejected:
a keel-laying photo at only 821×655px (too low-resolution to crop cleanly at 2400px width), and
a welders-at-work photo that, while extremely high resolution and public domain, prominently
features two named individuals posing for the camera — a different register than every other
hero image on this site, all of which are structure/machinery shots with no posed people. This
USS Iowa photo has tiny, incidental figures in the background only, keeping the frame focused on
the structure itself.

The frame is dense with content edge to edge — hull framing, turret barbette housings, cross-
bracing, cabling, the gantry crane legs converging toward the stern — rather than a wide shot
dominated by open water or sky, and the archival print carries only a thin white margin (no
HAER-style printed label to remove).

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original2.tif`. Note: `identify`/`convert` on this container hit the
default ImageMagick disk-cache policy on a 5,028×6,053 16-bit TIFF (`cache resources exhausted`)
when read directly — the JPEG-scaling trick doesn't apply to TIFF, but a plain full-resolution
`convert` (no `-define jpeg:size`) worked fine for this file; only very large JPEGs needed that
hint in earlier runs of this skill.

```bash
# 1. Resize to the target hero width
convert original2.tif -resize 2400x resized.png   # → 2400x2889

# 2. Hero crop: a wide band across the turret-barbette/machinery region (chosen by eye — this
#    is the densest structural area, avoiding the open-water horizon at the top of the frame
#    and the handwritten caption near the bottom). The archival print has a thin, slightly
#    asymmetric white margin (heavier on the right edge), so the crop insets 70px from the
#    left and 130px from the right before upscaling back to the full 2400px width.
convert resized.png -crop 2200x480+70+982 +repage -resize 2400x480! -depth 8 crop-final.png

# 3. Contrast boost (source is already greyscale, no -colorspace Gray needed)
convert crop-final.png -brightness-contrast 3x10 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the nav, so only the bottom edge needs
#    to fade into the article header)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q85/78/70/60 were
#    compared — q70 was the chosen balance of detail vs size)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~118KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` source used for the hero, at a taller aspect that keeps all four turret barbette
housings and the ring structure in frame:

```bash
convert resized.png -crop 1200x630+600+780 +repage -depth 8 og-crop.png
convert og-crop.png -brightness-contrast 3x10 og-grey.png
convert og-grey.png -quality 75 og.jpg
```

Result: 1200×630px JPEG, ~143KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the NARA source photograph is already greyscale (a 16-bit
  grayscale TIFF), so it sits calmly against the site's blue/white/grey palette without any
  colour-correction risk.
- The archival print's margin is thin and slightly asymmetric rather than a clean rectangular
  border, so it's handled with an inset-then-upscale crop rather than an automated `-trim` (which
  only caught a sliver of the right edge and left visible white slivers in the hero band at
  first pass — confirmed by eye, not assumed).
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
