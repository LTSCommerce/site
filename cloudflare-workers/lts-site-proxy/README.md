# LTS Site Proxy - Cloudflare Worker

**Deployed Worker Name**: `lts-site-proxy`
**Route**: `ltscommerce.dev/*`

## Purpose

This Cloudflare Worker intercepts all traffic to the site and:

1. **Fixes Cache Issues**
   - HTML: No browser cache (`max-age=0`)
   - Assets: Long cache (`max-age=31536000`)
   - Prevents stale HTML after deployments

2. **Strips GitHub Fingerprints**
   - Removes: `server`, `x-github-*`, `via`, `age`, `x-served-by`
   - Improves security posture
   - Reduces response size

3. **Adds Security Headers**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

4. **WWW Redirect**
   - 301 redirects from `www.ltscommerce.dev` to `ltscommerce.dev`

## Build

```bash
cd cloudflare-workers/lts-site-proxy
npm install
npm run build
```

## Deployment

### Manual Deployment via Wrangler CLI

```bash
cd cloudflare-workers/lts-site-proxy
npm run deploy
```

Prerequisites:
1. Install dependencies: `npm install`
2. Authenticate Wrangler: `npx wrangler login`

### Cloudflare API Token

For CI/CD or non-interactive deployment:

1. Cloudflare Dashboard -> My Profile -> API Tokens -> Create Token
2. Use "Edit Cloudflare Workers" template
3. Set permissions: Account -> Cloudflare Workers Scripts -> Edit
4. Zone Resources: Include -> ltscommerce.dev

```bash
export CLOUDFLARE_API_TOKEN="your-token-here"
npx wrangler deploy
```

## Testing

```bash
# HTML should have max-age=0
curl -I https://ltscommerce.dev/

# Assets should have max-age=31536000
curl -I https://ltscommerce.dev/assets/some-asset.js

# GitHub headers should be gone
curl -I https://ltscommerce.dev/ | grep -i "x-github"
```

## Monitoring

- **Logs**: Cloudflare Dashboard -> Workers & Pages -> lts-site-proxy -> Logs
- **CLI**: `wrangler tail lts-site-proxy`
