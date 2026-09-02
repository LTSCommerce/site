# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Interior of machine shop-lathes" — HAER NC,25-NEBER,29-29, a
  black-and-white architectural/industrial documentation photograph of the machine shop at
  Barbour Boat Works, showing several lathes, a wall of tool racks, chucks, and an electrical
  panel. Photographed 1997 by Jet Lowe for the Historic American Engineering Record (HAER), a
  National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Interior_of_machine_shop-lathes._-_Barbour_Boat_Works,_Tryon_Palace_Drive,_New_Bern,_Craven_County,_NC_HAER_NC,25-NEBER,29-29.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/5/58/Interior_of_machine_shop-lathes._-_Barbour_Boat_Works%2C_Tryon_Palace_Drive%2C_New_Bern%2C_Craven_County%2C_NC_HAER_NC%2C25-NEBER%2C29-29.tif>
- **Original dimensions**: 5,000×3,614px TIFF, 8-bit grayscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties." A work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about the Unix philosophy: small, single-purpose tools that each do one thing
well and compose together into a working system. A machine shop is a direct, literal fit for
that idea rather than a stretched metaphor — a tool room built up from many distinct
purpose-built instruments (lathes, a threader, a grinder, wrenches, dies, an electrical panel)
that only add up to a working shop when used together, each doing its own job. The frame is
already dense with content edge to edge (wall-mounted tool racks and chucks on the left,
multiple lathes and a tarp-covered machine through the middle, a mill and more equipment on the
right), so it reads as a hero band rather than a small subject on empty background. It was also
already black-and-white HAER documentation photography, so no desaturation artefacts to manage.
`php-stream-wrappers` already used a HAER steel manifold engineering drawing for its piping
metaphor, so a machine shop interior — same public-domain HAER/NPS source family, visually
distinct subject — was chosen instead of another pipe/manifold image.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Trim the scan's film-rebate border (a black strip with the "HAER NC-44-29" watermark
#    runs down the right edge, a thinner black strip down the left edge — both outside the
#    actual photographed content). Boundaries found by inspecting 400px-wide strips at each
#    edge: content starts at x=100 and ends at x=4750 out of the original 5000px width.
convert original.tif -crop 4650x3614+100+0 +repage content.tif

# 2. Resize the trimmed content to the target hero width
convert content.tif -resize 2400x resized.png   # -> 2400x1865

# 3. Crop a wide, content-dense band (chosen by eye — the wall of tool racks/chucks/electrical
#    panel plus the lathes' headstock row, not the ceiling/lighting strip above or the open
#    floor below)
convert resized.png -crop 2400x480+0+560 +repage crop.png

# 4. Light contrast boost (source was already greyscale HAER documentation photography, no
#    -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 5. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q65/70/75/80/85
#    were all tried — 75 was the chosen balance of detail vs size: 104KB, clearly sharper than
#    q65/q70, well under the ~150KB budget that q80/q85 start to approach)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~102KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=graya alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same trimmed
`resized.png` used for the hero (same source, taller framing — same wall-of-tool-racks subject,
more headroom and floor context than the 5:1 hero crop allows):

```bash
convert resized.png -crop 1200x630+0+480 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~123KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No further desaturation was needed — the HAER source photograph is already black-and-white,
  so it sits calmly against the site's blue/white/grey palette without any processing.
- The film-rebate border (black strip with the HAER catalogue watermark) had to be trimmed
  before resizing/cropping, or it would show up as a solid black bar at one or both edges of a
  480px-tall band cropped straight from the untrimmed scan — this is the one step that differs
  from the `host-action-bridge` recipe, because that source had no visible scan border in the
  chosen crop region.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
