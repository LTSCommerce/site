# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Interior View of Scale House, Showing Howe Scale" — HAER WYO,23-OSAG.V,1-P-4,
  a black-and-white photograph documenting the interior of the scale house at the Clay Spur
  Bentonite Plant and Camp, on the Clay Spur Siding of the Burlington Northern Railroad, Osage
  vicinity, Weston County, Wyoming. Shows a 10-ton commercial motor truck scale manufactured by
  the Howe Scale Company of Rutland, Vermont, installed before 1940, inside a small corrugated-tin
  scale house. Historic American Engineering Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:INTERIOR_VIEW_OF_SCALE_HOUSE,_SHOWING_HOWE_SCALE_-_Clay_Spur_Bentonite_Plant_and_Camp,_Scale_House,_Clay_Spur_Siding_on_Burlington_Northern_Railroad,_Osage,_Weston_County,_WY_HAER_WYO,23-OSAG.V,1-P-4.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/3/38/INTERIOR_VIEW_OF_SCALE_HOUSE%2C_SHOWING_HOWE_SCALE_-_Clay_Spur_Bentonite_Plant_and_Camp%2C_Scale_House%2C_Clay_Spur_Siding_on_Burlington_Northern_Railroad%2C_Osage%2C_Weston_County%2C_WY_HAER_WYO%2C23-OSAG.V%2C1-P-4.tif>
- **Original dimensions**: 3,938×5,000px TIFF, already greyscale
- **Licence**: "This image or media file contains material based on a work of a National Park
  Service employee, created as part of that person's official duties. As a work of the U.S.
  federal government, such work is in the public domain in the United States." Verified on the
  Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article's central analogy is the "honesty bucket": a car park with a sign reading "£5 per
hour, please pay here" and no barrier, no enforcement — TypeScript's type system checks that
declared types are honest, but nothing stops a developer from lying to it via `any`,
`@ts-ignore`, or a dozen other escape hatches documented in the piece. A commercial platform
scale is a literal, physical version of the same idea: a device whose entire purpose is
verifying that a claimed weight matches the true one. This particular HAER photograph was chosen
over the toll-house and customs-house candidates considered first (both read as small buildings
on a wide, mostly-empty background at hero-banner proportions — the exact composition mistake
flagged in the `article-image` skill's own lessons-learned) because the frame is already dense
with content edge to edge: the Howe-branded scale beam and hanging counterweight roughly
centred, flanked by a ladder and barrel on one side and a stove/canister on the other, with two
windows providing natural light and depth. The scale mechanism itself — a beam, a hanging
counterweight, a branded nameplate certifying it as a genuine Howe scale — is a closer visual
match for "verifying a claim is true" than an abstract building exterior would have been.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # → 2400x3047

# 2. Hero crop: a wide band across the scale mechanism (beam, nameplate, hanging counterweight),
#    chosen by eye to also catch the ladder/barrel on the left and stove/canister on the right —
#    tested two offsets (+0+1420 and +0+1550) and preferred +1420 for keeping the full beam and
#    nameplate in frame rather than cropping into the counterweight alone
convert resized.png -crop 2400x480+0+1420 +repage crop.png

# 3. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q85/q78/q70 compared — 78 was the chosen balance of detail vs size; the
#    source has moderate wood-grain/mechanical texture but nowhere near heavy enough to need the
#    blur-before-encode step)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~75KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same source:

```bash
# A taller crop than the hero, centred higher up so the full scale beam (including the "HOWE"
# nameplate at the top of the arm) is visible, not just its lower half
convert resized.png -crop 1200x630+600+1300 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~103KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
