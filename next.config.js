/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ["localhost", "blob.v0.dev"],
      unoptimized: true,
    },
  }
  
  module.exports = nextConfig
  