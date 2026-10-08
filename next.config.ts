import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  webpack(config) {
    config.module.rules.push({ test: /\.mp3$/i, type: "asset/resource" });
    return config;
  },
};

export default nextConfig;
