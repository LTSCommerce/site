# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Sunset Seen Through Smog" — NARA 542680, a colour documentation photograph
  showing the sun low in a hazy, deep-orange-to-red sky over a mountain ridge near Los Angeles.
  Photographed May 1972 by Gene Daniels for the EPA's DOCUMERICA project (a photographic survey
  of US environmental subjects, 1972–1977), held by the National Archives and Records
  Administration (NARA).
- **Source page**: <https://commons.wikimedia.org/wiki/File:SUNSET_SEEN_THROUGH_SMOG_-_NARA_-_542680.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/e/ed/SUNSET_SEEN_THROUGH_SMOG_-_NARA_-_542680.jpg>
- **Original dimensions**: 3,000×2,049px JPEG (scanned 35mm slide, with a visible black slide-mount
  border and rounded corners baked into the scan — removed during processing, see below)
- **Licence**: Public domain — "This image (or other media) is a work of an Environmental
  Protection Agency employee, taken or made as part of that person's official duties. As works
  of the U.S. federal government, all EPA images are in the public domain." Verified on the
  Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article ("Dynamic Gradient Headings") is about a CSS/JS technique for mouse-responsive
gradient text — literally a colour gradient as the subject matter. Rather than reach for an
abstract mechanical metaphor, this photograph makes the connection direct: a real, continuous
colour gradient in nature — pale gold at the top, through orange, into deep red-black at the
bottom — with the sun itself as a bright focal point, not unlike the way the article's gradient
sweeps from one hue to another around a moving anchor point. Two other candidates were
considered and rejected: prism/spectroscope diagrams on Commons were mostly low-resolution line
art or diagrams (not photographs, and too small/schematic for a wide hero banner), and dye-vat/
textile-mill photographs didn't turn up a genuinely public-domain candidate with a strong colour
gradient in frame. This DOCUMERICA sunset was chosen because the frame is dense with gradation
edge to edge in the exact aspect ratio a hero crop needs, it is federal-government public domain
with no attribution obligation, and the subject (haze-scattered sunset light) is itself a
physical example of continuous colour transition.

## Colour treatment: kept warm, not desaturated to greyscale

Every previous hero image on this site was desaturated toward greyscale specifically so an
arbitrary source photograph's colour never fights the site's own blue/white/grey palette. That
default was deliberately **not** applied here: the whole point of choosing this image is that its
colour gradient is the visual argument, and flattening it to greyscale would remove the one thing
that makes it relevant to the article. Instead the source's very saturated warm colour (a scanned
colour slide, boosted further by the original photo's own colour-grade) was **moderately muted** —
saturation pulled back to 68% and a mild contrast lift — so it reads as a calm, editorial-toned
photograph rather than a saturated postcard-orange banner shouting over the page. This is a
conscious exception to the greyscale default, not an oversight; if the site's palette or an
editor's taste changes later, rerunning the recipe below without the `-modulate` step recovers
the original colour intensity.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to a working width
convert original.jpg -resize 3000x work.png                       # → 3000x2049 (no-op resize,
                                                                    #   source was already 3000 wide)

# 2. The source is a scanned 35mm slide with its own black mount border and rounded corners
#    baked into the frame — not the photographed subject. -fuzz trim alone did not reliably
#    catch it (the border blends into the dark corners), so the border was removed with a
#    fixed inset crop instead, judged by eye from the resized image:
convert work.png -resize 2400x resized.png                        # → 2400x1639
convert resized.png -crop 2280x1500+60+70 +repage clean.png       # inset ~60-70px each side,
                                                                    # slightly more off the bottom
                                                                    # to clear a faint scan-edge
                                                                    # ridge in that corner
convert clean.png -resize 2400x clean-resized.png                 # back to full hero width → 2400x1579

# 3. Hero crop: a wide band capturing the full gold→orange→red gradation around the sun, with
#    a hint of the mountain silhouette bottom-right for grounding (offset chosen by eye — three
#    vertical offsets were tried; +160 was the one that fit the most colour range into the frame
#    without cropping into the mountain or losing the pale-gold top band)
convert clean-resized.png -crop 2400x480+0+160 +repage hero-crop.png

# 4. Moderate desaturation + mild contrast (see "Colour treatment" above — deliberately NOT
#    full greyscale for this article)
convert hero-crop.png -modulate 100,68,100 -brightness-contrast 2x6 hero-toned.png

# 5. Light blur before encoding — the source is a scanned colour slide with heavy film grain,
#    which is high-frequency noise that WebP compresses poorly (same rationale as the stone-wall
#    texture case in the skill doc, just from grain rather than a rough physical surface)
convert hero-toned.png -blur 0x0.5 hero-blurred.png

# 6. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque.png
convert -size 2400x216 gradient:white-black fade.png
convert opaque.png fade.png -append gradient-mask.png

# 7. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert hero-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 8. Encode to WebP with alpha preserved, quality-controlled for file size (q90/85/78/70 were
#    all tried — q78 was the chosen balance; this source compresses far better than the site's
#    other hero photos because the blur+desaturation left mostly smooth gradation, not fine detail)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~53KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render transparency, so the on-page hero (5:1,
alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized.png` used for the hero (same framing family, taller aspect, sun centred):

```bash
convert clean-resized.png -crop 1200x630+228+0 +repage og-crop.png
convert og-crop.png -modulate 100,68,100 -brightness-contrast 2x6 -blur 0x0.5 og-toned.png
convert og-toned.png -quality 82 og.jpg
```

Result: 1200×630px JPEG, ~95KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- The border-removal step (crop-then-resize-then-crop-again) exists only because this
  particular source is a scanned slide with its own physical mount frame baked into the digital
  scan — not something the previous two HAER photographs needed, since those were plain
  documentation photographs with no frame.
- Desaturation was intentionally partial (68% saturation, not full greyscale) — see "Colour
  treatment" above. This is the one deliberate departure from every prior hero image on this
  site, made because the article's subject is a colour gradient.
- The blur-before-encode step is specific to this source's heavy 1970s colour-slide film grain;
  it is not part of the default recipe and should be re-evaluated (try without it first) for any
  future source that isn't a grainy scanned photograph.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, not the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offsets/quality/
  saturation values — the source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
