import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.NETLIFY ? undefined : 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.api-sports.io',
        pathname: '**/*',
      },
    ],
  },
};

export default nextConfig;
