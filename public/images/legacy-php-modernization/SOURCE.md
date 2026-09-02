# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Detail of forefoot and steel bow reinforcement, port side" — HAER
  WASH,17-SEAT,10-19, a black-and-white architectural documentation photograph of the wooden
  schooner WAWONA's bow, showing where a steel reinforcement plate has been bolted onto the
  original wooden forefoot, with a second vessel and the dry dock's wooden staging structure
  visible in the background. Historic American Engineering Record (HAER), a National Park
  Service programme. Photographed at Lake Union Dry Dock Company, 1018 Valley Street, Seattle,
  King County, WA.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Detail_of_forefoot_and_steel_bow_reinforcement,_port_side_-_Schooner_WAWONA,_1018_Valley_Street,_Seattle,_King_County,_WA_HAER_WASH,17-SEAT,10-19.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/3/32/Detail_of_forefoot_and_steel_bow_reinforcement%2C_port_side_-_Schooner_WAWONA%2C_1018_Valley_Street%2C_Seattle%2C_King_County%2C_WA_HAER_WASH%2C17-SEAT%2C10-19.tif>
- **Original dimensions**: 5,000×3,574px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work
  of the U.S. federal government, such work is in the public domain in the United States."
  Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about modernizing legacy PHP codebases incrementally — reinforcing an existing,
working system with modern materials and practices rather than scrapping and rebuilding it from
scratch. This photograph shows exactly that, literally: a steel reinforcement plate bolted onto
the original wooden forefoot of an 1897 wooden schooner, photographed during a routine dry-dock
haul-out rather than a full rebuild. The vessel stays substantially the same ship; only the
failure-prone structural point gets reinforced with a modern material. The frame is also
content-dense edge to edge — chain rigging, the reinforcement plate and its bolts, weathered
hull planking, a second vessel and the dock's own wooden staging structure — rather than a
small subject with empty space around it.

Other WAWONA dry-dock photographs from the same HAER survey were considered (e.g. WASH,17-SEAT,
10-62, a wider view of the whole vessel on blocks) but rejected: that frame has a large blank-sky
upper half and reads as a portrait of the ship rather than a dense working scene, whereas 10-19
is already close to a wide-format crop with detail throughout.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to a working width, then remove the HAER archival photo-frame border (black
#    border + a vertical "HAER No. WA-14-19" text label printed along the right edge — both
#    are part of the archival print mount, not the photographed subject)
convert original.tif -resize 2400x resized.png                 # → 2400x1716
convert resized.png -fuzz 8% -trim +repage trimmed.png         # trims the outer white mount
convert trimmed.png -crop 2040x1660+30+20 +repage clean.png    # first pass: crop off black frame
convert clean.png -crop 1980x1600+50+35 +repage clean2.png     # second pass: clean remaining corners
convert clean2.png -resize 2400x clean-resized.png             # → 2400x1939, back to hero width

# 2. Hero crop: a wide band across the reinforcement plate / hull grain / dock staging region
#    (chosen by eye after comparing bands at y=250/450/650/850/900/950/1000 — y=950 was the
#    densest: second vessel's bow, dock staging structure, reinforcement plate with rivets,
#    and hull grain, with minimal flat sky)
convert clean-resized.png -crop 2400x480+0+950 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 3. No blur needed — unblurred WebP at q78 already landed at ~65KB, well under the usual
#    ~100-140KB range (checked before reaching for blur, per the skill's guidance: this
#    source's grain is fine-detail but not as high-frequency-noisy as raw stone/foliage
#    textures that need it)

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the nav, so only the bottom edge —
#    where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q78/85/90 compared — 85 chosen: ~92KB, comfortably under budget with
#    good grain detail retained; q78 dropped to ~65KB but softened the wood-grain texture
#    slightly more than needed given the size headroom)
convert hero-faded.png -quality 85 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~91.6KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized.png` used for the hero (same framing family, taller aspect ratio, centred a
little higher/more towards the reinforcement plate than the hero band so the plate and rivets
read clearly at the more square crop):

```bash
convert clean-resized.png -crop 1200x630+700+700 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~111KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source is already black-and-white, so it sits calmly
  against the site's blue/white/grey palette with only a light contrast boost.
- The archival print border (black frame + vertical "HAER No." text label) had to be manually
  trimmed in two passes — `-fuzz 8% -trim` alone only removed the outer white mount, not the
  black frame itself, which isn't a uniform border colour once cropped tightly.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`), so only the bottom edge needed a fade, not the top.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality
  values — the source URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
