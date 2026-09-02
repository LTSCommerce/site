# Source: hero.webp

## Provenance

- **Original work**: photograph of a coiled corn snake (_Pantherophis guttatus_) on grass,
  Everglades National Park, taken 2012-04-29.
- **Source page**: <https://commons.wikimedia.org/wiki/File:A_close_up_of_a_coiled_up_Corn_snake_on_the_grass._(00f0e1dc-b4b7-4ab6-b124-bcddd284a68e).jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/3/3e/A_close_up_of_a_coiled_up_Corn_snake_on_the_grass._%2800f0e1dc-b4b7-4ab6-b124-bcddd284a68e%29.jpg>
- **Original dimensions**: 3150×2092px JPEG
- **Licence**: Public domain — a work of a National Park Service employee created as part of
  official duties, a work of the U.S. federal government. Verified on the Wikimedia Commons
  file page at fetch time.
- **Fetched**: 2026-09-02

## Why this replaced the first version

The first version of this hero used a historical alchemical ouroboros manuscript illustration
(Chrysopoeia of Cleopatra) — thematically exact but visually a small emblem with a lot of empty
space around it at hero-banner width, reading as an icon rather than a hero image. Joseph asked
for something wide and full of visual content instead; strict ouroboros-specificity wasn't
required ("a snake picture would be OK"). This coiled, tightly-framed photograph fills the full
width with detail. The manuscript image may be worth reusing elsewhere (it's still a strong,
precise image) — it isn't deleted from history, just not used as this article's hero.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `corn-snake-original.jpg`:

```bash
# 1. Resize to the target hero width
convert corn-snake-original.jpg -resize 2400x snake-resized.png

# 2. Crop a wide band from the densest, most detailed part of the frame (adjust the +X+Y
#    offset by eye per source image — there's no formula for "most interesting region",
#    view the resized image first and pick a crop that keeps the subject filling the frame)
convert snake-resized.png -gravity center -crop 2400x480+0+40 +repage \
  -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 snake-crop-grey.png

# 3. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge — where it meets the article header — needs to fade; the top is covered by
#    the translucent nav, not faded)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert \( -size ${W}x${OPAQUE_H} xc:white \) \( -size ${W}x${FADE_H} gradient:white-black \) -append gradient-mask.png

# 4. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, unlike the line-art version, so a straight CopyOpacity replace is
#    correct here — no need for the multiply-alphas step the manuscript version needed)
convert snake-crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 5. Encode to WebP with alpha preserved, quality-controlled for file size
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~103KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=graya alpha=True`).

## Why this approach

- Desaturated to near-greyscale specifically so an arbitrary source photo's colour palette
  never clashes with the site's own palette (blue primary, white/grey neutrals) — greyscale
  always sits calmly against it regardless of what colour the original subject was.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/`W`/`H`/fade
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
