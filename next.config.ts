import type { NextConfig } from "next";
import BundleAnalyzerPlugin from "@next/bundle-analyzer";

const withBundleAnalyzer = BundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: { unoptimized: true },
};

export default withBundleAnalyzer(nextConfig);
