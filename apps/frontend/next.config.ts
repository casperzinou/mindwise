import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable webpack optimizations
  webpack: (config) => {
    // Reduce bundle size by not bundling development dependencies
    config.optimization.minimize = true;
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          // Reduce the size of vendor chunks
          maxSize: 25000, // 25KB (extremely aggressive)
        },
      },
    };
    
    // Disable webpack cache to reduce bundle size
    config.cache = false;
    
    // Aggressive minimization
    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer: any) => {
        if (minimizer.options && minimizer.options.terserOptions) {
          minimizer.options.terserOptions.compress = {
            ...minimizer.options.terserOptions.compress,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.info', 'console.debug', 'console.warn']
          };
        }
      });
    }
    
    return config;
  },
  // Enable experimental features to reduce bundle size
  experimental: {
    optimizePackageImports: [
      '@supabase/supabase-js',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'lucide-react'
    ]
  },
  // Reduce server bundle size by not bundling dev dependencies
  productionBrowserSourceMaps: false,
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
  // Use standalone output for smaller bundles
  output: 'standalone',
  // Reduce the number of pages generated
  trailingSlash: false,
};

export default nextConfig;
