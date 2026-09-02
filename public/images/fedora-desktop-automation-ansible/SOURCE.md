# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Mission control center" — an overall view of the Shuttle (White) Flight
  Control Room in Johnson Space Center's Mission Control Center, captured during STS-114
  simulation activities. Photo ID JSC2005-E-09159, catalogued by Lyndon B. Johnson Space Center.
  Photographed 4 March 2005.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Mission_control_center.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/3/3b/Mission_control_center.jpg>
- **Original dimensions**: 3,000×2,000px JPEG
- **Licence**: Public domain — "This file is in the public domain in the United States because
  it was solely created by NASA." Verified on the Wikimedia Commons file page at fetch time
  (works created by NASA, a US federal government agency, carry no copyright).
- **Fetched**: 2026-09-02

## Why this image

The article is about turning Ansible into a repeatable, idempotent recipe for configuring a
Fedora desktop identically every time — the opposite of ad hoc, by-hand setup. A NASA Mission
Control room is a strong, unforced fit for that idea: dozens of near-identical console
workstations, each built to the same standard so any operator's station behaves exactly like the
next, all watched over from one coordinating view. It also avoids the record-keeping/database
angle used by `ansible-fact-caching-problems` and the general server/network-infrastructure angle
likely used elsewhere in the Ansible article set — this is specifically about _workstation_
configuration, and a room full of individually-manned but identically-equipped desks reads as
workstations, not server racks.

The wide elevated shot was chosen over other Mission Control candidates because it's already
dense edge to edge — rows of monitors, keyboards, paperwork and desk consoles fill the frame with
no large empty background — which crops cleanly to the site's 5:1 hero band without leaving dead
space at either side.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png   # → 2400x1600

# 2. Crop a wide band from the densest console-row region (chosen by eye — the tiered rows of
#    workstation desks and monitors in the lower two-thirds of the room, not the large wall
#    displays at the very top or the dark ceiling area)
convert resized.png -crop 2400x480+0+560 +repage crop-test1.png

# 3. Desaturate toward greyscale so the source's blue-lit-room colour cast never clashes with
#    the site's own blue/white/grey palette, plus a light contrast lift
convert crop-test1.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q70/78/85 were all
#    tried — q78 was the chosen balance: q70 saved ~20KB more but visibly softened the small
#    console-screen text/detail that makes the crop read as "workstations", q85 gained little
#    over q78 for ~45KB more)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~119KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=graya alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
used for the hero (same source, different framing — not a re-derivation or a resize of the hero):

```bash
# Centred horizontally on the same 2400-wide resize, offset up slightly from the hero crop so
# the taller 630px frame also catches a sliver of the big wall displays at the very top of the
# room for context, while keeping the same dense console rows as the main subject
convert resized.png -crop 1200x630+600+490 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~128KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- Greyscale desaturation strips out the source's blue console-glow cast so it sits calmly
  against the site's blue/white/grey palette rather than competing with it.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- No credit text is baked into either image — attribution lives in the article's byline meta row
  via `heroImage.creditText`/`creditUrl`, per the site's established pattern.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
