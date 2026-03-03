/**
 * Cloudflare Worker for LTS Commerce Site
 *
 * Purpose:
 * - Control cache headers for HTML (no browser cache) vs assets (long cache)
 * - Strip GitHub Pages fingerprints and unnecessary headers
 * - Add security headers
 * - Redirect www to non-www
 * - Serve branded 404 page for missing resources
 *
 * Deployment:
 * - Build: npm run build (from lts-site-proxy directory)
 * - Deploy via wrangler CLI or GitHub Actions
 * - Route: ltscommerce.dev/*
 */

// Security headers to add to all responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
} as const;

// Vanity headers
const VANITY_HEADERS = {
  'X-Crafted-By': 'LTS Commerce - Long Term Support for PHP',
} as const;

// Headers to strip (GitHub fingerprints and unnecessary headers)
const HEADERS_TO_REMOVE = [
  'server',
  'x-github-request-id',
  'x-github-backend',
  'x-served-by',
  'x-cache-hits',
  'x-timer',
  'x-fastly-request-id',
  'via',
  'age',
] as const;

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Redirect www to non-www (301 permanent)
  if (url.hostname === 'www.ltscommerce.dev') {
    const redirectUrl = 'https://ltscommerce.dev' + url.pathname + url.search + url.hash;
    return Response.redirect(redirectUrl, 301);
  }

  // Fetch from origin (GitHub Pages)
  const response = await fetch(request);

  // Handle 404s with branded error page
  if (response.status === 404) {
    return handle404(url, request);
  }

  // Clone response so we can modify headers
  const modifiedResponse = new Response(response.body, response);

  applyHeaders(modifiedResponse, url.pathname.replace(/\/$/, ''));

  return modifiedResponse;
}

/**
 * Apply standard header modifications to a response
 */
function applyHeaders(response: Response, pathname: string): void {
  // Remove unwanted headers
  HEADERS_TO_REMOVE.forEach((header) => {
    response.headers.delete(header);
  });

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add vanity headers
  Object.entries(VANITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Set cache headers based on content type
  const contentType = response.headers.get('content-type') || '';

  if (isHTMLRequest(pathname, contentType)) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    response.headers.set('CDN-Cache-Control', 'public, max-age=3600');

  } else if (isAssetRequest(pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');

  } else {
    response.headers.set('Cache-Control', 'public, max-age=3600');
    response.headers.set('CDN-Cache-Control', 'public, max-age=3600');
  }
}

/**
 * Handle 404 errors with branded error page
 *
 * Fetches the prerendered /errors/404/ page and returns it with 404 status.
 */
async function handle404(url: URL, originalRequest: Request): Promise<Response> {
  const error404Url = new URL('/errors/404/', url.origin);

  const error404Response = await fetch(error404Url.toString(), {
    headers: {
      'User-Agent': originalRequest.headers.get('User-Agent') || 'Cloudflare-Worker',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  // If the 404 page itself is missing, return simple fallback
  if (!error404Response.ok) {
    return new Response(
      '<!DOCTYPE html><html><head><title>404 Not Found</title></head>' +
      '<body><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>' +
      '<p><a href="/">Return to homepage</a></p></body></html>',
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...SECURITY_HEADERS,
        },
      }
    );
  }

  const modifiedResponse = new Response(error404Response.body, {
    status: 404,
    statusText: 'Not Found',
    headers: error404Response.headers,
  });

  applyHeaders(modifiedResponse, '/errors/404');

  // Short cache for 404 pages
  modifiedResponse.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  modifiedResponse.headers.set('CDN-Cache-Control', 'public, max-age=300');

  return modifiedResponse;
}

/**
 * Check if request is for HTML content
 */
function isHTMLRequest(pathname: string, contentType: string): boolean {
  if (pathname === '/' || pathname === '' || pathname.endsWith('/')) {
    return true;
  }

  if (pathname.endsWith('.html')) {
    return true;
  }

  if (contentType.includes('text/html')) {
    return true;
  }

  return false;
}

/**
 * Check if request is for static assets
 */
function isAssetRequest(pathname: string): boolean {
  if (pathname.startsWith('/assets/')) {
    return true;
  }

  const assetExtensions = [
    '.js', '.css', '.jpg', '.jpeg', '.png', '.gif',
    '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot',
    '.ico', '.json', '.xml', '.txt', '.pdf'
  ];

  return assetExtensions.some((ext) => pathname.endsWith(ext));
}
