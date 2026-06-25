/**
 * Centralized URL helper that respects basePath configuration
 * Works for both development and production environments
 */

/**
 * Get the base path from environment or config
 * @returns {string} The base path (e.g., '/panamacity_website' or '')
 */
export function getBasePath() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Client-side: try to get from Next.js router or meta tag
    const basePath = document.querySelector('meta[name="basePath"]')?.content || 
                     window.__NEXT_DATA__?.buildId ? window.__NEXT_DATA__.runtimeConfig?.basePath : '';
    console.log('🔧 Client-side basePath:', basePath);
    return basePath || '';
  }
  
  // Server-side: get from environment variable
  const serverBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  console.log('🔧 Server-side basePath:', serverBasePath);
  return serverBasePath;
}

/**
 * Get the base URL with proper basePath
 * @returns {string} The full base URL (e.g., 'https://212.85.22.57/panamacity_website')
 */
export function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const basePath = getBasePath();
  
  // Debug logging
  console.log('🔧 getBaseUrl Debug:', {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    baseUrl,
    basePath,
    NODE_ENV: process.env.NODE_ENV
  });
  
  // If baseUrl already includes basePath, don't duplicate it
  if (basePath && baseUrl.endsWith(basePath)) {
    console.log('🔧 BaseURL already includes basePath:', baseUrl);
    return baseUrl;
  }
  
  const result = `${baseUrl}${basePath}`;
  console.log('🔧 Final baseURL:', result);
  return result;
}

/**
 * Create a full URL with proper basePath handling
 * @param {string} path - The path to append (e.g., '/success', '/cancel')
 * @returns {string} The complete URL with basePath
 */
export function getFullUrl(path) {
  const baseUrl = getBaseUrl();
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const result = `${baseUrl}${cleanPath}`;
  console.log('🔧 getFullUrl Result:', { 
    path, 
    baseUrl, 
    cleanPath, 
    result 
  });
  
  return result;
}

/**
 * Build a full URL from the INCOMING REQUEST's real host, not a static env var.
 *
 * Used for payment redirect URLs (success/cancel) so they point back to wherever
 * the user actually is: in dev that's the server IP:port (e.g.
 * http://212.85.22.57:1376), in prod the public domain — no need to flip
 * NEXT_PUBLIC_BASE_URL between environments.
 *
 * Source preference:
 *   1. `Origin` header (the browser sends it on the checkout POST; most accurate).
 *   2. `x-forwarded-host` / `host` + inferred protocol (proxy-aware).
 *   3. Fallback to the static env-based getFullUrl() if no host is present.
 *
 * @param {Request} request - the route handler Request.
 * @param {string} path - path to append (e.g. '/success').
 * @returns {string} absolute URL with basePath.
 */
export function getFullUrlFromRequest(request, path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const origin = request?.headers?.get?.('origin');
  if (origin) {
    return `${origin}${basePath}${cleanPath}`;
  }

  const host = request?.headers?.get?.('x-forwarded-host') || request?.headers?.get?.('host');
  if (host) {
    // localhost / raw IPv4 default to http; real domains to https. A proxy's
    // x-forwarded-proto wins when present.
    const isLocalOrIp = /^(localhost|127\.|\d{1,3}(\.\d{1,3}){3})(:|$)/.test(host);
    const proto = request.headers.get('x-forwarded-proto') || (isLocalOrIp ? 'http' : 'https');
    return `${proto}://${host}${basePath}${cleanPath}`;
  }

  // No host info (e.g. non-browser call): fall back to the static env base.
  return getFullUrl(cleanPath);
}

/**
 * Create internal app URL with basePath (for client-side routing)
 * @param {string} path - The internal path
 * @returns {string} Path with basePath prefix
 */
export function getInternalUrl(path) {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${basePath}${cleanPath}`;
}

/**
 * Get API endpoint URL with proper basePath.
 *
 * In the BROWSER, API calls must be same-origin: return a root-relative path
 * (`${basePath}${endpoint}`) so the fetch hits whatever host the user is on
 * (dev IP:port, prod domain, …) instead of a hardcoded NEXT_PUBLIC_BASE_URL.
 * On the SERVER, an absolute URL is required, so fall back to getFullUrl().
 *
 * @param {string} endpoint - API endpoint path (e.g., '/api/checkout')
 * @returns {string} Same-origin path (client) or full URL (server)
 */
export function getApiUrl(endpoint) {
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (typeof window !== 'undefined') {
    const basePath = getBasePath();
    return `${basePath}${cleanPath}`;
  }

  return getFullUrl(cleanPath);
}

// For debugging - can be removed in production
export function debugUrls() {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 URL Helper Debug:', {
      basePath: getBasePath(),
      baseUrl: getBaseUrl(),
      successUrl: getFullUrl('/success'),
      cancelUrl: getFullUrl('/'),
      apiCheckout: getApiUrl('/api/checkout')
    });
  }
}