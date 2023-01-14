const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = withBundleAnalyzer({
  // reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'],
  },
  // pageExtensions: ["page.tsx", "api.ts", "ts"],
})

module.exports = nextConfig
