// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "electron-fetch": "cross-fetch", // or "cross-fetch"
      electron: false,
    };
    return config;
  },
};

export default nextConfig;
