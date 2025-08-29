// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent "electron" from being bundled
    config.resolve.fallback = {
      ...config.resolve.fallback,
      electron: false,
    };

    return config;
  },
};

export default nextConfig;
