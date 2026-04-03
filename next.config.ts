import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Image optimization for Vercel
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
