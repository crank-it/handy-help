import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize font loading
  optimizeFonts: true,

  // Ensure experimental features are properly configured
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
