/* eslint-plugin-disable @typescript-eslint */
import { generateSitemap } from "./src/generateSitemap.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateSitemap()
    }

    return config
  },
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig
