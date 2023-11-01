import { generateSitemap } from './src/libs/generateSitemap.mjs'

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
