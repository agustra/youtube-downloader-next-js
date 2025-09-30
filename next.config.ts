import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Only apply webpack config for production builds
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          buffer: false,
        };
      }
      return config;
    },
  }),
};

export default nextConfig;