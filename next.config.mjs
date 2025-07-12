/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.unsplash.com', 'plus.unsplash.com', 'localhost'],
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Enable experimental features for better performance
    experimental: {
      optimizePackageImports: ['react-icons'],
    },
    // Optimize bundle
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
  };
  
  export default nextConfig;
  