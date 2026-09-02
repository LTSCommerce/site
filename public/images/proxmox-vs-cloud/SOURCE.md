# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Power Room Interior, Detail Caterpillar Diesel Engine, Generator on
  Right" — a photograph documenting the private diesel-generator power house at Death
  Valley Ranch (widely known as "Scotty's Castle"), a privately built desert estate near
  Death Valley Junction, Inyo County, CA. The estate generated its own electricity on-site
  rather than drawing from a public utility grid — two Caterpillar diesel engine/generator
  units are visible in the frame, side by side.
- **Source page**: <https://commons.wikimedia.org/wiki/File:POWER_ROOM_INTERIOR,_DETAIL_CATERPILLAR_DIESEL_ENGINE,_GENERATOR_ON_RIGHT_-_Death_Valley_Ranch,_Power_House,_Death_Valley_Junction,_Inyo_County,_CA_HABS_CAL,14-DVNM,1-E-22.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/2/26/POWER_ROOM_INTERIOR%2C_DETAIL_CATERPILLAR_DIESEL_ENGINE%2C_GENERATOR_ON_RIGHT_-_Death_Valley_Ranch%2C_Power_House%2C_Death_Valley_Junction%2C_Inyo_County%2C_CA_HABS_CAL%2C14-DVNM%2C1-E-22.tif>
- **Original dimensions**: 4,993×3,591px TIFF, 8-bit grayscale, ~17.1MB
- **Licence**: Public domain — "This image or media file contains material based on a work
  of a National Park Service employee, created as part of that person's official duties. As
  a work of the U.S. federal government, such work is in the public domain in the United
  States." Documented under the Historic American Buildings Survey (HABS), a National Park
  Service programme; digitised copy held by the Library of Congress. Verified on the
  Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article argues for owning and operating your own Proxmox infrastructure rather than
renting a public cloud provider's utility compute — cost predictability, direct hardware
control, no surprise bills. Scotty's Castle's power house is a literal, non-metaphorical
match for that argument from the pre-electrical-grid era: instead of connecting to a public
utility, the estate installed and ran its own diesel generating plant on-site. Two
generator units stand side by side in the frame, which reads closer to "a small cluster of
infrastructure you run yourself" than a single isolated engine would (the companion
Fairbanks-Morse photograph, HABS CAL,14-DVNM,1-E-23, shows only one unit and was considered
but not used, for that reason). The photograph is also already black-and-white HABS
documentation photography — no desaturation artefacts to manage — and the frame is dense
with mechanical detail (engine block, wiring, gauge cluster, generator housings, concrete
plinths) edge to edge, satisfying the skill's "wide, content-dense" composition guidance
rather than a small subject on empty background.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width (source was already 8-bit grayscale, no -colorspace
#    Gray conversion needed)
convert original.tif -resize 2400x resized.png   # → 2400x1726

# 2. Crop a wide band from the densest machinery region (chosen by eye after comparing
#    three vertical offsets — +0+280 caught too much wall/void at top-left, +0+680 caught
#    too much floor/shadow void at bottom-left; +0+480 balances mechanical detail across the
#    full width: generator drum on the left, engine block and gauge cluster in the middle,
#    second generator housing plus concrete plinth on the right)
convert resized.png -crop 2400x480+0+480 +repage crop.png

# 3. Light contrast boost (source already greyscale)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the top of the page under the translucent nav, so only
#    the bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of
#    its own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85
#    were all tried — 78 was the chosen balance: ~99KB, clearly readable mechanical detail,
#    well under the ~150KB target; q85 landed at ~144KB for only a marginal detail gain)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~99KB (98,840 bytes), alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at
a roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page
hero (5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a
separate, fully opaque asset at the conventional 1200×630 social-card size, cropped from the
same `resized.png` used for the hero (same source, different derivation — not a re-fetch
and not a resize-in-place of `hero.webp`):

```bash
# Crop offset chosen by eye from three candidates at x=300/600/900 — +600+350 captures the
# same engine-block/gauge-cluster/generator-housing detail as the hero crop, at the taller
# 1200x630 aspect ratio, without cutting off the generator drum on the right
convert resized.png -crop 1200x630+600+350 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~131KB (130,949 bytes). Wired in via the article's
`heroImage.ogImage` field, which `entry-server.tsx`/`prerender.mjs` use for that route's
`og:image`/`twitter:image` meta tags instead of falling back to the site-wide default.

## Why this approach

- No desaturation was needed — the HABS source photograph is already 8-bit grayscale, so it
  sits calmly against the site's blue/white/grey palette without any colour processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient
  overlay — one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade,
  not the top, since the nav itself provides the top transition.
- The two-generator-unit composition was chosen over the companion single-engine photograph
  (HABS CAL,14-DVNM,1-E-23, Fairbanks-Morse engine) specifically because it reads as "a
  small set of infrastructure you run yourself," a closer visual match to a Proxmox cluster
  than a single isolated machine.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
