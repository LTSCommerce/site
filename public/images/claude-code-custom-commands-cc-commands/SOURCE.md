# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "138FW AMXS Tool Crib [Image 1 of 4]" — a colour photograph of a foam
  shadow-board tool drawer ("CAB 5", labelled "HYDRAULIC TOOLS") at the 138th Aircraft
  Maintenance Squadron's tool crib, Tulsa Air National Guard Base, Oklahoma. Each tool sits in
  its own cut foam outline with a printed/barcoded accountability tag, alongside standardised
  ammo-can-style storage boxes. Photographed 15 June 2022 by Airman 1st Class Allen Tyler,
  138th Fighter Wing (Oklahoma Air National Guard), published via DVIDS (Defense Visual
  Information Distribution Service).
- **Source page**: <https://www.dvidshub.net/image/7274488/138fw-amxs-tool-crib>
- **Direct file fetched**: `https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2206/7274488/2000w_q95.jpg`
  (DVIDS serves capped-width derivatives from this CDN path; `2000w` — 1,999×1,428px — was the
  largest variant that returned HTTP 200; wider `2400w`/`full`/`source` all 400'd. The native
  asset is 3,680×2,456px per the photo's own metadata page, but is gated behind a DVIDS
  registration/login for direct download, so this build starts from the 1,999px CDN derivative
  and upscales in Step 1 below — see "Why this approach" for why that's an acceptable trade-off
  here.)
- **Original dimensions (fetched derivative)**: 1,999×1,428px JPEG
- **Licence**: Public domain — "This work ... by A1C Allen Tyler, identified by DVIDS, must
  comply with the restrictions shown on https://www.dvidshub.net/about/copyright." DVIDS states
  all media on the site is produced by the U.S. DoD or a federal agency and is in the public
  domain unless otherwise indicated (confirmed via `https://api.dvidshub.net/docs/copyright`,
  and no other-copyright indication appears on this photo's own page). A work of a U.S. federal
  government employee acting in an official capacity, same public-domain basis as the site's
  existing NPS/HAER hero images.
- **VIRIN**: 220615-Z-YQ313-1002
- **Fetched**: 2026-09-02

## Why this image

The article is about CC-Commands: a repository of custom Claude Code slash commands, each one a
standardised, reusable, labelled tool synchronised across multiple projects. A military tool
crib is a direct, unforced structural match for that idea rather than a metaphor stretch — every
tool has its own cut-out slot, its own accountability tag, and is checked out and returned to
the same standard place every time, exactly like a catalogue of reusable commands kept in sync
across many project checkouts. It was chosen over other tool-storage candidates (a Smithsonian
machinist's tool chest — behind a login-walled image host with no clear direct-fetch path; a
printer's type case — same objection noted in this site's own component-driven-design
SOURCE.md, only CC BY-SA candidates found) because the frame is already dense with content edge
to edge: foam cut-outs, barcoded tags, ammo-can boxes and cabinet signage, with no empty
background to crop around.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
fetched CDN derivative as `original.jpg`:

```bash
# 1. Resize to the target hero width. The fetched derivative is 1,999px wide, narrower than the
#    2,400px hero target, so this is a ~1.2x upscale (not a downscale like the other two hero
#    images on this site) — see "Why this approach" for why that's fine at this content density.
convert original.jpg -resize 2400x resized.png   # → 2400x1714

# 2. Hero crop: a wide band across the densest part of the shadow-board foam — labelled
#    wrenches, barcoded yellow tags, the red rubber sleeve, and the yellow/olive storage boxes —
#    chosen by eye after comparing offsets at y=850/1000/1150 (the lower two read as
#    increasingly close-focus/blurred foreground; y=850 keeps everything in focus)
convert resized.png -crop 2400x480+0+850 +repage crop.png

# 3. Desaturate toward greyscale (source is a colour photo, unlike this site's two prior HAER
#    heroes which were already black-and-white) so the yellow tags/red sleeve don't clash with
#    the site's blue/white/grey palette, plus a light contrast lift
convert crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q65/75/85 compared —
#    q75 was the chosen balance; no blur-before-encode step was needed, unlike the
#    component-driven-design hero, because this source's foam/gravel texture still compressed
#    to a reasonable size without it)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~104KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).
(q65 → ~94KB, q85 → ~151KB — q75 kept the yellow tag barcodes and tool-outline edges legible
while staying well under the ~150KB budget.)

### og.jpg — social card image

```bash
# A different crop from the same resized.png — centred on the red rubber heat-shrink sleeve,
# storage box and barcoded tags, at the taller 1200x630 social-card ratio. Tried a second
# option including the cabinet's top signage strip (og-test1); this crop (og-test2) reads
# denser and sharper at social-card scale, so it was the one kept.
convert resized.png -crop 1200x630+600+500 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~115KB. Wired in via the article's `heroImage.ogImage` field.

## Why this approach

- **Upscaling from a 1,999px source, not downscaling from something larger.** DVIDS' CDN caps
  unauthenticated derivatives at `2000w`; the site's registration flow was skipped to keep this
  build to publicly-fetchable URLs only. A ~1.2x upscale on a sharp, well-lit, high-detail
  source photo (originally 3,680×2,456px) produces no visible softness at the hero's on-page
  display size, verified by inspecting the final crop directly. If a sharper source is ever
  needed, re-fetch via a DVIDS account and rerun from Step 1 with the true full-resolution file.
- **Desaturation matters here** in a way it didn't for the site's two prior hero images — both
  of those sourced already-greyscale HAER archival photography, while this is a colour photo
  with a genuinely orange/yellow/red palette that would otherwise clash with the site's
  blue/white/grey scheme.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the same CDN derivative (or a higher-resolution
  authenticated fetch) with new crop offset/quality values — the source URL and licence above
  are exactly what's needed to refetch it from scratch if this processed copy is ever lost.
