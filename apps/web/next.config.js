const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
  // reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com', 'media.discordapp.net'],
  },
  // pageExtensions: ["page.tsx", "api.ts", "ts"],
})

module.exports = nextConfig
