# LTS Site Proxy - Cloudflare Worker

**Deployed Worker Name**: `lts-site-proxy`
**Routes**: `ltscommerce.dev/*`, `www.ltscommerce.dev/*`
**Origin**: GitHub Pages (`LTSCommerce/site`)

## Purpose

This Cloudflare Worker intercepts all traffic to the site and:

1. **Cache Control**
   - HTML: No browser cache (`max-age=0, must-revalidate`), 1 hour edge cache
   - Assets (`/assets/*`): Long cache (`max-age=31536000, immutable`) - safe because content-hashed
   - Other files: 1 hour cache
   - Prevents stale HTML after deployments

2. **Security Headers**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

3. **GitHub Fingerprint Stripping**
   - Removes: `x-github-request-id`, `x-github-backend`, `x-served-by`, `x-cache-hits`, `x-timer`, `x-fastly-request-id`, `via`, `age`

4. **WWW Redirect**
   - 301 redirects `www.ltscommerce.dev` to `ltscommerce.dev`

5. **Branded 404 Page**
   - Serves prerendered `/errors/404/` page when GitHub Pages returns 404
   - Falls back to minimal HTML if the 404 page itself is missing

## Prerequisites

### DNS Configuration

All A and AAAA records for `ltscommerce.dev` and `www.ltscommerce.dev` must be **proxied** (orange cloud) in Cloudflare DNS. Without this, traffic bypasses the worker entirely.

### SSL/TLS Mode

SSL/TLS encryption mode **must be set to Full** (not Flexible). With Flexible, Cloudflare connects to GitHub Pages over HTTP, which redirects back to HTTPS, creating an infinite redirect loop.

Set via: Cloudflare Dashboard -> `ltscommerce.dev` -> SSL/TLS -> Overview -> **Full**

### Cloudflare API Token

Required for both CLI deployment and GitHub Actions CI/CD.

**Create the token:**

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use **Custom Token** (not a template)
4. Set permissions:
   - **Account -> Workers Scripts -> Edit**
   - **Zone -> Workers Routes -> Edit**
   - **Zone -> Zone Settings -> Edit** (for SSL/TLS mode)
   - **Zone -> DNS -> Edit** (for managing DNS proxy status)
5. Account Resources: Include -> your account
6. Zone Resources: Include -> Specific zone -> `ltscommerce.dev`
7. Create Token and copy the value

**Add to GitHub Actions:**

1. Go to https://github.com/LTSCommerce/site/settings/secrets/actions
2. Click **New repository secret**
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: paste the token
5. Add secret

## Build

```bash
cd cloudflare-workers/lts-site-proxy
npm install        # first time only
npm run build      # compiles worker.ts -> worker.js via esbuild
```

The build output (`worker.js`) is gitignored - it's always built fresh before deployment.

## Deployment

### Automated (GitHub Actions)

The workflow at `.github/workflows/deploy-worker.yml` deploys automatically on push to `main` when worker files change. It can also be triggered manually via **Actions -> Deploy Cloudflare Worker -> Run workflow**.

Triggers:
- Changes to `cloudflare-workers/lts-site-proxy/**`
- Changes to `.github/workflows/deploy-worker.yml`

### Manual (CLI)

```bash
cd cloudflare-workers/lts-site-proxy
npm install

# Option 1: Interactive login (opens browser)
npx wrangler login
npm run deploy

# Option 2: API token
export CLOUDFLARE_API_TOKEN="your-token-here"
npm run deploy
```

## Testing

```bash
# Verify security headers and cache control
curl -sI https://ltscommerce.dev/ | grep -iE "x-crafted|x-content-type|x-frame|cache-control|referrer-policy"

# Expected:
# cache-control: public, max-age=0, must-revalidate
# x-content-type-options: nosniff
# x-crafted-by: LTS Commerce - Long Term Support for PHP
# x-frame-options: SAMEORIGIN
# referrer-policy: strict-origin-when-cross-origin

# Verify GitHub headers are stripped
curl -sI https://ltscommerce.dev/ | grep -i "x-github"
# Expected: no output

# Verify www redirect
curl -sI https://www.ltscommerce.dev/ | grep -i location
# Expected: location: https://ltscommerce.dev/

# Verify 404 page
curl -s -o /dev/null -w "%{http_code}" https://ltscommerce.dev/nonexistent-page
# Expected: 404
```

## Monitoring

- **Dashboard**: Cloudflare -> Workers & Pages -> lts-site-proxy -> Logs / Metrics
- **CLI**: `npx wrangler tail lts-site-proxy`