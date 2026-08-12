FROM claude-yolo:latest

# ================================================================
# lts-commerce-site (ltscommerce.dev) — project-specific ccy image
#
# Bakes in the Playwright chromium browser + its OS-level deps so
# `npx ts-qa` (which runs e2e/pages.spec.ts) works out of the box in a
# freshly-launched ccy container, without an ad-hoc
# `npx playwright install chromium` on every session.
#
# Kept in lockstep with package.json's `@playwright/test` version —
# rebuild this image whenever that version bumps.
# ================================================================

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    npx -y playwright@1.61.1 install --with-deps chromium

RUN npx -y playwright@1.61.1 --version
