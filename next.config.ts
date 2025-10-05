import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Specify the correct root directory for turbopack
  turbopack: {
    root: process.cwd(),
  },
  
  images: {
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Domains for external images (if needed)
    domains: [],
    
    // Minimize layout shift
    minimumCacheTTL: 60,
    
    // Allow SVG optimization
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
