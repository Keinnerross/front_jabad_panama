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
 * Get API endpoint URL with proper basePath
 * @param {string} endpoint - API endpoint path (e.g., '/api/checkout')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  return getFullUrl(endpoint);
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