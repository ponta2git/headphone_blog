import { generateSitemap } from './libs/generateSitemap.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateSitemap();
    }

    return config;
  },
  reactStrictMode: true
}

export default nextConfig
