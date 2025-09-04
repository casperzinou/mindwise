import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization as it's not supported on Cloudflare Pages
  images: {
    unoptimized: true,
  },
  // Additional optimizations for Cloudflare Pages
  compress: true,
  // Optimize react by removing development-only code
  reactStrictMode: false,
  // Remove default 404 page to reduce bundle size
  excludeDefaultMomentLocales: true,
  // Security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
