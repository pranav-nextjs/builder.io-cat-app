import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn2.thecatapi.com',
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: '**.thecatapi.com',
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: '**.tumblr.com',
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: '**.theimageapi.com',
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
