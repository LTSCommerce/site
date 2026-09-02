# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Ross Dam with a Relief Valve at Elevation 1340 Open" — HAER
  WASH,37-NEHA.V,1-H-3, a black-and-white architectural documentation photograph of Ross Dam
  (Skagit Power Development, Skagit River, Whatcom County, Washington) taken with one of the
  dam's relief valves open and actively venting water, 1989. Historic American Engineering
  Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:ROSS_DAM_WITH_A_RELIEF_VALVE_AT_ELEVATION_1340_OPEN,_1989._-_Skagit_Power_Development,_Ross_Dam,_11.0_miles_upstream_from_Newhalem_on_Skagit_River,_Newhalem,_Whatcom_County,_HAER_WASH,37-NEHA.V,1-H-3.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/9/9f/ROSS_DAM_WITH_A_RELIEF_VALVE_AT_ELEVATION_1340_OPEN%2C_1989._-_Skagit_Power_Development%2C_Ross_Dam%2C_11.0_miles_upstream_from_Newhalem_on_Skagit_River%2C_Newhalem%2C_Whatcom_County%2C_HAER_WASH%2C37-NEHA.V%2C1-H-3.tif>
- **Original dimensions**: 5,000×3,591px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of
  a National Park Service employee, created as part of that person's official duties. As a
  work of the U.S. federal government, such work is in the public domain in the United
  States." Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article argues for systems that fail immediately and visibly rather than limping forward
in a broken state — the actual title concept is "crash spectacularly" rather than degrade
silently. A dam relief valve caught mid-discharge is a literal, physical version of that idea:
a safety mechanism that trips the instant a threshold is exceeded, and announces it loudly and
visibly (a plume of water, not a quiet leak) rather than letting pressure build unseen. It was
chosen over several other HAER relief-valve candidates in the same Commons category (Diablo
Dam's valve-house interior, Hoover Dam's relief valves, a turbine-pit relief valve) because
this is the only one that shows the valve mid-event — open and actively venting — rather than
a static/closed mechanism, which matches "fails fast and loud" more directly than "has a
failure mode." It was also, by a wide margin, the most content-dense composition of the
candidates: the dam's checkered concrete facing fills the frame edge to edge, flanked by dense
conifer forest on both sides, with the valve and its water jet as a clear focal point — not a
small subject on an empty background.

Considered and rejected: the Diablo Dam valve-house interior (HAER WASH,37-NEHA.V,1-F-4) — a
clean, well-composed control-panel photograph, but roughly half the frame is bare concrete
floor and empty wall, which reads as sparse rather than dense at hero-banner proportions.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `ross-dam.tif`:

```bash
# 1. Resize to a working width
convert ross-dam.tif -resize 2400x resized.png                    # -> 2400x1724

# 2. Remove the HAER archival print border: a black frame line plus a vertical
#    "HAER No. WA-24-H-3" text label printed down the right margin, both part of the
#    archival print, not the photographed subject. Auto-trim first, then manually crop
#    the remaining left border and the right-hand text strip (checked by eye — the
#    label starts at roughly x=2223 of the 2383px-wide auto-trimmed image).
convert resized.png -fuzz 10% -trim +repage trimmed.png           # -> 2383x1697
convert trimmed.png -crop 2190x1697+30+0 +repage clean.png        # drop left border + right label strip
convert clean.png -resize 2400x clean-resized.png                 # -> 2400x1860

# 3. Hero crop: a wide band across the dam face + the open relief valve's water jet,
#    with forest filling both side margins (offset chosen by eye)
convert clean-resized.png -crop 2400x480+0+840 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Light blur BEFORE encoding — the dam's checkered concrete facing and the conifer
#    forest are both high-frequency detail that WebP compresses poorly (unblurred:
#    ~176KB even at q65). A small blur cut file size by roughly 30% with no visible
#    softness at on-page display size.
convert crop-grey.png -blur 0x0.6 crop-blurred.png

# 5. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency
#    of its own to preserve, so a straight CopyOpacity replace is correct)
convert crop-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP (q55/60/65/70/78 compared after the blur step — q65 was the chosen
#    balance of detail vs size)
convert hero-faded.png -quality 65 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~125KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` -> `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized.png` used for the hero:

```bash
# A taller crop from the same source, centred on the same dam-face + valve subject
convert clean-resized.png -crop 1200x630+600+700 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -blur 0x0.5 og-blurred.png
convert og-blurred.png -quality 75 og.jpg
```

Result: 1200×630px JPEG, ~133KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette with no colour-clash risk.
- The archival-print border (black frame line, "HAER No. WA-24-H-3" text label) had to be
  removed by crop before any resizing/cropping for content, or it would have ended up baked
  into either derived asset — this is the one step that isn't in either of the two prior hero
  images' recipes, since neither of their sources carried a visible archival label in the
  usable frame area.
- The blur-before-encode step is specific to this source's combination of dense concrete
  texture and forest detail; skip it by default and only reach for it when an unblurred WebP
  is landing well above the usual ~100-140KB range, per the skill's guidance.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality
  values — the source URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
