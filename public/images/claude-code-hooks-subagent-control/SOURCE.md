# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Perspective looking north northeast through Locks 70 (foreground), 69,
  68, 67 (extreme background)" — HAER NY,32-LOCK,14A-24, a black-and-white architectural
  documentation photograph of the Lockport Locks (New York State Barge Canal / Erie Canal) at
  Lockport, Niagara County, NY. Photographed 2006 by Jet Lowe for the Historic American
  Engineering Record (HAER), a National Park Service programme. The frame shows the stacked
  stone lock wall, the overhead road bridge crossing the lock cut, and the canal corridor
  receding toward the following lock chambers.
- **Source page**: <https://commons.wikimedia.org/wiki/File:PERSPECTIVE_LOOKING_NORTH_NORTHEAST_THROUGH_LOCKS_70_(FOREGROUND),_69,_68,_67_(EXTERME_BACKGROUND)._-_New_York_State_Barge_Canal,_Lockport_Locks,_Richmond_Avenue,_Lockport,_HAER_NY,32-LOCK,14A-24.tif>
  (note: "EXTERME" is a typo in Wikimedia Commons' own file title, reproduced verbatim here for
  a working link — the HAER caption text itself reads "EXTREME BACKGROUND").
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/8/83/PERSPECTIVE_LOOKING_NORTH_NORTHEAST_THROUGH_LOCKS_70_%28FOREGROUND%29%2C_69%2C_68%2C_67_%28EXTERME_BACKGROUND%29._-_New_York_State_Barge_Canal%2C_Lockport_Locks%2C_Richmond_Avenue%2C_Lockport%2C_HAER_NY%2C32-LOCK%2C14A-24.tif>
- **Original dimensions**: 5,277×3,808px grayscale TIFF (~19.2MB)
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties," a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time. Same
  HAER/NPS provenance class as `public/images/host-action-bridge/` (also photographed by Jet
  Lowe).
- **Fetched**: 2026-09-02

## Why this image

The article covers using Claude Code hooks (`PreToolUse` etc.) to gate and constrain sub-agent
behaviour before it executes — enforcing rules at defined interception points rather than after
the fact. A canal lock is a literal, physical instance of the same idea: a sequence of gated
chambers that control passage through defined points, admitting movement only when the gate
mechanism allows it. This particular HAER photograph was chosen over an interlocking-tower/lever
frame alternative (several candidates were checked — Commons' PD/HAER coverage of railroad
interlocking tower interiors turned out to be thin, and the one genuinely-PD interior lever
machine photo found was only 816×552px, too small to upscale cleanly to a 2400px-wide hero) because
this frame is dense edge-to-edge: stacked stone lock wall, the arching bridge structure crossing
the lock cut, the rock-cut canal corridor, and a lock-side building in the distance — no empty sky
or water dominating either side, and no upscale problem at 5277×3808px source resolution.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # → 2400x1732

# 2. The HAER print carries its own archival scan border (black frame + white paper margin +
#    a vertical "HAER NY-61-24" pencil label on the right edge) — this is NOT part of the
#    photograph and must be excluded from any crop. Usable photo content in the 2400x1732
#    resize was found by sampling pixel values at the edges (identify -format
#    "%[pixel:p{0,0}]" on 1x1 crops at various x/y): the border occupies roughly x<90,
#    x>2245, y<95, y>1630 — usable region is x:[90,2245] y:[95,1630] (2155x1535).

# 3. Crop a 5:1-aspect band from within that usable region — chosen by eye for the densest
#    diagonal composition (stone lock wall + arching road bridge + rock cut + distant
#    building), avoiding the sky-heavy top and the near-empty railing/pavement area at the
#    very bottom of the usable region
convert resized.png -crop 2155x431+90+450 +repage band.png

# 4. Resize the band to the exact hero target (2155x431 -> 2400x480; note the "!" forces the
#    exact target size rather than preserving the crop's own aspect, since 2155:431 and
#    2400:480 are both already ~5:1 so this is a mild uniform upscale, not a stretch)
convert band.png -resize 2400x480! crop-resized.png

# 5. Light contrast boost (source was already greyscale HAER documentation photography, no
#    -colorspace Gray needed)
convert crop-resized.png -brightness-contrast 3x8 crop-grey.png

# 6. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the translucent nav, so
#    only the bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 7. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 8. Encode to WebP with alpha preserved, quality-controlled for file size (q65/78/85 were
#    tried — 167KB/123KB/95KB respectively; q78 was the chosen balance of stone-texture detail
#    vs size for this detail-dense source, consistent with the q75 choice on the
#    host-action-bridge truss photo)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~120KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` used for the hero (same source, different derivation, not a re-fetch or a
resize-in-place of `hero.webp`):

```bash
convert resized.png -crop 1200x630+390+380 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 75 og.jpg
```

Result: 1200×630px JPEG, ~122KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No further desaturation was needed — the HAER source photograph is already black-and-white,
  so it sits calmly against the site's blue/white/grey palette without any processing.
- The archival scan border (black frame, white paper margin, pencil HAER label) had to be
  identified and excluded by pixel-sampling before any crop was chosen — cropping without doing
  this first risks including a strip of black frame or handwritten label text in the final hero.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
