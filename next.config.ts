import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [
      {
        pathname: '/api/assets/**',
      },
      {
        pathname: '/api/shop/avatar/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'dp-hd-assets.s3.ca-east-tor.io.cloud.ovh.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hipsterdonut-site-assets.s3.ca-east-tor.io.cloud.ovh.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hipsterdonut-user-assets.s3.ca-east-tor.io.cloud.ovh.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dp-shop-assets.s3.ca-east-tor.io.cloud.ovh.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.heycafecdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shopadmin.dragonspurr.ca',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
