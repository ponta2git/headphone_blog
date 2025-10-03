import type { NextConfig } from "next";
import BundleAnalyzerPlugin from "@next/bundle-analyzer";

const withBundleAnalyzer = BundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  typedRoutes: true,
  images: { unoptimized: true },
  experimental: {
    typedEnv: true,
  },
};

export default process.env.ANALYZE
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
