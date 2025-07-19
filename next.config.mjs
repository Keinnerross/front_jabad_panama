/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
    basePath,
    assetPrefix: basePath,
    trailingSlash: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'plus.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: '212.85.22.57',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
        },
      ],
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      unoptimized: true,
    },
    // Enable experimental features for better performance
    experimental: {
      optimizePackageImports: ['react-icons'],
    },
    // Optimize bundle
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    // Public runtime config for client-side access
    publicRuntimeConfig: {
      basePath,
    },
  };
  
  export default nextConfig;
  