/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/boquete_website',
  assetPrefix: '/boquete_website/',
  trailingSlash: true,
  // output: 'standalone', // Disabled for debugging SSR issues
  
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
    // Removido unoptimized: true para permitir optimización
    // Removida política CSP que podría bloquear recursos
  },

  experimental: {
    optimizePackageImports: ['react-icons'],
  },

  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production', // Temporarily disabled for debugging
  },

  // Añade rewrites para manejar rutas estáticas
  async rewrites() {
    return [
      {
        source: '/boquete_website/_next/:path*',
        destination: '/_next/:path*',
      },
    ];
  },
};

export default nextConfig;
