import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `robohash.org`,
      },
      {
        
        protocol: 'https',
        hostname: `ui-avatars.com`,
      },
      
    ]
  }
  
  /* config options here */
};

export default nextConfig;
