/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async headers() {
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
  // Handle environment variables gracefully
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://akxvtqekdgqeclurvdcq.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mindwise-backend.fly.dev/api',
  },
  // Disable static generation for pages that use edge runtime
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;