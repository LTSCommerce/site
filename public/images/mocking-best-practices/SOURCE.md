# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Four Engine USB Model in the 40x80 foot Wind Tunnel" (AC74-2756), a colour
  photograph looking straight up at a four-engine upper-surface-blowing (USB) wind-tunnel test
  model, mounted from below in the National Full-Scale Aerodynamics Complex's 40-by-80-Foot Wind
  Tunnel at NASA Ames Research Center. The model's yellow-painted wing, fuselage, four turbofan
  simulators, and support struts fill the frame edge to edge, with the tunnel's floor grating and
  test-section walls visible around it. Photographed 19 June 1974 (Test #441).
- **Source page**: <https://commons.wikimedia.org/wiki/File:Four_Engine_USB_Model_in_the_40x80_foot_Wind_Tunnel_(AC74-2756).jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/a/a2/Four_Engine_USB_Model_in_the_40x80_foot_Wind_Tunnel_%28AC74-2756%29.jpg>
- **Original dimensions**: 4,771×5,841px JPEG (colour)
- **Licence**: Public domain — "This file is in the public domain in the United States because
  it was solely created by NASA. NASA copyright policy states that 'NASA material is not
  protected by copyright unless noted.'" Verified on the Wikimedia Commons file page at fetch
  time (not inferred from a search snippet).
- **Fetched**: 2026-09-02

## Why this image

The article argues that a mock is a stand-in built to imitate a real dependency's interface for
testing purposes — useful in the right dose, actively harmful when it replaces the thing under
test rather than merely isolating it. A full-scale wind-tunnel test model is the physical-world
version of exactly that trade-off: an aircraft's aerodynamic surfaces and engine nacelles
reproduced faithfully enough to be tested under real airflow, without needing the real aircraft
in the air. It stands in for the genuine article at the interface that matters (the shape the
air sees) while everything behind that interface is scaffolding — struts, mounting hardware, a
sting — built only to hold the test subject in place, exactly the way a test double reproduces
only the interface a test needs and no more.

Other candidates considered and rejected:

- A Convair F-106 scale model in NASA Lewis's 8×6-Foot Supersonic Tunnel (grc-1967-c-04055) —
  thematically apt (a scale model standing in for the real aircraft) but only 1,024×724px at
  source, too small to resize up to a 2400px-wide hero without visible softness.
- A SCAT-16 variable-sweep model in Ames's 40×80 tunnel (AC-31300) — high resolution and public
  domain, but the model occupies only the left third of the frame with a large, mostly empty
  dark tunnel ceiling filling the rest; a 2400×480 band crop from it reads as a small subject in
  a lot of black space, the exact composition problem flagged in the skill's own lessons.
- "Assembling a crash test dummy.png" — directly on-theme (a dummy is literally a stand-in), but
  licensed CC BY-SA 4.0 (share-alike), not public domain; a clean PD alternative was preferred
  over carrying a share-alike obligation on the derivative.

This USB model photograph was chosen instead because it is public domain, very high resolution,
and — critically — the model, its mounting hardware, and the tunnel structure around it fill the
frame completely with no dead space at any crop offset tried.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero working width
convert original.jpg -resize 2400x resized.png   # → 2400x2938

# 2. Crop a wide band across the engine/wing/fuselage row (chosen by eye after comparing bands
#    at y=1000/1150/1300/1450 — y=1300 captures all four engine nacelles, the fuselage mount,
#    and the wing roots with the least empty tunnel-ceiling space at the top of the frame)
convert resized.png -crop 2400x480+0+1300 +repage crop.png

# 3. Desaturate to greyscale — the source's bright NASA-yellow paint would clash hard with the
#    site's blue/white/grey palette, same reasoning as every other hero image on this site
convert crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white top.png
convert -size ${W}x${FADE_H} gradient:white-black bottom.png
convert top.png bottom.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q85/q78/q70/q60/q50 were compared — q85 landed at ~200KB, well above the
#    usual ~100-150KB target, because of the dense rivet/grating/weathered-paint texture across
#    the whole frame; q70 was the chosen balance, ~107KB with no visible softness at display
#    size — no pre-encode blur was needed to reach that target)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~104KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` used for the hero (same source, different derivation — not a re-fetch and not a
resize-in-place of `hero.webp`):

```bash
# A taller crop centred on the fuselage/mount junction, capturing the same engine row plus more
# of the mounting struts and lighting above — same subject family as the hero, different aspect
convert resized.png -crop 1200x630+600+1100 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 78 og.jpg
```

Result: 1200×630px JPEG, ~116KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- Desaturation is load-bearing here (unlike the two prior hero images, which were already
  black-and-white HAER documentation photos) — the source is a vividly yellow-painted test
  model, and greyscale is what makes it sit calmly against the site's blue/white/grey palette.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality values —
  the source file's URL and licence above are exactly what's needed to refetch it from scratch if
  this processed copy is ever lost.
