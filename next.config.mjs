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
          protocol: 'https',
          hostname: 'chabad.kosherwithoutborders.com',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
        },
        {
          protocol: 'https',
          hostname: 'img.youtube.com',
        },
      ],
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      // Optimizar imágenes solo en producción (más rápido en desarrollo)
      unoptimized: process.env.NODE_ENV !== 'production',
    },
    // Enable experimental features for better performance
    experimental: {
      optimizePackageImports: ['react-icons'],
    },
    // Optimize bundle
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    },
  };
  
  export default nextConfig;
  